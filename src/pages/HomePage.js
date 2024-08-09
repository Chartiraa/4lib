import React, { useState, useEffect } from 'react';
import { Routes as AppRoutes, Route } from "react-router-dom";
import { Routes } from "../routes";

// pages

import Menu from "./Menu";
import Products from "./Products";
import DashboardOverview from "./dashboard/DashboardOverview";
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const RouteWithLoader = ({ component: Component }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader show={!loaded} />
      {loaded && <Component />}
    </>
  );
};

const RouteWithSidebar = ({ component: Component }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true;
  };

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  };

  return (
    <>
      <Preloader show={!loaded} />
      {loaded && (
        <>
          <Sidebar />
          <main className="content">
            <Navbar />
            <Component />
          </main>
        </>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppRoutes>
      <Route path={Routes.Signin.path} element={<RouteWithLoader component={Signin} />} />
      <Route path={Routes.Signup.path} element={<RouteWithLoader component={Signup} />} />
      <Route path={Routes.ForgotPassword.path} element={<RouteWithLoader component={ForgotPassword} />} />
      <Route path={Routes.ResetPassword.path} element={<RouteWithLoader component={ResetPassword} />} />
      <Route path={Routes.Lock.path} element={<RouteWithLoader component={Lock} />} />
      <Route path={Routes.NotFound.path} element={<RouteWithLoader component={NotFoundPage} />} />
      <Route path={Routes.ServerError.path} element={<RouteWithLoader component={ServerError} />} />

      {/* pages */}
      <Route path={Routes.Dashboard.path} element={<RouteWithSidebar component={DashboardOverview} />} />
      <Route path={Routes.Menu.path} element={<RouteWithLoader component={Menu} />} />
      <Route path={Routes.Products.path} element={<RouteWithLoader component={Products} />} />
      <Route path={Routes.Transactions.path} element={<RouteWithSidebar component={Transactions} />} />
      <Route path={Routes.Settings.path} element={<RouteWithSidebar component={Settings} />} />
      <Route path={Routes.BootstrapTables.path} element={<RouteWithSidebar component={BootstrapTables} />} />

      {/* components */}
      <Route path={Routes.Accordions.path} element={<RouteWithSidebar component={Accordion} />} />
      <Route path={Routes.Alerts.path} element={<RouteWithSidebar component={Alerts} />} />
      <Route path={Routes.Badges.path} element={<RouteWithSidebar component={Badges} />} />
      <Route path={Routes.Breadcrumbs.path} element={<RouteWithSidebar component={Breadcrumbs} />} />
      <Route path={Routes.Buttons.path} element={<RouteWithSidebar component={Buttons} />} />
      <Route path={Routes.Forms.path} element={<RouteWithSidebar component={Forms} />} />
      <Route path={Routes.Modals.path} element={<RouteWithSidebar component={Modals} />} />
      <Route path={Routes.Navs.path} element={<RouteWithSidebar component={Navs} />} />
      <Route path={Routes.Navbars.path} element={<RouteWithSidebar component={Navbars} />} />
      <Route path={Routes.Pagination.path} element={<RouteWithSidebar component={Pagination} />} />
      <Route path={Routes.Popovers.path} element={<RouteWithSidebar component={Popovers} />} />
      <Route path={Routes.Progress.path} element={<RouteWithSidebar component={Progress} />} />
      <Route path={Routes.Tables.path} element={<RouteWithSidebar component={Tables} />} />
      <Route path={Routes.Tabs.path} element={<RouteWithSidebar component={Tabs} />} />
      <Route path={Routes.Tooltips.path} element={<RouteWithSidebar component={Tooltips} />} />
      <Route path={Routes.Toasts.path} element={<RouteWithSidebar component={Toasts} />} />

    </AppRoutes>
  );
}
