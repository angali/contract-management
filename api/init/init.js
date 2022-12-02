import mongoose from "mongoose";
import shortId from "shortid";
import dotEnv from "dotenv";
import Event from "../models/event";
import User from "../models/user";
import { InitialInputData } from "./test_data-full_stack";

dotEnv.config();

// connect to database
mongoose
  .connect(process.env.MONGO_URI, { useNewurlParser: true })
  .then(() => {
    console.log("DB conneceted");

    const email = process.env.ADMIN_EMAIL;
    const username = shortId.generate();

    //check if user exist
    User.findOne({ email }).exec((err, user) => {
      if (user) {
        console.log("Admin email is already taken");
        return;
      }

      // Register new user
      const newUser = new User({
        username,
        name: "Admin",
        email,
        password: "admins",
        role: "admin"
      });
      newUser.save((err, user) => {
        if (err) {
          console.log("Unable to save the user in database. Try later.");
          return;
        }

        console.log("Admin Account is activated successfully. Please login.");
        return;
      });
    });

    Event.insertMany(InitialInputData)
      .then(function() {
        console.log("Data inserted - press ctrl+c to exit"); // Success
      })
      .catch(function(error) {
        console.log(error); // Failure
      });
  })
  .catch(err => console.log("DB Error:  ", err));
