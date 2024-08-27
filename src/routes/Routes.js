import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import React from "react";
import {ROUTES_PATH} from "./RoutesPath";
import ErrorPage from "../error-page";
import ReportPage from "../pages/reportPage/ReportPage";
import TestPage from "../pages/testPage/TestPage";
import {TestPageReportComponent} from "../components/testPageComponents/reportComponent/TestPageReportComponent";
import {TestPageMainComponent} from "../components/testPageComponents/testPageMainComponent/TestPageMainComponent";
import {TestPageReportList} from "../components/testPageComponents/testPageReportListComponent/TestPageReportList";
import {SnapShot} from "../pages/snapshot/SnapShot";
import {EditorChart} from "../pages/editorChart/EditorChart";
import {Charts} from "../pages/charts/Charts";
import {ChartList} from "../pages/chartList/ChartList";
import {PrivateRoute} from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: '/snapshot',
    element: <PrivateRoute><SnapShot/></PrivateRoute>,
  },
  {
    path: '/main',
    element: <PrivateRoute><TestPage/></PrivateRoute>,
    children: [
      { index: true, element: <TestPageMainComponent/> },
      { path: '/main/report', element: <TestPageReportComponent/> },
      { path: '/main/reportList', element: <TestPageReportList/> },
      {
        path: '/main' + ROUTES_PATH.editorChart,
        element: <Charts/>,
        children: [
          {
            path: '/main' + ROUTES_PATH.editorChart + '/:id',
            element: <EditorChart/>,
          },
          {
            path: '/main' + ROUTES_PATH.editorChart,
            element: <ChartList/>,
          }
        ]
      },
    ]
  },
  {
    path: ROUTES_PATH.reportPage,
    element: <PrivateRoute><ReportPage/></PrivateRoute>,
  },
]);