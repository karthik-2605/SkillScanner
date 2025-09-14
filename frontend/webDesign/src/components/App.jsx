import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home.jsx";
import Dashboard from "./Dashboard.jsx";
import Admin from "./Admin.jsx";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/admin",
      element: <Admin />,
    },
  ]);

  return <RouterProvider router={router} />;
}
