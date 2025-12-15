 import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  UserCheck,
  Trophy,
  Filter,
  Download,
  Calendar,
  Vote,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

const ElectionDashboard = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [participants, setParticipants] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // Use unique identifiers to prevent duplication
  const allPeople = React.useMemo(() => {
    const people = [];
    const seenEmails = new Set(); // Use email to deduplicate
    
    // Add candidates first (they take priority)
    candidates.forEach((candidate) => {
      if (!seenEmails.has(candidate.email)) {
        seenEmails.add(candidate.email);
        people.push({
          ...candidate,
          id: `candidate-${candidate.documentId || candidate.id}`, // Use documentId for unique ID
          role: "Candidate",
        });
      }
    });
    
    // Add participants who are NOT already candidates
    participants.forEach((participant) => {
      if (!seenEmails.has(participant.email)) {
        seenEmails.add(participant.email);
        people.push({
          ...participant,
          id: `participant-${participant.id}`,
          role: "Voter",
        });
      }
    });
    
    return people;
  }, [participants, candidates]);

  // Calculate deduplicated counts
  const totalCandidates = React.useMemo(() => {
    const seenEmails = new Set();
    return candidates.filter(candidate => {
      if (!seenEmails.has(candidate.email)) {
        seenEmails.add(candidate.email);
        return true;
      }
      return false;
    }).length;
  }, [candidates]);

  const totalParticipants = participants.length;
  
  const totalVoters = React.useMemo(() => {
    // Get all candidate emails (deduplicated)
    const candidateEmails = new Set();
    candidates.forEach(candidate => {
      candidateEmails.add(candidate.email);
    });
    
    // Count participants who are NOT candidates
    return participants.filter(p => !candidateEmails.has(p.email)).length;
  }, [participants, candidates]);

  const totalVotes = React.useMemo(() => {
    const seenEmails = new Set();
    return candidates.reduce((sum, candidate) => {
      if (!seenEmails.has(candidate.email)) {
        seenEmails.add(candidate.email);
        return sum + (candidate.votes || 0);
      }
      return sum;
    }, 0);
  }, [candidates]);

  // -----------------------------
  // FETCH PARTICIPANTS & CANDIDATES
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Participants
        const participantRes = await axios.get(
          "https://api.regeve.in/api/election-participants?populate=*"
        );

        const participantArray = participantRes.data.data || [];

        const formattedParticipants = participantArray.map((item) => {
          const photoUrl = item.attributes?.photo?.data?.attributes?.url
            ? `https://api.regeve.in${item.attributes.photo.data.attributes.url}`
            : `https://api.dicebear.com/7.x/initials/svg?seed=${item.attributes?.name || "User"}`;

          return {
            id: item.id,
            documentId: item.documentId,
            name: item.attributes?.name || "Unknown",
            email: item.attributes?.email || "",
            registrationDate: item.attributes?.createdAt || item.createdAt,
            image: photoUrl,
            votes: 0,
            party: null,
            isVerified: item.attributes?.isVerified || false,
          };
        });

        // Fetch Candidates
        const candidateRes = await axios.get(
          "https://api.regeve.in/api/candidates?populate[photo]=true&populate[election_candidate_position]=true"
        );

        const candidateArray = candidateRes.data.data || [];
        const formattedCandidates = candidateArray.map((item) => {
          // Handle both Strapi v4 and v5 structures
          const attributes = item.attributes || item;
          const photoData = attributes?.photo?.data?.attributes || attributes?.photo;
          const positionData = attributes?.election_candidate_position?.data?.attributes || 
                            attributes?.election_candidate_position;
          
          const photoUrl = photoData?.url
            ? `https://api.regeve.in${photoData.url}`
            : `https://api.dicebear.com/7.x/initials/svg?seed=${attributes?.name || "Candidate"}`;

          return {
            id: item.id,
            documentId: item.documentId,
            name: attributes?.name || "Unknown Candidate",
            email: attributes?.email || "",
            registrationDate: attributes?.createdAt || item.createdAt,
            image: photoUrl,
            votes: attributes?.votes || 0,
            party: attributes?.party || null,
            position: positionData?.Position || "Candidate",
          };
        });

        // Filter only verified participants
        const verifiedParticipants = formattedParticipants.filter(
          (p) => p.isVerified === true
        );

        setParticipants(verifiedParticipants);
        setCandidates(formattedCandidates);
      } catch (error) {
        console.error("API Fetch Error:", error);
      }
    };

    fetchData();
  }, []);

  // Filtering Logic
  const filteredList = allPeople.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.party && p.party.toLowerCase().includes(search.toLowerCase())) ||
      (p.position && p.position.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (filter === "candidate" && p.role === "Candidate") ||
      (filter === "voter" && p.role === "Voter");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-10 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Election Analytics Dashboard
            </h1>
            <p className="text-gray-500">
              Monitor election progress and participant analytics
            </p>
          </div>
          <button className="mt-4 lg:mt-0 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 font-medium text-sm shadow-sm hover:shadow">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_15px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-2">
              Total Participants
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {totalParticipants.toLocaleString()}
            </p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <UserPlus className="w-4 h-4 mr-2" />
              <span>
                {totalCandidates} candidates • {totalVoters} voters
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_15px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-50">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-blue-600 font-medium">Active</span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-2">
              Total Candidates
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {totalCandidates}
            </p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>Active contenders in race</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_15px_25px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50">
                <Vote className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-purple-600 font-medium">Cast</span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-2">
              Total Votes
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {totalVotes.toLocaleString()}
            </p>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Votes recorded to date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Participants Directory
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage and view all election participants
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredList.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {allPeople.length}
                </span>{" "}
                participants
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 bg-gradient-to-r from-gray-50/50 to-white border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search participants by name, email, or position..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-500 shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm">
                <Filter className="w-5 h-5 text-gray-400 mr-3" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="outline-none bg-transparent text-gray-700 cursor-pointer pr-8"
                >
                  <option value="all">All Participants</option>
                  <option value="candidate">Candidates</option>
                  <option value="voter">Voters</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th className="p-6 text-left text-sm font-semibold text-gray-700">
                  Participant
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-700">
                  Role & Position
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-700">
                  Registration
                </th>
                <th className="p-6 text-left text-sm font-semibold text-gray-700">
                  Performance
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200/50">
              {filteredList.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/30 transition-all duration-200"
                >
                  {/* Participant Column */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md"
                        />
                        {p.role === "Candidate" && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <UserCheck className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm text-gray-600 truncate max-w-[180px]">
                            {p.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="p-6">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                          p.role === "Candidate"
                            ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border border-blue-200"
                            : "bg-gradient-to-r from-gray-50 to-gray-100/50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {p.role === "Candidate" ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" /> Candidate
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4 mr-2" /> Voter
                          </>
                        )}
                      </span>
                      {p.position && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Position:</span>{" "}
                          {p.position}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Registration Date */}
                  <td className="p-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(p.registrationDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          Registered
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Performance / Votes */}
                  <td className="p-6">
                    {p.role === "Candidate" ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Votes:</span>
                          <span className="font-bold text-gray-900">
                            {(p.votes || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full shadow-sm"
                            style={{
                              width:
                                totalVotes > 0
                                  ? `${((p.votes || 0) / totalVotes) * 100}%`
                                  : "0%",
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {totalVotes > 0
                            ? `${(((p.votes || 0) / totalVotes) * 100).toFixed(
                                1
                              )}% of total votes`
                            : "0% of total votes"}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                          <Vote className="w-5 h-5" />
                        </div>
                        <span>Eligible Voter</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredList.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-gray-700 text-xl font-semibold mb-3">
                No participants found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search criteria or filter to find what you're
                looking for
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredList.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50/50 to-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredList.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {allPeople.length}
                </span>{" "}
                participants
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <span className="text-gray-600">Candidates:</span>
                  <span className="font-semibold text-gray-900">
                    {totalCandidates}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-500"></div>
                  <span className="text-gray-600">Voters:</span>
                  <span className="font-semibold text-gray-900">
                    {totalVoters}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionDashboard;