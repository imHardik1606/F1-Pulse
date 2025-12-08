'use client';

import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Skeleton loader component for dark mode
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="h-10 bg-gray-800 rounded-lg animate-pulse w-1/3"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-800 rounded-lg animate-pulse"></div>
      ))}
    </div>
  </div>
);

// Helper function to format time
const formatTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return 'TBD';
  
  const date = new Date(`${dateStr}T${timeStr}`);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
};

// Helper function to get flag emoji
const getFlagEmoji = (country) => {
  const countryFlags = {
    'Australia': '🇦🇺',
    'Austria': '🇦🇹',
    'Azerbaijan': '🇦🇿',
    'Bahrain': '🇧🇭',
    'Belgium': '🇧🇪',
    'Brazil': '🇧🇷',
    'Canada': '🇨🇦',
    'China': '🇨🇳',
    'Great Britain': '🇬🇧',
    'Hungary': '🇭🇺',
    'Italy': '🇮🇹',
    'Japan': '🇯🇵',
    'Mexico': '🇲🇽',
    'Monaco': '🇲🇨',
    'Netherlands': '🇳🇱',
    'Qatar': '🇶🇦',
    'Saudi Arabia': '🇸🇦',
    'Singapore': '🇸🇬',
    'Spain': '🇪🇸',
    'United Arab Emirates': '🇦🇪',
    'United States': '🇺🇸',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Switzerland': '🇨🇭',
    'Denmark': '🇩🇰',
    'Finland': '🇫🇮',
    'Poland': '🇵🇱',
    'Russia': '🇷🇺',
    'Thailand': '🇹🇭',
    'Argentina': '🇦🇷',
    'South Africa': '🇿🇦',
    'New Zealander': '🇳🇿',
    'Sweden': '🇸🇪'
  };
  
  return countryFlags[country] || '🏁';
};

