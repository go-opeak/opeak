import { ROUTES } from "@constants/routes";
import { Login } from "@pages/Login";
import { Main } from "@pages/Main";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  { path: `${ROUTES.MAIN}`, element: <Main /> },
  { path: `${ROUTES.LOGIN}`, element: <Login /> },
]);

export default router;
