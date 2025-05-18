import React,{useState} from 'react'
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const SignIn = () => {
     const [showLogin, setShowLogin] = useState(true);
      
   return (
     <div className="min-h-screen bg-gray-100 flex flex-col justify-center mt-4 mb-4">
       <div className="text-center mb-6">
         <button
           onClick={() => setShowLogin(true)}
           className={`px-4 py-2 font-medium ${
             showLogin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
           } rounded-l-md`}
         >
           Login
         </button>
         <button
           onClick={() => setShowLogin(false)}
           className={`px-4 py-2 font-medium ${
             !showLogin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
           } rounded-r-md`}
         >
           Sign Up
         </button>
       </div>
       {showLogin ? <LoginForm /> : <SignupForm setShowLogin={setShowLogin} />}
     </div>
   );
}

export default SignIn