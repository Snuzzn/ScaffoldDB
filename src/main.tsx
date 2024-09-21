import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import { SnackbarProvider } from "notistack";
import Snackbar from "./components/Snackbar";

const snackbars = {
    success: Snackbar,
    warning: Snackbar,
    error: Snackbar,
    info: Snackbar,
};
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <SnackbarProvider
            Components={snackbars}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <App />
        </SnackbarProvider>
    </React.StrictMode>,
);
