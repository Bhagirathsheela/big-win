import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../common/context/auth-context";
import { useHttpClient } from "../common/hooks/http-hook";
import { useNotification } from "../common/context/NotificationContext";
import moment from "moment";
import {
  FaCamera,
  FaEnvelope,
  FaCalendarAlt,
  FaCoins,
  FaTrophy,
  FaTicketAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { tileColor } from "../common/ui/confetti";

const toneClass = {
  purple: "bg-purple-100 text-brand-purpleDeep",
  orange: "bg-orange-100 text-orange-700",
  mint: "bg-emerald-100 text-emerald-700",
};

function StatTile({ icon, label, value, tone = "purple" }) {
  return (
    <div className="card-pop text-center p-4">
      <div className={`mx-auto w-10 h-10 rounded-xl grid place-items-center ${toneClass[tone]}`}>
        {icon}
      </div>
      <div className="font-display font-bold text-lg sm:text-xl text-brand-purpleDeep mt-2 leading-tight">
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-gray-500 mt-1">
        {label}
      </div>
    </div>
  );
}

export default function Profile() {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const { showSuccess, showError } = useNotification();

  const [photo, setPhoto] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [betsInfo, setBetsInfo] = useState([]);
  const defaultPhoto = "https://www.w3schools.com/howto/img_avatar.png";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userInfo.userId}`
        );
        if (responseData) {
          setUserData(responseData.userInfo);
          setPhoto(`${process.env.REACT_APP_ASSET_URL}/${responseData.userInfo.image}`);
        }
      } catch (err) {
        showError("Failed to load user data.");
      }
    };
    const fetchBetInfo = async () => {
      if (auth.userInfo.userId) {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/bets/${auth.userInfo.userId}`
          );
          if (responseData) setBetsInfo(responseData);
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
        `${process.env.REACT_APP_BACKEND_URL}/users/updateUser`,
        "PATCH",
        formData,
        { Authorization: `Bearer ${auth.token}` }
      );
      if (responseData) {
        setShowUpdateBtn(false);
        showSuccess("Your photo looks great!");
      }
    } catch (err) {
      showError("Failed to update photo.");
    }
  };

  const stats = useMemo(() => {
    let bets = 0;
    let staked = 0;
    betsInfo.forEach((b) => {
      (b.selectedBet || []).forEach((s) => {
        bets += 1;
        staked += Number(s.amount) || 0;
      });
    });
    return { bets, staked, sessions: betsInfo.length };
  }, [betsInfo]);

  if (!userData)
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="card-pop flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-brand-purple animate-pulse" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pb-16 pt-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient text-white p-6 sm:p-8 shadow-popPink">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-12 -left-10 w-44 h-44 rounded-full bg-brand-yellow/30 blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="relative">
              <img
                src={photo || defaultPhoto}
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-soft"
              />
              <label className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-soft cursor-pointer hover:scale-110 transition active:scale-95">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <FaCamera className="text-brand-purpleDeep" />
              </label>
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight truncate">
                {userData.name}
              </h1>
              <p className="text-white/90 mt-1 inline-flex items-center gap-2 text-sm">
                <FaCalendarAlt className="opacity-80" /> Member since{" "}
                {moment(userData.createdAt).format("MMMM YYYY")}
              </p>
            </div>
            {showUpdateBtn && (
              <button
                onClick={handleUpdate}
                className="inline-flex items-center gap-2 bg-white text-brand-purpleDeep font-semibold px-5 py-2.5 rounded-full shadow-soft active:scale-95 animate-bounceIn"
              >
                <FaCheckCircle /> Save photo
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <StatTile icon={<FaTicketAlt />} label="Bets placed" value={stats.bets} tone="purple" />
          <StatTile icon={<FaCoins />} label="Total staked" value={`Rs.${stats.staked.toLocaleString("en-IN")}`} tone="orange" />
          <StatTile icon={<FaTrophy />} label="Sessions" value={stats.sessions} tone="mint" />
        </div>

        <div className="card-pop mt-5">
          <h3 className="font-display font-bold text-brand-purpleDeep text-lg mb-3">Account</h3>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50">
            <div className="w-10 h-10 rounded-xl bg-white grid place-items-center text-brand-pink">
              <FaEnvelope />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium text-gray-800 truncate">{userData.email}</div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="font-display font-bold text-brand-purpleDeep text-lg mb-3 px-1">My bets</h3>
          {betsInfo.length === 0 ? (
            <div className="card-pop text-center">
              <div className="text-4xl mb-2">*</div>
              <p className="text-gray-500">No bets placed yet. Go pick some lucky numbers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-in">
              {betsInfo.map((session, index) => {
                const total = (session.selectedBet || []).reduce(
                  (s, b) => s + (Number(b.amount) || 0), 0
                );
                return (
                  <div key={index} className="card-pop">
                    <div className="flex items-center justify-between mb-3">
                      <span className="chip bg-purple-100 text-brand-purpleDeep">
                        Session #{index + 1}
                      </span>
                      <span className="font-display font-bold text-brand-purpleDeep">
                        Rs.{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(session.selectedBet || []).map((sel, idx) => {
                        const palette = tileColor(sel.selectedNumber);
                        return (
                          <div key={idx} className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-purple-100">
                            <span className={`w-7 h-7 rounded-full grid place-items-center font-bold text-xs ${palette.bg} ${palette.text}`}>
                              {sel.selectedNumber.toString().padStart(2, "0")}
                            </span>
                            <span className="text-xs font-semibold text-gray-700">
                              Rs.{Number(sel.amount).toLocaleString("en-IN")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
