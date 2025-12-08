'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { f1Api } from '../../../services/f1Api';

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
        const response = await f1Api.getCurrentSeason();
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
              circuitName: "Albert Park Circuit",
              country: "Australia",
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
              circuitName: "Bahrain International Circuit",
              country: "Bahrain",
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
              circuitName: "Jeddah Corniche Circuit",
              country: "Saudi Arabia",
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
              circuitName: "Miami International Autodrome",
              country: "USA",
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
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format time only
  const formatTime = (dateString, timeString) => {
    if (!dateString || !timeString) return 'TBD';
    try {
      const date = new Date(dateString + 'T' + timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-gray-700 border-b-transparent rounded-full animate-spin-reverse"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Loading Season Data</h3>
          <p className="text-gray-400">Preparing race calendar...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !seasonData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Connection Error</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const raceCounts = countRacesByStatus();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{seasonData.championship.championshipName}</h1>
              <p className="text-gray-400 text-sm">Season {seasonData.season} • {raceCounts.total} Races</p>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href={seasonData.championship.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${filterStatus === 'all' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            All ({raceCounts.total})
          </button>
          <button
            onClick={() => setFilterStatus('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${filterStatus === 'upcoming' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Upcoming ({raceCounts.upcoming})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${filterStatus === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Completed ({raceCounts.completed})
          </button>
        </div>

        {/* Races Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredRaces.map((race, index) => {
            const isCompleted = isRaceCompleted(race);
            const raceDate = new Date(race.schedule.race.date + 'T' + race.schedule.race.time);
            const daysToRace = Math.ceil((raceDate - currentDate) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={race.raceId} 
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-red-500/50 transition-colors group"
              >
                {/* Race Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-red-600 rounded-lg">
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{race.country || 'TBD'}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors mb-1">
                        {race.raceName}
                      </h3>
                      <p className="text-gray-400 text-sm">{race.circuitName}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${isCompleted ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                        {isCompleted ? 'Completed' : daysToRace > 0 ? `In ${daysToRace} day${daysToRace !== 1 ? 's' : ''}` : 'Today'}
                      </span>
                    </div>
                  </div>

                  {/* Race Date & Time */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="text-gray-300 font-medium">Race Day</div>
                      <div className="text-lg font-semibold text-white">
                        {formatDate(race.schedule.race.date, race.schedule.race.time)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-300 font-medium">Race Time</div>
                      <div className="text-lg font-semibold text-white">
                        {formatTime(race.schedule.race.date, race.schedule.race.time)}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Details */}
                  <button
                    onClick={() => toggleRaceDetails(race.raceId)}
                    className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors mb-4"
                  >
                    <span className="text-gray-300 font-medium">
                      {expandedRace === race.raceId ? 'Hide schedule' : 'Show schedule'}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-red-500 transition-transform ${expandedRace === race.raceId ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Session Details */}
                  {expandedRace === race.raceId && (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Practice Sessions */}
                        {race.schedule.fp1 && race.schedule.fp1.date && (
                          <SessionCard 
                            type="Practice 1"
                            date={race.schedule.fp1.date}
                            time={race.schedule.fp1.time}
                            isPassed={isSessionPassed(race.schedule.fp1.date, race.schedule.fp1.time)}
                          />
                        )}
                        {race.schedule.fp2 && race.schedule.fp2.date && (
                          <SessionCard 
                            type="Practice 2"
                            date={race.schedule.fp2.date}
                            time={race.schedule.fp2.time}
                            isPassed={isSessionPassed(race.schedule.fp2.date, race.schedule.fp2.time)}
                          />
                        )}
                        {race.schedule.fp3 && race.schedule.fp3.date && (
                          <SessionCard 
                            type="Practice 3"
                            date={race.schedule.fp3.date}
                            time={race.schedule.fp3.time}
                            isPassed={isSessionPassed(race.schedule.fp3.date, race.schedule.fp3.time)}
                          />
                        )}
                        {/* Qualifying */}
                        {race.schedule.qualy && race.schedule.qualy.date && (
                          <SessionCard 
                            type="Qualifying"
                            date={race.schedule.qualy.date}
                            time={race.schedule.qualy.time}
                            isPassed={isSessionPassed(race.schedule.qualy.date, race.schedule.qualy.time)}
                            accent
                          />
                        )}
                        {/* Sprint Sessions */}
                        {race.schedule.sprintQualy && race.schedule.sprintQualy.date && (
                          <SessionCard 
                            type="Sprint Qualifying"
                            date={race.schedule.sprintQualy.date}
                            time={race.schedule.sprintQualy.time}
                            isPassed={isSessionPassed(race.schedule.sprintQualy.date, race.schedule.sprintQualy.time)}
                          />
                        )}
                        {race.schedule.sprintRace && race.schedule.sprintRace.date && (
                          <SessionCard 
                            type="Sprint Race"
                            date={race.schedule.sprintRace.date}
                            time={race.schedule.sprintRace.time}
                            isPassed={isSessionPassed(race.schedule.sprintRace.date, race.schedule.sprintRace.time)}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t border-gray-800">
                    {isCompleted ? (
                      <Link
                        href={`/results/${race.raceId}?round=${race.round}`}
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-center font-medium text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        View Results
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-center font-medium text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Upcoming
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {!isCompleted && (
                  <div className="h-1 bg-gray-800">
                    <div 
                      className="h-full bg-red-600 transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, ((currentDate.getTime() - (raceDate.getTime() - (7 * 24 * 60 * 60 * 1000))) / (7 * 24 * 60 * 60 * 1000)) * 100)}%` 
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredRaces.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No races found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {filterStatus === 'upcoming' 
                ? 'There are no upcoming races scheduled' 
                : filterStatus === 'completed'
                ? 'No completed races in this season yet'
                : 'No races available'}
            </p>
            <button
              onClick={() => setFilterStatus('all')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              View All Races
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-3xl font-bold text-white mb-2">{raceCounts.total}</div>
            <div className="text-gray-400 font-medium">Total Races</div>
            <div className="text-gray-500 text-sm mt-2">Season {seasonData.season}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-3xl font-bold text-green-500 mb-2">{raceCounts.upcoming}</div>
            <div className="text-gray-400 font-medium">Upcoming</div>
            <div className="text-gray-500 text-sm mt-2">Races to go</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-3xl font-bold text-blue-500 mb-2">{raceCounts.completed}</div>
            <div className="text-gray-400 font-medium">Completed</div>
            <div className="text-gray-500 text-sm mt-2">Checkered flag</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            Data provided by <a href="https://f1api.dev" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">F1 API</a>
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
          animation: fadeIn 0.2s ease-out;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Session Card Component
function SessionCard({ type, date, time, isPassed, accent = false }) {
  return (
    <div className={`p-3 rounded-lg ${isPassed ? 'bg-gray-800/30' : 'bg-gray-800/50'} ${accent ? 'border-l-2 border-red-500' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${isPassed ? 'bg-red-500' : 'bg-gray-600'}`} />
        <div className={`text-xs font-medium ${isPassed ? 'text-gray-400' : 'text-gray-300'}`}>{type}</div>
      </div>
      <div className="text-sm font-semibold text-white">
        {new Date(date + 'T' + time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
      <div className="text-xs text-gray-400">
        {new Date(date + 'T' + time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}