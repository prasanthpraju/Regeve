 import React, { useState, useRef, useEffect } from "react";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import {
  Search,
  Filter,
  Mail,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Clock,
  Hash,
  MapPin,
  Download,
  Users,
  ChevronDown,
  Edit2,
  Share2,
  AlertCircle,
  ArrowLeft,
  Send,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const participationForm = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [activeShareMenu, setActiveShareMenu] = useState(null);

  const shareMenuRef = useRef(null);

  const [participants, setParticipants] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Close share menu when clicking outside
  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(
        "https://api.regeve.in/api/election-participants?populate=*"
      );

      const apiData = response.data.data; // this is the real array

      if (Array.isArray(apiData)) {
        const formatted = apiData.map((item) => {
          // Extract real image
          const photoUrl = item.Photo?.url
            ? `https://api.regeve.in${item.Photo.url}`
            : `https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`;

          return {
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone_number,
            whatsapp: item.whatsapp_number,
            idNumber: item.id_card,
            idType: "voterid",
            address: "Not Provided",
            registrationDate: item.createdAt,
            verified: item.isVerified,
            constituency: "Not Assigned",

            // REAL IMAGE from Strapi
            image: photoUrl,
          };
        });

        setParticipants(formatted);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  // Show alert function
  const showAlertMessage = (message, type = "success") => {
    setShowAlert({ show: true, message, type });
    setTimeout(() => {
      setShowAlert({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Toggle verification with confirmation
  const toggleVerifyParticipant = async (id, name) => {
    const isCurrentlyVerified = participants.find((p) => p.id === id)?.verified;
    const action = isCurrentlyVerified ? "unverify" : "verify";

    if (window.confirm(`Are you sure you want to ${action} ${name}?`)) {
      try {
        await axios.put(
          `https://api.regeve.in/api/election-participants/${id}`,
          {
            isVerified: !isCurrentlyVerified,
          }
        );

        setParticipants((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, verified: !isCurrentlyVerified } : p
          )
        );

        showAlertMessage(
          `${name} ${
            !isCurrentlyVerified ? "verified" : "unverified"
          } successfully`
        );
      } catch (error) {
        showAlertMessage("Failed to update verification", "error");
        console.error(error);
      }
    }
  };

  // Send verification message
  const sendVerification = (participant, method) => {
    const electionLink = "https://election-portal.example.com/vote";
    const votingId = `VOTE${participant.id.toString().padStart(6, "0")}`;

    const message = `🏛️ Election Commission Verification\n\nDear ${participant.name},\n\n✅ Your election participation has been VERIFIED!\n\n📋 Your Details:\n• Voter ID: ${votingId}\n• Constituency: ${participant.constituency}\n\n🔗 Election Portal: ${electionLink}\n\n🗳️ Important Dates:\n• Voting Period: March 15-20, 2024\n• Results Declaration: March 25, 2024\n\nPlease keep your voting credentials secure.\n\nBest regards,\nElection Commission of India`;

    if (method === "email") {
      const subject =
        "✅ Election Verification Complete - You Are Eligible to Vote!";
      const mailtoLink = `mailto:${
        participant.email
      }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        message
      )}`;
      window.location.href = mailtoLink;
      showAlertMessage(`Email sent to ${participant.name}`, "success");
    } else if (method === "whatsapp") {
      const whatsappUrl = `https://wa.me/${participant.phone.replace(
        /\D/g,
        ""
      )}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      showAlertMessage(
        `WhatsApp message sent to ${participant.name}`,
        "success"
      );
    } else if (method === "telegram") {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
        electionLink
      )}&text=${encodeURIComponent(message)}`;
      window.open(telegramUrl, "_blank");
      showAlertMessage(
        `Telegram message sent to ${participant.name}`,
        "success"
      );
    }

    setActiveShareMenu(null);
  };

  // Start editing
  const startEditing = (participant) => {
    setEditingId(participant.id);
    setEditForm({ ...participant });
  };

  // Save edit
  const saveEdit = () => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === editingId ? { ...p, ...editForm } : p))
    );
    setEditingId(null);
    showAlertMessage("Participant updated successfully", "success");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.idNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.constituency.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "verified"
        ? p.verified
        : filter === "pending"
        ? !p.verified
        : true;

    return matchesSearch && matchesFilter;
  });

  const totalCount = participants.length;
  const verifiedCount = participants.filter((p) => p.verified).length;
  const pendingCount = totalCount - verifiedCount;

  const getIDTypeColor = (type) => {
    const colors = {
      aadhar: "bg-blue-50 text-blue-700 border border-blue-100",
      voterid: "bg-green-50 text-green-700 border border-green-100",
      passport: "bg-purple-50 text-purple-700 border border-purple-100",
      driving: "bg-amber-50 text-amber-700 border border-amber-100",
    };
    return colors[type] || "bg-gray-50 text-gray-700 border border-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Alert Messages */}
        {showAlert.show && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              showAlert.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : showAlert.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : showAlert.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-blue-50 border-blue-200 text-blue-700"
            } shadow-sm animate-fadeIn`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{showAlert.message}</p>
            </div>
          </div>
        )}

        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/candidate-dashboard")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Voter Management
              </h1>
              <p className="text-gray-600">
                Manage voter verification and communication
              </p>
            </div>

            <button className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 text-sm font-medium bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)]">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Total Voters Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_15px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Voters
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalCount}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Verified Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_15px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Verified</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {verifiedCount}
                </p>
                <p className="text-green-600 text-xs font-medium mt-2">
                  {((verifiedCount / totalCount) * 100).toFixed(1)}% verified
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Pending Card */}
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_15px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-600 text-sm font-medium">Pending</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">
        {pendingCount}
      </p>
    </div>
    <div className="p-3 bg-amber-50 rounded-xl">
      <Clock className="w-6 h-6 text-amber-600" />
    </div>
  </div>
</div>
        </div>

        {/* Combined Search and Actions Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.08)] p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search and Filter Row */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, ID, or constituency..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 bg-white"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 bg-white appearance-none cursor-pointer"
                >
                  <option value="all">All Voters</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Only</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
           <table className="w-full">
  <thead className="bg-gray-50 border-b border-gray-200">
    <tr>
      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Voter</th>
      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Info</th>
      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
      <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-100">
    {filteredParticipants.map((participant) => (
      <tr 
        key={participant.id} 
        className="hover:bg-blue-50/30 transition-colors duration-150"
      >
        {/* Voter Information */}
        <td className="py-5 px-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={participant.image}
                alt={participant.name}
                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
              />
              {participant.verified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-md font-medium text-gray-900 truncate">{participant.name}</p>
              <div className="flex items-center mt-1 space-x-3">
                <span className="inline-flex items-center text-xs text-gray-500">
                  <span className="font-bold px-1">ID: </span> {participant.id.toString().padStart(4, '0')}
                </span>
                
              </div>
            </div>
          </div>
        </td>
        
        {/* Contact Details */}
        <td className="py-5 px-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate max-w-[160px]">{participant.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">{participant.phone}</span>
            </div>
          </div>
        </td>
        
        {/* ID Information */}
        <td className="py-5 px-6">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className={`px-2.5 py-1 rounded-md text-xs font-medium ${getIDTypeColor(participant.idType)}`}>
                {participant.idType}
              </div>
            </div>
            <p className="text-xs text-gray-600 font-mono bg-gray-50 px-3 py-1.5 rounded-md truncate max-w-[180px]">
              {participant.idNumber}
            </p>
            <p className="text-xs text-gray-500">
              Registered {new Date(participant.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </td>
        
        {/* Verification Status */}
        <td className="py-5 px-6">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${participant.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className={`text-sm font-medium ${participant.verified ? 'text-green-700' : 'text-yellow-700'}`}>
                {participant.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
            
            {/* Fixed Toggle Switch */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleVerifyParticipant(participant.id, participant.name)}
                className="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                role="switch"
                aria-checked={participant.verified}
              >
                <span className="sr-only">
                  {participant.verified ? "Mark as unverified" : "Mark as verified"}
                </span>
                <span
                  className={`pointer-events-none relative inline-block h-5 w-10 transform rounded-full shadow-sm transition duration-200 ease-in-out ${
                    participant.verified ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      participant.verified ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </span>
              </button>
              
              <span className="text-xs text-gray-600 font-medium">
                {participant.verified ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-xs text-gray-500">
              {participant.verified ? 'Voter is verified' : 'Awaiting verification'}
            </p>
          </div>
        </td>
        
        {/* Actions */}
        <td className="py-5 px-6">
          <div className="flex items-center space-x-2">
            {/* Edit Button */}
            <button
              onClick={() => startEditing(participant)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
              title="Edit voter details"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            {/* Share Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveShareMenu(activeShareMenu === participant.id ? null : participant.id)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                title="Share verification"
              >
                <Share2 className="w-4 h-4" />
              </button>
              
              {activeShareMenu === participant.id && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-700">Send Verification</p>
                  </div>
                  <button
                    onClick={() => sendVerification(participant, 'email')}
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    Send via Email
                  </button>
                  <button
                    onClick={() => sendVerification(participant, 'whatsapp')}
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <FaWhatsapp className="w-4 h-4 mr-3 text-green-500" />
                    Send via WhatsApp
                  </button>
                  <button
                    onClick={() => sendVerification(participant, 'telegram')}
                    className="w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <FaTelegram className="w-4 h-4 mr-3 text-blue-500" />
                    Send via Telegram
                  </button>
                </div>
              )}
            </div>
            
           
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          </div>

          {filteredParticipants.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-gray-700 text-lg font-semibold mb-2">
                No voters found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search criteria or filter to find what you're
                looking for
              </p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Edit Voter Details
                </h3>
                <button
                  onClick={cancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Constituency
                  </label>
                  <input
                    type="text"
                    value={editForm.constituency || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, constituency: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                    placeholder="Enter constituency"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelEdit}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Footer */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredParticipants.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
              registered voters
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Verified:</span>
                <span className="font-semibold text-gray-900">
                  {verifiedCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold text-gray-900">
                  {pendingCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default participationForm;