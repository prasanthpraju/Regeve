import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Vote,
  CheckCircle,
  Award,
  X,
  Mail,
  Calendar,
  MapPin,
  Landmark,
  Trophy,
  Crown,
  Lock,
  Eye,
  EyeOff,
  Clock as ClockIcon,
  Briefcase,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API_URL = "https://api.regeve.in/api";

const VotingPage = ({ token = null }) => {
  const location = useLocation();

  const electionData = useMemo(
    () =>
      location.state || {
        electionName: "Untitled Election",
        electionType: "Custom",
        electionCategory: "Custom Election",
        electionId: null,
        startTime: null,
        endTime: null,
      },
    [location.state]
  );

  const [positions, setPositions] = useState([]);
  const [submittedVotes, setSubmittedVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [winners, setWinners] = useState({});
  const [votingEnded, setVotingEnded] = useState(false);
  const [voteCounts, setVoteCounts] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }),
    [token]
  );

  useEffect(() => {
    if (electionData.endTime) {
      const endTime = new Date(electionData.endTime).getTime();
      const now = new Date().getTime();

      if (now >= endTime) {
        setVotingEnded(true);
        setShowResults(true);
      } else {
        setVotingEnded(false);
        const interval = setInterval(() => {
          const currentTime = new Date().getTime();
          const timeLeft = endTime - currentTime;

          if (timeLeft <= 0) {
            setVotingEnded(true);
            setShowResults(true);
            clearInterval(interval);
          } else {
            const hours = Math.floor(
              (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [electionData.endTime]);

  const fetchVoteCounts = useCallback(async () => {
    try {
      const votesResponse = await axiosInstance.get("/votes", {
        params: {
          election: electionData.electionId,
          populate: ["candidate"],
        },
      });

      if (votesResponse.data) {
        const counts = {};
        votesResponse.data.forEach((vote) => {
          if (vote.candidate && vote.candidate.id) {
            counts[vote.candidate.id] = (counts[vote.candidate.id] || 0) + 1;
          }
        });

        setVoteCounts(counts);

        setPositions((prevPositions) =>
          prevPositions.map((position) => ({
            ...position,
            candidates: position.candidates.map((candidate) => ({
              ...candidate,
              votes: counts[candidate.id] || 0,
            })),
          }))
        );
      }
    } catch (error) {
      console.log("Could not fetch vote counts");
    }
  }, [axiosInstance, electionData.electionId]);

  const fetchWinners = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/winners", {
        params: {
          election: electionData.electionId,
          populate: ["candidate", "position"],
        },
      });

      if (response.data && response.data.length > 0) {
        const winnersMap = {};
        response.data.forEach((winner) => {
          if (winner.position && winner.candidate) {
            winnersMap[winner.position.id] = winner.candidate.id;
          }
        });
        setWinners(winnersMap);
      }
    } catch (error) {
      console.error("Error fetching winners:", error);
    }
  }, [axiosInstance, electionData.electionId]);

  const fetchVotingData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const positionsResponse = await axiosInstance.get(
        "/election-candidate-positions",
        {
          params: {
            populate: {
              candidates: {
                populate: ["photo"],
              },
            },
          },
        }
      );

      const positionsData = positionsResponse.data.map((position) => ({
        id: position.id,
        name: position.Position,
        position: position.Position,
        submitted: submittedVotes[position.id] || false,
        candidates:
          position.candidates?.map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone_number,
            whatsapp: candidate.whatsApp_number,
            age: candidate.age,
            gender: candidate.gender,
            candidate_id: candidate.candidate_id,
            position: position.Position,
            photoUrl: candidate.photo?.url
              ? `https://api.regeve.in${candidate.photo.url}`
              : null,
            bio:
              candidate.bio ||
              `${candidate.name} is a candidate for ${position.Position}`,
            location: candidate.location || "Not specified",
            joinDate: candidate.join_date || "2020",
            department: candidate.department || "General",
            experience: candidate.experience || "5+ years",
            votes: 0,
            selected: false,
            isWinner: winners[position.id] === candidate.id,
          })) || [],
      }));

      setPositions(positionsData);
      fetchVoteCounts();
    } catch (error) {
      console.error("Error fetching voting data:", error);
      setFetchError("Failed to load voting data. Please try again later.");
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  }, [axiosInstance, submittedVotes, winners, fetchVoteCounts]);

  useEffect(() => {
    fetchVotingData();
  }, [fetchVotingData, refreshKey]);

  useEffect(() => {
    if (votingEnded || showResults) {
      fetchWinners();
    }
  }, [votingEnded, showResults, fetchWinners]);

  const handleVote = (candidateId, positionId) => {
    if (votingEnded || submittedVotes[positionId]) return;

    setPositions((prevPositions) =>
      prevPositions.map((position) => {
        if (position.id === positionId) {
          return {
            ...position,
            candidates: position.candidates.map((candidate) => ({
              ...candidate,
              selected: candidate.id === candidateId,
            })),
          };
        }
        return position;
      })
    );
  };

  const handleSubmitVote = async (positionId, positionName) => {
    const position = positions.find((p) => p.id === positionId);
    if (!position || votingEnded) return;

    const selectedCandidate = position.candidates.find((c) => c.selected);
    if (!selectedCandidate) {
      alert(`Please select a candidate for ${positionName} before submitting.`);
      return;
    }

    try {
      const voteResponse = await axiosInstance.post("/votes", {
        data: {
          candidate: selectedCandidate.id,
          election: electionData.electionId,
          position: positionId,
          voter: "user_id_here",
          timestamp: new Date().toISOString(),
        },
      });

      console.log(`Vote submitted for ${positionName}:`, voteResponse.data);

      setVoteCounts((prev) => ({
        ...prev,
        [selectedCandidate.id]: (prev[selectedCandidate.id] || 0) + 1,
      }));

      setPositions((prev) =>
        prev.map((pos) =>
          pos.id === positionId
            ? {
                ...pos,
                submitted: true,
                candidates: pos.candidates.map((candidate) =>
                  candidate.id === selectedCandidate.id
                    ? { ...candidate, votes: (candidate.votes || 0) + 1 }
                    : { ...candidate, selected: false }
                ),
              }
            : pos
        )
      );

      setSubmittedVotes((prev) => ({
        ...prev,
        [positionId]: true,
      }));
    } catch (error) {
      console.error(`Error submitting vote for ${positionName}:`, error);
      alert("Failed to submit vote. Please try again.");
    }
  };

  const handleToggleResults = () => {
    setShowResults(!showResults);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const totalCandidates = useMemo(
    () =>
      positions.reduce(
        (total, position) => total + position.candidates.length,
        0
      ),
    [positions]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="inline-block rounded-full h-16 w-16 border-t-3 border-b-3 border-blue-600 mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 text-lg font-medium"
          >
            Loading voting data...
          </motion.p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Unable to Load
          </h3>
          <p className="text-gray-600 text-center mb-8">{fetchError}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
                <Landmark className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  {electionData.electionName}
                </h1>
                <p className="text-gray-600 text-sm">
                  {electionData.electionCategory}
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Refresh</span>
              </motion.button>

              {votingEnded ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-100 to-red-50 text-red-700 rounded-xl font-semibold flex items-center gap-2 border border-red-200"
                >
                  <Lock className="w-4 h-4" />
                  <span>Voting Ended</span>
                </motion.div>
              ) : (
                remainingTime && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-xl font-semibold flex items-center gap-2 border border-blue-200"
                  >
                    <ClockIcon className="w-4 h-4" />
                    <span>{remainingTime}</span>
                  </motion.div>
                )
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleResults}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
              >
                {showResults ? (
                  <EyeOff className="w-5 h-5 text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600" />
                )}
                <span className="font-semibold text-gray-700">
                  {showResults ? "Hide Results" : "Show Results"}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8 mt-6"
          >
            {[
              { value: positions.length, label: "Positions", color: "blue" },
              { value: totalCandidates, label: "Candidates", color: "green" },
              {
                value: `${
                  Object.values(submittedVotes).filter(Boolean).length
                }/${positions.length}`,
                label: "Voted",
                color: "purple",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`text-3xl font-bold text-${stat.color}-600 mb-1`}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Grid View */}
          {positions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200/50"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <User className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Positions Available
              </h3>
              <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
                There are no positions registered for this election yet.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Check Again
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {positions.map((position, positionIndex) => {
                const selectedCandidate = position.candidates.find(
                  (c) => c.selected
                );

                return (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: positionIndex * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/50"
                  >
                    {/* Position Header */}
                    <div className="bg-gradient-to-r from-blue-50/80 to-white px-6 sm:px-8 py-6 border-b border-blue-100">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                        <motion.div
                          className="flex items-center gap-4 sm:gap-6"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-lg">
                            <Award className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                              {position.position}
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                              {position.candidates.length} candidate
                              {position.candidates.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </motion.div>

                        {position.submitted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg text-sm sm:text-base"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Submitted</span>
                          </motion.div>
                        ) : votingEnded ? (
                          <div className="text-gray-500 font-medium text-sm sm:text-base">
                            Voting Ended
                          </div>
                        ) : (
                          <div className="text-right">
                            <p className="text-gray-600 text-sm sm:text-base">
                              Select one candidate
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Candidates Grid */}
                    <div className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {position.candidates.map(
                          (candidate, candidateIndex) => {
                            const isWinner =
                              winners[position.id] === candidate.id;
                            const candidateVotes =
                              voteCounts[candidate.id] || candidate.votes || 0;

                            return (
                              <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: candidateIndex * 0.05 }}
                                whileHover={{ y: -6 }}
                                className={`relative rounded-xl border-2 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl ${
                                  isWinner && showResults
                                    ? "border-amber-300 bg-gradient-to-br from-amber-50/50 to-yellow-50/30"
                                    : candidate.selected
                                    ? "border-emerald-300 bg-gradient-to-br from-emerald-50/50 to-green-50/30"
                                    : votingEnded
                                    ? "border-gray-200 bg-gray-50/30"
                                    : "border-gray-200 hover:border-blue-300 bg-white"
                                }`}
                              >
                                <div className="p-4 sm:p-5">
                                  {/* Candidate Profile - Centered */}
                                  <div className="flex flex-col items-center mb-4">
                                    <motion.div
                                      className="relative mb-4"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <div
                                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto shadow-xl ${
                                          isWinner && showResults
                                            ? "border-4 border-amber-300"
                                            : candidate.selected
                                            ? "border-4 border-emerald-300"
                                            : "border-4 border-gray-100"
                                        }`}
                                      >
                                        {candidate.photoUrl ? (
                                          <img
                                            src={candidate.photoUrl}
                                            alt={candidate.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-xl sm:text-2xl">
                                              {getInitials(candidate.name)}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Status Badges */}
                                      <div className="absolute -top-1 -right-1 flex flex-col gap-1">
                                        {candidate.selected && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-full p-1.5 sm:p-2 shadow-lg"
                                          >
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                          </motion.div>
                                        )}
                                        {isWinner && showResults && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full p-1.5 sm:p-2 shadow-lg"
                                          >
                                            <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                          </motion.div>
                                        )}
                                      </div>
                                    </motion.div>

                                    <div className="text-center">
                                      <h4 className="font-bold text-gray-900 text-lg sm:text-xl truncate w-full">
                                        {candidate.name}
                                      </h4>
                                      <p className="text-blue-600 font-semibold text-sm sm:text-base truncate w-full">
                                        {candidate.position}
                                      </p>
                                      {showResults && (
                                        <motion.p
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          className="text-gray-700 font-bold mt-2 text-base sm:text-lg"
                                        >
                                          {candidateVotes} votes
                                        </motion.p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Status Tags */}
                                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    {isWinner && showResults && (
                                      <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-xs font-bold shadow"
                                      >
                                        🏆 Winner
                                      </motion.span>
                                    )}
                                    {candidate.selected && (
                                      <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-xs font-bold shadow"
                                      >
                                        ✓ Your Choice
                                      </motion.span>
                                    )}
                                  </div>

                                  {/* Action Button - Centered */}
                                  <div className="mt-4 flex justify-center">
                                    {!votingEnded && !position.submitted ? (
                                      <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                          handleVote(candidate.id, position.id)
                                        }
                                        disabled={candidate.selected}
                                        className={`w-32 sm:w-40 py-2 sm:py-3 rounded-lg font-bold  text-black cursor-pointer  transition-all text-xs sm:text-sm md:text-base${ candidate.selected? "bg-gradient-to-r from-emerald-600 to-green-600 cursor-not-allowed" : "bg-gradient-to-r from-gray-900 to-gray-800 border-gray-900 hover:from-gray-800 hover:to-black shadow-lg"  }`}
                                      >
                                        {candidate.selected
                                          ? "Selected"
                                          : "Select Candidate"}
                                      </motion.button>
                                    ) : (
                                      <div className="text-center py-2 sm:py-3">
                                        <p className="text-gray-500 font-medium text-xs sm:text-sm">
                                          {votingEnded
                                            ? "Voting Ended"
                                            : "Vote Submitted"}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Candidate Info (Compact) */}
                                  <div className="mt-4 pt-4 border-t border-gray-900">
                                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                                      <div className="text-gray-600 truncate">
                                        <Briefcase className="w-3 ml-20 h-3 inline mr-1" />
                                        {candidate.department}
                                      </div>
                                      <div className="text-gray-600 truncate text-right">
                                        <MapPin className="w-3 h-3 inline mr-1" />
                                        {candidate.location}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          }
                        )}
                      </div>

                      {/* Submit Section - Centered and Improved */}
                      {!position.submitted &&
                        position.candidates.length > 0 &&
                        !votingEnded && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 pt-8 border-t border-gray-200"
                          >
                            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 border-2 border-blue-100">
                              <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
                                <div className="text-center">
                                  <p className="text-xl font-bold text-gray-900 mb-1">
                                    Ready to Submit Your Vote?
                                  </p>
                                  <p className="text-gray-700 text-sm sm:text-base">
                                    {selectedCandidate
                                      ? `Selected: ${selectedCandidate.name}`
                                      : "No candidate selected"}
                                  </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      handleSubmitVote(
                                        position.id,
                                        position.position
                                      )
                                    }
                                    disabled={!selectedCandidate}
                                    className={`px-8 py-3.5 rounded-xl font-bold text-white text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-lg min-w-[200px] ${
                                      selectedCandidate
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                                    }`}
                                  >
                                    <Vote className="w-5 h-5" />
                                    Submit Vote
                                  </motion.button>
                                  {selectedCandidate && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => {
                                        setPositions((prev) =>
                                          prev.map((pos) =>
                                            pos.id === position.id
                                              ? {
                                                  ...pos,
                                                  candidates:
                                                    pos.candidates.map((c) => ({
                                                      ...c,
                                                      selected: false,
                                                    })),
                                                }
                                              : pos
                                          )
                                        );
                                      }}
                                      className="px-6 py-3.5 rounded-xl font-bold text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all min-w-[160px] text-sm sm:text-base"
                                    >
                                      Clear Selection
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                      {/* Winner Announcement */}
                      {votingEnded && showResults && winners[position.id] && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-8 p-6 sm:p-8 bg-gradient-to-r from-amber-50 via-yellow-50/50 to-amber-50 rounded-2xl border-2 border-amber-300"
                        >
                          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
                            <div className="flex items-center gap-4 sm:gap-6">
                              <div className="relative">
                                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl p-4 shadow-xl">
                                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                                </div>
                              </div>
                              <div>
                                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                  🎉 Winner Announced!
                                </h4>
                                <p className="text-gray-700 text-sm sm:text-base">
                                  Congratulations to{" "}
                                  <span className="font-bold text-amber-700">
                                    {
                                      position.candidates.find(
                                        (c) => c.id === winners[position.id]
                                      )?.name
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="bg-white rounded-xl px-6 py-4 sm:px-8 sm:py-6 shadow-lg border-2 border-amber-200">
                              <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                                {voteCounts[winners[position.id]] ||
                                  position.candidates.find(
                                    (c) => c.id === winners[position.id]
                                  )?.votes ||
                                  0}
                              </p>
                              <p className="text-gray-600 font-medium text-sm sm:text-base">
                                Total Votes
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Footer Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200/50"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Voting Summary
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {votingEnded
                        ? "Thank you for participating in the election!"
                        : "Make sure to submit your votes for all positions before time ends."}
                    </p>
                  </div>
                  <div className="flex gap-6 sm:gap-8">
                    {[
                      {
                        value:
                          Object.values(submittedVotes).filter(Boolean).length,
                        label: "Submitted",
                        color: "green",
                      },
                      {
                        value:
                          positions.length -
                          Object.values(submittedVotes).filter(Boolean).length,
                        label: "Pending",
                        color: "blue",
                      },
                      ...(votingEnded
                        ? [
                            {
                              value: Object.keys(winners).length,
                              label: "Winners",
                              color: "amber",
                            },
                          ]
                        : []),
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <p
                          className={`text-2xl sm:text-3xl font-bold text-${stat.color}-600`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Secure Voting Platform • Encrypted Ballot System •{" "}
                    {new Date().getFullYear()}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VotingPage;
