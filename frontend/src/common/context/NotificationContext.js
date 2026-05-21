import React, { createContext, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const baseOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  const showSuccess = (message) => {
    toast.dismiss();
    toast.success(message, baseOptions);
  };

  const showError = (message) => {
    toast.dismiss();
    toast.error(message, baseOptions);
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
    </NotificationContext.Provider>
  );
};
