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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: '/main',
    element: <TestPage/>,
    children: [
      { index: true, element: <TestPageMainComponent/> },
      { path: '/main/report', element: <TestPageReportComponent/> },
      { path: '/main/reportList', element: <TestPageReportList/> },
    ]
  },
  // {
  //   path: ROUTES_PATH.main,
  //   element: <Main/>,
  //   children: [
  //     { index: true, element: <MainComponent /> },
  //     { path: '/main/report', element: <Report/> },
  //     { path: '/main/report1', element: <Report2/> },
  //     { path: '/main/reportList', element: <ReportList/> },
  //     { path: '/main/addNewReport', element: <AddNewReport/>}
  //   ],
  // },
  {
    path: ROUTES_PATH.reportPage,
    element: <ReportPage/>,
  },
  // {
  //   path: 'test',
  //   element: <TestPage/>
  // }
]);