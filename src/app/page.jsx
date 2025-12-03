"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  Users,
  Award,
  Flag,
  Award as TrophyIcon,
  CircuitBoard,
} from "lucide-react";
import { f1Api } from "../services/f1Api";
import { Racing_Sans_One, Orbitron, Oxanium } from "next/font/google";

const racingSans = Racing_Sans_One({
  weight: '400',
  subsets: ['latin'],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700", "900"], // choose weights you need
});

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "700"], // choose weights you need
});

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [nextRace, setNextRace] = useState(null);
  const [nextRaceTime, setNextRaceTime] = useState(null);
  const [activeStanding, setActiveStanding] = useState("drivers");
  const [isVisible, setIsVisible] = useState(false);
  const [standings, setStandings] = useState({
    drivers: [],
    constructors: [],
  });
  const [loading, setLoading] = useState({
    drivers: true,
    constructors: true,
    race: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchAllData();
  }, []);

  const currentYear = new Date().getFullYear();

  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading({
        drivers: true,
        constructors: true,
        race: true,
      });

      // Fetch data in parallel
      const [driversData, constructorsData, nextRaceData] = await Promise.all([
        f1Api.getDriverChampionship().catch((err) => {
          console.error("Failed to fetch drivers:", err);
          return null;
        }),
        f1Api.getConstructorChampionship().catch((err) => {
          console.error("Failed to fetch constructors:", err);
          return null;
        }),
        f1Api.getNextRace().catch((err) => {
          console.error("Failed to fetch next race:", err);
          return null;
        }),
      ]);

      // Update drivers standings
      if (driversData && Array.isArray(driversData)) {
        const transformedDrivers = driversData.map((driver) => ({
          name: `${driver.driver.name} ${driver.driver.surname}`,
          team: simplifyTeamName(driver.team.teamName),
          points: driver.points,
          color: getTeamColor(driver.team.teamName),
          wins: driver.wins,
          position: driver.position,
          driverId: driver.driverId,
          nationality: driver.driver.nationality,
          shortName: driver.driver.shortName,
        }));
        setStandings((prev) => ({ ...prev, drivers: transformedDrivers }));
      }

      // Update constructors standings
      if (constructorsData && Array.isArray(constructorsData)) {
        const transformedConstructors = constructorsData.map((constructor) => ({
          name: simplifyTeamName(constructor.team.teamName),
          points: constructor.points,
          color: getTeamColor(constructor.team.teamName),
          wins: constructor.wins,
          position: constructor.position,
          teamId: constructor.teamId,
          country: constructor.team.country,
          championships: constructor.team.constructorsChampionships || 0,
        }));
        setStandings((prev) => ({
          ...prev,
          constructors: transformedConstructors,
        }));
      }

      // Update next race
      if (nextRaceData) {
        const race = nextRaceData.race[0];
        setNextRace({
          name: race.raceName,
          circuit: race.circuit.circuitName,
          date: race.schedule.race.date + "T" + race.schedule.race.time,
          schedule: race.schedule, // Add this line
          round: race.round,
          season: nextRaceData.season,
        });
        startRaceCountdown(
          race.schedule.race.date + "T" + race.schedule.race.time
        );
      } else {
        // Fallback with schedule data
        const currentYear = new Date().getFullYear();
        setNextRace({
          name: "Singapore Grand Prix",
          circuit: "Marina Bay Street Circuit",
          date: `${currentYear}-09-22T12:00:00Z`,
          schedule: {
            race: { date: `${currentYear}-09-22`, time: "12:00:00Z" },
            qualy: { date: `${currentYear}-09-21`, time: "14:00:00Z" },
            fp1: { date: `${currentYear}-09-20`, time: "09:30:00Z" },
            fp2: { date: `${currentYear}-09-20`, time: "13:00:00Z" },
            fp3: { date: `${currentYear}-09-21`, time: "10:30:00Z" },
          },
        });
        startRaceCountdown(`${currentYear}-09-22T12:00:00Z`);

        setError("Failed to load data. Please try again later.");
      }
    } finally {
      setLoading({
        drivers: false,
        constructors: false,
        race: false,
      });
    }
  };

  const getTeamColor = (teamName) => {
    if (!teamName) return "from-gray-600 to-gray-400";

    // First simplify the name, then map to colors
    const simplifiedName = simplifyTeamName(teamName).toLowerCase();

    const colorMap = {
      "red bull": "from-blue-900 to-blue-700",
      ferrari: "from-red-600 to-red-800",
      mclaren: "from-orange-500 to-orange-700",
      mercedes: "from-cyan-500 to-blue-600",
      "aston martin": "from-green-600 to-emerald-500",
      alpine: "from-blue-500 to-pink-500",
      williams: "from-blue-900 to-white",
      haas: "from-gray-500 to-white",
      rb: "from-blue-900 to-white",
      sauber: "from-red-600 to-white",
      default: "from-gray-600 to-gray-400",
    };

    return colorMap[simplifiedName] || colorMap.default;
  };

  // Add this function after the getTeamColor function:

  const simplifyTeamName = (teamName) => {
    if (!teamName) return "Unknown Team";

    const nameMap = {
      "red bull racing": "Red Bull",
      "scuderia ferrari": "Ferrari",
      "mclaren formula 1 team": "McLaren",
      "mercedes formula 1 team": "Mercedes",
      "aston martin f1 team": "Aston Martin",
      "alpine f1 team": "Alpine",
      "williams racing": "Williams",
      "haas f1 team": "Haas",
      "rb f1 team": "Racing Bull",
      "sauber f1 team": "Sauber",
      default: teamName,
    };

    const simplified = nameMap[teamName.toLowerCase()];
    return simplified || teamName;
  };

  const startRaceCountdown = (raceDate) => {
    const calculateTimeLeft = () => {
      const raceDateObj = new Date(raceDate);
      const now = new Date();
      const difference = raceDateObj - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setNextRaceTime(calculateTimeLeft());
    const timer = setInterval(() => {
      setNextRaceTime(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  };

  // F1 Logo SVG for background
  const f1LogoSVG = `url("data:image/svg+xml,%3Csvg width='200' height='120' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120'%3E%3Cpath d='M20,60 Q50,20 80,60 T140,60' stroke='%23${
    darkMode ? "ffffff" : "000000"
  }' stroke-width='3' fill='none' opacity='0.05'/%3E%3Cpath d='M40,60 Q70,20 100,60 T160,60' stroke='%23${
    darkMode ? "ffffff" : "000000"
  }' stroke-width='3' fill='none' opacity='0.05'/%3E%3Ctext x='100' y='75' text-anchor='middle' font-family='Arial, sans-serif' font-size='20' fill='%23${
    darkMode ? "ffffff" : "000000"
  }' opacity='0.05'%3EF1%3C/text%3E%3C/svg%3E")`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const countVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i) => ({
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: i * 0.1,
      },
    }),
  };

  const trackLineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 2, bounce: 0 },
        opacity: { duration: 0.01 },
      },
    },
  };

  // Update the Next Race section to use API data
  const renderNextRaceSection = () => {
    if (loading.race) {
      return (
        <motion.div
          className={`bg-gray-900/30 backdrop-blur-xl border border-gray-800/30 rounded-2xl p-8 mb-12`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="flex space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1">
                  <div className="h-16 bg-gray-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }

    if (error && !nextRace) {
      return (
        <motion.div
          className="bg-gray-900/30 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 mb-12"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-center">
            <div className="text-red-500 mb-2">Failed to load race data</div>
            <button
              onClick={fetchAllData}
              className="text-red-500 hover:text-red-400 font-medium px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Retry
            </button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className={`bg-gray-900/30 backdrop-blur-xl border border-gray-800/30 rounded-2xl p-6 md:p-8 mb-12 md:mb-16 shadow-2xl ${racingSans.className}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <motion.div className="flex items-center space-x-2 mb-2">
              <motion.div
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="w-7 h-7 text-yellow-500" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                Next Race
              </h3>
            </motion.div>
            <h4 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent mb-2">
              {nextRace ? nextRace.name : "Singapore Grand Prix"}
            </h4>
            <p className="text-gray-400 mb-4">
              {nextRace ? nextRace.circuit : "Marina Bay Street Circuit"}
            </p>

            {/* Session Dates Section */}
            {/* {nextRace && nextRace.schedule && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {Object.entries(nextRace.schedule).map(([session, details]) => {
                  if (!details?.date) return null;

                  const sessionLabels = {
                    race: "Race",
                    qualy: "Qualifying",
                    fp1: "FP1",
                    fp2: "FP2",
                    fp3: "FP3",
                    sprintQualy: "Sprint Qualifying",
                    sprintRace: "Sprint Race",
                  };

                  const sessionColors = {
                    race: "from-red-600 to-red-400",
                    qualy: "from-blue-600 to-blue-400",
                    fp1: "from-purple-600 to-purple-400",
                    fp2: "from-green-600 to-green-400",
                    fp3: "from-yellow-600 to-yellow-400",
                    sprintQualy: "from-pink-600 to-pink-400",
                    sprintRace: "from-orange-600 to-orange-400",
                  };

                  const formatDateTime = (dateStr, timeStr) => {
                    const date = new Date(
                      `${dateStr}T${timeStr || "12:00:00Z"}`
                    );
                    return date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    });
                  };

                  return (
                    <motion.div
                      key={session}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay:
                          0.1 * Object.keys(nextRace.schedule).indexOf(session),
                      }}
                      className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full bg-linear-to-r ${
                            sessionColors[session] ||
                            "from-gray-600 to-gray-400"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-300">
                          {sessionLabels[session] || session}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDateTime(details.date, details.time)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )} */}
            {nextRace && nextRace.schedule && (
              <div className="mt-4 pt-4 border-t border-gray-800/50">
                <h5 className="text-sm font-medium text-gray-400 mb-3">
                  Session Schedule
                </h5>
                <div className="space-y-2">
                  {Object.entries(nextRace.schedule)
                    .filter(([_, details]) => details?.date)
                    .sort(
                      (a, b) =>
                        new Date(`${a[1].date}T${a[1].time}`) -
                        new Date(`${b[1].date}T${b[1].time}`)
                    )
                    .map(([session, details], index) => {
                      const date = new Date(
                        `${details.date}T${details.time || "12:00:00Z"}`
                      );
                      const isRace = session === "race";

                      return (
                        <motion.div
                          key={session}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800/30 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                isRace ? "bg-red-500" : "bg-gray-600"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isRace
                                  ? "text-white font-medium"
                                  : "text-gray-300"
                              }`}
                            >
                              {session === "race"
                                ? "Race"
                                : session === "qualy"
                                ? "Qualifying"
                                : session.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {nextRaceTime && (
            <div className="flex space-x-4 md:space-x-6">
              {[
                { value: nextRaceTime.days, label: "DAYS" },
                { value: nextRaceTime.hours, label: "HOURS" },
                { value: nextRaceTime.minutes, label: "MINUTES" },
                { value: nextRaceTime.seconds, label: "SECONDS" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={countVariants}
                  className="text-center"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 md:p-4 min-w-16 md:min-w-20">
                    <motion.div
                      className="text-2xl md:text-3xl font-bold text-white"
                      key={`${item.label}-${item.value}`}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {item.value.toString().padStart(2, "0")}
                    </motion.div>
                    <div className="text-xs md:text-sm text-gray-400 mt-1">
                      {item.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Update the renderStandings function to handle both drivers and constructors:
  const renderStandings = () => {
    const currentStandings =
      activeStanding === "drivers"
        ? loading.drivers
          ? []
          : standings.drivers
        : loading.constructors
        ? []
        : standings.constructors;

    if (
      (loading.drivers && activeStanding === "drivers") ||
      (loading.constructors && activeStanding === "constructors")
    ) {
      return (
        <div className="space-y-4">
          {/* Show loading skeletons - 10 for drivers, 10 for constructors */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                    {activeStanding === "drivers" && (
                      <div className="h-4 bg-gray-700 rounded w-24"></div>
                    )}
                    {activeStanding === "constructors" && (
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                    )}
                  </div>
                </div>
                <div className="h-8 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (currentStandings.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No standings data available</div>
          <button
            onClick={fetchAllData}
            className="text-red-500 hover:text-red-400 font-medium px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3 md:space-y-4">
        {currentStandings.map((item, index) => (
          <motion.div
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 10 }}
            className="flex items-center justify-between bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3 md:space-x-4">
              <motion.div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-linear-to-r ${item.color} backdrop-blur-sm`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="font-bold text-white text-sm md:text-base">
                  {item.position || index + 1}
                </span>
              </motion.div>
              <div>
                <h4 className={`text-base md:text-xl font-semibold text-white flex items-center gap-2 ${orbitron.className}`}>
                  {item.name}
                  {activeStanding === "drivers" && item.shortName && (
                    <span className="text-xs bg-gray-700/50 px-2 py-0.5 rounded text-gray-300">
                      {item.shortName}
                    </span>
                  )}
                </h4>
                {activeStanding === "drivers" && item.team && (
                  <div className="flex items-center gap-2">
                    <p className={`text-gray-400 text-sm font-medium ${racingSans.className}`}>
                      {item.team}
                    </p>
                    {item.nationality && (
                      <span className={`text-xs text-gray-500 ${oxanium.className}`}>
                        • {item.nationality}
                      </span>
                    )}
                  </div>
                )}
                {activeStanding === "constructors" && (
                  <div className="flex items-center gap-2 mt-1">
                    {item.country && (
                      <div className="flex items-center gap-1">
                        <Flag className="w-3 h-3 text-gray-500" />
                        <span className={`text-md text-gray-400 ${racingSans.className}`}>
                          {item.country}
                        </span>
                      </div>
                    )}
                    {item.championships > 0 && (
                      <div className="flex items-center gap-1">
                        <TrophyIcon className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-500">
                          {item.championships} titles
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <motion.div
                className={`text-xl md:text-2xl font-bold text-white ${orbitron.className}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {item.points}
              </motion.div>
              <div className="flex items-center justify-end gap-2">
                <div className={`text-gray-400 text-xs md:text-sm ${racingSans.className}`}>PTS</div>
                {item.wins > 0 && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span className={`text-xs text-yellow-500 ${oxanium.className}`}>
                      {item.wins}W
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Animated track lines in background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.svg
          className="absolute w-full h-full"
          initial="hidden"
          animate="visible"
        >
          <motion.path
            d="M0,100 Q250,50 500,100 T1000,100"
            stroke={
              darkMode ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)"
            }
            strokeWidth="2"
            fill="none"
            variants={trackLineVariants}
          />
          <motion.path
            d="M0,200 Q250,150 500,200 T1000,200"
            stroke={
              darkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)"
            }
            strokeWidth="2"
            fill="none"
            variants={trackLineVariants}
            transition={{ delay: 0.5 }}
          />
          <motion.path
            d="M0,300 Q250,250 500,300 T1000,300"
            stroke={
              darkMode ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.05)"
            }
            strokeWidth="2"
            fill="none"
            variants={trackLineVariants}
            transition={{ delay: 1 }}
          />
        </motion.svg>

        {/* Animated F1 Logo Grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: f1LogoSVG,
            backgroundSize: "400px",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Animated Particles Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            initial={{
              x: Math.random() * 100 + "vw",
              y: Math.random() * 100 + "vh",
            }}
            animate={{
              x: [null, Math.random() * 100 + "vw"],
              y: [null, Math.random() * 100 + "vh"],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header with Dark Mode Toggle */}
      {/* <header className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-8 h-8 bg-linear-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span className="font-bold text-white text-sm">F1</span>
              </motion.div>
              <span className="text-xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                PULSE
              </span>
            </motion.div>

            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            {/* Hero Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center mb-12 md:mb-16"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center space-x-2 bg-gray-800/30 backdrop-blur-xl px-4 py-2 rounded-full mb-6 border border-gray-700/30"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-4 h-4 text-red-500" />
                </motion.div>
                <span className="text-sm font-semibold text-gray-300">
                  LIVE UPDATES
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className={`text-4xl sm:text-5xl md:text-7xl font-bold mb-6 ${oxanium.className} leading-tight`}
              >
                <span className="block text-white">F1 STATS</span>
                <motion.span
                  className="block bg-linear-to-r from-red-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    backgroundSize: "200% auto",
                  }}
                >
                  REIMAGINED
                </motion.span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className={`text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 px-4 ${racingSans.className}`}
              >
                Experience Formula 1 like never before with real-time analytics,
                stunning visualizations, and in-depth statistics that bring you
                closer to the action.
              </motion.p>
            </motion.div>

            {/* Next Race Countdown */}
            {renderNextRaceSection()}

            {/* Championship Standings */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/30 rounded-2xl p-6 md:p-8 shadow-2xl"
            >
              <div
                className={`${orbitron.className} flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8`}
              >
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl md:text-3xl font-semibold text-white">
                    Current Leaderboard
                  </h3>
                  <p className="text-gray-400">
                    {currentYear} Championship Standings
                  </p>
                </motion.div>

                {/* Animated Championship Toggle */}
                <div className="relative mt-4 sm:mt-0">
                  <div className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50">
                    <div className="relative flex gap-2">
                      {" "}
                      {/* Removed w-64 */}
                      <motion.div
                        className="absolute top-1 bottom-1 w-1/2 bg-red-600/30 rounded-md border border-red-500/50"
                        animate={
                          activeStanding === "drivers"
                            ? { x: 0 }
                            : { x: "100%" }
                        }
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                        }}
                      />
                      <button
                        onClick={() => setActiveStanding("drivers")}
                        className="relative flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors z-10 cursor-pointer min-w-0 overflow-hidden"
                        disabled={loading.drivers}
                      >
                        <Users className="w-6 h-6 shrink-0" />
                        <span className="font-medium truncate">Drivers</span>
                      </button>
                      <button
                        onClick={() => setActiveStanding("constructors")}
                        className="relative flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors z-10 cursor-pointer min-w-0 overflow-hidden"
                        disabled={loading.constructors}
                      >
                        <Award className="w-6 h-6 shrink-0 mr-2" />
                        <span className="font-medium">
                          Constructors
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStanding}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStandings()}
                </motion.div>
              </AnimatePresence>

              <motion.div
                className="mt-6 md:mt-8 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <button
                  onClick={fetchAllData}
                  className="text-red-500 hover:text-red-400 font-semibold flex items-center justify-center mx-auto space-x-2 backdrop-blur-sm px-6 py-3 rounded-lg hover:bg-red-600/10 transition-all duration-300 border border-red-500/30"
                >
                  <span>Refresh Data</span>
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <CircuitBoard className="w-4 h-4" />
                  </motion.span>
                </button>
              </motion.div>
            </motion.div>

            {/* Animated Circuit Line */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-20"
            >
              <svg className="w-full h-32" viewBox="0 0 1200 200">
                <motion.path
                  d="M0,100 Q300,50 600,100 T1200,100"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <motion.circle
                  cx="1200"
                  cy="100"
                  r="8"
                  fill="#ef4444"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: [1, 1.5, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: 2, duration: 1, repeat: Infinity }}
                />
              </svg>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 border-t border-gray-800/30 bg-gray-950/90 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <motion.div
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-8 h-8 bg-linear-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <span className="font-bold text-white text-sm">F1</span>
                </motion.div>
                <span className="text-xl font-bold bg-linear-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                  PULSE
                </span>
              </motion.div>
              <p className="text-gray-500 text-sm">
                © {currentYear} F1 Pulse. Not affiliated with Formula 1.
              </p>
              <p>
                Made with <span className="text-red-500">♥</span> by F1 Enthusiasts - Hardik Gayner
              </p>
            </div>

            <div className="flex space-x-4 md:space-x-6 flex-wrap justify-center">
              {["Twitter", "GitHub", "API Docs", "Privacy"].map(
                (item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="text-gray-500 hover:text-white transition-colors text-sm md:text-base font-medium"
                    whileHover={{ y: -3 }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.a>
                )
              )}
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Floating Speed Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-8 bg-linear-to-b from-red-500 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: ["-100vh", "100vh"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-red-900/90 backdrop-blur-xl border border-red-700/50 rounded-xl p-4 max-w-sm">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{error}</p>
                  <button
                    onClick={fetchAllData}
                    className="text-red-300 hover:text-white text-sm font-medium mt-2"
                  >
                    Try Again →
                  </button>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .gradient-animate {
          background-size: 200% auto;
          animation: gradientShift 3s ease infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ef4444, #3b82f6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #dc2626, #2563eb);
        }

        /* Font smoothing for better readability */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}
