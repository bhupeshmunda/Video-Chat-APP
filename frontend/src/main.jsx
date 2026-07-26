import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router";

import LandingPage from "./pages/LandingPage.jsx";
import Authentication from "./pages/Authentication.jsx";
import VideoMeet from "./pages/VideoMeet.jsx";
import HomeComponent from "./pages/HomeComponent.jsx";
import History from "./pages/History.jsx";
import Support from "./pages/Support.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/home" element={<HomeComponent />}></Route>
        <Route path="/auth" element={<Authentication />}></Route>
        <Route path="/history" element={<History />}></Route>
        <Route path="/support" element={<Support/>}></Route>
        <Route path="/:url" element={<VideoMeet/>}></Route>
      </Route>  
  ),
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
