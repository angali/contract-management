import React, { Fragment } from "react";
import Link from "next/link";
import Router from "next/router";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

//loading progress bar apears on top of the page
Router.events.on("routeChangeStart", (url: URL) => Nprogress.start());
Router.events.on("routeChangeComplete", (url: URL) => Nprogress.done());
Router.events.on("routeChangeError", (url: URL) => Nprogress.done());

type IProps = {
  children: JSX.Element;
};

// Main layout of all pages
const Layout: React.FC<IProps> = ({ children }) => {
  const nav = () => (
    <ul className="nav nav-tabs bg-success shadow sticky-top">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-white">
            <h2 className="dance-font">Contract Management </h2>
          </a>
        </Link>
      </li>
    </ul>
  );

  return (
    <Fragment>
      {nav()} <div className="container pt-2 pb-5 ">{children}</div>
    </Fragment>
  );
};

export default Layout;
