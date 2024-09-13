import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";

import "./scss/volt.scss";

import "../src/css/index.css";
import "react-datetime/css/react-datetime.css";
import 'primeicons/primeicons.css';

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";

ReactDOM.render(
  <HashRouter>
    <ScrollToTop />
    <HomePage />
  </HashRouter>,
  document.getElementById("root")
);
