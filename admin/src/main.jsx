import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login/index.jsx";
import Category from "./pages/category";
import NotFound from "./pages/notFound";
import MainLayout from "./layouts/MainLayout";
import "./styles.scss";
import ContentCensorShip from "./pages/contentCensorship/index.jsx";

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
        element: <ContentCensorShip />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
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
