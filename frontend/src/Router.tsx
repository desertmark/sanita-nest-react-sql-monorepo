import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./Components/Layout";
import { Providers } from "./Providers/Providers";
import { Home } from "./Screens/Home";
import { Products } from "./Screens/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Providers>
        <Layout />
      </Providers>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
    ],
  },
]);
