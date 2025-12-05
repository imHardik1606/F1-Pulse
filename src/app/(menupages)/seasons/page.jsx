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
    hidden: { y: 20, opacity: 0 },
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
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
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

  // F1 Checkered flag pattern component
  const CheckeredPattern = () => (
    <div className="absolute inset-0 overflow-hidden opacity-5">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(45deg, #fff 25%, transparent 25%),
          linear-gradient(-45deg, #fff 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #fff 75%),
          linear-gradient(-45deg, transparent 75%, #fff 75%)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
      }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <CheckeredPattern />
      
      {/* Animated grid lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto p-4 md:p-6 relative z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500 mr-4"></div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
              FORMULA 1 CHAMPIONS
            </h1>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500 ml-4"></div>
          </div>
          <p className="text-gray-400 text-lg">Explore championship winners through the seasons</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Seasons List */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-4 md:p-6 relative overflow-hidden"
          >
            {/* Racing line accent */}
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-500 via-red-600 to-transparent"></div>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-bold mb-6 flex items-center"
            >
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                SEASON SELECTOR
              </span>
              <div className="ml-4 h-px flex-1 bg-gradient-to-r from-red-500/50 to-transparent"></div>
            </motion.h2>
            
            <AnimatePresence mode="wait">
              {loading.seasons ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-16"
                >
                  <motion.div
                    animate={pulseAnimation}
                    className="relative"
                  >
                    <div className="w-16 h-16 border-4 border-transparent border-t-red-500 border-r-red-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-red-300 border-l-red-300 rounded-full animate-spin-reverse"></div>
                  </motion.div>
                  <span className="ml-4 text-gray-300">Loading seasons grid...</span>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-red-900/20 border border-red-800/50 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-red-300">{error}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300"
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
                  className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  {seasons.map((season, index) => (
                    <motion.button
                      key={season.championshipId}
                      variants={itemVariants}
                      onClick={() => handleSeasonClick(season)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        selectedSeason?.championshipId === season.championshipId
                          ? 'bg-gradient-to-r from-red-900/30 via-red-900/20 to-transparent border-l-4 border-red-500 shadow-lg'
                          : 'bg-gray-800/30 hover:bg-gray-800/50 border-l-4 border-gray-700'
                      }`}
                    >
                      {/* Speed line effect for selected season */}
                      {selectedSeason?.championshipId === season.championshipId && (
                        <motion.div
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: "100%", opacity: 1 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        />
                      )}
                      
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                            >
                              {safeText(season.year)}
                            </motion.span>
                            <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
                            {selectedSeason?.championshipId === season.championshipId && loading.champions && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-transparent border-t-red-500 border-r-red-500 rounded-full"
                              />
                            )}
                          </div>
                          <p className="text-gray-400 mt-2 text-sm">
                            {safeText(season.championshipName)}
                          </p>
                        </div>
                        <motion.svg
                          animate={selectedSeason?.championshipId === season.championshipId ? { rotate: 90 } : {}}
                          className={`w-5 h-5 flex-shrink-0 ${
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
          </motion.div>

          {/* Championship Details */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl p-4 md:p-6 relative overflow-hidden"
          >
            {/* Racing line accent */}
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 via-blue-600 to-transparent"></div>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl font-bold mb-6 flex items-center"
            >
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CHAMPIONSHIP DETAILS
              </span>
              <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </motion.h2>

            <AnimatePresence mode="wait">
              {loading.champions ? (
                <motion.div
                  key="champions-loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center py-16"
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
                    className="relative mb-6"
                  >
                    <div className="w-20 h-20 border-4 border-transparent border-t-red-500 border-r-blue-500 rounded-full"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-red-300 border-l-blue-300 rounded-full"></div>
                  </motion.div>
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-gray-300"
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
                  className="bg-red-900/20 border border-red-800/50 rounded-xl p-6"
                >
                  <p className="text-red-300">{error}</p>
                </motion.div>
              ) : !selectedSeason ? (
                <motion.div
                  key="no-season"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-6 text-gray-600"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-400 text-lg"
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
                  className="space-y-6"
                >
                  {/* Driver Champion */}
                  <motion.div
                    variants={cardVariants}
                    className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 group"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative z-10"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white">
                            DRIVER CHAMPION
                          </h3>
                        </div>
                        {driverChampion?.points && (
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white text-sm font-bold rounded-full border border-red-700 shadow-lg"
                          >
                            {safeText(driverChampion.points)} PTS
                          </motion.span>
                        )}
                      </div>
                      
                      {driverChampion ? (
                        <div className="flex items-center space-x-4 md:space-x-6">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                          >
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-2xl">
                              {getInitials(driverChampion.name)}
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-400 border-r-red-300 animate-spin"></div>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <motion.h4
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
                            >
                              {safeText(driverChampion.name)}
                            </motion.h4>
                            <div className="space-y-2 mb-4">
                              <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-300 flex items-center"
                              >
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                Team: <span className="ml-2 font-semibold text-white">{safeText(driverChampion.team)}</span>
                              </motion.p>
                              <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-300 flex items-center"
                              >
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Nationality: <span className="ml-2 font-semibold text-white">{safeText(driverChampion.nationality)}</span>
                              </motion.p>
                            </div>
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6 }}
                              className="flex flex-wrap gap-4 text-sm"
                            >
                              <div className="px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                <span className="text-gray-400">Wins: </span>
                                <span className="font-bold text-white ml-1">{safeText(driverChampion.wins)}</span>
                              </div>
                              <div className="px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                <span className="text-gray-400">Podiums: </span>
                                <span className="font-bold text-white ml-1">{safeText(driverChampion.podiums)}</span>
                              </div>
                              <div className="px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                <span className="text-gray-400">Position: </span>
                                <span className="font-bold text-red-500 ml-1">#{safeText(driverChampion.position)}</span>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No driver championship data available
                        </div>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Constructor Champion */}
                  <motion.div
                    variants={cardVariants}
                    className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 group"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative z-10"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white">
                            CONSTRUCTOR CHAMPION
                          </h3>
                        </div>
                        {constructorChampion?.points && (
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-bold rounded-full border border-blue-700 shadow-lg"
                          >
                            {safeText(constructorChampion.points)} PTS
                          </motion.span>
                        )}
                      </div>
                      
                      {constructorChampion ? (
                        <div className="flex items-center space-x-4 md:space-x-6">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                          >
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center shadow-2xl">
                              <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-blue-300 animate-spin-slow"></div>
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <motion.h4
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
                            >
                              {safeText(constructorChampion.name)}
                            </motion.h4>
                            <div className="space-y-2 mb-4">
                              <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-300 flex items-center"
                              >
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Nationality: <span className="ml-2 font-semibold text-white">{safeText(constructorChampion.nationality)}</span>
                              </motion.p>
                            </div>
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6 }}
                              className="flex flex-wrap gap-4 text-sm"
                            >
                              <div className="px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                <span className="text-gray-400">Wins: </span>
                                <span className="font-bold text-white ml-1">{safeText(constructorChampion.wins)}</span>
                              </div>
                              <div className="px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                <span className="text-gray-400">Points: </span>
                                <span className="font-bold text-white ml-1">{safeText(constructorChampion.points)}</span>
                              </div>
                              <div className="px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700">
                                <span className="text-gray-400">Position: </span>
                                <span className="font-bold text-blue-500 ml-1">#{safeText(constructorChampion.position)}</span>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No constructor championship data available
                        </div>
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Season Wikipedia Link */}
                  {selectedSeason.url && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6 pt-6 border-t border-gray-800"
                    >
                      <motion.a
                        whileHover={{ x: 5 }}
                        href={selectedSeason.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700 transition-all duration-300 group"
                      >
                        <span className="text-gray-300 group-hover:text-white font-medium">
                          Learn more about {safeText(selectedSeason.year)} season on Wikipedia
                        </span>
                        <motion.svg
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-5 h-5 ml-3 text-red-500"
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
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm"
        >
          <p>Formula 1 Championship Data • Updated in real-time</p>
          <p className="mt-2">Experience the thrill of F1 history</p>
        </motion.div>
      </div>

      {/* Add custom styles for scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #dc2626, #7f1d1d);
          border-radius: 10px;
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
      `}</style>
    </div>
  );
};

export default F1SeasonInfo;