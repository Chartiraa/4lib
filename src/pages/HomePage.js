import React, { useState, useEffect } from 'react';
import { Routes as AppRoutes, Route } from "react-router-dom";
import { Routes } from "../routes";
import ProtectedRoute from "../components/ProtectedRoute";

// pages

import Menu from "./Menu1/Menu";
import Menu2 from "./Menu2/Menu";
import Menu3 from "./Menu3/Menu";
import Barista from "./Barista";
import MenuSettings from "./MenuSettings";
import Products from "./Menu1/Products";
import Products2 from "./Menu2/Products";
import Products3 from "./Menu3/Products";

import DashboardOverview from "./dashboard/DashboardOverview";
import TakeOrder from './TakeOrder';
import LogTable from './LogTable';
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
    const timer = setTimeout(() => setLoaded(true), 2000);
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
      {/* Public Routes */}
      <Route path={Routes.Signin.path} element={<RouteWithLoader component={Signin} />} />
      <Route path={Routes.Signup.path} element={<RouteWithLoader component={Signup} />} />
      <Route path={Routes.ForgotPassword.path} element={<RouteWithLoader component={ForgotPassword} />} />
      <Route path={Routes.ResetPassword.path} element={<RouteWithLoader component={ResetPassword} />} />
      <Route path={Routes.Lock.path} element={<RouteWithLoader component={Lock} />} />
      <Route path={Routes.NotFound.path} element={<RouteWithLoader component={NotFoundPage} />} />
      <Route path={Routes.ServerError.path} element={<RouteWithLoader component={ServerError} />} />

{/* Protected Routes */}
<Route
  path={Routes.Dashboard.path}
  element={
    <ProtectedRoute requiredRoles={["barista","waiter", "cashier", "admin"]}>
      <RouteWithSidebar component={DashboardOverview} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.Barista.path}
  element={
    <ProtectedRoute requiredRoles={["barista", "cashier", "admin"]}>
      <RouteWithSidebar component={Barista} />
    </ProtectedRoute>
  }
/>

<Route
  path={Routes.MenuSettings.path}
  element={
    <ProtectedRoute requiredRoles={["admin"]}>
      <RouteWithSidebar component={MenuSettings} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.TakeOrder.path}
  element={
    <ProtectedRoute requiredRoles={["waiter", "cashier", "admin"]}>
      <RouteWithSidebar component={TakeOrder} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.LogTable.path}
  element={
    <ProtectedRoute requiredRoles={["cashier", "admin"]}>
      <RouteWithSidebar component={LogTable} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.Transactions.path}
  element={
    <ProtectedRoute requiredRoles={["cashier", "admin"]}>
      <RouteWithSidebar component={Transactions} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.Settings.path}
  element={
    <ProtectedRoute requiredRoles={["admin"]}>
      <RouteWithSidebar component={Settings} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.BootstrapTables.path}
  element={
    <ProtectedRoute requiredRoles={["cashier", "admin"]}>
      <RouteWithSidebar component={BootstrapTables} />
    </ProtectedRoute>
  }
/>

{/* Menü Sayfaları */}
<Route
  path={Routes.Menu.path}
  element={
    <ProtectedRoute>
      <RouteWithLoader component={Menu} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.Menu2.path}
  element={
    <ProtectedRoute>
      <RouteWithLoader component={Menu2} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.Menu3.path}
  element={
    <ProtectedRoute>
      <RouteWithLoader component={Menu3} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.Products.path}
  element={
    <ProtectedRoute>
      <RouteWithLoader component={Products} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.Products2.path}
  element={
    <ProtectedRoute>
      <RouteWithLoader component={Products2} />
    </ProtectedRoute>
  }
/>
<Route
  path={Routes.Products3.path}
  element={
    <ProtectedRoute>
      <RouteWithLoader component={Products3} />
    </ProtectedRoute>
  }
/>



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