// Helper function to format date
const formatDate = (dateStr) => {
  if (!dateStr) return 'TBD';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function RaceResults() {
  const { race_id } = useParams();
  const searchParams = useSearchParams();
  const round = searchParams.get("round");
  
  const [raceData, setRaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRaceData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://f1api.dev/api/current`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch race data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Find the specific race by race_id or round
        const race = data.races.find(race => 
          race.raceId === race_id || 
          (round && race.round === parseInt(round))
        );
        
        if (!race) {
          throw new Error(`Race not found: ${race_id || round}`);
        }
        
        setRaceData(race);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching race data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRaceData();
  }, [race_id, round]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-12 bg-gray-800 rounded-lg animate-pulse w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-800 rounded-lg animate-pulse w-1/6"></div>
          </div>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-8 text-center backdrop-blur-sm">
            <div className="text-6xl mb-4">🏎️💨</div>
            <h2 className="text-2xl font-bold text-red-400 mb-3">Error Loading Race Data</h2>
            <p className="text-red-300 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Race Header */}
        <motion.header 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-sm font-bold">
                  Round {raceData.round}
                </span>
                {raceData.winner && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full text-sm font-bold">
                    Completed
                  </span>
                )}
                {!raceData.winner && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-sm font-bold">
                    Upcoming
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">
                {raceData.raceName}
              </h1>
              <div className="flex items-center gap-3 text-gray-300">
                <span className="text-xl">{getFlagEmoji(raceData.circuit.country)}</span>
                <span className="text-lg">{raceData.circuit.circuitName}</span>
              </div>
            </div>
            
            {raceData.winner && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-yellow-900/20 to-amber-900/10 border border-yellow-800/30 rounded-2xl p-6 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-yellow-300 mb-3">Race Winner</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <div className="text-2xl font-bold">
                      {raceData.winner.name} {raceData.winner.surname}
                    </div>
                    <div className="text-gray-300 flex items-center gap-2">
                      <span>{getFlagEmoji(raceData.winner.country)}</span>
                      <span>{raceData.teamWinner.teamName}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Race Info */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Circuit Card */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-red-500">📍</span>
                Circuit Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Circuit Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">Length</span>
                        <span className="font-mono font-bold">{raceData.circuit.circuitLength}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">Laps</span>
                        <span className="font-bold">{raceData.laps}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">Corners</span>
                        <span className="font-bold">{raceData.circuit.corners}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">First F1 Race</span>
                        <span className="font-bold">{raceData.circuit.firstParticipationYear}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">Country</span>
                        <span className="flex items-center gap-2">
                          {getFlagEmoji(raceData.circuit.country)}
                          <span>{raceData.circuit.country}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                        <span className="text-gray-400">City</span>
                        <span>{raceData.circuit.city}</span>
                      </div>
                      {raceData.circuit.lapRecord && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                          <span className="text-gray-400">Lap Record</span>
                          <span className="font-mono font-bold text-cyan-400">{raceData.circuit.lapRecord}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {raceData.circuit.url && (
                <a 
                  href={raceData.circuit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 active:scale-95"
                >
                  <span>More Circuit Info</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            {/* Schedule Card */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-yellow-500">📅</span>
                Race Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(raceData.schedule).map(([session, details]) => {
                  if (!details.date || !details.time) return null;
                  
                  return (
                    <motion.div 
                      key={session}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border ${
                        session === 'race' 
                          ? 'bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-800/30' 
                          : 'bg-gray-900/30 border-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg capitalize">
                          {session === 'qualy' ? 'Qualifying' :
                           session === 'fp1' ? 'Free Practice 1' :
                           session === 'fp2' ? 'Free Practice 2' :
                           session === 'fp3' ? 'Free Practice 3' :
                           session === 'sprintQualy' ? 'Sprint Qualifying' :
                           session === 'sprintRace' ? 'Sprint Race' :
                           session}
                        </h3>
                        {session === 'race' && <span className="text-2xl">🏁</span>}
                        {session === 'qualy' && <span className="text-2xl">⏱️</span>}
                        {session.includes('fp') && <span className="text-2xl">🔧</span>}
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-300">
                          {formatDate(details.date)}
                        </div>
                        <div className="font-mono text-cyan-400">
                          {formatTime(details.date, details.time)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fastest Lap */}
              {raceData.fast_lap.fast_lap && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-900/20 to-violet-900/10 border border-purple-800/30 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-purple-400">⚡</span>
                    Fastest Lap
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Time</span>
                      <span className="text-2xl font-mono font-bold text-purple-400">
                        {raceData.fast_lap.fast_lap}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Driver</span>
                      <span className="font-bold">{raceData.fast_lap.fast_lap_driver_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Team</span>
                      <span className="font-bold">{raceData.fast_lap.fast_lap_team_id}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Circuit Record */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-cyan-800/30 rounded-2xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-cyan-400">🏆</span>
                  Circuit Record
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Time</span>
                    <span className="text-xl font-mono font-bold text-cyan-400">
                      {raceData.circuit.lapRecord || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Driver</span>
                    <span className="font-bold">{raceData.circuit.fastestLapDriverId || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Year</span>
                    <span className="font-bold">{raceData.circuit.fastestLapYear || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Winner Info & Stats */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Winner Card */}
            {raceData.winner ? (
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-yellow-500">🥇</span>
                  Race Winner
                </h2>
                
                <div className="space-y-6">
                  {/* Driver Info */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-900/20 to-amber-900/10 rounded-xl">
                    <div className="text-5xl">👤</div>
                    <div>
                      <div className="text-2xl font-bold">
                        {raceData.winner.name} {raceData.winner.surname}
                      </div>
                      <div className="text-gray-300 flex items-center gap-2">
                        {getFlagEmoji(raceData.winner.country)}
                        <span>#{raceData.winner.number} • {raceData.winner.shortName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-xl">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <span className="text-red-500">🏎️</span>
                      Winning Team
                    </h3>
                    <div className="space-y-2">
                      <div className="text-xl font-bold">{raceData.teamWinner.teamName}</div>
                      <div className="text-gray-300 flex items-center gap-2">
                        {getFlagEmoji(raceData.teamWinner.country)}
                        <span>Since {raceData.teamWinner.firstAppearance}</span>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-400">{raceData.teamWinner.constructorsChampionships}</div>
                          <div className="text-sm text-gray-400">Constructors Titles</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-400">{raceData.teamWinner.driversChampionships}</div>
                          <div className="text-sm text-gray-400">Drivers Titles</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                      <div className="text-gray-400 text-sm">Birthday</div>
                      <div className="font-bold">
                        {raceData.winner.birthday.includes('-') 
                          ? new Date(raceData.winner.birthday).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : raceData.winner.birthday
                        }
                      </div>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                      <div className="text-gray-400 text-sm">Country</div>
                      <div className="font-bold flex items-center justify-center gap-2">
                        {getFlagEmoji(raceData.winner.country)}
                        <span>{raceData.winner.country}</span>
                      </div>
                    </div>
                  </div>

                  {raceData.winner.url && (
                    <a 
                      href={raceData.winner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-center rounded-lg hover:from-yellow-700 hover:to-amber-700 transition-all transform hover:scale-105 active:scale-95"
                    >
                      Driver Biography
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-bold text-gray-200 mb-2">Race Not Started</h3>
                <p className="text-gray-400">Winner information will be available after the race.</p>
                <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                  <div className="text-gray-300">Scheduled for</div>
                  <div className="text-xl font-bold text-cyan-400">
                    {formatDate(raceData.schedule.race.date)}
                  </div>
                  <div className="text-gray-400">
                    {formatTime(raceData.schedule.race.date, raceData.schedule.race.time)}
                  </div>
                </div>
              </div>
            )}

            {/* Race Statistics */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-green-500">📊</span>
                Race Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Total Laps</span>
                  <span className="font-bold text-xl">{raceData.laps}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Circuit Length</span>
                  <span className="font-bold text-lg">{raceData.circuit.circuitLength}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">First F1 Race</span>
                  <span className="font-bold">{raceData.circuit.firstParticipationYear}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-400">Corners</span>
                  <span className="font-bold text-lg">{raceData.circuit.corners}</span>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-blue-500">🔗</span>
                More Information
              </h2>
              <div className="space-y-3">
                {raceData.url && (
                  <a 
                    href={raceData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-900/20 hover:bg-blue-800/30 border border-blue-800/30 rounded-lg transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📖</span>
                      <span>Wikipedia Article</span>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                )}
                {raceData.circuit.url && (
                  <a 
                    href={raceData.circuit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏁</span>
                      <span>Circuit Details</span>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                )}
                {raceData.winner?.url && (
                  <a 
                    href={raceData.winner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-amber-900/20 hover:bg-amber-800/30 border border-amber-800/30 rounded-lg transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👤</span>
                      <span>Driver Biography</span>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-gray-800/50"
        >
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700/50 rounded-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <span>←</span>
            <span>Back to Races</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}