import React from "react";
import { NextPage } from "next";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Link from "next/link";
import { isAuth } from "../helpers/auth";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="container ">
        <div className="d-flex flex-column justify-content-center align-items-center mt-5 text-center">
          <h1 className="fw-bolder mb-5">
            Welcome To Contract Management System
          </h1>
          {isAuth() && (
            <React.Fragment>
              <Link href="/admin">
                <a className="btn btn-success d-block mb-3">Manage Contracts</a>
              </Link>
            </React.Fragment>
          )}

          {!isAuth() && (
            <React.Fragment>
              <p>Please sign in to continue</p>
              <Link href="/login">
                <a className="btn btn-success mb-3 px-5">Sign In</a>
              </Link>
              <Link href="/register">
                <a className="btn btn-success mb-3 px-4">Sign Up</a>
              </Link>
            </React.Fragment>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      seoPageTitle: "Welcome to Contract Management dashboard"
    }
  };
};

export default Home;
