"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { f1Api } from "../../../services/f1Api";

const DriversComponent = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDriver, setExpandedDriver] = useState(null);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [driverPhotos, setDriverPhotos] = useState({});
  const [loadingPhotos, setLoadingPhotos] = useState({});
  const containerRef = useRef(null);

  // Team configurations with colors, names, and gradients
  const teamConfig = {
    mclaren: {
      name: "McLaren",
      color: "#FF8000",
      secondary: "#47C7FC",
      gradient: "from-[#FF8000] to-[#FFD700]",
      bgGradient: "from-[#FF8000]/20 via-[#FF8000]/10 to-transparent",
      accent: "text-[#FF8000]",
    },
    mercedes: {
      name: "Mercedes",
      color: "#00D2BE",
      secondary: "#000000",
      gradient: "from-[#00D2BE] to-[#6CD3C3]",
      bgGradient: "from-[#00D2BE]/20 via-[#00D2BE]/10 to-transparent",
      accent: "text-[#00D2BE]",
    },
    red_bull: {
      name: "Red Bull Racing",
      color: "#0600EF",
      secondary: "#FF0000",
      gradient: "from-[#0600EF] to-[#FF0000]",
      bgGradient: "from-[#0600EF]/20 via-[#0600EF]/10 to-transparent",
      accent: "text-[#0600EF]",
    },
    ferrari: {
      name: "Ferrari",
      color: "#DC0000",
      secondary: "#FFFFFF",
      gradient: "from-[#DC0000] to-[#FF2800]",
      bgGradient: "from-[#DC0000]/20 via-[#DC0000]/10 to-transparent",
      accent: "text-[#DC0000]",
    },
    aston_martin: {
      name: "Aston Martin",
      color: "#006F62",
      secondary: "#00594F",
      gradient: "from-[#006F62] to-[#00A88E]",
      bgGradient: "from-[#006F62]/20 via-[#006F62]/10 to-transparent",
      accent: "text-[#006F62]",
    },
    alpine: {
      name: "Alpine",
      color: "#0090FF",
      secondary: "#FF00C7",
      gradient: "from-[#0090FF] to-[#FF00C7]",
      bgGradient: "from-[#0090FF]/20 via-[#0090FF]/10 to-transparent",
      accent: "text-[#0090FF]",
    },
    williams: {
      name: "Williams",
      color: "#005AFF",
      secondary: "#FFFFFF",
      gradient: "from-[#005AFF] to-[#64B5FF]",
      bgGradient: "from-[#005AFF]/20 via-[#005AFF]/10 to-transparent",
      accent: "text-[#005AFF]",
    },
    haas: {
      name: "Haas F1 Team",
      color: "#FFFFFF",
      secondary: "#D00000",
      gradient: "from-[#FFFFFF] to-[#D00000]",
      bgGradient: "from-[#D00000]/20 via-[#D00000]/10 to-transparent",
      accent: "text-[#D00000]",
    },
    sauber: {
      name: "Sauber",
      color: "#900000",
      secondary: "#000000",
      gradient: "from-[#900000] to-[#000000]",
      bgGradient: "from-[#900000]/20 via-[#900000]/10 to-transparent",
      accent: "text-[#900000]",
    },
    rb: {
      name: "Racing Bulls",
      color: "#6692FF",
      secondary: "#00293C",
      gradient: "from-[#6692FF] to-[#2B63FF]",
      bgGradient: "from-[#6692FF]/20 via-[#6692FF]/10 to-transparent",
      accent: "text-[#6692FF]",
    },
    default: {
      name: "F1 Team",
      color: "#dc2626",
      secondary: "#ffffff",
      gradient: "from-[#dc2626] to-[#ef4444]",
      bgGradient: "from-[#dc2626]/20 via-[#dc2626]/10 to-transparent",
      accent: "text-primary",
    },
  };

  const getTeamConfig = (teamId) => {
    const teamKey = teamId?.toLowerCase()?.replace(/\s+/g, "") || "default";
    return teamConfig[teamKey] || teamConfig.default;
  };

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await f1Api.getAllDrivers();
        setDrivers(data);
      } catch (err) {
        setError("Failed to load drivers data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDrivers();
  }, []);

  // Function to fetch driver photo only when clicked
  const fetchDriverPhoto = useCallback(async (driverId) => {
    // Don't fetch if already loading or already have photo
    if (loadingPhotos[driverId] || driverPhotos[driverId]) return;
    
    setLoadingPhotos(prev => ({ ...prev, [driverId]: true }));
    
    try {
      // f1Api.getDriverPicture() already handles fallback to placeholder
      const photoUrl = await f1Api.getDriverPicture(driverId);
      setDriverPhotos(prev => ({
        ...prev,
        [driverId]: photoUrl
      }));
    } catch (error) {
      console.error(`Failed to fetch photo for ${driverId}:`, error);
      // f1Api.getDriverPicture() already has fallback, but just in case:
      setDriverPhotos(prev => ({
        ...prev,
        [driverId]: null // Will show placeholder in UI
      }));
    } finally {
      setLoadingPhotos(prev => ({ ...prev, [driverId]: false }));
    }
  }, [driverPhotos, loadingPhotos]);

  const calculateAge = (birthday) => {
  if (!birthday) return "Unknown";
  
  try {
    let birthDate;
    
    // Handle different date formats
    if (birthday.includes('/')) {
      // Format: "01/09/1994"
      const [day, month, year] = birthday.split('/');
      birthDate = new Date(`${year}-${month}-${day}`);
    } else if (birthday.includes('-')) {
      // Format: "01-09-1994" or "1994-09-01"
      if (birthday.split('-')[0].length === 4) {
        // Format: "1994-09-01" (ISO format)
        birthDate = new Date(birthday);
      } else {
        // Format: "01-09-1994" (day-month-year)
        const [day, month, year] = birthday.split('-');
        birthDate = new Date(`${year}-${month}-${day}`);
      }
    } else {
      // Try to parse as-is (ISO format or other)
      birthDate = new Date(birthday);
    }
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      console.warn(`Invalid date format: ${birthday}`);
      return "Unknown";
    }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error(`Error calculating age for ${birthday}:`, error);
    return "Unknown";
  }
};

  const getDriverData = (driver) => ({
    name: driver?.first_name || driver?.name || "Unknown",
    surname: driver?.last_name || driver?.surname || "Driver",
    number: driver?.permanent_number || driver?.number || "--",
    nationality: driver?.country || driver?.nationality || "Unknown",
    code: driver?.code || driver?.shortName || "---",
    team: driver?.team || driver?.teamId || "Unknown",
    birthday: driver?.date_of_birth || driver?.birthday || null,
    id: driver?.driver_id || driver?.driverId || "unknown",
  });

  // Card click handler - fetches photo and shows modal
  const handleCardClick = useCallback((driver, team) => {
    const driverData = getDriverData(driver);
    const driverId = driverData.id;
    
    // Fetch photo only when clicked
    fetchDriverPhoto(driverId);
    
    // Show modal
    setExpandedDriver(driver);
    setExpandedTeam(team);
  }, [fetchDriverPhoto]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const expandedCardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-primary via-red-500 to-primary bg-clip-text text-transparent animate-gradient-x">
              F1 2025 DRIVERS
            </h1>
            <p className="text-gray-400 mt-4">Loading elite racing talent...</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 h-96 border border-gray-700/30 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🏎️💨</div>
          <h2 className="text-2xl font-bold text-white mb-2">Race Halted!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300"
          >
            Retry Connection
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8 relative"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto mb-12 md:mb-16"
      >
        <div className="text-center">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            <span className="bg-linear-to-r from-primary via-red-500 to-primary bg-clip-text text-transparent animate-gradient-x font-oribitron">
              F1 2025 GRID
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg"
          >
            {drivers.length} elite drivers competing for glory
          </motion.p>
        </div>
      </motion.header>

      {/* Drivers Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10"
      >
        {drivers.map((driver, index) => {
          const driverData = getDriverData(driver);
          const team = getTeamConfig(driverData.team);

          return (
            <motion.div
              key={driverData.id || index}
              variants={cardVariants}
              whileHover="hover"
              onClick={() => handleCardClick(driver, team)}
              className="relative cursor-pointer group"
            >
              {/* Permanent Animated Border - Always Visible */}
              <div className="absolute -inset-0.5 rounded-2xl overflow-hidden pointer-events-none z-0">
                <motion.div
                  initial={{ backgroundPosition: "0% 0%" }}
                  animate={{ backgroundPosition: "200% 200%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background: `linear-gradient(45deg, 
                      transparent, 
                      transparent 20%, 
                      ${team.color} 50%, 
                      transparent 80%, 
                      transparent)`,
                    backgroundSize: "200% 200%",
                  }}
                  className="absolute inset-0 opacity-40"
                />
              </div>

              {/* Team Color Glow on Hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${team.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
              />

              {/* Driver Card */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 group-hover:border-gray-700/70 transition-all duration-300 overflow-hidden z-10">
                <div className="relative z-10 flex items-start justify-between mb-6">
                  <div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-baseline gap-2"
                    >
                      <span
                        style={{ color: team.color }}
                        className="text-3xl font-bold"
                      >
                        #{driverData.number}
                      </span>
                      <div className="flex flex-col">
                        <h3 className="text-2xl font-bold text-white">
                          {driverData.name}
                        </h3>
                        <h4
                          style={{ color: team.color }}
                          className="text-3xl font-black tracking-tighter"
                        >
                          {driverData.surname}
                        </h4>
                      </div>
                    </motion.div>
                    <p className="text-gray-400 text-sm mt-1">{team.name}</p>
                  </div>

                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl"
                  >
                    {driverData.nationality === "Great Britain"
                      ? "🇬🇧"
                      : driverData.nationality === "Netherlands"
                      ? "🇳🇱"
                      : driverData.nationality === "Spain"
                      ? "🇪🇸"
                      : driverData.nationality === "Monaco"
                      ? "🇲🇨"
                      : "🏁"}
                  </motion.div>
                </div>

                {/* Driver Stats */}
                <div className="relative z-10 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-gray-400">Nationality</span>
                    <span className="text-white font-medium">
                      {driverData.nationality}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                    <span className="text-gray-400">Age</span>
                    <span className="text-white font-medium">
                      {calculateAge(driverData.birthday)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Code</span>
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      style={{ color: team.color }}
                      className="text-xl font-black"
                    >
                      {driverData.code}
                    </motion.span>
                  </div>
                </div>

                {/* Team Color Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  style={{ backgroundColor: team.color }}
                  className="absolute bottom-0 left-0 h-1"
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Expanded Driver Modal - On Click */}
      <AnimatePresence>
        {expandedDriver && expandedTeam && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setExpandedDriver(null);
                setExpandedTeam(null);
              }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              variants={expandedCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-6xl h-[85vh] max-h-[800px] bg-linear-to-br from-gray-900 to-black rounded-3xl border border-primary/20 overflow-hidden shadow-2xl"
            >
              {/* Animated Border for Modal */}
              <div className="absolute -inset-0.5 rounded-3xl overflow-hidden pointer-events-none">
                <motion.div
                  initial={{ backgroundPosition: "0% 0%" }}
                  animate={{ backgroundPosition: "200% 200%" }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background: `linear-gradient(45deg, 
                      transparent, 
                      transparent 20%, 
                      ${expandedTeam.color} 50%, 
                      transparent 80%, 
                      transparent)`,
                    backgroundSize: "200% 200%",
                  }}
                  className="absolute inset-0 opacity-30"
                />
              </div>

              {/* Team Pattern Background */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, ${expandedTeam.color} 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setExpandedDriver(null);
                  setExpandedTeam(null);
                }}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:text-primary transition-colors"
              >
                ✕
              </motion.button>

              {/* Driver Info Container */}
              <div className="relative z-10 h-full flex flex-col md:flex-row overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {/* Left Side - Driver Photo & Basic Info */}
                <div className="md:w-2/5 p-6 md:p-8 flex flex-col">
                  {/* Photo Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative mb-6 md:mb-8"
                  >
                    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-linear-to-br from-gray-800 to-gray-900">
                      {loadingPhotos[getDriverData(expandedDriver).id] ? (
                        // Loading spinner
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-gray-700 border-t-primary rounded-full mb-4"
                          />
                          <p className="text-gray-400">Loading photo...</p>
                        </div>
                      ) : driverPhotos[getDriverData(expandedDriver).id] ? (
                        // Actual photo
                        <motion.img
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          src={driverPhotos[getDriverData(expandedDriver).id]}
                          alt={`${getDriverData(expandedDriver).name} ${getDriverData(expandedDriver).surname}`}
                          className="w-full h-full object-contain bg-transparent"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.onerror = null;
                            const initials = getDriverData(expandedDriver).id.split('_')
                              .map(word => word.charAt(0).toUpperCase()).join('') 
                              || getDriverData(expandedDriver).id.substring(0, 2).toUpperCase();
                            const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4'];
                            const hash = getDriverData(expandedDriver).id.split('')
                              .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const color = colors[hash % colors.length];
                            e.target.src = `https://via.placeholder.com/500/${color}/FFFFFF?text=${encodeURIComponent(initials)}`;
                          }}
                        />
                      ) : (
                        // Placeholder
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🏎️</div>
                            <p className="text-gray-400">Photo not available</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Team Color Overlay */}
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundColor: expandedTeam.color }}
                      />
                      
                      {/* Driver Number Badge */}
                      <div 
                        style={{ backgroundColor: expandedTeam.color }}
                        className="absolute top-4 left-4 w-16 h-16 rounded-full flex items-center justify-center"
                      >
                        <span className="text-2xl font-bold text-white">
                          #{getDriverData(expandedDriver).number}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Basic Driver Info */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white">
                        {getDriverData(expandedDriver).name}
                      </h2>
                      <h1
                        style={{ color: expandedTeam.color }}
                        className="text-4xl md:text-5xl font-black mb-2"
                      >
                        {getDriverData(expandedDriver).surname}
                      </h1>
                      <div className="flex items-center gap-4">
                        <span
                          style={{
                            backgroundColor: `${expandedTeam.color}20`,
                          }}
                          className="px-4 py-2 rounded-full text-sm font-bold text-white"
                        >
                          {expandedTeam.name}
                        </span>
                        <span className="text-2xl">
                          {getDriverData(expandedDriver).nationality ===
                          "Great Britain"
                            ? "🇬🇧"
                            : getDriverData(expandedDriver).nationality ===
                              "Netherlands"
                            ? "🇳🇱"
                            : getDriverData(expandedDriver).nationality === "Spain"
                            ? "🇪🇸"
                            : getDriverData(expandedDriver).nationality === "Monaco"
                            ? "🇲🇨"
                            : "🏁"}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Driver Code</p>
                          <p 
                            style={{ color: expandedTeam.color }}
                            className="text-2xl font-black"
                          >
                            {getDriverData(expandedDriver).code}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Age</p>
                          <p className="text-white text-xl font-medium">
                            {calculateAge(getDriverData(expandedDriver).birthday)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side - Detailed Stats */}
                <div className="md:w-3/5 p-6 md:p-8 flex flex-col border-t md:border-t-0 md:border-l border-gray-800/50">
                  {/* Team Gradient Display */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className={`h-2 w-full bg-linear-to-r ${expandedTeam.gradient} rounded-full mb-6`}
                  />

                  {/* Additional Stats */}
                  <div className="space-y-4 md:space-y-6">
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-800"
                    >
                      <h3
                        className="text-lg font-bold mb-4"
                        style={{ color: expandedTeam.color }}
                      >
                        PERSONAL INFO
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-gray-400">Nationality</span>
                          <span className="text-white font-medium">
                            {getDriverData(expandedDriver).nationality}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                          <span className="text-gray-400">Date of Birth</span>
                          <span className="text-white font-medium">
                            {getDriverData(expandedDriver).birthday}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-400">Age</span>
                          <span className="text-white font-medium">
                            {calculateAge(getDriverData(expandedDriver).birthday)} years
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-800"
                    >
                      <h3
                        className="text-lg font-bold mb-4"
                        style={{ color: expandedTeam.color }}
                      >
                        TEAM & STATS
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Team</span>
                            <span
                              style={{ backgroundColor: `${expandedTeam.color}20` }}
                              className="px-4 py-2 rounded-full text-sm font-bold text-white"
                            >
                              {expandedTeam.name}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "75%" }}
                              transition={{ delay: 0.8, duration: 1 }}
                              style={{ backgroundColor: expandedTeam.color }}
                              className="h-full"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Experience Level</span>
                            <span className="text-white font-bold">
                              {calculateAge(getDriverData(expandedDriver).birthday) > 30
                                ? "Veteran"
                                : calculateAge(getDriverData(expandedDriver).birthday) > 25
                                ? "Experienced"
                                : "Young Talent"}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(calculateAge(getDriverData(expandedDriver).birthday) * 3, 100)}%`,
                              }}
                              transition={{ delay: 0.9, duration: 1 }}
                              style={{ backgroundColor: expandedTeam.color }}
                              className="h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Team Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1, type: "spring" }}
                      style={{
                        backgroundColor: `${expandedTeam.color}15`,
                        borderColor: `${expandedTeam.color}30`,
                      }}
                      className="flex-1 flex items-center justify-center rounded-2xl border p-4"
                    >
                      <div className="text-center">
                        <div
                          style={{ color: expandedTeam.color }}
                          className="text-2xl md:text-3xl font-black mb-2"
                        >
                          {getDriverData(expandedDriver).surname.toUpperCase()}
                        </div>
                        <div
                          style={{ color: expandedTeam.color }}
                          className="text-lg opacity-75"
                        >
                          {expandedTeam.name.toUpperCase()}
                        </div>
                      </div>
                    </motion.div>

                    {/* Wikipedia Link */}
                    {expandedDriver.url && (
                      <motion.a
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        href={expandedDriver.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: expandedTeam.color }}
                        className="block text-center text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300"
                      >
                        View Wikipedia Profile
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriversComponent;