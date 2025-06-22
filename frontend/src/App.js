import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "./common/context/NotificationContext";
import { LoaderProvider } from "./common/context/LoaderContext";
import Loader from "./common/ui/Loader";
import Header from "./Header"
import Footer from "./Footer";
import { AuthContext } from "./common/context/auth-context";
import { useAuth } from "./common/hooks/auth-hook";
import { LayoutProvider } from "./common/context/LayoutContext";
import Popup from "./common/ui/Popup";

const App = () => {
 const auth= useAuth();
  
 /* const AppRoutes = ({ token }) => {
   return (
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/bet" element={<BettingPage />} />
       <Route path="/summary" element={<PaymentSummary />} />

       {token ? (
         <>
           <Route path="/profile" element={<Profile />} />
           <Route path="*" element={<Navigate to="/" replace />} />
         </>
       ) : (
         <>
           <Route path="/signin" element={<SignIn />} />
           <Route path="*" element={<Navigate to="/signin" replace />} />
         </>
       )}
     </Routes>
   );
 }; */
  return (
    <LoaderProvider>
      <NotificationProvider>
        <LayoutProvider>
          <ToastContainer />
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
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow bg-gray-100">
                  <AppRoutes />
                </div>
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
