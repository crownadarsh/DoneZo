import React, { useState, useRef, useEffect } from "react";
import DoneZoLogo from "../assets/DoneZo.jpg";

const Navbar = () => {
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const userData = localStorage.getItem("userData");
    const { accessToken } = JSON.parse(userData) || {};

    if (!accessToken) {
      console.error("No token found");
      window.location.href = "/login";;
    }

    try {
      const response = await fetch("http://localhost:8080/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        console.log("Logout successful");
        localStorage.removeItem("userData");
        window.location.href = "/login";
      } else {
        console.error("Logout failed", await response.json());
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUpdatePassword = () => {
    setShowPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleSubmitPasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    const userData = localStorage.getItem("userData");
    const { accessToken } = JSON.parse(userData) || {};

    if (!accessToken) {
      console.error("No token found");
      window.location.href = "/login";;
    }

    console.log("Updating password with:", { oldPassword, newPassword });
    try {
        console.log(JSON.stringify({ oldPassword, newPassword}))
        const response = await fetch("http://localhost:8080/user/update-password", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ oldPassword, newPassword}),
        });
        if (response.ok) {
          console.log("Password updated successfully");
        } else {
          const error = await response.json()
          console.error("Update password failed", error);
          alert(error.message)
        }
      } catch (error) {
         
        console.error("Error updating password:", error);
      }
    handleCloseModal();
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#033452] shadow-md relative">
      <div className="flex items-center gap-3">
        <img src={DoneZoLogo} alt="DoneZo Logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold text-white">DoneZo</h1>
      </div>

      <div className="w-96 text-center">
        <h1 className="bg-[#033452] text-white p-2 text-3xl font-bold">
          Welcome to DoneZo!
        </h1>
      </div>

      <div className="relative" ref={menuRef}>
        <div
          className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center text-gray-600 font-bold cursor-pointer bg-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {!imageError ? (
            <img
              src="https://via.placeholder.com/40"
              alt="User Profile"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span>UT</span>
          )}
        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>
            <button
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#00000085]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              className="w-full p-2 border rounded mb-2"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-2 border rounded mb-2"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-black text-white rounded mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#033452] text-white rounded"
                onClick={handleSubmitPasswordChange}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
