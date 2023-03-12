import React, { useEffect, useState } from "react";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages";
import Login from "./pages/login";
import NotFound from "./pages/404";
import Explore from "./pages/playlist";
import MagazineGrid from "./pages/magazine/grid";
import ExploreGrid from "./pages/playlist/grid";
import PodcastList from "./pages/podcast/list";
import MagazineDetail from "./pages/magazine/detail";
import MagazineReader from "./pages/magazine/reader";
import PodcastDetail from "./pages/podcast/detail";
import Sidebar from "./components/sidebar";
import Search from "./pages/search";
import Account from "./pages/account";
import Subscription from "./pages/subscription";
import { Modal } from "antd-mobile";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <div className="layout">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/playlist",
        element: <Explore />
      },
      {
        path: "/playlist/:id",
        element: <ExploreGrid />
      },
      {
        path: "/magazine",
        element: <MagazineGrid />
      },
      {
        path: "/magazine/:id",
        element: <MagazineDetail />
      },
      {
        path: "/podcast",
        element: <PodcastList />
      },
      {
        path: "/podcast/:id",
        element: <PodcastDetail />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/account",
        element: <Account />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/subscription",
        element: <Subscription />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  },
  {
    path: "/magazine/reader",
    element: <MagazineReader />
  }
]);

const App = () => {
  const [isOnline, setIsOnline] = useState(true);

  const updateOnlineStatus = () => {
    setIsOnline(navigator.onLine);

    if (navigator.onLine) {
      Modal.clear();
      document.body.style.overflow = "auto";
    } else {
      Modal.show({
        content:
          "Pastikan Anda terhubung ke internet, untuk menggunakan aplikasi ini",
        actions: [{ key: "ok", text: "Retry" }]
      });
      document.body.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      {isOnline ? null : <div className="no-internet" />}
    </>
  );
};

export default App;
