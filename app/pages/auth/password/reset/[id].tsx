import React, { useEffect, useState } from "react";
import { withRouter } from "next/router";
import axios from "axios";
import { BACKEND_API_URL } from "../../../../config";
import Layout from "../../../../components/Layout";
import jwt from "jsonwebtoken";
import {
  showSuccessMessage,
  showErrorMessage
} from "../../../../helpers/alerts";
import { NextPage } from "next";
import { IAPIError } from "../../../../models/api";

const ResetPassword: NextPage = ({ router }: any) => {
  const [state, setState] = useState({
    token: "",
    name: "",
    newPassword: "",
    error: "",
    success: "",
    buttonText: "Reset password"
  });

  const { token, name, newPassword, error, success, buttonText } = state;

  useEffect(() => {
    const token = router.query.id;
    if (token) {
      const { name } : any = jwt.decode(token);
      setState({ ...state, name, token });
    }
  }, [router.query.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Submitting" });
    try {
      const response = await axios.put(`${BACKEND_API_URL}/reset-password`, {
        resetPasswordLink: token,
        newPassword
      });
      setState({
        ...state,
        newPassword: "",
        buttonText: "Done",
        error: "",
        success: response.data.message
      });
    } catch (err) {

      const error : IAPIError  = err as IAPIError;

      setState({
        ...state,
        buttonText: "Reset password",
        error: error.response.data.error || "Unknown error, please try again!",
        success: ""
      });
    }
  };

  const handleChange = (name : string)  => (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState({ ...state, [name]: e.target.value, error: "", success: "" });
  };

  const resetPasswordForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          value={newPassword}
          onChange={handleChange("newPassword")}
          type="password"
          placeholder="New password"
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
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Hello {name}, Reset your password</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {resetPasswordForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
