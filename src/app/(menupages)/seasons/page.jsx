"use client";
import React, { useState, useEffect } from 'react';
import { f1Api } from '../../../services/f1Api';
import { motion, AnimatePresence } from 'framer-motion';

const F1SeasonInfo = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [driverChampion, setDriverChampion] = useState(null);
  const [constructorChampion, setConstructorChampion] = useState(null);
  const [loading, setLoading] = useState({
    seasons: true,
    champions: false
  });
  const [error, setError] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Fetch seasons on component mount
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setLoading(prev => ({ ...prev, seasons: true }));
        setError(null);
        
        const seasonsData = await f1Api.getSeasons();
        const sortedSeasons = seasonsData.sort((a, b) => b.year - a.year);
        setSeasons(sortedSeasons);
        
        if (sortedSeasons.length > 0) {
          handleSeasonClick(sortedSeasons[0]);
        }
      } catch (err) {
        setError('Failed to load seasons. Please try again later.');
        console.error('Error fetching seasons:', err);
      } finally {
        setLoading(prev => ({ ...prev, seasons: false }));
      }
    };

    fetchSeasons();
  }, []);

  const handleSeasonClick = async (season) => {
    setSelectedSeason(season);
    setLoading(prev => ({ ...prev, champions: true }));
    setError(null);
    setDriverChampion(null);
    setConstructorChampion(null);

    try {
      const [driverData, constructorData] = await Promise.allSettled([
        f1Api.getDriverChampionshipByYear(season.year),
        f1Api.getConstructorChampionshipByYear(season.year)
      ]);

      // Handle driver championship data
      if (driverData.status === 'fulfilled') {
        const drivers = driverData.value?.drivers_championship || [];
        
        if (drivers.length > 0) {
          const champion = drivers.find(d => d.position === 1) || drivers[0];
          const driverInfo = {
            name: champion.driver_name || champion.driver?.name || champion.name || 'Unknown Driver',
            surname : champion.driver_surname || champion.driver?.surname || champion.surname || '',
            team: typeof champion.team === 'object' 
              ? champion.team.teamName || champion.team.name || champion.constructor_name || 'Unknown Team'
              : champion.team || champion.constructor_name || 'Unknown Team',
            points: champion.points || 0,
            wins: champion.wins || 0,
            podiums: champion.podiums || 0,
            position: champion.position || 1,
            nationality: champion.nationality || champion.driver?.nationality || 'Unknown',
            raw: champion
          };
          
          setDriverChampion(driverInfo);
        }
      }

      // Handle constructor championship data
      if (constructorData.status === 'fulfilled') {
        const constructors = constructorData.value?.constructors_championship || [];
        
        if (constructors.length > 0) {
          const champion = constructors.find(c => c.position === 1) || constructors[0];
          const constructorInfo = {
            name: champion.team?.teamName || 
                  champion.teamName || 
                  champion.name || 
                  'Unknown Constructor',
            points: champion.points || 0,
            wins: champion.wins || 0,
            position: champion.position || 1,
            nationality: champion.team?.country || 
                        champion.country || 
                        champion.nationality || 
                        'Unknown',
            raw: champion
          };
          
          setConstructorChampion(constructorInfo);
        }
      }
    } catch (err) {
      setError('Failed to fetch championship data. Please try again.');
      console.error('Error fetching championship data:', err);
    } finally {
      setLoading(prev => ({ ...prev, champions: false }));
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.charAt(0).toUpperCase();
  };

  const safeText = (text) => {
    if (text === null || text === undefined) return 'N/A';
    if (typeof text === 'object') {
      return text.name || 
             text.teamName || 
             text.constructor_name || 
             JSON.stringify(text).substring(0, 30) + '...';
    }
    return text.toString();
  };

  // F1 Checkered flag pattern component - Responsive
  const CheckeredPattern = () => (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] md:opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(45deg, #fff 25%, transparent 25%),
          linear-gradient(-45deg, #fff 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #fff 75%),
          linear-gradient(-45deg, transparent 75%, #fff 75%)
        `,
        backgroundSize: 'clamp(20px, 40px, 60px) clamp(20px, 40px, 60px)',
        backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
      }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <CheckeredPattern />
      
      {/* Animated grid lines - Responsive */}
      <div className="absolute inset-0 hidden sm:block">
        <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-red-500/10 to-transparent"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-linear-to-b from-transparent via-white/5 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-linear-to-b from-transparent via-red-500/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 relative z-10">
        {/* Header - Responsive */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
            <div className="hidden sm:block h-px w-8 sm:w-12 bg-linear-to-r from-transparent to-red-500 mr-2 sm:mr-4"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent px-4">
              FORMULA 1 CHAMPIONS
            </h1>
            <div className="hidden sm:block h-px w-8 sm:w-12 bg-linear-to-l from-transparent to-red-500 ml-2 sm:ml-4"></div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg px-4">Explore championship winners through the seasons</p>
        </motion.div>
        
        {/* Main Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Seasons List - Responsive Glass Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              backdropFilter: 'blur(12px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}
          >
            {/* Racing line accent */}
            <div className="absolute top-0 left-0 w-1 sm:w-2 h-full bg-linear-to-b from-red-500 via-red-600 to-transparent"></div>
            
            <div className="p-4 sm:p-5 md:p-6">
              <motion.h2 
                variants={fadeInUp}
                className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center"
              >
                <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  SEASON SELECTOR
                </span>
                <div className="ml-2 sm:ml-4 h-px flex-1 bg-linear-to-r from-red-500/50 to-transparent"></div>
              </motion.h2>
              
              <AnimatePresence mode="wait">
                {loading.seasons ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col sm:flex-row items-center justify-center py-12 sm:py-16"
                  >
                    <motion.div
                      animate={pulseAnimation}
                      className="relative mb-4 sm:mb-0"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-transparent border-t-red-500 border-r-red-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-transparent border-b-red-300 border-l-red-300 rounded-full animate-spin-reverse"></div>
                    </motion.div>
                    <span className="ml-0 sm:ml-4 text-gray-300 text-sm sm:text-base">Loading seasons grid...</span>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 sm:p-6"
                    style={{
                      background: 'rgba(220, 38, 38, 0.1)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <div className="flex items-start sm:items-center mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-900/50 flex items-center justify-center mr-3 shrink-0">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-red-300 text-sm sm:text-base">{error}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 sm:px-6 sm:py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 text-sm sm:text-base"
                    >
                      Retry
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="seasons"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar"
                  >
                    {seasons.map((season, index) => (
                      <motion.button
                        key={season.championshipId}
                        variants={itemVariants}
                        onClick={() => handleSeasonClick(season)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 relative overflow-hidden ${
                          selectedSeason?.championshipId === season.championshipId
                            ? 'bg-linear-to-r from-red-900/30 via-red-900/20 to-transparent border-l-2 sm:border-l-4 border-red-500 shadow-md sm:shadow-lg'
                            : 'bg-gray-800/20 hover:bg-gray-800/30 border-l-2 sm:border-l-4 border-gray-700'
                        }`}
                        style={{
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        {/* Speed line effect for selected season */}
                        {selectedSeason?.championshipId === season.championshipId && (
                          <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: "100%", opacity: 1 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-16 sm:w-20 h-full bg-linear-to-r from-transparent via-white/5 to-transparent"
                          />
                        )}
                        
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="text-lg sm:text-xl md:text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent"
                              >
                                {safeText(season.year)}
                              </motion.span>
                              <div className="hidden sm:block h-4 sm:h-6 w-px bg-linear-to-b from-transparent via-gray-600 to-transparent"></div>
                              {selectedSeason?.championshipId === season.championshipId && loading.champions && (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-transparent border-t-red-500 border-r-red-500 rounded-full"
                                />
                              )}
                            </div>
                            <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm truncate">
                              {safeText(season.championshipName)}
                            </p>
                          </div>
                          <motion.svg
                            animate={selectedSeason?.championshipId === season.championshipId ? { rotate: 90 } : {}}
                            className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ml-2 ${
                              selectedSeason?.championshipId === season.championshipId 
                                ? 'text-red-500' 
                                : 'text-gray-500'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </motion.svg>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Championship Details - Responsive Glass Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              backdropFilter: 'blur(12px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}
          >
            {/* Racing line accent */}
            <div className="absolute top-0 left-0 w-1 sm:w-2 h-full bg-linear-to-b from-blue-500 via-blue-600 to-transparent"></div>
            
            <div className="p-4 sm:p-5 md:p-6">
              <motion.h2 
                variants={fadeInUp}
                className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center"
              >
                <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CHAMPIONSHIP DETAILS
                </span>
                <div className="ml-2 sm:ml-4 h-px flex-1 bg-linear-to-r from-blue-500/50 to-transparent"></div>
              </motion.h2>

              <AnimatePresence mode="wait">
                {loading.champions ? (
                  <motion.div
                    key="champions-loading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center py-12 sm:py-16"
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="relative mb-4 sm:mb-6"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 border-3 sm:border-4 border-transparent border-t-red-500 border-r-blue-500 rounded-full"></div>
                      <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-3 sm:border-4 border-transparent border-b-red-300 border-l-blue-300 rounded-full"></div>
                    </motion.div>
                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-gray-300 text-sm sm:text-base"
                    >
                      Loading championship data...
                    </motion.p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="champions-error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 sm:p-6"
                    style={{
                      background: 'rgba(220, 38, 38, 0.1)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <p className="text-red-300 text-sm sm:text-base">{error}</p>
                  </motion.div>
                ) : !selectedSeason ? (
                  <motion.div
                    key="no-season"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 sm:py-16"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 text-gray-600"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-400 text-base sm:text-lg"
                    >
                      Select a season to view championship details
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="champions"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Driver Champion - Responsive */}
                    <motion.div
                      variants={cardVariants}
                      className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 group"
                      style={{
                        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Animated background effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-red-900/5 via-transparent to-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-r from-red-600 to-red-700 flex items-center justify-center mr-2 sm:mr-3">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                              DRIVER CHAMPION
                            </h3>
                          </div>
                          {driverChampion?.points && (
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 sm:px-4 sm:py-2 bg-linear-to-r from-red-600 to-red-800 text-white text-xs sm:text-sm font-bold rounded-full border border-red-700 shadow-lg w-fit"
                            >
                              {safeText(driverChampion.points)} PTS
                            </motion.span>
                          )}
                        </div>
                        
                        {driverChampion ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="relative self-center sm:self-auto"
                            >
                              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-linear-to-r from-red-600 to-red-800 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-2xl">
                                {getInitials(driverChampion.name)}
                              </div>
                              <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-transparent border-t-red-400 border-r-red-300 animate-spin"></div>
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <motion.h4
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 text-center sm:text-left"
                              >
                                {safeText(driverChampion.name) + " " + safeText(driverChampion.surname)}
                              </motion.h4>
                              <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                                <motion.p
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.4 }}
                                  className="text-gray-300 text-sm sm:text-base flex items-center justify-center sm:justify-start"
                                >
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mr-2"></span>
                                  Team: <span className="ml-1 sm:ml-2 font-semibold text-white truncate">{safeText(driverChampion.team)}</span>
                                </motion.p>
                                <motion.p
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  className="text-gray-300 text-sm sm:text-base flex items-center justify-center sm:justify-start"
                                >
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2"></span>
                                  Nationality: <span className="ml-1 sm:ml-2 font-semibold text-white">{safeText(driverChampion.nationality)}</span>
                                </motion.p>
                              </div>
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm"
                              >
                                <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                  <span className="text-gray-400">Wins: </span>
                                  <span className="font-bold text-white ml-1">{safeText(driverChampion.wins)}</span>
                                </div>
                                <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                  <span className="text-gray-400">Podiums: </span>
                                  <span className="font-bold text-white ml-1">{safeText(driverChampion.podiums)}</span>
                                </div>
                                <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                  <span className="text-gray-400">Position: </span>
                                  <span className="font-bold text-red-500 ml-1">#{safeText(driverChampion.position)}</span>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                            No driver championship data available
                          </div>
                        )}
                      </motion.div>
                    </motion.div>

                    {/* Constructor Champion - Responsive */}
                    <motion.div
                      variants={cardVariants}
                      className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 group"
                      style={{
                        background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(0, 0, 0, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Animated background effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-blue-900/5 via-transparent to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative z-10"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-r from-blue-600 to-blue-700 flex items-center justify-center mr-2 sm:mr-3">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                              CONSTRUCTOR CHAMPION
                            </h3>
                          </div>
                          {constructorChampion?.points && (
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 sm:px-4 sm:py-2 bg-linear-to-r from-blue-600 to-blue-800 text-white text-xs sm:text-sm font-bold rounded-full border border-blue-700 shadow-lg w-fit"
                            >
                              {safeText(constructorChampion.points)} PTS
                            </motion.span>
                          )}
                        </div>
                        
                        {constructorChampion ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="relative self-center sm:self-auto"
                            >
                              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-linear-to-r from-blue-600 to-blue-800 flex items-center justify-center shadow-2xl">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <div className="absolute inset-0 rounded-full border-3 sm:border-4 border-transparent border-t-blue-400 border-r-blue-300 animate-spin-slow"></div>
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <motion.h4
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 text-center sm:text-left"
                              >
                                {safeText(constructorChampion.name)}
                              </motion.h4>
                              <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                                <motion.p
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  className="text-gray-300 text-sm sm:text-base flex items-center justify-center sm:justify-start"
                                >
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2"></span>
                                  Nationality: <span className="ml-1 sm:ml-2 font-semibold text-white">{safeText(constructorChampion.nationality)}</span>
                                </motion.p>
                              </div>
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm"
                              >
                                <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                  <span className="text-gray-400">Wins: </span>
                                  <span className="font-bold text-white ml-1">{safeText(constructorChampion.wins)}</span>
                                </div>
                                <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                  <span className="text-gray-400">Points: </span>
                                  <span className="font-bold text-white ml-1">{safeText(constructorChampion.points)}</span>
                                </div>
                                <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                  <span className="text-gray-400">Position: </span>
                                  <span className="font-bold text-blue-500 ml-1">#{safeText(constructorChampion.position)}</span>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                            No constructor championship data available
                          </div>
                        )}
                      </motion.div>
                    </motion.div>

                    {/* Season Wikipedia Link - Responsive */}
                    {selectedSeason.url && (
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800"
                      >
                        <motion.a
                          whileHover={{ x: 3 }}
                          href={selectedSeason.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-700 transition-all duration-300 group text-sm sm:text-base"
                          style={{
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          <span className="text-gray-300 group-hover:text-white font-medium truncate">
                            Learn more about {safeText(selectedSeason.year)} season
                          </span>
                          <motion.svg
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 text-red-500 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </motion.svg>
                        </motion.a>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Footer - Responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-500 text-xs sm:text-sm"
        >
          <p>Formula 1 Championship Data • Updated in real-time</p>
          <p className="mt-1 sm:mt-2">Experience the thrill of F1 history</p>
        </motion.div>
      </div>

      {/* Add custom styles for scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #dc2626, #7f1d1d);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ef4444, #991b1b);
        }
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        /* Improve mobile touch targets */
        @media (max-width: 640px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default F1SeasonInfo;