// components/TeamsReducedHover.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Flag, 
  Trophy, 
  Users, 
  ChevronRight,
  Zap,
  Calendar,
  MapPin,
  Target
} from 'lucide-react';

const TeamsReducedHover = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredTeam, setHoveredTeam] = useState(null);

  // Team color schemes with subtle gradients
  const teamColors = {
    mercedes: {
      gradient: 'from-[#00D2BE] to-[#008571]',
      light: 'from-[#00D2BE]/10 to-[#008571]/5',
      border: 'border-[#00D2BE]/20',
      text: 'text-[#00D2BE]',
      accent: 'bg-[#00D2BE]/10',
      hover: 'hover:border-[#00D2BE]/30 hover:bg-[#00D2BE]/5'
    },
    red_bull: {
      gradient: 'from-[#1E5BC6] to-[#0B1965]',
      light: 'from-[#1E5BC6]/10 to-[#0B1965]/5',
      border: 'border-[#1E5BC6]/20',
      text: 'text-[#1E5BC6]',
      accent: 'bg-[#1E5BC6]/10',
      hover: 'hover:border-[#1E5BC6]/30 hover:bg-[#1E5BC6]/5'
    },
    ferrari: {
      gradient: 'from-[#ED1C24] to-[#9B0A0F]',
      light: 'from-[#ED1C24]/10 to-[#9B0A0F]/5',
      border: 'border-[#ED1C24]/20',
      text: 'text-[#ED1C24]',
      accent: 'bg-[#ED1C24]/10',
      hover: 'hover:border-[#ED1C24]/30 hover:bg-[#ED1C24]/5'
    },
    mclaren: {
      gradient: 'from-[#FF8000] to-[#FF3700]',
      light: 'from-[#FF8000]/10 to-[#FF3700]/5',
      border: 'border-[#FF8000]/20',
      text: 'text-[#FF8000]',
      accent: 'bg-[#FF8000]/10',
      hover: 'hover:border-[#FF8000]/30 hover:bg-[#FF8000]/5'
    },
    alpine: {
      gradient: 'from-[#0093CC] to-[#0055A6]',
      light: 'from-[#0093CC]/10 to-[#0055A6]/5',
      border: 'border-[#0093CC]/20',
      text: 'text-[#0093CC]',
      accent: 'bg-[#0093CC]/10',
      hover: 'hover:border-[#0093CC]/30 hover:bg-[#0093CC]/5'
    },
    aston_martin: {
      gradient: 'from-[#006F62] to-[#003A33]',
      light: 'from-[#006F62]/10 to-[#003A33]/5',
      border: 'border-[#006F62]/20',
      text: 'text-[#006F62]',
      accent: 'bg-[#006F62]/10',
      hover: 'hover:border-[#006F62]/30 hover:bg-[#006F62]/5'
    },
    haas: {
      gradient: 'from-[#B6BABD] to-[#6C6D6F]',
      light: 'from-[#B6BABD]/10 to-[#6C6D6F]/5',
      border: 'border-[#B6BABD]/20',
      text: 'text-[#B6BABD]',
      accent: 'bg-[#B6BABD]/10',
      hover: 'hover:border-[#B6BABD]/30 hover:bg-[#B6BABD]/5'
    },
    williams: {
      gradient: 'from-[#37BEDD] to-[#005AFF]',
      light: 'from-[#37BEDD]/10 to-[#005AFF]/5',
      border: 'border-[#37BEDD]/20',
      text: 'text-[#37BEDD]',
      accent: 'bg-[#37BEDD]/10',
      hover: 'hover:border-[#37BEDD]/30 hover:bg-[#37BEDD]/5'
    },
    rb: {
      gradient: 'from-[#6692FF] to-[#0039E6]',
      light: 'from-[#6692FF]/10 to-[#0039E6]/5',
      border: 'border-[#6692FF]/20',
      text: 'text-[#6692FF]',
      accent: 'bg-[#6692FF]/10',
      hover: 'hover:border-[#6692FF]/30 hover:bg-[#6692FF]/5'
    },
    sauber: {
      gradient: 'from-[#52E252] to-[#008000]',
      light: 'from-[#52E252]/10 to-[#008000]/5',
      border: 'border-[#52E252]/20',
      text: 'text-[#52E252]',
      accent: 'bg-[#52E252]/10',
      hover: 'hover:border-[#52E252]/30 hover:bg-[#52E252]/5'
    }
  };

  useEffect(() => {
    const fetchAllTeamsAndDrivers = async () => {
      try {
        setLoading(true);
        
        const teamsResponse = await fetch('https://f1api.dev/api/current/teams');
        const teamsData = await teamsResponse.json();
        const allTeams = teamsData.teams || [];
        
        const sortedTeams = allTeams.sort((a, b) => (a.position || 99) - (b.position || 99));
        
        const teamsWithDrivers = await Promise.all(
          sortedTeams.map(async (team) => {
            try {
              const driversResponse = await fetch(`https://f1api.dev/api/current/teams/${team.teamId}/drivers`);
              const driversData = await driversResponse.json();
              return {
                ...team,
                drivers: driversData.drivers || []
              };
            } catch (error) {
              return { ...team, drivers: [] };
            }
          })
        );
        
        setTeams(teamsWithDrivers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTeamsAndDrivers();
  }, []);

  const formatTeamName = (teamName) => {
    return teamName
      .replace('Formula 1 Team', '')
      .replace('F1 Team', '')
      .trim();
  };

  const getTeamShortName = (teamName) => {
    const shortNames = {
      'McLaren Formula 1 Team': 'MCL',
      'Mercedes Formula 1 Team': 'MER',
      'Red Bull Racing': 'RBR',
      'Scuderia Ferrari': 'FER',
      'Williams Racing': 'WIL',
      'RB F1 Team': 'RB',
      'Aston Martin F1 Team': 'AMR',
      'Haas F1 Team': 'HAS',
      'Sauber F1 Team': 'SAU',
      'Alpine F1 Team': 'ALP'
    };
    return shortNames[teamName] || teamName.split(' ').map(w => w[0]).join('').substring(0, 3);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 15
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -2,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const subtleGlow = {
    boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.05)"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-1 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full animate-pulse"></div>
              <div className="h-10 w-64 bg-gray-900 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-4 w-96 bg-gray-900 rounded animate-pulse"></div>
          </div>
          
          {/* Loading Cards */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-900/30 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              animate={pulseAnimation}
              className="h-10 w-1 bg-gradient-to-b from-red-500/60 to-red-600/40 rounded-full"
            ></motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                2025 F1 CONSTRUCTORS & DRIVERS
              </h1>
              <p className="text-gray-400/80 mt-2">
                All teams with their drivers and current standings
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400/70 flex items-center gap-2">
              <motion.div 
                animate={pulseAnimation}
                className="h-2 w-2 rounded-full bg-red-500/70"
              ></motion.div>
              LIVE STANDINGS
            </div>
            <div className="text-sm px-4 py-2 bg-gray-900/30 rounded-full border border-gray-800/50 text-gray-300/80">
              {teams.length} TEAMS • {teams.reduce((acc, team) => acc + (team.drivers?.length || 0), 0)} DRIVERS
            </div>
          </div>
        </motion.header>

        {/* Teams List */}
        <AnimatePresence>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {teams.map((team, index) => {
              const colors = teamColors[team.teamId] || teamColors.haas;
              const teamDrivers = team.drivers || [];
              
              return (
                <motion.div
                  key={team.teamId}
                  variants={itemVariants}
                  whileHover="hover"
                  custom={index}
                  onMouseEnter={() => setHoveredTeam(team.teamId)}
                  onMouseLeave={() => setHoveredTeam(null)}
                  className={`relative rounded-xl border ${colors.border} bg-gradient-to-br from-gray-900/20 to-black/10 
                    backdrop-blur-sm transition-all duration-300 ${colors.hover}`}
                >
                  {/* Subtle hover background */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredTeam === team.teamId ? 0.03 : 0 }}
                    className={`absolute inset-0 bg-gradient-to-r ${colors.gradient}`}
                  />

                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Left Side - Team Info */}
                      <div className="lg:w-2/5">
                        <div className="flex items-start gap-4">
                          <motion.div 
                            whileHover={{ rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                          >
                            <div className={`w-14 h-14 rounded-lg ${colors.accent} flex items-center justify-center`}>
                              <Car className="w-6 h-6 text-white/90" />
                            </div>
                          </motion.div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h2 className="text-xl font-bold text-white/95">
                                {formatTeamName(team.teamName)}
                              </h2>
                              <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className={`text-xs px-2.5 py-1 rounded-full ${colors.accent} ${colors.text} font-medium`}
                              >
                                <Flag className="w-3 h-3 inline mr-1" />
                                P{team.position || index + 1}
                              </motion.span>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-gray-500/70" />
                                <span className="text-gray-400/70 text-sm">{team.teamNationality}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-gray-500/70" />
                                <span className="text-gray-400/70 text-sm">Since {team.firstAppeareance}</span>
                              </div>
                            </div>
                            
                            {/* Team Stats */}
                            <div className="grid grid-cols-3 gap-3">
                              <motion.div 
                                variants={hoverVariants}
                                whileHover="hover"
                                className="text-center p-2.5 rounded-lg bg-gray-900/20 border border-gray-800/30"
                              >
                                <div className="text-xl font-bold text-white/95">{team.points || '0'}</div>
                                <div className="text-xs text-gray-400/70 mt-0.5">POINTS</div>
                              </motion.div>
                              
                              <motion.div 
                                variants={hoverVariants}
                                whileHover="hover"
                                className="text-center p-2.5 rounded-lg bg-gray-900/20 border border-gray-800/30"
                              >
                                <div className="text-xl font-bold text-white/95">{team.wins || '0'}</div>
                                <div className="text-xs text-gray-400/70 mt-0.5">WINS</div>
                              </motion.div>
                              
                              <motion.div 
                                variants={hoverVariants}
                                whileHover="hover"
                                className="text-center p-2.5 rounded-lg bg-gray-900/20 border border-gray-800/30"
                              >
                                <Trophy className="w-3.5 h-3.5 text-yellow-500/70 mx-auto mb-1" />
                                <div className="text-xl font-bold text-white/95">{team.constructorsChampionships || '0'}</div>
                                <div className="text-xs text-gray-400/70 mt-0.5">WCC</div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Drivers */}
                      <div className="lg:w-3/5">
                        <div className="mb-3">
                          <div className="text-sm text-gray-400/70 mb-3 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            DRIVER LINEUP
                          </div>
                          
                          {teamDrivers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {teamDrivers.map((driverData, driverIndex) => {
                                const driver = driverData.driver;
                                
                                return (
                                  <motion.div
                                    key={driver.driverId}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: driverIndex * 0.1 + 0.2 }}
                                    variants={hoverVariants}
                                    whileHover="hover"
                                    className={`rounded-lg p-3 ${colors.accent} border ${colors.border} bg-gradient-to-br from-gray-900/10 to-black/5`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {/* Driver Avatar */}
                                      <div className="relative">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center">
                                          <motion.div 
                                            whileHover={{ scale: 1.05 }}
                                            className={`w-10 h-10 ${colors.accent} rounded flex items-center justify-center`}
                                          >
                                            <span className="text-white text-base font-bold">
                                              #{driver.number}
                                            </span>
                                          </motion.div>
                                        </div>
                                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${colors.accent} border border-white/50 flex items-center justify-center`}>
                                          <span className="text-xs font-bold text-white/90">
                                            {driver.position || 'N/A'}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {/* Driver Info */}
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <h3 className="font-bold text-white/95 text-base">
                                              {driver.name} <span className="text-gray-300/80">{driver.surname}</span>
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                              <span className="text-xs text-gray-400/70">{driver.nationality}</span>
                                              <motion.span 
                                                whileHover={{ scale: 1.05 }}
                                                className={`text-xs px-1.5 py-0.5 rounded ${colors.accent} ${colors.text}`}
                                              >
                                                {driver.shortName}
                                              </motion.span>
                                            </div>
                                          </div>
                                          
                                          <motion.div 
                                            whileHover={{ scale: 1.05 }}
                                            className="text-right"
                                          >
                                            <div className="text-xl font-bold text-white/95">{driver.points || '0'}</div>
                                            <div className="text-xs text-gray-400/70">PTS</div>
                                          </motion.div>
                                        </div>
                                        
                                        {/* Driver Stats */}
                                        <div className="flex items-center gap-3 mt-2">
                                          <div className="text-xs">
                                            <span className="text-gray-400/70">Wins: </span>
                                            <span className="text-white/95 font-medium">{driver.wins || '0'}</span>
                                          </div>
                                          
                                          <div className="text-xs">
                                            <span className="text-gray-400/70">Age: </span>
                                            <span className="text-white/95 font-medium">
                                              {driver.birthday ? 
                                                new Date().getFullYear() - new Date(driver.birthday).getFullYear() 
                                                : 'N/A'}
                                            </span>
                                          </div>
                                          
                                          <div className="text-xs flex items-center gap-0.5">
                                            <Target className="w-3 h-3 text-gray-400/70" />
                                            <span className="text-white/95 font-medium">#{driver.number}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className={`rounded-lg p-4 text-center ${colors.accent}`}>
                              <div className="text-gray-400/70">No driver data available</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                    className={`px-5 py-2.5 border-t ${colors.border} flex items-center justify-between text-sm bg-gradient-to-r from-black/10 to-transparent`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500/60"></div>
                        <span className="text-gray-400/70">ACTIVE</span>
                      </div>
                      <span className="text-gray-500/50">|</span>
                      <span className="text-gray-400/70">Since {team.firstAppeareance}</span>
                    </div>
                    
                    <motion.a
                      href={team.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 2 }}
                      className={`px-3 py-1 rounded-lg ${colors.accent} ${colors.text} text-xs flex items-center gap-1 transition-colors duration-200`}
                    >
                      PROFILE
                      <ChevronRight className="w-3 h-3" />
                    </motion.a>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 pt-6 border-t border-gray-800/30"
        >
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500/70">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="mb-3 md:mb-0"
            >
              <span className="flex items-center gap-1.5">
                <motion.span 
                  animate={pulseAnimation}
                  className="h-1.5 w-1.5 rounded-full bg-red-500/60"
                ></motion.span>
                DATA FROM F1 API • 2025 SEASON
              </span>
            </motion.div>
            <div className="text-xs">
              <span className="px-3 py-1.5 bg-gray-900/20 rounded-full border border-gray-800/30">
                UPDATED: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default TeamsReducedHover;