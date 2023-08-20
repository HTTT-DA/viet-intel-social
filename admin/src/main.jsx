import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login/index.jsx";
import RegisterUseAPI from "./pages/registerUseAPI/index.jsx";
import Category from "./pages/category";
import ContentCensorShip from "./pages/contentCensorship/index.jsx";
import DetailAnswer from "./pages/DetailAnswer";
import DetailQuestion from "./pages/DetailQuestion";
import Export from "./pages/export";
import Import from "./pages/import";
import ListAnswers from "./pages/listAnswers";
import NotFound from "./pages/notFound";
import Setting from "./pages/setting";
import UsersRequest from "./pages/UsersRequest";

import MainLayout from "./layouts/MainLayout";
import "./styles.scss";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Category />,
      },
      {
        path: "/content-censorship",
        children: [
          {
            path: "/content-censorship",
            element: <ContentCensorShip />,
          },
          {
            path: "question/:questionId",
            element: <DetailQuestion />,
          },
          {
            path: "list-answers/:questionId",
            element: <ListAnswers />,
          },
          {
            path: "answer/:answerId",
            element: <DetailAnswer />,
          },
        ],
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/import",
        element: <Import />,
      },
      {
        path: "/export",
        element: <Export />,
      },
      {
        path: "/api-access",
        element: <UsersRequest />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register-use-api",
    element: <RegisterUseAPI />,
  },
  // 404 not found
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
