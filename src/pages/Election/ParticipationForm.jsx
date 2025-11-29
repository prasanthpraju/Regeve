 import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { 
  Search, 
  Filter, 
  Mail, 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  IdCard,
  Calendar,
  MapPin,
  Send,
  Download,
  Eye,
  Shield,
  Vote,
  Users,
  MoreVertical
} from "lucide-react";

const RegisteredParticipants = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // table or card

  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 98765 43210",
      idNumber: "1234 5678 9012",
      idType: "aadhar",
      address: "123 Main Street, Bangalore, Karnataka - 560001",
      registrationDate: "2024-01-15",
      verified: false,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      constituency: "Bangalore South",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 87654 32109",
      idNumber: "ABCD1234567",
      idType: "voterid",
      address: "456 Park Avenue, Mumbai, Maharashtra - 400001",
      registrationDate: "2024-01-16",
      verified: true,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      constituency: "Mumbai North",
    },
    {
      id: 3,
      name: "Alex Chen",
      email: "alex.chen@example.com",
      phone: "+91 76543 21098",
      idNumber: "P1234567",
      idType: "passport",
      address: "789 Oak Road, Delhi - 110001",
      registrationDate: "2024-01-14",
      verified: false,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      constituency: "Delhi Central",
    },
    {
      id: 4,
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "+91 65432 10987",
      idNumber: "DL0420231234567",
      idType: "driving",
      address: "321 Pine Lane, Chennai, Tamil Nadu - 600001",
      registrationDate: "2024-01-17",
      verified: false,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      constituency: "Chennai Central",
    },
  ]);

  const toggleSelectParticipant = (id) => {
    setSelectedParticipants(prev =>
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const selectAllParticipants = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    }
  };

  const verifyParticipant = (id) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, verified: true } : p)
    );
    setSelectedParticipants(prev => prev.filter(pid => pid !== id));
  };

  const unverifyParticipant = (id) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, verified: false } : p)
    );
  };

  const bulkVerify = () => {
    setParticipants(prev =>
      prev.map(p => 
        selectedParticipants.includes(p.id) ? { ...p, verified: true } : p
      )
    );
    setSelectedParticipants([]);
  };

  const sendVerification = (participant, method) => {
    const electionLink = "https://election-portal.example.com/vote";
    const votingId = `VOTE${participant.id.toString().padStart(6, '0')}`;
    
    const message = `🏛️ Election Commission Verification\n\nDear ${participant.name},\n\n✅ Your election participation has been VERIFIED!\n\n📋 Your Details:\n• Voter ID: ${votingId}\n• Constituency: ${participant.constituency}\n\n🔗 Election Portal: ${electionLink}\n\n🗳️ Important Dates:\n• Voting Period: March 15-20, 2024\n• Results Declaration: March 25, 2024\n\nPlease keep your voting credentials secure.\n\nBest regards,\nElection Commission of India`;

    if (method === 'email') {
      const subject = "✅ Election Verification Complete - You Are Eligible to Vote!";
      const mailtoLink = `mailto:${participant.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoLink;
    } else if (method === 'whatsapp') {
      const whatsappUrl = `https://wa.me/${participant.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const sendBulkVerification = (method) => {
    const selected = participants.filter(p => selectedParticipants.includes(p.id));
    if (selected.length === 0) return;

    if (method === 'email') {
      const emails = selected.map(p => p.email).join(',');
      const subject = "✅ Election Verification Complete - You Are Eligible to Vote!";
      const message = "Your election participation has been verified. Please check your registered email for voting details and important dates.";
      const mailtoLink = `mailto:?bcc=${emails}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoLink;
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.email.toLowerCase().includes(search.toLowerCase()) ||
                         p.idNumber.toLowerCase().includes(search.toLowerCase()) ||
                         p.constituency.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      filter === "all" ? true :
      filter === "verified" ? p.verified :
      filter === "pending" ? !p.verified : true;
    
    return matchesSearch && matchesFilter;
  });

  const totalCount = participants.length;
  const verifiedCount = participants.filter((p) => p.verified).length;
  const pendingCount = totalCount - verifiedCount;

  const getIDTypeColor = (type) => {
    const colors = {
      aadhar: "bg-blue-100 text-blue-800",
      voterid: "bg-green-100 text-green-800",
      passport: "bg-purple-100 text-purple-800",
      driving: "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border">
              <Vote className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Registered Voters
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Manage voter verification and eligibility
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <div className="flex bg-white rounded-xl border shadow-sm">
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 text-sm font-medium rounded-l-xl transition ${
                  viewMode === "table" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`px-4 py-2 text-sm font-medium rounded-r-xl transition ${
                  viewMode === "card" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Card View
              </button>
            </div>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center gap-2 font-medium bg-white shadow-sm">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Voters</p>
                <p className="text-3xl font-bold mt-2">{totalCount}</p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Verified Voters</p>
                <p className="text-3xl font-bold mt-2">{verifiedCount}</p>
                <p className="text-green-200 text-sm mt-1">
                  {((verifiedCount / totalCount) * 100).toFixed(1)}% verified
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Verification</p>
                <p className="text-3xl font-bold mt-2">{pendingCount}</p>
              </div>
              <XCircle className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Combined Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search voters by name, email, ID, or constituency..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-11 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 appearance-none"
                    >
                      <option value="all">All Voters</option>
                      <option value="verified">Verified Only</option>
                      <option value="pending">Pending Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedParticipants.length > 0 && (
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedParticipants.length} voters selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={bulkVerify}
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verify Selected
                  </button>
                  <button
                    onClick={() => sendBulkVerification('email')}
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Notify All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Participants Table */}
        {viewMode === "table" ? (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                  <tr>
                    <th className="p-4 text-left w-12">
                      <input
                        type="checkbox"
                        checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
                        onChange={selectAllParticipants}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">Voter Information</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">Contact Details</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">ID Verification</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">Registration</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-blue-50/50 transition-all duration-200">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => toggleSelectParticipant(participant.id)}
                          className="rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={participant.image}
                            alt={participant.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{participant.name}</p>
                            <p className="text-sm text-gray-500">Voter ID: #{participant.id}</p>
                            <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-1 inline-block">
                              {participant.constituency}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{participant.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{participant.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getIDTypeColor(participant.idType)}`}>
                            <IdCard className="w-3 h-3" />
                            {participant.idType.toUpperCase()}
                          </span>
                          <p className="text-sm text-gray-600 font-mono">
                            {participant.idNumber}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{new Date(participant.registrationDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="truncate max-w-[120px]">{participant.address.split(',')[0]}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {participant.verified ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle className="w-4 h-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                            <XCircle className="w-4 h-4" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {participant.verified ? (
                            <>
                              <button
                                onClick={() => unverifyParticipant(participant.id)}
                                className="px-3 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition font-medium"
                                title="Revoke Verification"
                              >
                                Revoke
                              </button>
                              <button
                                onClick={() => sendVerification(participant, 'email')}
                                className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium flex items-center gap-1"
                                title="Send Email Notification"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => verifyParticipant(participant.id)}
                              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => sendVerification(participant, 'whatsapp')}
                            className="px-3 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium flex items-center gap-1"
                            title="Send WhatsApp"
                          >
                            <FaWhatsapp className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredParticipants.length === 0 && (
              <div className="text-center py-16">
                <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No voters found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParticipants.map((participant) => (
              <div key={participant.id} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={participant.image}
                      alt={participant.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{participant.name}</h3>
                      <p className="text-sm text-gray-500">ID: #{participant.id}</p>
                    </div>
                  </div>
                  {participant.verified ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-orange-500" />
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {participant.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {participant.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {participant.constituency}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getIDTypeColor(participant.idType)}`}>
                    {participant.idType.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    Reg: {new Date(participant.registrationDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  {participant.verified ? (
                    <>
                      <button
                        onClick={() => unverifyParticipant(participant.id)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50 transition font-medium"
                      >
                        Revoke
                      </button>
                      <button
                        onClick={() => sendVerification(participant, 'email')}
                        className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => verifyParticipant(participant.id)}
                      className="flex-1 px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verify Voter
                    </button>
                  )}
                  <button
                    onClick={() => sendVerification(participant, 'whatsapp')}
                    className="px-3 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Showing {filteredParticipants.length} of {totalCount} registered voters
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisteredParticipants;  