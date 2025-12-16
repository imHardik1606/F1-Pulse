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
import Link from "next/link";

const racingSans = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
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
          schedule: race.schedule,
          round: race.round,
          season: nextRaceData.season,
        });
        startRaceCountdown(
          race.schedule.race.date + "T" + race.schedule.race.time
        );
      } else {
        // Fallback with schedule data
        // const currentYear = new Date().getFullYear();
        // setNextRace({
        //   name: "Singapore Grand Prix",
        //   circuit: "Marina Bay Street Circuit",
        //   date: `${currentYear}-09-22T12:00:00Z`,
        //   schedule: {
        //     race: { date: `${currentYear}-09-22`, time: "12:00:00Z" },
        //     qualy: { date: `${currentYear}-09-21`, time: "14:00:00Z" },
        //     fp1: { date: `${currentYear}-09-20`, time: "09:30:00Z" },
        //     fp2: { date: `${currentYear}-09-20`, time: "13:00:00Z" },
        //     fp3: { date: `${currentYear}-09-21`, time: "10:30:00Z" },
        //   },
        // });
        // startRaceCountdown(`${currentYear}-09-22T12:00:00Z`);

        // setError("Failed to load data. Please try again later.");
        // No more races this season
        setNextRace(null);
        setNextRaceTime(null);
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
      ferrari: "from-primary to-red-800",
      mclaren: "from-orange-500 to-orange-700",
      mercedes: "from-cyan-500 to-blue-600",
      "aston martin": "from-green-600 to-emerald-500",
      alpine: "from-blue-500 to-pink-500",
      williams: "from-blue-900 to-white",
      haas: "from-gray-500 to-white",
      rb: "from-blue-900 to-white",
      sauber: "from-primary to-white",
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

    // Handle no races case
    if (!nextRace) {
      return (
        <motion.div
          className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/30 rounded-2xl p-6 md:p-8 mb-12 md:mb-16 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
        >
          <div className="flex flex-col items-center justify-center text-center py-8 md:py-12">
            <motion.div
              className="mb-6"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <div className="w-20 h-20 bg-linear-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700/50">
                <Trophy className="w-10 h-10 text-gray-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3
                className={`text-2xl md:text-3xl font-bold text-white ${racingSans.className}`}
              >
                Season Complete! 🏁
              </h3>

              <div className="text-gray-400 max-w-md mx-auto space-y-3">
                <p className="text-lg">No more races left this season</p>
                <p className="text-sm md:text-base">
                  The {currentYear} Formula 1 season has concluded. Stay tuned
                  for the next season's schedule!
                </p>
              </div>

              <motion.div
                className="flex items-center justify-center space-x-2 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-8 h-8 rounded-full bg-linear-to-r from-gray-700 to-gray-600 border-2 border-gray-900"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />
                ))}
              </div> */}
                <span className="text-sm text-gray-500">
                  See you in {currentYear + 1}!
                </span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    // if (!nextRace) {
    // return (
    //   <motion.div
    //     className="relative overflow-hidden bg-linear-to-br from-gray-900 via-black to-gray-900 border border-red-600/20 rounded-2xl p-8 md:p-12 mb-16 shadow-[0_0_60px_rgba(229,9,20,0.15)]"
    //     initial={{ scale: 0.9, opacity: 0 }}
    //     animate={{ scale: 1, opacity: 1 }}
    //     transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
    //   >
    //     {/* Racing track background effect */}
    //     <div className="absolute inset-0 overflow-hidden">
    //       <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-500/30 to-transparent -translate-y-1/2" />
    //       <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-linear-to-b from-transparent via-red-500/10 to-transparent" />
    //       <div className="absolute top-0 bottom-0 right-1/4 w-0.5 bg-linear-to-b from-transparent via-red-500/10 to-transparent" />

    //       {/* Grid pattern - Fixed SVG */}
    //       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_70%,rgba(0,0,0,0.7)_100%)]" />
    //       <div
    //         className="absolute inset-0 opacity-20"
    //         style={{
    //           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E10600' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    //           backgroundSize: '60px 60px'
    //         }}
    //       />
    //     </div>

    //     {/* Checkered flag border - Fixed */}
    //     <div
    //       className="absolute -top-1 -left-1 -right-1 h-2 rounded-t-2xl"
    //       style={{
    //         backgroundImage: `linear-gradient(90deg, #000 50%, #fff 50%)`,
    //         backgroundSize: '20px 100%'
    //       }}
    //     />
    //     <div
    //       className="absolute -bottom-1 -left-1 -right-1 h-2 rounded-b-2xl"
    //       style={{
    //         backgroundImage: `linear-gradient(90deg, #fff 50%, #000 50%)`,
    //         backgroundSize: '20px 100%'
    //       }}
    //     />

    //     <div className="relative flex flex-col items-center justify-center text-center py-12 md:py-16">
    //       <motion.div
    //         className="mb-8"
    //         initial={{ rotate: -180, scale: 0 }}
    //         animate={{ rotate: 0, scale: 1 }}
    //         transition={{ type: "spring", stiffness: 100, damping: 15 }}
    //       >
    //         <div className="relative w-24 h-24 bg-linear-to-br from-red-600 via-red-700 to-black rounded-full flex items-center justify-center border-2 border-red-500/50 shadow-[0_0_30px_rgba(229,9,20,0.3)]">
    //           {/* Podium steps effect */}
    //           <div className="absolute -bottom-6 flex space-x-1">
    //             {[1, 2, 3].map((step) => (
    //               <motion.div
    //                 key={step}
    //                 className="h-3 bg-linear-to-b from-yellow-400 via-yellow-600 to-amber-800"
    //                 initial={{ y: 20, opacity: 0 }}
    //                 animate={{ y: 0, opacity: 1 }}
    //                 transition={{ delay: 0.4 + step * 0.1 }}
    //                 style={{ width: `${10 - step * 2}px` }}
    //               />
    //             ))}
    //           </div>
    //           <Trophy className="w-12 h-12 text-yellow-300 drop-shadow-lg" />

    //           {/* Trophy shine effect */}
    //           <div className="absolute inset-0 rounded-full bg-linear-to-tr from-transparent via-white/5 to-transparent" />
    //         </div>
    //       </motion.div>

    //       <motion.div
    //         initial={{ y: 20, opacity: 0 }}
    //         animate={{ y: 0, opacity: 1 }}
    //         transition={{ delay: 0.2 }}
    //         className="space-y-6"
    //       >
    //         {/* F1-style header with gradient */}
    //         <div className="relative">
    //           <h3 className={`text-4xl md:text-5xl font-bold bg-linear-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent ${racingSans.className} tracking-tight`}>
    //             SEASON FINALE 🏁
    //           </h3>
    //           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-linear-to-r from-red-600 via-yellow-500 to-red-600 rounded-full" />
    //         </div>

    //         <div className="space-y-4 max-w-2xl mx-auto">
    //           <motion.p
    //             className="text-xl md:text-2xl text-white font-medium"
    //             initial={{ x: -20, opacity: 0 }}
    //             animate={{ x: 0, opacity: 1 }}
    //             transition={{ delay: 0.3 }}
    //           >
    //             <span className="text-red-400 font-bold">RACE COMPLETE!</span> The {currentYear} championship has been decided.
    //           </motion.p>

    //           <div className="text-gray-300 space-y-3 text-lg">
    //             <motion.p
    //               className="leading-relaxed"
    //               initial={{ x: 20, opacity: 0 }}
    //               animate={{ x: 0, opacity: 1 }}
    //               transition={{ delay: 0.4 }}
    //             >
    //               The final chequered flag has waved, marking the end of an incredible season.
    //               The garage doors are closed, but the passion for racing continues to burn.
    //             </motion.p>

    //             <motion.p
    //               className="leading-relaxed italic text-gray-400 border-l-2 border-red-600/50 pl-4 py-2"
    //               initial={{ x: -20, opacity: 0 }}
    //               animate={{ x: 0, opacity: 1 }}
    //               transition={{ delay: 0.5 }}
    //             >
    //               "In Formula 1, we don't look at where we are, but where we can be.
    //               The off-season is just the start of our next victory lap."
    //             </motion.p>
    //           </div>

    //           {/* Team driver helmets */}
    //           <motion.div
    //             className="flex items-center justify-center space-x-6 mt-8"
    //             initial={{ opacity: 0 }}
    //             animate={{ opacity: 1 }}
    //             transition={{ delay: 0.6 }}
    //           >
    //             <div className="flex -space-x-3">
    //               {[
    //                 { gradient: 'from-red-600 to-red-800', team: 'Ferrari' },
    //                 { gradient: 'from-blue-500 to-blue-700', team: 'Mercedes' },
    //                 { gradient: 'from-[#6CD3BF] to-[#469D8B]', team: 'Aston Martin' },
    //                 { gradient: 'from-black to-gray-800', team: 'McLaren' },
    //                 { gradient: 'from-[#3671C6] to-[#2B5294]', team: 'Red Bull' }
    //               ].map(({ gradient, team }, i) => (
    //                 <motion.div
    //                   key={i}
    //                   className="relative group"
    //                   initial={{ x: -20, opacity: 0 }}
    //                   animate={{ x: 0, opacity: 1 }}
    //                   transition={{ delay: 0.7 + i * 0.1 }}
    //                   whileHover={{ scale: 1.2, y: -5 }}
    //                 >
    //                   <div className={`w-10 h-10 rounded-full bg-linear-to-br ${gradient} border-2 border-gray-900 shadow-lg`} />
    //                   {/* Team tooltip */}
    //                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
    //                     {team}
    //                   </div>
    //                 </motion.div>
    //               ))}
    //             </div>
    //             <div className="h-6 w-px bg-linear-to-b from-transparent via-gray-600 to-transparent" />
    //             <span className="text-sm font-medium text-gray-400 tracking-wider">
    //               <span className="text-red-400 font-bold">{currentYear}</span>
    //               <span className="mx-2 text-yellow-400">⏩</span>
    //               <span className="text-yellow-300 font-bold">{currentYear + 1}</span>
    //             </span>
    //           </motion.div>

    //           {/* Season transition indicator */}
    //           <motion.div
    //             className="mt-8 pt-6 border-t border-gray-800/50"
    //             initial={{ scale: 0.9, opacity: 0 }}
    //             animate={{ scale: 1, opacity: 1 }}
    //             transition={{ delay: 0.8 }}
    //           >
    //             <div className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-gray-900/80 via-black/80 to-gray-900/80 rounded-xl border border-gray-700/50 shadow-lg">
    //               <div className="flex items-center gap-2">
    //                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
    //                 <span className="text-sm font-medium text-gray-300 tracking-wider">
    //                   NEXT SEASON IN PROGRESS
    //                 </span>
    //               </div>
    //               <div className="h-4 w-px bg-gray-600" />
    //               <span className="text-sm font-bold text-yellow-300 tracking-widest">
    //                 SEASON {currentYear + 1}
    //               </span>
    //             </div>

    //             {/* Loading bars */}
    //             <div className="flex justify-center gap-1 mt-4">
    //               {[0.1, 0.3, 0.5, 0.7, 0.9].map((width, i) => (
    //                 <motion.div
    //                   key={i}
    //                   className="h-1 bg-linear-to-r from-red-600 to-yellow-500 rounded-full"
    //                   initial={{ width: 0 }}
    //                   animate={{ width: `${width * 100}%` }}
    //                   transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
    //                 />
    //               ))}
    //             </div>
    //           </motion.div>
    //         </div>
    //       </motion.div>
    //     </div>

    //     {/* Floating champagne bubbles */}
    //     {[...Array(8)].map((_, i) => (
    //       <motion.div
    //         key={i}
    //         className="absolute w-1 h-1 bg-linear-to-br from-yellow-400/50 to-red-500/50 rounded-full"
    //         initial={{
    //           x: Math.random() * 100 - 50,
    //           y: Math.random() * 100 - 50,
    //           opacity: 0
    //         }}
    //         animate={{
    //           y: [null, -20, -40],
    //           opacity: [0, 1, 0]
    //         }}
    //         transition={{
    //           repeat: Infinity,
    //           duration: 2 + Math.random(),
    //           delay: i * 0.2,
    //           ease: "easeOut"
    //         }}
    //         style={{
    //           left: `${10 + i * 10}%`,
    //           top: `${80 - i * 5}%`
    //         }}
    //       />
    //     ))}
    //   </motion.div>
    // );
    // }

    // Original next race display code (when there is a next race)
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
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="w-7 h-7 text-yellow-500" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                Next Race
              </h3>
            </motion.div>
            <h4 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-primary to-yellow-500 bg-clip-text text-transparent mb-2">
              {nextRace.name}
            </h4>
            <p className="text-gray-400 mb-4">{nextRace.circuit}</p>

            {/* Session Dates Section */}
            {nextRace.schedule && (
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
        {currentStandings.slice(0, 10).map((item, index) => (
          <motion.div
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.3) }}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between bg-gray-800/30 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50 hover:border-red-500/90 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3 md:space-x-4">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-linear-to-r ${item.color}`}
              >
                <span className="font-bold text-white text-sm md:text-base">
                  {item.position || index + 1}
                </span>
              </div>
              <div>
                <h4
                  className={`text-base md:text-xl font-semibold text-white flex items-center gap-2 ${orbitron.className}`}
                >
                  {item.name}
                  {activeStanding === "drivers" && item.shortName && (
                    <span className="text-xs bg-gray-700/50 px-2 py-0.5 rounded text-gray-300">
                      {item.shortName}
                    </span>
                  )}
                </h4>
                {activeStanding === "drivers" && item.team && (
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-gray-400 text-sm font-medium ${racingSans.className}`}
                    >
                      {item.team}
                    </p>
                    {item.nationality && (
                      <span
                        className={`text-xs text-gray-500 ${oxanium.className}`}
                      >
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
                        <span
                          className={`text-md text-gray-400 ${racingSans.className}`}
                        >
                          {item.country}
                        </span>
                      </div>
                    )}
                    {item.championships > 0 && (
                      <div
                        className={`flex items-center gap-1 bg-yellow-200 p-2 rounded-md`}
                      >
                        <TrophyIcon className="w-3 h-3 text-black" />
                        <span
                          className={`text-xs text-black ${oxanium.className}`}
                        >
                          {item.championships} titles
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-xl md:text-2xl font-bold text-white ${orbitron.className}`}
              >
                {item.points}
              </div>
              <div className="flex items-center justify-end gap-2">
                <div
                  className={`text-gray-400 text-xs md:text-sm ${racingSans.className}`}
                >
                  PTS
                </div>
                {item.wins > 0 && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span
                      className={`text-xs text-yellow-500 ${oxanium.className}`}
                    >
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
          className="absolute inset-0 opacity-5 bg-[url('/assets/f1-bg.jpeg')] bg-center bg-no-repeat"
          style={{ backgroundSize: "400px" }}
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
                className="w-8 h-8 bg-linear-to-r from-primary to-red-800 rounded-lg flex items-center justify-center"
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
              <span className="text-xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
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
                  className="block bg-linear-to-r from-primary via-yellow-500 to-blue-600 bg-clip-text text-transparent"
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

            <div className={`flex justify-center m-6 ${racingSans.className}`}>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary/50 rounded-md border border-red-500/50 text-white font-medium hover:bg-primary/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <Link href="/menu" className="inline-flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M4 4h4v4H4zM12 4h4v4h-4zM4 12h4v4H4zM12 12h4v4h-4z"
                      fill="currentColor"
                    />
                    <path
                      d="M20 4v16M4 20h16"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Explore more stats <p className="text-2xl">&gt;</p>
                </Link>
              </button>
            </div>
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
                        className="absolute top-1 bottom-1 w-1/2 bg-primary/30 rounded-md border border-red-500/50"
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
                        <span className="font-medium">Constructors</span>
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
                <Link
                  href="/standings"
                  className="text-red-500 hover:text-red-400 font-semibold flex items-center justify-center mx-auto space-x-2 px-6 py-3 rounded-lg hover:bg-primary/10 transition-all duration-300 border border-red-500/30 w-full max-w-[200px]"
                >
                  <span>View all Standings</span>
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
                </Link>
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
                  className="w-8 h-8 bg-linear-to-r from-primary to-red-800 rounded-lg flex items-center justify-center backdrop-blur-sm"
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <span className="font-bold text-white text-sm">F1</span>
                </motion.div>
                <span className="text-xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  PULSE
                </span>
              </motion.div>
              <p className="text-gray-500 text-sm">
                © {currentYear} F1 Pulse. Not affiliated with Formula 1.
              </p>
              <p>
                Made with <span className="text-red-500">♥</span> by F1
                Enthusiasts - Hardik Gayner
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
