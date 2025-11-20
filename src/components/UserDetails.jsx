import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaWhatsapp,
  FaEnvelope,
  FaShareAlt,
  FaPhoneAlt,
  FaHome,
  FaUser,
  FaUtensils,
  FaUsers,
  FaChild,
  FaUserPlus,
} from "react-icons/fa";

/* ---------------------------------------------
   REUSABLE COMPONENTS
--------------------------------------------- */

const InfoPill = ({ icon: Icon, label, value, theme = "blue" }) => {
  const themeColors = {
    blue: "bg-blue-500/20 text-blue-600",
    green: "bg-emerald-500/20 text-emerald-600",
    purple: "bg-purple-500/20 text-purple-600",
    orange: "bg-orange-500/20 text-orange-600",
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white/85 rounded-xl border border-white/90 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${themeColors[theme]}`}
      >
        <Icon className="text-xl" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-gray-500 text-base font-semibold uppercase tracking-wide">
          {label}
        </div>
        <div className="text-gray-900 font-semibold text-lg truncate">
          {value || "N/A"}
        </div>
      </div>
    </div>
  );
};

const SimpleActionButton = ({ icon: Icon, label, colorClass, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full px-5 py-2 ${colorClass} rounded-full font-semibold text-base shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95`}
  >
    <div className="flex items-center justify-center gap-2">
      <Icon className="text-base" />
      <span>{label}</span>
    </div>
  </button>
);

