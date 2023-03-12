import React from "react";
import ReactDOM from "react-dom/client";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, localStoragePersister } from "@/libraries/react-query";
import { AppProvider } from "@/contexts";
import { ConfigProvider } from "antd-mobile";
import idID from "antd-mobile/es/locales/id-ID";

import App from "./App";
import "styles/main.css"; // empty

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: localStoragePersister }}
    >
      <ConfigProvider locale={idID}>
        <AppProvider>
          <App />
        </AppProvider>
      </ConfigProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
