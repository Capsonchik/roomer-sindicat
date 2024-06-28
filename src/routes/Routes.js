import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import React from "react";
import {ROUTES_PATH} from "./RoutesPath";
import ErrorPage from "../error-page";
import Main from "../pages/main/Main";
import {MainComponent} from "../components/mainComponent/MainComponent";
import {Report} from "../components/report/Report";
import {ReportList} from "../components/report/reportList/ReportList";



export const router = createBrowserRouter([
  {
    path: ROUTES_PATH.root,
    element: <App/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: ROUTES_PATH.main,
    element: <Main/>,
    errorElement: <ErrorPage/>,
    children: [
      { index: true, element: <MainComponent /> },
      { path: '/main/report', element: <Report/> },
      { path: '/main/reportList', element: <ReportList/> },
    ],
  },
]);