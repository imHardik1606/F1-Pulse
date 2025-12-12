// components/ResultComponent.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Flag,
  Trophy,
  Timer,
  MapPin,
  Users,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { f1Api } from "../../../services/f1Api";

const sessionTypes = [
  { id: "fp1", name: "Free Practice 1", icon: "FP1" },
  { id: "fp2", name: "Free Practice 2", icon: "FP2" },
  { id: "fp3", name: "Free Practice 3", icon: "FP3" },
  { id: "qualy", name: "Qualifying", icon: "Q" },
  { id: "race", name: "Race", icon: "R" },
];

const teamColors = {
  red_bull: "#3671C6",
  ferrari: "#F91536",
  mercedes: "#27F4D2",
  mclaren: "#F58020",
  aston_martin: "#358C75",
  alpine: "#2293D1",
  rb: "#6692FF",
  haas: "#B6BABD",
  sauber: "#52E252",
  williams: "#64C4FF",
};

export default function ResultComponent() {
  const [currentYear] = useState(new Date().getFullYear());
  const [round, setRound] = useState(1);
  const [session, setSession] = useState("race");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await f1Api.getResults(currentYear, round, session);
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [round, session]);

  const getSessionResults = () => {
    if (!data?.races) return [];

    switch (session) {
      case "fp1":
      case "fp2":
      case "fp3":
        return data.races[`${session}Results`] || [];
      case "qualy":
        return data.races.qualyResults || [];
      case "race":
        return data.races.results || [];
      default:
        return [];
    }
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return time.replace(/:/g, ":").replace(/(\d+):(\d+):(\d+)/, "$1:$2:$3");
  };

  const getSessionTime = () => {
    if (!data?.races) return null;

    switch (session) {
      case "fp1":
        return { date: data.races.fp1Date, time: data.races.fp1Time };
      case "fp2":
        return { date: data.races.fp2Date, time: data.races.fp2Time };
      case "fp3":
        return { date: data.races.fp3Date, time: data.races.fp3Time };
      case "qualy":
        return { date: data.races.qualyDate, time: data.races.qualyTime };
      case "race":
        return { date: data.races.date, time: data.races.time };
      default:
        return null;
    }
  };

  const getRaceName = (round) => {
    const races = {
      1: "Bahrain GP",
      2: "Saudi Arabian GP",
      3: "Australian GP",
      4: "Japanese GP",
      5: "Chinese GP",
      6: "Miami GP",
      7: "Emilia Romagna GP",
      8: "Monaco GP",
      9: "Spanish GP",
      10: "Canadian GP",
      11: "Austrian GP",
      12: "British GP",
      13: "Hungarian GP",
      14: "Belgian GP",
      15: "Dutch GP",
      16: "Italian GP",
      17: "Azerbaijan GP",
      18: "Singapore GP",
      19: "United States GP",
      20: "Mexico City GP",
      21: "São Paulo GP",
      22: "Las Vegas GP",
      23: "Qatar GP",
      24: "Abu Dhabi GP",
    };
    return races[round] || `Grand Prix ${round}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 font-orbitron">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              F1 Results & Timings
            </h1>
            <p className="text-gray-400 mt-2">
              Live and historical Formula 1 session results
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-red-600 rounded-full">
              Season {currentYear}
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full">
              Round {round}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 font-exo2">
          {/* Round Selector */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Round Selection
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setRound(Math.max(1, round - 1))}
                disabled={round <= 1}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="relative flex-1">
                <select
                  value={round}
                  onChange={(e) => setRound(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-black border-2 border-red-600 rounded-lg appearance-none 
                            focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-500
                            font-bold text-white hover:border-red-500 transition-all duration-200 bg-fixed"
                >
                  {[...Array(24).keys()].map((i) => (
                    <option
                      key={i + 1}
                      value={i + 1}
                      className="bg-black text-white font-bold"
                    >
                      R{i + 1 < 10 ? `0${i + 1}` : i + 1} • {getRaceName(i + 1)}
                    </option>
                  ))}
                </select>
                <ChevronRight
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400"
                  size={16}
                />
              </div>

              <button
                onClick={() => setRound(round + 1)}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {/* Session Type Selector */}
          <div className="flex-1">
            <label className="block text-md font-medium text-gray-300 mb-2">
              Session Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {sessionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSession(type.id)}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    session === type.id
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  <span className="block text-lg font-medium">{type.icon}</span>
                  <span className="text-[10px] opacity-75">
                    {type.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading session data...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-center"
          >
            <p className="text-red-400">Error loading data: {error}</p>
            <button
              onClick={fetchResults}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Main Content */}
        {!loading && !error && data && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${round}-${session}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Race Info Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-red-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                  {/* Round Info */}
                  <div className="md:col-span-2 font-exo2">
                    <h2 className="text-2xl font-bold mb-2">
                      {data.races.raceName}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-red-500" />
                        <span>{data.races.circuit.circuitName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag size={18} className="text-red-500" />
                        <span>
                          {data.races.circuit.city},{" "}
                          {data.races.circuit.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-red-500" />
                        <span>{data.races.circuit.corners} corners</span>
                      </div>
                    </div>
                  </div>

                  {/* Race Details */}
                  <div className="space-y-3 font-exo2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={22} className="text-red-600" />
                        <span className="text-sm text-gray-300">
                          Session Date
                        </span>
                      </div>
                      <span className="font-medium">
                        {getSessionTime()?.date || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={22} className="text-red-600" />
                        <span className="text-sm text-gray-300">
                          Session Time
                        </span>
                      </div>
                      <span className="font-medium">
                        {getSessionTime()?.time || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer size={22} className="text-red-600" />
                        <span className="text-sm text-gray-300">
                          Lap Record
                        </span>
                      </div>
                      <span className="font-medium">
                        {data.races.circuit.lapRecord}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
                <div className="px-6 py-4 bg-gray-800/50 border-b border-red-500">
                  <div className="flex items-center justify-between font-exo2">
                    <h3 className="text-xl font-extrabold">
                      {sessionTypes.find((s) => s.id === session)?.name} Results
                    </h3>
                    <div className="flex items-center gap-2 rounded-lg bg-red-500 p-4">
                      <Trophy className="text-white" size={20} />
                      <span className="text-md text-white">
                        {getSessionResults().length} drivers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800/50 font-exo2">
                        <th className="py-4 px-6 text-left text-md font-medium text-gray-400">
                          Pos
                        </th>
                        <th className="py-4 px-6 text-left text-md font-medium text-gray-400">
                          Driver
                        </th>
                        <th className="py-4 px-6 text-left text-md font-medium text-gray-400">
                          Team
                        </th>

                        {/* Session-specific columns */}
                        {session === "qualy" && (
                          <>
                            <th className="py-4 px-6 text-left text-md font-medium text-gray-400">
                              Q1
                            </th>
                            <th className="py-4 px-6 text-left text-md font-medium text-gray-400">
                              Q2
                            </th>
                            <th className="py-4 px-6 text-left text-md font-medium text-gray-400">
                              Q3
                            </th>
                            <th className="py-4 px-6 text-left text-md font-medium text-gray-400">
                              Grid
                            </th>
                          </>
                        )}

                        {["fp1", "fp2", "fp3"].includes(session) && (
                          <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">
                            Time
                          </th>
                        )}

                        {session === "race" && (
                          <>
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">
                              Grid
                            </th>
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">
                              Time/Gap
                            </th>
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-400">
                              Points
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      <AnimatePresence>
                        {getSessionResults().map((result, index) => (
                          <motion.tr
                            key={result.driver?.driverId || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                          >
                            {/* Position */}
                            <td className="py-4 px-6">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  index === 0
                                    ? "bg-yellow-500 text-black/60"
                                    : index === 1
                                    ? "bg-gray-300 text-black/60"
                                    : index === 2
                                    ? "bg-amber-700 text-black/60"
                                    : "bg-gray-700/50 text-gray-400"
                                }`}
                              >
                                {session === "race"
                                  ? result.position
                                  : index + 1}
                              </div>
                            </td>

                            {/* Driver */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-13 h-13 rounded-lg flex items-center justify-center font-bold text-md font-orbitron p-2"
                                  style={{
                                    backgroundColor:
                                      teamColors[result.team?.teamId] ||
                                      "#374151",
                                    color: ["mercedes", "mclaren"].includes(
                                      result.team?.teamId
                                    )
                                      ? "#000"
                                      : "#fff",
                                  }}
                                >
                                  {result.driver?.shortName || "N/A"}
                                </div>
                                <div>
                                  <div className="font-medium font-exo2">
                                    {result.driver?.name}{" "}
                                    {result.driver?.surname}
                                  </div>
                                  <div className="text-md text-gray-400">
                                    #{result.driver?.number || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Team */}
                            <td className="py-4 px-6 font-orbitron">
                              <div className="font-medium">
                                {result.team?.teamName || "N/A"}
                              </div>
                              <div className="text-sm text-gray-400">
                                {result.team?.nationality || "N/A"}
                              </div>
                            </td>

                            {/* Session-specific data */}
                            {session === "qualy" && (
                              <>
                                <td className="py-4 px-6 font-mono">
                                  {formatTime(result.q1)}
                                </td>
                                <td className="py-4 px-6 font-mono">
                                  {formatTime(result.q2)}
                                </td>
                                <td className="py-4 px-6 font-mono">
                                  {formatTime(result.q3)}
                                </td>
                                <td className="py-4 px-6 font-bold">
                                  {result.gridPosition}
                                </td>
                              </>
                            )}

                            {["fp1", "fp2", "fp3"].includes(session) && (
                              <td className="py-4 px-6 font-mono text-lg">
                                {formatTime(result.time)}
                              </td>
                            )}

                            {session === "race" && (
                              <>
                                <td className="py-4 px-6">{result.grid}</td>
                                <td className="py-4 px-6 font-mono">
                                  {result.time || "N/A"}
                                </td>
                                <td className="py-4 px-6">
                                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700/50 rounded-full">
                                    <Trophy
                                      size={14}
                                      className="text-yellow-500"
                                    />
                                    <span className="font-bold">
                                      {result.points}
                                    </span>
                                  </div>
                                </td>
                              </>
                            )}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Footer Stats */}
                <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700">
                  <div className="flex flex-wrap gap-6 text-sm text-gray-400 font-exo2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Pole Position/Winner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span>Second Place</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-700"></div>
                      <span>Third Place</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-oxanium">
                {/* Circuit Info */}
                <div className="md:col-span-2">
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h4 className="text-lg font-semibold mb-4">
                      Circuit Information
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Circuit Length */}
                      <div>
                        <div className="text-sm text-gray-400">
                          Circuit Length
                        </div>
                        <div className="font-medium">
                          {data.races.circuit.circuitLength
                            ? `${data.races.circuit.circuitLength
                                .toString()
                                .replace("km", "")} m`
                            : "N/A"}
                        </div>
                      </div>

                      {/* First Grand Prix */}
                      <div>
                        <div className="text-sm text-gray-400">
                          First Grand Prix
                        </div>
                        <div className="font-medium">
                          {data.races.circuit.firstParticipationYear}
                        </div>
                      </div>

                      {/* Number of Corners */}
                      <div>
                        <div className="text-sm text-gray-400">Corners</div>
                        <div className="font-medium">
                          {data.races.circuit.corners}
                        </div>
                      </div>

                      {/* Lap Record */}
                      <div>
                        <div className="text-sm text-gray-400">Lap Record</div>
                        <div className="font-medium">
                          {data.races.circuit.lapRecord || "N/A"}
                        </div>
                      </div>

                      {/* Fastest Lap Year */}
                      <div>
                        <div className="text-sm text-gray-400">
                          Fastest Lap Year
                        </div>
                        <div className="font-medium">
                          {data.races.circuit.fastestLapYear}
                        </div>
                      </div>

                      {/* Fastest Lap Driver */}
                      <div>
                        <div className="text-sm text-gray-400">
                          Lap Record Holder
                        </div>
                        <div
                          className="font-medium truncate"
                          title={data.races.circuit.fastestLapDriverId}
                        >
                          {data.races.circuit.fastestLapDriverId
                            ? data.races.circuit.fastestLapDriverId
                                .replace("_", " ")
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")
                            : "N/A"}
                        </div>
                      </div>

                      {/* Fastest Lap Team */}
                      <div>
                        <div className="text-sm text-gray-400">Record Team</div>
                        <div
                          className="font-medium truncate"
                          title={data.races.circuit.fastestLapTeamId}
                        >
                          {data.races.circuit.fastestLapTeamId
                            ? data.races.circuit.fastestLapTeamId
                                .charAt(0)
                                .toUpperCase() +
                              data.races.circuit.fastestLapTeamId.slice(1)
                            : "N/A"}
                        </div>
                      </div>

                      {/* Total Results (if applicable) */}
                      <div>
                        <div className="text-sm text-gray-400">
                          Total Results
                        </div>
                        <div className="font-medium">{data.total}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        window.open(data.races.circuit.url, "_blank")
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>View Wikipedia</span>
                      </div>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() =>
                        window.open(data.races.circuit.url, "_blank")
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center justify-between transition-colors group"
                    >
                      <span>Circuit Details</span>
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setRound(round < 24 ? round + 1 : 1)}
                      className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg flex items-center justify-between transition-colors group"
                    >
                      <span>Next Round</span>
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm"
      >
        <p>
          F1 Results Component • Data sourced from F1API.dev • {currentYear}{" "}
          Season
        </p>
        <p className="mt-2">
          Not affiliated with Formula 1, Formula One Management, or Formula One
          World Championship Limited.
        </p>
      </motion.footer>
    </div>
  );
}
