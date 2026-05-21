import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "./common/context/NotificationContext";
import { LoaderProvider } from "./common/context/LoaderContext";
import Loader from "./common/ui/Loader";
import Header from "./Header";
import Footer from "./Footer";
import { AuthContext } from "./common/context/auth-context";
import { useAuth } from "./common/hooks/auth-hook";
import { LayoutProvider } from "./common/context/LayoutContext";
import Popup from "./common/ui/Popup";

const App = () => {
  const auth = useAuth();

  return (
    <LoaderProvider>
      <NotificationProvider>
        <LayoutProvider>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
            toastClassName="bw-toast"
            className="bw-toast-container"
          />
          <Loader />
          <Popup />
          <AuthContext.Provider
            value={{
              isLoggedIn: !!auth.token,
              token: auth.token,
              userInfo: auth.userInfo,
              login: auth.login,
              logout: auth.logout,
            }}
          >
            <Router>
              <div className="flex flex-col min-h-screen bg-playful-gradient bg-grid-soft">
                <Header />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </Router>
          </AuthContext.Provider>
        </LayoutProvider>
      </NotificationProvider>
    </LoaderProvider>
  );
};

export default App;
