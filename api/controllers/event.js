import Event from "../models/event";

require("dotenv").config();

export const list = (req, res, next) => {
  const { skip, limit } = req.query;

  const { role } = req.profile;

  if (role !== "admin")
    return res.status(401).json({ error: "No authorized to read the events" });

  const pipleline = [
    {
      $group: {
        _id: "$contractId",
        contractId: { $first: "$contractId" },
        premium: { $first: "$premium" },
        startDate: {
          $first: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } }
        },
        terminationDate: {
          $last: {
            $dateToString: { format: "%Y-%m-%d", date: "$terminationDate" }
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        contractId: 1,
        premium: 1,
        startDate: 1,
        terminationDate: 1
      }
    },
    { $sort: { contractId: -1 } }
  ];

  Event.aggregate(pipleline, (err, data) => {
    if (err) return res.status(400).json({ error: "Can not read events" });

    return res.json(data);
  })
    .skip(parseInt(skip) || 0)
    .limit(parseInt(limit) || 10);

};

export const create = async (req, res, next) => {
  const { contractId, premium, startDate } = req.body;

  const { role } = req.profile;

  if (role !== "admin")
    return res
      .status(401)
      .json({ error: "Not authorized to create the event" });

  let _id = contractId ? contractId : await newContractId();

  const event = new Event({
    contractId: _id,
    name: "ContractCreatedEvent",
    premium: premium || 100,
    startDate: startDate ? new Date(startDate) : Date.now()
  });

  //if contractId is passed we need check if it is duplicated or not
  if (contractId)
    Event.findOne({ contractId, name: "ContractCreatedEvent" }, (err, data) => {
      //check for event create duplication
      if (!err && data)
        return res
          .status(400)
          .json({ error: "Event with this ID is already created" });
      // save to new event to db
      event.save((err, data) => {
        if (err)
          return res
            .status(400)
            .json({ error: "Can not save ContractCreatedEvent" });
        return res.json(data);
      });
    });
  else {
    // save to new event to db with new contract id
    event.save((err, data) => {
      if (err)
        return res
          .status(400)
          .json({ error: "Can not save ContractCreatedEvent" });
      return res.json(data);
    });
  }
};

export const terminate = (req, res, next) => {
  const { contractId, terminationDate } = req.body;

  const { role } = req.profile;

  if (role !== "admin")
    return res
      .status(401)
      .json({ error: "Not authorized to create the event" });

  const event = new Event({
    name: "ContractTerminatedEvent",
    contractId,
    terminationDate: terminationDate ? new Date(terminationDate) : Date.now()
  });

  // save to db
  event.save((err, data) => {
    if (err)
      return res
        .status(400)
        .json({ error: "Can not save ContractTerminatedEvent" });
    return res.json(data);
  });
};

// allocate new contract ID
// we assume that contract ID is incremental
const newContractId = async () => {
  const data = await Event.aggregate(
    [{ $group: { _id: null, max: { $max: "$contractId" } } }],
    (err, data) => {
      return data;
    }
  );

  return data && data[0] ? data[0].max + 1 : 0;
};
