import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaIdCard,
  FaBirthdayCake,
  FaUsers,
  FaTimes,
  FaBuilding,
} from "react-icons/fa";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const popupVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
  exit: { opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.2 } },
};

const ProfilePopup = ({ isOpen, onClose, userData, luckyNumber }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="
            bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
            border border-slate-700/60 rounded-3xl shadow-2xl text-white relative
            w-full max-w-5xl
            h-auto
            overflow-hidden
            flex
          "
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-900/90 hover:bg-red-600 transition p-2 rounded-xl shadow-xl z-10"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* LEFT SIDE - Full Image & Basic Info */}
          <div className="w-2/5 bg-gradient-to-b from-blue-900/30 to-purple-900/30 p-8 flex flex-col items-center justify-center border-r border-slate-700/60">
            <div className="text-center w-full">
              {/* Full Profile Image */}
              <div className="relative w-56 h-62 rounded-2xl border-4 border-white/20 shadow-2xl overflow-hidden mb-8 mx-auto">
                {userData.image ? (
                  <img 
                    src={userData.image} 
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-600 to-purple-600">
                    <FaUser className="text-white text-5xl" />
                  </div>
                )}
              </div>

              {/* User Name */}
              <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                {userData.name}
              </h2>

              {/* Member ID */}
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-6">
                <span className="text-base font-mono text-blue-300 font-semibold">
                  ID: {luckyNumber}
                </span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-600/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Active Member</span>
              </div>

              {/* Decorative Elements */}
              <div className="mt-8 flex justify-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - All Content Without Scroll */}
          <div className="w-3/5 p-8">
            {/* Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">Winner Profile Details</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>

            {/* Content Grid - Compact Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Company Information */}
              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/60 col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-600/20 p-2 rounded-lg">
                    <FaBuilding className="text-blue-400 text-xl" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Company Details</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-300 text-lg">
                    <span className="text-blue-400 font-medium">Company ID:</span> {userData.companyId}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600/20 p-2 rounded-lg">
                    <FaPhone className="text-green-400 text-xl" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Contact</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                    <FaPhone className="text-green-500 flex-shrink-0" />
                    <span className="text-slate-300">{userData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                    <FaWhatsapp className="text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{userData.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                    <FaEnvelope className="text-blue-400 flex-shrink-0" />
                    <span className="text-slate-300 break-all">{userData.email}</span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-600/20 p-2 rounded-lg">
                    <FaIdCard className="text-purple-400 text-xl" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Personal</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                    <span className="text-blue-400 font-medium">Age</span>
                    <div className="flex items-center gap-2">
                      <FaBirthdayCake className="text-orange-400" />
                      <span className="text-slate-300">{userData.age} years</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                    <span className="text-blue-400 font-medium">Gender</span>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-purple-400" />
                      <span className="text-slate-300">{userData.gender}</span>
                    </div>
                  </div>
                </div>
              </div>

             
            </div>

           
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfilePopup;