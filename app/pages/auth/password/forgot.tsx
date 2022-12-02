import React, { useState } from "react";
import axios from "axios";
import { BACKEND_API_URL } from "../../../config";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { NextPage } from "next";
import { IAPIError } from "../../../models/api";

const ForgotPassword: NextPage = () => {
  const [state, setState] = useState({
    email: "",
    error: "",
    success: "",
    buttonText: "Fogot Password"
  });

  const { email, error, success, buttonText } = state;

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Submitting" });
    try {
      const response = await axios.post(`${BACKEND_API_URL}/forgot-password`, { email });
      setState({
        ...state,
        email: "",
        buttonText: "Done",
        error: "",
        success: response.data.message
      });
    } catch (err) {
      
      const error : IAPIError  = err as IAPIError;

      setState({
        ...state,
        buttonText: "Fogot Password",
        error: error.response.data.error || "Unknown error, please try again!",
        success: ""
      });
    }
  };

  const handleChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setState({ ...state, [name]: e.target.value, error: "", success: "" });
  };

  const forgotPasswordForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          value={email}
          onChange={handleChange("email")}
          type="email"
          placeholder="Type your your email"
          className="form-control mb-3"
          required
        />
      </div>
      <div className="input-group">
        <button
          type="submit"
          className="btn btn-outline-warning btn-block text-center"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <React.Fragment>
        <h1>Forgot Password </h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {forgotPasswordForm()}
      </React.Fragment>
    </Layout>
  );
};

export default ForgotPassword;
