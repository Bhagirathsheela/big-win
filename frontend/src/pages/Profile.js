import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../common/context/auth-context";
import { useHttpClient } from "../common/hooks/http-hook";
import { useNotification } from "../common/context/NotificationContext";
import moment from "moment";

export default function Profile() {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const { showSuccess, showError } = useNotification();

  const [photo, setPhoto] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [betsInfo, setBetsInfo] = useState([])
  const defaultPhoto = "https://www.w3schools.com/howto/img_avatar.png";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${auth.userInfo.userId}`
        );
        if (responseData) {
          setUserData(responseData.userInfo);
          setPhoto(`http://localhost:5000/${responseData.userInfo.image}`);
        }
      } catch (err) {
        showError("Failed to load user data.");
      }
    };
     const fetchBetInfo = async () => {
      if (auth.userInfo.userId) {
        try {
          const responseData = await sendRequest(
            `http://localhost:5000/api/bets/${auth.userInfo.userId}`
          );
          if (responseData) {
            setBetsInfo(responseData);
          }
        } catch (err) {}
      }
    };
    fetchBetInfo();
    fetchUser();
  }, [auth.token, auth.userInfo.userId, sendRequest, showError]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setShowUpdateBtn(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!newPhoto) return;
    const formData = new FormData();
    formData.append("image", newPhoto);
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/updateUser",
        "PATCH",
        formData,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      if (responseData) {
        setShowUpdateBtn(false);
        showSuccess("The profile photo is updated!");
      }
    } catch (err) {
      showError("Failed to update photo.");
    }
  };

  if (!userData)
    return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Photo */}
          <div className="relative">
            <img
              src={photo || defaultPhoto}
              alt="Profile"
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-indigo-300 shadow-md"
            />
            <label className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-indigo-100">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 5a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0011.414 5H18a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 3a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-indigo-800">
                {userData.name}
              </h2>
              <p className="text-gray-500 mt-1">
                Enthusiastic Explorer 🌍 | Member since{" "}
                {moment(userData.createdAt).format("YYYY")}
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 space-y-3 shadow-inner">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{userData.email}</p>
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

            {/* Bets Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                My Bets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {betsInfo.length === 0 ? (
                  <p className="text-gray-500">No bets placed yet.</p>
                ) : (
                  betsInfo.map((bet, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border p-4 shadow-sm"
                    >
                      {bet.selectedBet.map((sel, idx) => (
                        <p key={idx} className="text-gray-800">
                          Number: <strong>{sel.selectedNumber}</strong>, Amount:
                          ₹{sel.amount}
                        </p>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
