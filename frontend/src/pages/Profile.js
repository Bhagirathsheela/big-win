import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";

export default function Profile() {
  const defaultAvatar = "/images/default-avatar.jpg";

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "",
    photo: "", // Empty initially to test fallback
  });

  const [editMode, setEditMode] = useState({
    name: false,
    phone: false,
  });

  const [isDirty, setIsDirty] = useState(false); // Track if any field is being edited

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsDirty(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // Here you'd send the updated `profile` to your backend
    console.log("Saving profile:", profile);
    setEditMode({ name: false, phone: false });
    setIsDirty(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-10 transition-all">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">My Profile</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Profile Photo */}
        <div className="relative group">
          <img
            src={profile.photo || defaultAvatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-600 object-cover"
          />
          <label
            title="Change Photo"
            className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1 bg-indigo-600 border-2 border-white rounded-full p-1.5 cursor-pointer shadow-md hover:bg-indigo-700 transition-all duration-300 group"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 5a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0011.414 5H18a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 3a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </label>
        </div>

        {/* Editable Fields */}
        <div className="w-full flex flex-col gap-4">
          {/* Name Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={profile.name}
              onChange={handleChange}
              disabled={!editMode.name}
              className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500 ${
                editMode.name
                  ? "border-indigo-400"
                  : "bg-gray-100 cursor-not-allowed border-gray-300"
              }`}
            />
            <PencilIcon
              onClick={() => toggleEdit("name")}
              className="w-5 h-5 text-gray-500 absolute top-8 right-3 cursor-pointer hover:text-indigo-600 transition"
            />
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={profile.email}
              readOnly
              className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Phone Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              disabled={!editMode.phone}
              className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500 ${
                editMode.phone
                  ? "border-indigo-400"
                  : "bg-gray-100 cursor-not-allowed border-gray-300"
              }`}
            />
            <PencilIcon
              onClick={() => toggleEdit("phone")}
              className="w-5 h-5 text-gray-500 absolute top-8 right-3 cursor-pointer hover:text-indigo-600 transition"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isDirty && (
        <div className="mt-6 text-right">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-full shadow hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
