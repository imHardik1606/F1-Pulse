'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { f1Api } from '../../../services/f1Api'

export default function F1SeasonRaces() {
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRace, setExpandedRace] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch season data
  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        setLoading(true);
        const response = await f1Api.getCurrentSeason()
        setSeasonData(response);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching season data:', err);
        
        // Fallback data in case API fails
        const fallbackData = {
          api: "https://f1api.dev",
          url: "https://f1api.dev/api/current",
          limit: 30,
          offset: 0,
          total: 24,
          season: 2025,
          championship: {
            championshipId: "f1_2025",
            championshipName: "2025 Formula 1 World Championship",
            url: "https://en.wikipedia.org/wiki/2025_Formula_One_World_Championship",
            year: 2025
          },
          races: [
            {
              raceId: "australian_2025",
              championshipId: "f1_2025",
              raceName: "Louis Vuitton Australian Grand Prix 2025",
              schedule: {
                race: {
                  date: "2025-03-16",
                  time: "04:00:00Z"
                },
                qualy: {
                  date: "2025-03-15",
                  time: "05:00:00Z"
                },
                fp1: {
                  date: "2025-03-14",
                  time: "01:30:00Z"
                },
                fp2: {
                  date: "2025-03-14",
                  time: "05:00:00Z"
                },
                fp3: {
                  date: "2025-03-15",
                  time: "01:30:00Z"
                },
                sprintQualy: {
                  date: null,
                  time: null
                },
                sprintRace: {
                  date: null,
                  time: null
                }
              }
            },
            {
              raceId: "bahrain_2025",
              championshipId: "f1_2025",
              raceName: "Gulf Air Bahrain Grand Prix 2025",
              schedule: {
                race: {
                  date: "2025-03-02",
                  time: "15:00:00Z"
                },
                qualy: {
                  date: "2025-03-01",
                  time: "15:00:00Z"
                },
                fp1: {
                  date: "2025-02-28",
                  time: "11:30:00Z"
                },
                fp2: {
                  date: "2025-02-28",
                  time: "15:00:00Z"
                },
                fp3: {
                  date: "2025-03-01",
                  time: "12:00:00Z"
                },
                sprintQualy: {
                  date: "2025-02-29",
                  time: "11:30:00Z"
                },
                sprintRace: {
                  date: "2025-02-29",
                  time: "16:00:00Z"
                }
              }
            },
            {
              raceId: "saudi_2025",
              championshipId: "f1_2025",
              raceName: "STC Saudi Arabian Grand Prix 2025",
              schedule: {
                race: {
                  date: "2025-03-09",
                  time: "17:00:00Z"
                },
                qualy: {
                  date: "2025-03-08",
                  time: "17:00:00Z"
                },
                fp1: {
                  date: "2025-03-07",
                  time: "13:30:00Z"
                },
                fp2: {
                  date: "2025-03-07",
                  time: "17:00:00Z"
                },
                fp3: {
                  date: "2025-03-08",
                  time: "13:30:00Z"
                },
                sprintQualy: {
                  date: null,
                  time: null
                },
                sprintRace: {
                  date: null,
                  time: null
                }
              }
            },
            {
              raceId: "miami_2025",
              championshipId: "f1_2025",
              raceName: "Crypto.com Miami Grand Prix 2025",
              schedule: {
                race: {
                  date: "2025-05-04",
                  time: "20:30:00Z"
                },
                qualy: {
                  date: "2025-05-03",
                  time: "21:00:00Z"
                },
                fp1: {
                  date: "2025-05-02",
                  time: "18:30:00Z"
                },
                fp2: {
                  date: "2025-05-02",
                  time: "22:00:00Z"
                },
                fp3: {
                  date: "2025-05-03",
                  time: "17:30:00Z"
                },
                sprintQualy: {
                  date: "2025-05-03",
                  time: "16:30:00Z"
                },
                sprintRace: {
                  date: "2025-05-03",
                  time: "22:00:00Z"
                }
              }
            }
          ]
        };
        setSeasonData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, []);

  // Get current date for comparison
  const currentDate = new Date();

  // Format date to be more readable
  const formatDate = (dateString, timeString) => {
    if (!dateString || !timeString) return 'TBD';
    try {
      const date = new Date(dateString + 'T' + timeString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Check if a session has passed
  const isSessionPassed = (dateString, timeString) => {
    if (!dateString || !timeString) return false;
    try {
      const sessionDate = new Date(dateString + 'T' + timeString);
      return sessionDate < currentDate;
    } catch {
      return false;
    }
  };

  // Check if race is completed
  const isRaceCompleted = (race) => {
    try {
      const raceDate = new Date(race.schedule.race.date + 'T' + race.schedule.race.time);
      return raceDate < currentDate;
    } catch {
      return false;
    }
  };

  // Filter races based on status
  const filteredRaces = seasonData?.races ? seasonData.races.filter(race => {
    if (filterStatus === 'all') return true;
    
    const completed = isRaceCompleted(race);
    if (filterStatus === 'completed') return completed;
    if (filterStatus === 'upcoming') return !completed;
    
    return true;
  }) : [];

  // Count races by status
  const countRacesByStatus = () => {
    if (!seasonData?.races) return { total: 0, completed: 0, upcoming: 0 };
    
    const completed = seasonData.races.filter(isRaceCompleted).length;
    const upcoming = seasonData.races.length - completed;
    
    return {
      total: seasonData.races.length,
      completed,
      upcoming
    };
  };

  const toggleRaceDetails = (raceId) => {
    setExpandedRace(expandedRace === raceId ? null : raceId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-500 border-b-transparent rounded-full animate-spin-reverse"></div>
            </div>
          </div>
          <p className="mt-6 text-xl text-gray-300 font-medium">Loading F1 Season Data...</p>
          <p className="text-gray-500 mt-2">Revving up the engines</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !seasonData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-gray-500 mb-6">Using cached data for demonstration</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const raceCounts = countRacesByStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-6">
      {/* Championship Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 p-6 bg-gradient-to-r from-red-600/20 via-red-700/10 to-red-800/5 rounded-2xl border border-red-500/30 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cpath d='M20,50 Q50,10 80,50' stroke='%23ffffff' stroke-width='1' fill='none'/%3E%3Cpath d='M20,50 L80,50' stroke='%23ffffff' stroke-width='0.5' stroke-dasharray='5,5'/%3E%3C/svg%3E")`,
              backgroundSize: '200px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              {seasonData.championship.championshipName}
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-gray-300 text-lg">Season {seasonData.season}</p>
              <div className="flex items-center space-x-3">
                <span className="px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-full text-sm font-semibold backdrop-blur-sm">
                  {raceCounts.total} RACES
                </span>
                <a 
                  href={seasonData.championship.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Wiki
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${filterStatus === 'all' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            All Races ({raceCounts.total})
          </button>
          <button
            onClick={() => setFilterStatus('upcoming')}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${filterStatus === 'upcoming' ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Upcoming ({raceCounts.upcoming})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${filterStatus === 'completed' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed ({raceCounts.completed})
          </button>
        </div>

        {/* Races Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRaces.map((race, index) => {
            const isCompleted = isRaceCompleted(race);
            
            return (
              <div 
                key={race.raceId} 
                className={`relative group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${isCompleted ? 'border-blue-500/30 hover:border-blue-400/50' : 'border-red-500/30 hover:border-red-400/50'} border backdrop-blur-sm bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90`}
              >
                {/* Circuit pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,0,0,0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 70% 70%, rgba(0,100,255,0.1) 0%, transparent 50%)`
                  }}></div>
                </div>

                {/* Race Number Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-red-900 border border-red-500 shadow-lg">
                    <span className="font-bold text-lg">{index + 1}</span>
                  </div>
                </div>

                {/* Main Race Info */}
                <div className="p-6 relative z-10">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                      {race.raceName}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-lg font-semibold">
                        {formatDate(race.schedule.race.date, race.schedule.race.time)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-5">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${isCompleted ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${isCompleted ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`}></span>
                      {isCompleted ? 'Race Completed' : 'Upcoming Race'}
                    </span>
                  </div>

                  {/* Toggle Details Button */}
                  <button
                    onClick={() => toggleRaceDetails(race.raceId)}
                    className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/60 hover:to-gray-800/60 rounded-xl border border-gray-700 flex items-center justify-between transition-all group/button"
                  >
                    <span className="text-gray-300 font-medium group-hover/button:text-white transition-colors">
                      {expandedRace === race.raceId ? 'Hide Session Details' : 'Show Session Details'}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-red-500 transition-transform duration-300 ${expandedRace === race.raceId ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Details */}
                  {expandedRace === race.raceId && (
                    <div className="animate-fadeIn space-y-4">
                      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                        <h4 className="font-bold text-gray-300 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Session Schedule
                        </h4>
                        <div className="space-y-3">
                          {/* Practice Sessions */}
                          {race.schedule.fp1 && race.schedule.fp1.date && race.schedule.fp1.time && (
                            <div className={`flex items-center justify-between p-2 rounded-lg ${isSessionPassed(race.schedule.fp1.date, race.schedule.fp1.time) ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${isSessionPassed(race.schedule.fp1.date, race.schedule.fp1.time) ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                                <span className="text-gray-300 font-medium">Practice 1</span>
                              </div>
                              <span className="text-gray-400 text-sm">
                                {formatDate(race.schedule.fp1.date, race.schedule.fp1.time)}
                              </span>
                            </div>
                          )}

                          {race.schedule.fp2 && race.schedule.fp2.date && race.schedule.fp2.time && (
                            <div className={`flex items-center justify-between p-2 rounded-lg ${isSessionPassed(race.schedule.fp2.date, race.schedule.fp2.time) ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${isSessionPassed(race.schedule.fp2.date, race.schedule.fp2.time) ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                                <span className="text-gray-300 font-medium">Practice 2</span>
                              </div>
                              <span className="text-gray-400 text-sm">
                                {formatDate(race.schedule.fp2.date, race.schedule.fp2.time)}
                              </span>
                            </div>
                          )}

                          {race.schedule.fp3 && race.schedule.fp3.date && race.schedule.fp3.time && (
                            <div className={`flex items-center justify-between p-2 rounded-lg ${isSessionPassed(race.schedule.fp3.date, race.schedule.fp3.time) ? 'bg-gray-800/30' : 'bg-gray-900/30'}`}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${isSessionPassed(race.schedule.fp3.date, race.schedule.fp3.time) ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                                <span className="text-gray-300 font-medium">Practice 3</span>
                              </div>
                              <span className="text-gray-400 text-sm">
                                {formatDate(race.schedule.fp3.date, race.schedule.fp3.time)}
                              </span>
                            </div>
                          )}

                          {/* Qualifying */}
                          {race.schedule.qualy && race.schedule.qualy.date && race.schedule.qualy.time && (
                            <div className={`flex items-center justify-between p-2 rounded-lg ${isSessionPassed(race.schedule.qualy.date, race.schedule.qualy.time) ? 'bg-purple-900/20' : 'bg-gray-900/30'}`}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${isSessionPassed(race.schedule.qualy.date, race.schedule.qualy.time) ? 'bg-purple-500' : 'bg-gray-500'}`}></div>
                                <span className="text-gray-300 font-medium">Qualifying</span>
                              </div>
                              <span className="text-gray-400 text-sm">
                                {formatDate(race.schedule.qualy.date, race.schedule.qualy.time)}
                              </span>
                            </div>
                          )}

                          {/* Sprint Sessions (only if they exist) */}
                          {race.schedule.sprintQualy && race.schedule.sprintQualy.date && race.schedule.sprintQualy.time && (
                            <div className={`flex items-center justify-between p-2 rounded-lg ${isSessionPassed(race.schedule.sprintQualy.date, race.schedule.sprintQualy.time) ? 'bg-orange-900/20' : 'bg-gray-900/30'}`}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${isSessionPassed(race.schedule.sprintQualy.date, race.schedule.sprintQualy.time) ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                                <span className="text-gray-300 font-medium">Sprint Qualifying</span>
                              </div>
                              <span className="text-gray-400 text-sm">
                                {formatDate(race.schedule.sprintQualy.date, race.schedule.sprintQualy.time)}
                              </span>
                            </div>
                          )}

                          {race.schedule.sprintRace && race.schedule.sprintRace.date && race.schedule.sprintRace.time && (
                            <div className={`flex items-center justify-between p-2 rounded-lg ${isSessionPassed(race.schedule.sprintRace.date, race.schedule.sprintRace.time) ? 'bg-orange-900/20' : 'bg-gray-900/30'}`}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${isSessionPassed(race.schedule.sprintRace.date, race.schedule.sprintRace.time) ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                                <span className="text-gray-300 font-medium">Sprint Race</span>
                              </div>
                              <span className="text-gray-400 text-sm">
                                {formatDate(race.schedule.sprintRace.date, race.schedule.sprintRace.time)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-800">
                    {isCompleted ? (
                      <Link
                        href={`/results/${race.raceId}`}
                        className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl text-center font-bold text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        View Race Results
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl text-center font-bold text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Upcoming Race
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom gradient accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${isCompleted ? 'bg-gradient-to-r from-blue-500 to-blue-700' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}></div>
              </div>
            );
          })}
        </div>

        {/* No Results Message */}
        {filteredRaces.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No races found</h3>
              <p className="text-gray-500 mb-6">
                {filterStatus === 'upcoming' 
                  ? 'There are no upcoming races scheduled.' 
                  : filterStatus === 'completed'
                  ? 'No completed races in this season yet.'
                  : 'No races available.'}
              </p>
              <button
                onClick={() => setFilterStatus('all')}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full font-medium transition-all shadow-lg hover:shadow-red-500/30"
              >
                View All Races
              </button>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-red-500/30 transition-colors group">
              <div className="text-4xl font-bold text-red-500 mb-2 group-hover:scale-110 transition-transform">{raceCounts.total}</div>
              <div className="text-gray-400 font-medium">Total Races</div>
              <div className="text-gray-500 text-sm mt-2">Season {seasonData.season}</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-green-500/30 transition-colors group">
              <div className="text-4xl font-bold text-green-500 mb-2 group-hover:scale-110 transition-transform">{raceCounts.upcoming}</div>
              <div className="text-gray-400 font-medium">Upcoming Races</div>
              <div className="text-gray-500 text-sm mt-2">Awaiting green light</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-colors group">
              <div className="text-4xl font-bold text-blue-500 mb-2 group-hover:scale-110 transition-transform">{raceCounts.completed}</div>
              <div className="text-gray-400 font-medium">Completed Races</div>
              <div className="text-gray-500 text-sm mt-2">Checkered flag waved</div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            Data provided by <a href="https://f1api.dev" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">F1 API</a> • 
            Season {seasonData.season} • 
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}