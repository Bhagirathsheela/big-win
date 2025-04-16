import React, { useCallback, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { NotificationProvider } from "./common/context/NotificationContext";
import { LoaderProvider } from "./common/context/LoaderContext";
import Loader from "./common/ui/Loader";

import Header from "./Header"
import Footer from "./Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import { AuthContext } from "./common/context/auth-context";
import SignIn from "./auth/SignIn";
import BettingPage from "./pages/BettingPage";
import PaymentSummary from "./pages/PaymentSummary";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login =useCallback((user)=>{
    setIsLoggedIn(true)
    setUserInfo(user)
  },[])
  const logout = useCallback(()=>{
    setIsLoggedIn(false)
    setUserInfo(null);
  },[])
  const [userInfo, setUserInfo] = useState(null)
  let routes;

  /* if(isLoggedIn){
  routes = (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
    </>
  );
  }else{
   routes = (
     <>
       <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/signin" element={<SignIn />} />
     </>
   );
  } */
 const AppRoutes = ({ isLoggedIn }) => {
   return (
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/bet" element={<BettingPage />} />
       <Route path="/summary" element={<PaymentSummary />} />

       {isLoggedIn ? (
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
 };
  return (
    <LoaderProvider>
      <NotificationProvider>
        <ToastContainer />
        <Loader />
        <AuthContext.Provider
          value={{ isLoggedIn: isLoggedIn,userInfo:userInfo, login: login, logout: logout }}
        >
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow bg-gray-100">
                {/* <Routes>{routes}</Routes> */}
                <AppRoutes isLoggedIn={isLoggedIn} />
              </div>
              <Footer />
            </div>
          </Router>
        </AuthContext.Provider>
      </NotificationProvider>
    </LoaderProvider>
  );
};

export default App;
