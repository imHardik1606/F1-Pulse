'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CircuitCard = ({ circuit, index, isSelected, onSelect }) => {
  const formatCircuitLength = (length) => {
    if (!length) return 'N/A';
    return `${(length / 1000).toFixed(3)} km`;
  };

  const formatDriverName = (driverId) => {
    if (!driverId) return 'N/A';
    return driverId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700/50 hover:border-gray-600/50'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700/50">
            <span className="text-sm font-bold text-gray-300">#{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate mb-1">
              {circuit.circuitName}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-300">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm truncate">{circuit.city}, {circuit.country}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-gray-400">Length:</span>
            <span className="text-white font-medium">{formatCircuitLength(circuit.circuitLength)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="text-gray-400">Corners:</span>
            <span className="text-white font-medium">{circuit.numberOfCorners || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-400">First:</span>
            <span className="text-white font-medium">{circuit.firstParticipationYear || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400">Record:</span>
            <span className="text-white font-medium truncate">{circuit.lapRecord || 'N/A'}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Click for details →</span>
            <motion.div
              animate={{ scale: isSelected ? 1.1 : 1 }}
              className="text-blue-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CompactDetailPanel = ({ circuit, onClose }) => {
  const teamColors = {
    mercedes: 'bg-[#00D2BE] text-gray-900',
    red_bull: 'bg-[#0600EF] text-white',
    ferrari: 'bg-[#DC0000] text-white',
    mclaren: 'bg-[#FF8700] text-gray-900',
    alpine: 'bg-[#0090FF] text-white',
    alpha_tauri: 'bg-[#2B4562] text-white',
    aston_martin: 'bg-[#006F62] text-white',
    alfa_romeo: 'bg-[#900000] text-white',
    haas: 'bg-[#FFFFFF] text-gray-900',
    williams: 'bg-[#005AFF] text-white',
  };

  const formatCircuitLength = (length) => {
    if (!length) return 'N/A';
    return `${(length / 1000).toFixed(3)} km`;
  };

  const formatDriverName = (driverId) => {
    if (!driverId) return 'N/A';
    return driverId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTeamColorClass = (teamId) => {
    if (!teamId) return 'bg-gray-700 text-white';
    return teamColors[teamId] || 'bg-gray-700 text-white';
  };

  if (!circuit) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white line-clamp-2 mb-1">
              {circuit.circuitName}
            </h2>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{circuit.city}, {circuit.country}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0 ml-2"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Circuit Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-900/50 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-1">Length</p>
            <p className="text-sm font-semibold text-white">
              {formatCircuitLength(circuit.circuitLength)}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-1">Corners</p>
            <p className="text-sm font-semibold text-white">
              {circuit.numberOfCorners || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-1">First Race</p>
            <p className="text-sm font-semibold text-white">
              {circuit.firstParticipationYear || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-1">Lap Record</p>
            <p className="text-sm font-semibold text-yellow-400">
              {circuit.lapRecord || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Fastest Lap Section */}
        {circuit.fastestLapDriverId && (
          <div className="mb-6">
            <h4 className="text-base font-bold text-white mb-3">Fastest Lap</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Driver</p>
                <div className="flex items-center gap-2 p-2 bg-gray-900/30 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white truncate">
                    {formatDriverName(circuit.fastestLapDriverId)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 mb-1">Team</p>
                <div className="flex items-center gap-2 p-2 bg-gray-900/30 rounded-lg">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${getTeamColorClass(circuit.fastestLapTeamId)}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white truncate">
                    {circuit.fastestLapTeamId ? formatDriverName(circuit.fastestLapTeamId) : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 mb-1">Year</p>
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-yellow-900/30 to-yellow-400/20 rounded-full flex-shrink-0">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-yellow-400">
                    {circuit.fastestLapYear}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Circuit Info</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-800/50">
                <span className="text-xs text-gray-400">Circuit ID</span>
                <span className="text-xs font-medium text-gray-300">{circuit.circuitId}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-800/50">
                <span className="text-xs text-gray-400">City</span>
                <span className="text-xs font-medium text-gray-300">{circuit.city}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-800/50">
                <span className="text-xs text-gray-400">Country</span>
                <span className="text-xs font-medium text-gray-300">{circuit.country}</span>
              </div>
              {circuit.circuitLength && (
                <div className="flex justify-between items-center py-1.5 border-b border-gray-800/50">
                  <span className="text-xs text-gray-400">Length (m)</span>
                  <span className="text-xs font-medium text-gray-300">{circuit.circuitLength.toLocaleString()} m</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Wikipedia Link */}
      <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
        <a
          href={circuit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 text-blue-400 hover:text-blue-300 rounded-lg text-sm font-medium transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
        >
          Wikipedia
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

const CircuitsComponent = () => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchCircuits();
    
    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const fetchCircuits = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://f1api.dev/api/circuits');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch circuits: ${response.status}`);
      }
      
      const data = await response.json();
      setCircuits(data.circuits);
      
      // Auto-select first circuit on desktop
      if (data.circuits.length > 0 && !isMobile) {
        setSelectedCircuit(data.circuits[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch circuits');
      console.error('Error fetching circuits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCircuit = (circuit) => {
    setSelectedCircuit(circuit);
  };

  const handleCloseDetail = () => {
    setSelectedCircuit(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-800 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 rounded-xl p-4 animate-pulse"
              >
                <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-3 bg-gray-700/50 rounded"></div>
                  <div className="h-3 bg-gray-700/50 rounded"></div>
                  <div className="h-3 bg-gray-700/50 rounded"></div>
                  <div className="h-3 bg-gray-700/50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Circuits</h2>
            <p className="text-red-300 mb-4 text-sm">{error}</p>
            <button
              onClick={fetchCircuits}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            🏁 F1 Circuits
          </h1>
          <p className="text-gray-400 text-sm">
            {circuits.length} circuits available • Click any circuit for details
          </p>
        </div>

        {/* Main Content */}
        <div className="flex gap-4">
          {/* Circuits Grid - Takes most space */}
          <div className={`flex-1 ${selectedCircuit && !isMobile ? 'lg:w-3/4 xl:w-4/5' : 'w-full'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {circuits.map((circuit, index) => (
                  <CircuitCard
                    key={circuit.circuitId}
                    circuit={circuit}
                    index={index}
                    isSelected={selectedCircuit?.circuitId === circuit.circuitId}
                    onSelect={() => handleSelectCircuit(circuit)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Compact Detail Panel - On extreme right */}
          <AnimatePresence>
            {selectedCircuit && !isMobile && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '320px' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden lg:block flex-shrink-0"
              >
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 h-full flex flex-col overflow-hidden shadow-xl">
                  <CompactDetailPanel
                    circuit={selectedCircuit}
                    onClose={handleCloseDetail}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Detail Modal */}
        <AnimatePresence>
          {selectedCircuit && isMobile && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCircuit(null)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              />
              
              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
                >
                  <CompactDetailPanel
                    circuit={selectedCircuit}
                    onClose={() => setSelectedCircuit(null)}
                  />
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-800/50 text-center text-gray-500 text-xs">
          <p>Data provided by F1 API • {new Date().getFullYear()} F1 Circuits</p>
        </div>
      </div>
    </div>
  );
};

export default CircuitsComponent;