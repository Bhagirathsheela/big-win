import { useState,useContext } from "react";
import { AuthContext } from "../common/context/auth-context";
import { useHttpClient } from "../common/hooks/http-hook";
import { useNotification } from "../common/context/NotificationContext";

export default function Profile() {
  const auth = useContext(AuthContext);
  const {sendRequest } = useHttpClient();
  const { showSuccess,showError } = useNotification();
  const [photo, setPhoto] = useState(""); // this is base64 preview for UI
  const [newPhoto, setNewPhoto] = useState(null);  // this is raw data to send to backend
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);

  const defaultPhoto = "https://www.w3schools.com/howto/img_avatar.png";
  const userName = "John Doe";
  const email = "john@example.com";
  const mobile = "123-456-7890";

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
   // console.log(e.target.files)
    if (file) {
      setNewPhoto(file); // raw data to send to backend
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);  // photo in base 64 string form to show in the UI
        setShowUpdateBtn(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!newPhoto) return;

    const formData = new FormData();
    //formData.append("profileImage", newPhoto);
    formData.append("image", newPhoto);
    //formData.append("Authorization", 'Bearer ' + auth.token);
    
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/updateUser",
        "PATCH",
        formData,
        {
          Authorization: `Bearer ${auth.token}`,
        } 
      );
      console.log(responseData,"update img repo")
      if (responseData) {
        setShowUpdateBtn(false);
        showSuccess("The profile photo is updated!")
        
      }
      else{
        showError(responseData.message||"Error updating profile , please try again")
      }
    } catch (err) {}
    
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Photo */}
          <div className="relative">
            <img
              src={photo || defaultPhoto}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-indigo-300 shadow-md"
            />
            <label className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg cursor-pointer transition-all duration-300">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 5a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0011.414 5H18a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 3a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-indigo-800">{userName}</h2>
              <p className="text-gray-500 mt-1">
                Enthusiastic Explorer 🌍 | Member since 2024
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 space-y-3 shadow-inner">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="text-gray-800 font-medium">{mobile}</p>
              </div>
            </div>

            {showUpdateBtn && (
              <div>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition duration-300"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
