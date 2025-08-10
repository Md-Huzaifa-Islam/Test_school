"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { persistor, store } from "@/store/store";

/**
 * Redux Provider component for the entire application
 * Provides Redux store and persistence functionality
 */
interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({
  children,
}: ReduxProviderProps): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
}
