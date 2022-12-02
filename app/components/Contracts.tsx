/* This component shows list of contracts */
import React, { useState } from "react";
import { IContractEvent } from "../models/event";
import { ContractService } from "../services/ContractService";

import InfiniteScroll from "react-infinite-scroller";
import moment from "moment";

export interface IContractProps {
  contracts: IContractEvent[];
  contractsLimit: number;
  contractSkip: number;
  totalContracts: number;
}

interface IState {
  loading: boolean;
  allContracts: IContractEvent[];
  errorMessage: string;
  skip: number;
  limit: number;
  size: number;
}

const Contracts: React.FC<IContractProps> = ({
  contracts,
  contractsLimit,
  contractSkip,
  totalContracts
}) => {
  const [state, setState] = useState<IState>({
    loading: false,
    allContracts: contracts,
    errorMessage: "",
    skip: contractSkip,
    limit: contractsLimit,
    size: totalContracts
  });

  const { loading, allContracts, errorMessage, skip, limit, size } = state;

  const loadMore = async () => {

    const toSkip = skip + limit;
    const response = await ContractService.getContracts(limit, toSkip);

    if (response)
      setState(state => ({
        ...state,
        allContracts: [...allContracts, ...response.data],
        loading: false,
        errorMessage: "",
        size: response.data.length,
        skip: toSkip
      }));
    else
      setState(state => ({
        ...state,
        loading: false,
        errorMessage: "Can not load contarcs, please check your connection!"
      }));
  };

  const onTerminate = (contractId: number) => async (e: React.MouseEvent) => {
    const response = await ContractService.terminate(contractId);

    if (response && response.data) {
      var foundIndex = allContracts.findIndex(
        x => x.contractId == response.data.contractId
      );

      if (foundIndex >= 0)
        allContracts[foundIndex].terminationDate =
          response.data.terminationDate;

      setState(state => ({
        ...state,
        errorMessage: "",
        allContracts: allContracts
      }));
    } else
      setState(state => ({
        ...state,
        errorMessage:
          "Can not terminate the contract, please check your connection!"
      }));
  };

  const onCreate = async (e: React.MouseEvent) => {
    const response = await ContractService.create();

    if (response && response.data) {
      let newContract: IContractEvent = {
        _id: response.data._id,
        name: response.data.name,
        contractId: response.data.contractId,
        premium: response.data.premium,
        startDate: response.data.startDate,
        terminationDate: response.data.terminationDate
      };

      setState({
        ...state,
        errorMessage: "",
        allContracts: [newContract, ...allContracts]
      });
    } else
      setState(state => ({
        ...state,
        errorMessage:
          "Can not create new contract, please check your connection!"
      }));
  };

  /* render list of the contracts */
  const contractList = (): JSX.Element => (
    <ul className="list-unstyled">
      {allContracts.map((event: IContractEvent, index) => (
        <li
          className="contract text-center text-lg-start row  bg-white shadow p-3 mb-2 rounded align-items-center  position-relative"
          key={index}
        >
          {/* insurance info */}
          <div className="col-lg-5 order-3 order-lg-1 mb-2">
            <div className="d-flex flex-column ">
              <div className="contract-premium">
                <h4 className="fw-bold fs-4 text-bg-light d-inline-block px-2 ">
                  {event.premium ? "Premium" : ""}
                </h4>
              </div>
              <div className="contract-date text-secondary ">
                <p className="m-0 fw-bolder">
                  <span className="fw-bolder">Start</span>{" "}
                  {moment(event.startDate).format("YYYY-MM-DD")}{" "}
                </p>

                {event.terminationDate && (
                  <p className="m-0">
                    <span>Termination</span>{" "}
                    {moment(event.terminationDate).format("YYYY-MM-DD")}{" "}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* contract id section */}
          <div className="contract-info col-lg-4 order-2 mb-2 mb-lg-0">
            <div className="contract-id">
              <p className=" small text-secondary lh-1 text-uppercase m-0">
                contract id
              </p>
              <h3 className="fs-1 fw-bold ">{event.contractId}</h3>
            </div>
          </div>

          {/* contract icon */}
          <div className="contract-icon col-lg-3  text-center mb-3 mb-lg-0 order-1 order-lg-3">
            {event.terminationDate ? (
              <i className="fa-solid fa-file-circle-xmark fa-4x text-danger"></i>
            ) : (
              <i className="fa-solid fa-file-circle-check fa-4x text-success" />
            )}
            {!event.terminationDate && (
              <button
                className="contact-terminate-btn btn btn-danger btn-sm badge"
                onClick={onTerminate(event.contractId)}
              >
                Terminate
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <React.Fragment>
      <p className="h1 fw-bold text-success mt-0 mt-lg-4">Contracts</p>

      <p className="text-muted fst-italic m-">Manage Contracts</p>

      {/* show an alert if there is any error */}

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <button onClick={onCreate} className="btn btn-success">
        Create Contract
      </button>
      <hr />

      {/* show loading spiner */}
      {loading && (
        <React.Fragment>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </React.Fragment>
      )}

      <div className="row">
        <div className="col-md-8">
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={size > 0 && size >= limit}
            loader={
              <div key={0} className="position-relative">
                <div
                  className="spinner-border mt-4 position-absolute top-0 start-50 translate-middle text-primary"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            }
          >
            {contractList()}
          </InfiniteScroll>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contracts;
