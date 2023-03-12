import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 // 24 hours
    }
  }
});

export const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister
});
