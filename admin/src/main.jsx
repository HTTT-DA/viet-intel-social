import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "./pages/login/index.jsx";
import Category from "./pages/category";
import ContentCensorShip from "./pages/contentCensorship/index.jsx";
import DetailAnswer from "./pages/DetailAnswer";
import DetailQuestion from "./pages/DetailQuestion";
import Export from "./pages/export";
import Import from "./pages/import";
import ListAnswers from "./pages/listAnswers";
import NotFound from "./pages/notFound";
import Setting from "./pages/setting";

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
            path: "question/:id",
            element: <DetailQuestion />,
          },
          {
            path: "list-answers/:id",
            element: <ListAnswers />,
          },
          {
            path: "answer/:id",
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
    ],
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
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