const StatBox = ({ label, value, color = "blue" }) => {
  const colorConfig = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    purple: "text-purple-600",
    orange: "text-amber-600",
  };

  return (
    <div className="p-3 text-center bg-white/80 rounded-xl border border-white/90 shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`text-2xl font-bold ${colorConfig[color]} mb-1`}>
        {value || "0"}
      </div>
      <div className="text-gray-600 text-base font-semibold uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};

/* ---------------------------------------------
   MAIN COMPONENT
--------------------------------------------- */

const UserDetail = () => {
  const { Member_ID } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadMember = async () => {
      try {
        const response = await axios.get(
          `https://api.moviemads.com/api/event-forms/${Member_ID}`
        );
        setMember(response.data?.data);
      } catch (err) {
        console.error("Error fetching member data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [Member_ID]);

  const totalMembers =
    (member?.Adult_Count || 0) + (member?.Children_Count || 0);

  const handleShare = () => {
    if (!member) return;
    const profileURL = window.location.href;
    const shareMessage = `View Member Profile for ${member.Name} (ID: ${Member_ID}).\n\nProfile Link:\n${profileURL}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  /* ---------------------------------------------
     LOADING
  --------------------------------------------- */

  if (loading)
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-purple-500/20 rounded-full animate-spin" />
            <div className="w-10 h-10 border-4 border-transparent border-t-purple-500 rounded-full absolute top-0 left-0 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            Loading profile…
          </h3>
        </div>
      </div>
    );

  /* ---------------------------------------------
     NO MEMBER
  --------------------------------------------- */

  if (!member)
    return (
      <div className="h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-100 flex items-center justify-center px-4">
        <div className="bg-white/85 backdrop-blur-md rounded-xl p-6 text-center border border-white/70 shadow-xl max-w-md w-full">
          <div className="text-4xl text-rose-400 mx-auto mb-3">⚠️</div>
          <h3 className="text-gray-800 text-2xl font-bold mb-2">
            No Member Found
          </h3>
          <p className="text-gray-600 text-base mb-4">
            The requested member profile could not be loaded.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full font-semibold text-base hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  /* ---------------------------------------------
     MAIN UI
  --------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 py-4 px-3 sm:px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {/* PROFILE HEADER */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-blue-200/50 shadow-lg p-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            {/* IMAGE */}
            <div className="flex-shrink-0">
              {member.Photo?.url && !imageError ? (
                <img
                  src={`https://api.moviemads.com${member.Photo.url}`}
                  alt="Profile"
                  className="w-28 h-28 object-cover rounded-2xl border-4 border-white shadow-lg"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-200 to-cyan-300 flex items-center justify-center border-4 border-white shadow-lg">
                  <FaUser className="text-4xl text-blue-600" />
                </div>
              )}
            </div>

            {/* NAME + TAGS + STATS */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {member.Name}
              </h1>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-500/10 rounded-full text-blue-600 text-sm font-semibold">
                  ID: {Member_ID}
                </span>
                <span className="px-3 py-1 bg-green-500/10 rounded-full text-green-600 text-sm font-semibold">
                  {member.Company_ID}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <StatBox label="Age" value={member.Age} color="blue" />
                <StatBox label="Gender" value={member.Gender} color="purple" />
                <StatBox label="Status" value="Active" color="green" />
              </div>
            </div>

            {/* SHARE BUTTON */}
            <div className="w-full sm:w-auto">
              <SimpleActionButton
                icon={FaShareAlt}
                label="Share"
                colorClass="bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                onClick={handleShare}
              />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* CONTACT INFO */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-purple-200/50 shadow-lg p-4 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b border-purple-200/40 flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                  <FaPhoneAlt className="text-white text-sm" />
                </div>
                Contact Info
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoPill
                  icon={FaPhoneAlt}
                  label="Phone"
                  value={member.Phone_Number}
                  theme="blue"
                />
                <InfoPill
                  icon={FaWhatsapp}
                  label="WhatsApp"
                  value={member.WhatsApp_Number}
                  theme="green"
                />
                <InfoPill
                  icon={FaEnvelope}
                  label="Email"
                  value={member.Email}
                  theme="purple"
                />
                <InfoPill
                  icon={FaHome}
                  label="Address"
                  value={member.Address}
                  theme="orange"
                />
              </div>
            </div>
          </div>

          {/* MEMBER DETAILS */}
          <div>
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl border border-amber-200/60 shadow-lg p-4 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b border-amber-200/60 flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <FaUsers className="text-white text-sm" />
                </div>
                Member Details
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {/* Total Members */}
                <div className="col-span-2 p-3 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <FaUserPlus className="text-teal-500 text-xl mb-1 mx-auto" />
                  <div className="text-2xl font-bold text-teal-600">
                    {totalMembers}
                  </div>
                  <div className="text-teal-700 text-base font-semibold uppercase tracking-wide">
                    Total Members
                  </div>
                </div>

                {/* Veg */}
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <FaUtensils className="text-emerald-500 text-xl mb-1 mx-auto" />
                  <div className="text-xl font-bold text-emerald-600">
                    {member.Veg_Count || 0}
                  </div>
                  <div className="text-emerald-700 text-base font-semibold">
                    Veg
                  </div>
                </div>

                {/* Non-Veg */}
                <div className="p-3 bg-gradient-to-br from-rose-50 to-red-50 rounded-xl border border-rose-200 text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <FaUtensils className="text-rose-500 text-xl mb-1 mx-auto" />
                  <div className="text-xl font-bold text-rose-600">
                    {member.Non_Veg_Count || 0}
                  </div>
                  <div className="text-rose-700 text-base font-semibold">
                    Non-Veg
                  </div>
                </div>

                {/* Adults */}
                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <FaUsers className="text-blue-500 text-xl mb-1 mx-auto" />
                  <div className="text-xl font-bold text-blue-600">
                    {member.Adult_Count || 0}
                  </div>
                  <div className="text-blue-700 text-base font-semibold">
                    Adults
                  </div>
                </div>

                {/* Children */}
                <div className="p-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200 text-center shadow-sm hover:shadow-md transition-all duration-300">
                  <FaChild className="text-violet-500 text-xl mb-1 mx-auto" />
                  <div className="text-xl font-bold text-violet-600">
                    {member.Children_Count || 0}
                  </div>
                  <div className="text-violet-700 text-base font-semibold">
                    Children
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
