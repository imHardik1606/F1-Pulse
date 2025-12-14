'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const CircuitCard = ({ circuit, index, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatCircuitLength = (length) => {
    if (!length) return 'N/A';
    return `${(length / 1000).toFixed(2)} km`;
  };

  const getCircuitColor = (circuitId) => {
    const colors = {
      'bahrein': 'from-red-600 via-yellow-500 to-red-400',
      'jeddah': 'from-green-500 via-white to-green-400',
      'albert_park': 'from-blue-600 via-white to-blue-400',
      'suzuka': 'from-red-600 via-white to-red-400',
      'miami': 'from-pink-500 via-white to-blue-400',
      'imola': 'from-green-600 via-white to-red-600',
      'monaco': 'from-red-600 via-white to-red-400',
      'gilles_villeneuve': 'from-red-600 via-white to-red-400',
      'montmelo': 'from-red-600 via-yellow-500 to-red-400',
      'red_bull_ring': 'from-blue-500 via-yellow-500 to-red-500',
      'silverstone': 'from-blue-500 via-white to-blue-400',
      'hungaroring': 'from-red-600 via-white to-green-500',
      'zandvoort': 'from-orange-500 via-white to-blue-400',
      'spa': 'from-yellow-500 via-red-500 to-black',
      'monza': 'from-green-600 via-white to-red-600',
      'baku': 'from-blue-500 via-white to-green-500',
      'marina_bay': 'from-red-500 via-white to-blue-500',
      'hermanos_rodriguez': 'from-green-600 via-white to-red-600',
      'austin': 'from-red-600 via-white to-blue-500',
      'interlagos': 'from-green-600 via-yellow-500 to-blue-500',
      'lusail': 'from-maroon-600 via-white to-maroon-400',
      'yas_marina': 'from-yellow-500 via-white to-black',
      'vegas': 'from-red-600 via-white to-blue-400',
      'mugello': 'from-green-600 via-white to-red-600',
      'portimao': 'from-red-600 via-white to-green-600',
      'istanbul': 'from-red-600 via-white to-red-400',
      'paul_ricard': 'from-blue-500 via-white to-red-500',
      'sochi': 'from-red-500 via-white to-blue-500',
      'nurburgring': 'from-black via-white to-yellow-500',
      'adelaide': 'from-blue-500 via-white to-green-500',
      'default': 'from-red-600 via-red-500 to-red-400'
    };
    return colors[circuitId] || colors.default;
  };

  const getFlagEmoji = (country) => {
    const flags = {
      'Bahrein': '🇧🇭',
      'Saudi Arabia': '🇸🇦',
      'Australia': '🇦🇺',
      'Japan': '🇯🇵',
      'United States': '🇺🇸',
      'Italy': '🇮🇹',
      'Monaco': '🇲🇨',
      'Canada': '🇨🇦',
      'Spain': '🇪🇸',
      'Austria': '🇦🇹',
      'Great Britain': '🇬🇧',
      'Hungary': '🇭🇺',
      'Netherlands': '🇳🇱',
      'Belgium': '🇧🇪',
      'Azerbaijan': '🇦🇿',
      'Singapore': '🇸🇬',
      'Mexico': '🇲🇽',
      'Brazil': '🇧🇷',
      'Qatar': '🇶🇦',
      'United Arab Emirates': '🇦🇪',
      'Portugal': '🇵🇹',
      'Turkey': '🇹🇷',
      'France': '🇫🇷',
      'Russia': '🇷🇺',
      'Germany': '🇩🇪'
    };
    return flags[country] || '🏁';
  };

  // Check if circuit has valid data (not all null)
  const hasValidData = circuit.circuitLength !== null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: hasValidData ? 1 : 0.5, 
        x: 0,
        transition: { delay: index * 0.05, type: "spring", stiffness: 200 }
      }}
      whileHover={{ 
        x: hasValidData ? 4 : 0,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: hasValidData ? 0.98 : 1 }}
      onHoverStart={() => hasValidData && setIsHovered(true)}
      onHoverEnd={() => hasValidData && setIsHovered(false)}
      className={`relative w-full min-h-32 bg-linear-to-br from-gray-900/95 via-gray-900/90 to-black/95 
        backdrop-blur-lg rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer 
        ${isSelected ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-800 hover:border-red-500/50'}
        ${hasValidData ? 'cursor-pointer hover:shadow-xl hover:shadow-red-500/10' : 'cursor-not-allowed opacity-50'}
        shadow-lg group`}
      onClick={hasValidData ? onSelect : null}
    >
      {/* Inactive overlay for circuits without data */}
      {!hasValidData && (
        <div className="absolute inset-0 bg-black/50 z-20 rounded-2xl flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              NO DATA AVAILABLE
            </div>
            <div className="text-xs text-gray-500">Historical circuit</div>
          </div>
        </div>
      )}

      {/* F1 Racing Stripes Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-2 bg-linear-to-b from-red-600 via-white to-red-600 opacity-30" />
        <div className="absolute inset-y-0 left-3 w-1 bg-linear-to-b from-yellow-400 to-yellow-400 opacity-20" />
        <div className="absolute inset-y-0 right-0 w-4 bg-linear-to-b from-black via-gray-900 to-black opacity-80" />
        
        {/* Pirelli-style color bands */}
        <motion.div
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 1.5, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-yellow-500 to-transparent opacity-20"
        />
      </div>

      {/* Circuit Color Accent */}
      <motion.div
        animate={{ width: isHovered ? '8px' : '4px' }}
        className={`absolute left-0 top-0 h-full bg-linear-to-b ${getCircuitColor(circuit.circuitId)}`}
      />

      <div className="relative z-10 flex h-full">
        {/* LEFT SIDE: Circuit Info */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            {/* Circuit Number - F1 Style */}
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              className="mb-3"
            >
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Circuit
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </span>
                <span className="text-sm text-gray-400">/ {circuit.length}</span>
              </div>
            </motion.div>

            {/* Circuit Name */}
            <motion.h3
              animate={{ color: isHovered ? '#ffffff' : '#f3f4f6' }}
              className="text-xl font-bold text-white mb-2 line-clamp-1"
            >
              {circuit.circuitName}
            </motion.h3>

            {/* Country Flag and Location */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: isHovered ? 1.2 : 1 }}
                className="text-2xl"
              >
                {getFlagEmoji(circuit.country)}
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <motion.svg
                    animate={{ rotate: isHovered ? 180 : 0 }}
                    className="w-4 h-4 text-red-500 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </motion.svg>
                  <span className="text-sm font-medium text-gray-300 line-clamp-1">
                    {circuit.city}, {circuit.country}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    Est. {circuit.firstParticipationYear || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Circuit ID - Bottom Left */}
          <div className="mt-4">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              {circuit.circuitId}
            </span>
          </div>
        </div>

        {/* DIVIDER - F1 Checkered Pattern */}
        <div className="relative w-px my-4 bg-linear-to-b from-gray-800 via-gray-700 to-gray-800">
          <div className="absolute inset-0 w-px bg-linear-to-b from-red-500/20 via-yellow-500/20 to-red-500/20" />
        </div>

        {/* RIGHT SIDE: Circuit Stats */}
        <div className="flex-1 p-5">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Top Row Stats */}
            <motion.div
              whileHover={{ scale: hasValidData ? 1.05 : 1 }}
              className="p-3 bg-linear-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs text-gray-400 font-medium">LENGTH</span>
              </div>
              <p className="text-lg font-bold text-white">
                {formatCircuitLength(circuit.circuitLength)}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: hasValidData ? 1.05 : 1 }}
              className="p-3 bg-linear-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-xs text-gray-400 font-medium">CORNERS</span>
              </div>
              <p className="text-lg font-bold text-white">
                {circuit.numberOfCorners || 'N/A'}
              </p>
            </motion.div>

            {/* Bottom Row Stats */}
            <motion.div
              whileHover={{ scale: hasValidData ? 1.05 : 1 }}
              className="p-3 bg-linear-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-400 font-medium">FIRST GP</span>
              </div>
              <p className="text-lg font-bold text-white">
                {circuit.firstParticipationYear || 'N/A'}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: hasValidData ? 1.05 : 1 }}
              className="p-3 bg-linear-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-400 font-medium">LAP RECORD</span>
              </div>
              <p className="text-lg font-bold text-cyan-300 truncate">
                {circuit.lapRecord || 'N/A'}
              </p>
            </motion.div>
          </div>

          {/* Selection Indicator - Only show if has data */}
          {hasValidData && (
            <motion.div
              animate={{ 
                opacity: isSelected ? 1 : 0,
                scale: isSelected ? 1 : 0.5
              }}
              className="absolute bottom-4 right-4 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400 font-semibold">SELECTED</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* F1-style Speed Lines - Only show if has data */}
      {hasValidData && (
        <motion.div
          animate={{ opacity: isHovered ? 0.3 : 0.1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, transparent 50%, rgba(220, 38, 38, 0.1) 50%)`,
            backgroundSize: '20px 2px'
          }} />
        </motion.div>
      )}
    </motion.div>
  );
};

const DetailPanel = ({ circuit, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [imageError, setImageError] = useState(false);
  
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

  const getTeamColor = (teamId) => {
    const colors = {
      mercedes: 'bg-linear-to-r from-[#00D2BE] to-[#00A396]',
      red_bull: 'bg-linear-to-r from-[#0600EF] to-[#1E40AF]',
      ferrari: 'bg-linear-to-r from-[#DC0000] to-[#9B0000]',
      mclaren: 'bg-linear-to-r from-[#FF8700] to-[#FF6B00]',
      alpine: 'bg-linear-to-r from-[#0090FF] to-[#0066CC]',
      alpha_tauri: 'bg-linear-to-r from-[#2B4562] to-[#1E293B]',
      aston_martin: 'bg-linear-to-r from-[#006F62] to-[#005048]',
      alfa_romeo: 'bg-linear-to-r from-[#900000] to-[#660000]',
      haas: 'bg-linear-to-r from-white to-gray-300 text-gray-900',
      williams: 'bg-linear-to-r from-[#005AFF] to-[#0041CC]',
    };
    return colors[teamId] || 'bg-linear-to-r from-gray-700 to-gray-800';
  };

  // Map circuit IDs to static images in public folder
  const getCircuitImage = (circuitId) => {
    const circuitImages = {
      'bahrein': '/circuits/bahrain.jpg',
      'jeddah': '/circuits/jeddah.jpg',
      'albert_park': '/circuits/melbourne.jpg',
      'suzuka': '/circuits/suzuka.jpg',
      'miami': '/circuits/miami.jpg',
      'imola': '/circuits/imola.jpg',
      'monaco': '/circuits/monaco.png',
      'gilles_villeneuve': '/circuits/montreal.jpg',
      'montmelo': '/circuits/barcelona.jpg',
      'red_bull_ring': '/circuits/austria.jpg',
      'silverstone': '/circuits/silverstone.jpg',
      'hungaroring': '/circuits/hungaroring.jpg',
      'zandvoort': '/circuits/zandvoort.jpg',
      'spa': '/circuits/spa.jpg',
      'monza': '/circuits/monza.jpg',
      'baku': '/circuits/baku.jpg',
      'marina_bay': '/circuits/singapore.jpg',
      'hermanos_rodriguez': '/circuits/mexico.jpg',
      'austin': '/circuits/austin.jpg',
      'interlagos': '/circuits/interlagos.jpg',
      'lusail': '/circuits/qatar.jpg',
      'yas_marina': '/circuits/abudhabi.jpg',
      'vegas': '/circuits/vegas.png',
      'mugello': '/circuits/mugello.jpg',
      'portimao': '/circuits/portimao.jpg',
      'istanbul': '/circuits/istanbul.jpg',
      'paul_ricard': '/circuits/france.jpg',
      'sochi': '/circuits/sochi.jpg',
      'nurburgring': '/circuits/nurburgring.jpg',
      'adelaide': '/circuits/adelaide.jpg',
    };
    
    // Default fallback image in public folder
    return circuitImages[circuitId] || '/circuits/default-circuit.jpg';
  };

  if (!circuit) return null;

  // Check if circuit has valid data
  const hasValidData = circuit.circuitLength !== null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full flex flex-col bg-linear-to-br from-gray-900 via-black to-gray-900 
        backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-800 shadow-2xl"
    >
      {/* F1-style Header with Red Accent */}
      <div className="relative p-6 border-b border-gray-800">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 via-yellow-500 to-red-600" />
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-red-600 rounded-full">
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  {hasValidData ? 'F1 CIRCUIT' : 'HISTORICAL CIRCUIT'}
                </span>
              </div>
              <span className="text-sm text-gray-400">#{circuit.circuitId}</span>
            </div>
            
            <h2 className="text-2xl font-bold bg-linear-to-r from-white via-red-100 to-white bg-clip-text text-transparent mb-2">
              {circuit.circuitName}
            </h2>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-300">{circuit.city}, {circuit.country}</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="text-sm text-gray-400">Since {circuit.firstParticipationYear || 'N/A'}</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-800/50 rounded-xl transition-all duration-300"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
        
        {/* F1-style Tab Navigation - Disable fastest tab if no lap record */}
        <div className="flex gap-2">
          {['info', 'fastest', 'layout'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: (tab !== 'fastest' || circuit.fastestLapDriverId) ? 1.05 : 1 }}
              whileTap={{ scale: (tab !== 'fastest' || circuit.fastestLapDriverId) ? 0.95 : 1 }}
              onClick={() => (tab !== 'fastest' || circuit.fastestLapDriverId) && setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-linear-to-r from-red-600 to-red-700 text-white'
                  : (tab === 'fastest' && !circuit.fastestLapDriverId)
                  ? 'bg-gray-800/20 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
              disabled={tab === 'fastest' && !circuit.fastestLapDriverId}
            >
              {tab === 'info' ? 'CIRCUIT INFO' : tab === 'fastest' ? 'LAP RECORD' : 'TRACK LAYOUT'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTab === 'info' && (
              <div className="space-y-6 h-full">
                {/* No Data Warning for circuits without data */}
                {!hasValidData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-linear-to-r from-yellow-900/10 to-yellow-800/5 
                      backdrop-blur-sm rounded-xl border border-yellow-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-200">Historical Circuit</p>
                        <p className="text-xs text-yellow-300/70 mt-1">
                          This is a historical Formula 1 circuit. Detailed racing data is not available in the current database.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Stats Banner */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-linear-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-800"
                >
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    CIRCUIT OVERVIEW
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        hasValidData 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {hasValidData ? 'ACTIVE' : 'HISTORICAL'}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Length</p>
                      <p className="text-sm font-bold text-white">{formatCircuitLength(circuit.circuitLength)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Corners</p>
                      <p className="text-sm font-bold text-white">{circuit.numberOfCorners || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">First GP</p>
                      <p className="text-sm font-bold text-white">{circuit.firstParticipationYear || 'N/A'}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Lap Record Preview - Only show if available */}
                {circuit.fastestLapDriverId && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-linear-to-br from-yellow-900/10 via-black to-yellow-900/10 
                      backdrop-blur-sm rounded-xl border border-yellow-800/30"
                  >
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      LAP RECORD PREVIEW
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-yellow-600 to-yellow-800 
                          rounded-full flex items-center justify-center">
                          <span className="text-lg">🏎️</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Driver</p>
                          <p className="text-sm font-bold text-white">{formatDriverName(circuit.fastestLapDriverId)}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Fastest Lap</p>
                        <p className="text-2xl font-black text-yellow-400">{circuit.lapRecord || 'N/A'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'fastest' && circuit.fastestLapDriverId && (
              <div className="space-y-6 h-full">
                {/* Fastest Lap Trophy Card */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-6 bg-linear-to-br from-yellow-900/20 via-black to-yellow-900/5 
                    backdrop-blur-sm rounded-2xl border border-yellow-500/30"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-bold text-white">FASTEST LAP RECORD</h4>
                    <div className="px-3 py-1 bg-linear-to-r from-yellow-600 to-yellow-700 rounded-full">
                      <span className="text-xs font-bold text-white uppercase tracking-widest">RECORD</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-4 border-yellow-500/30 border-t-transparent"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-linear-to-br from-red-600 to-red-800 rounded-full 
                            flex items-center justify-center">
                            <span className="text-3xl">👤</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">DRIVER</p>
                      <p className="text-xl font-bold text-white">
                        {formatDriverName(circuit.fastestLapDriverId)}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className={`absolute inset-0 rounded-full ${getTeamColor(circuit.fastestLapTeamId)}`} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl">🏎️</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">TEAM</p>
                      <p className="text-xl font-bold text-white">
                        {circuit.fastestLapTeamId ? formatDriverName(circuit.fastestLapTeamId) : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 bg-linear-to-br from-yellow-600 to-yellow-800 
                          rounded-full flex items-center justify-center">
                          <span className="text-4xl font-bold">{circuit.fastestLapYear}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">YEAR</p>
                      <p className="text-xl font-bold text-white">{circuit.fastestLapYear}</p>
                    </div>
                  </div>
                  
                  {/* Lap Time Display */}
                  <div className="mt-8 pt-6 border-t border-yellow-500/20 text-center">
                    <p className="text-sm text-gray-400 mb-2">FASTEST LAP TIME</p>
                    <p className="text-4xl font-black text-yellow-400">{circuit.lapRecord || 'N/A'}</p>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-6 h-full">
                {/* Circuit Layout Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-linear-to-r from-gray-900/50 to-black/50 rounded-xl border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white">TRACK LAYOUT</h4>
                      <p className="text-sm text-gray-400">{circuit.circuitName} Circuit</p>
                    </div>
                    <span className="px-3 py-1 bg-linear-to-r from-red-600 to-red-800 rounded-full">
                      <span className="text-xs font-bold text-white uppercase tracking-widest">
                        {hasValidData ? 'F1 GRADE 1' : 'HISTORICAL'}
                      </span>
                    </span>
                  </div>
                  
                  <div className="relative h-64 bg-linear-to-br from-gray-900 to-black rounded-lg overflow-hidden">
                    {!imageError ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={getCircuitImage(circuit.circuitId)}
                          alt={`${circuit.circuitName} track layout`}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-contain p-2"
                          onError={() => setImageError(true)}
                          priority={true}
                        />
                      </motion.div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none">
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 text-center px-4">
                            Circuit layout image not available
                          </p>
                          <p className="text-gray-400 text-sm text-center mt-2 px-4">
                            Using default circuit visualization
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay with circuit info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">Direction</p>
                          <p className="text-sm font-medium text-white">Clockwise</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Elevation</p>
                          <p className="text-sm font-medium text-white">Varied</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">DRS Zones</p>
                          <p className="text-sm font-medium text-white">2-3</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Layout Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                      <p className="text-xs text-gray-400">Length</p>
                      <p className="text-sm font-bold text-white">{formatCircuitLength(circuit.circuitLength)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-900/30 rounded-lg">
                      <p className="text-xs text-gray-400">Corners</p>
                      <p className="text-sm font-bold text-white">{circuit.numberOfCorners || 'N/A'}</p>
                    </div>
                    <div className="text-center p-3 bg-linear-to-br from-gray-900/30 to-black/30 rounded-lg">
                      <p className="text-xs text-gray-400">First GP</p>
                      <p className="text-sm font-bold text-white">{circuit.firstParticipationYear || 'N/A'}</p>
                    </div>
                    <div className="text-center p-3 bg-linear-to-br from-gray-900/30 to-black/30 rounded-lg">
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="text-sm font-bold text-white">{hasValidData ? 'Active' : 'Historical'}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Circuit Characteristics - Only show for circuits with data */}
                {hasValidData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-linear-to-br from-gray-900/80 to-black/80 backdrop-blur-sm 
                      rounded-xl border border-gray-800"
                  >
                    <h4 className="text-lg font-bold text-white mb-4">TRACK CHARACTERISTICS</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Power Sensitivity</span>
                          <span className="text-sm font-medium text-white">High</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Downforce Requirement</span>
                          <span className="text-sm font-medium text-white">Medium-High</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Overtaking Difficulty</span>
                          <span className="text-sm font-medium text-white">Medium</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer with Wikipedia Link */}
      <div className="p-6 border-t border-gray-800">
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={circuit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-3 
            bg-linear-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30
            text-red-300 hover:text-white rounded-xl text-sm font-bold 
            transition-all duration-300 border border-red-500/30 hover:border-red-400/50
            backdrop-blur-sm uppercase tracking-widest"
        >
          <span>OFFICIAL WIKIPEDIA PAGE</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.a>
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
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const fetchCircuits = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://f1api.dev/api/circuits');
      
      if (!response.ok) throw new Error(`Failed to fetch circuits: ${response.status}`);
      
      const data = await response.json();
      
      // Filter out circuits that have all null data (like Adelaide)
      const validCircuits = data.circuits.filter(circuit => 
        circuit.circuitLength !== null || 
        circuit.lapRecord !== null || 
        circuit.firstParticipationYear !== null
      );
      
      setCircuits(validCircuits);
      
      if (validCircuits.length > 0 && !isMobile) {
        setSelectedCircuit(validCircuits[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch circuits');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* F1-style Loading Header */}
          <div className="mb-8">
            <div className="h-12 bg-linear-to-r from-gray-900 to-black rounded-2xl w-96 mb-4 animate-pulse" />
            <div className="h-1 bg-linear-to-r from-red-600 to-red-400 rounded-full w-48" />
          </div>
          
          {/* Horizontal Loading Cards */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex bg-linear-to-r from-gray-900/50 to-black/50 rounded-2xl p-6 animate-pulse">
                {/* Left side */}
                <div className="flex-1 pr-6">
                  <div className="h-8 bg-gray-800/50 rounded-full w-48 mb-4" />
                  <div className="h-4 bg-gray-800/50 rounded-full w-32 mb-2" />
                  <div className="h-4 bg-gray-800/50 rounded-full w-24" />
                </div>
                
                {/* Divider */}
                <div className="w-px bg-linear-to-b from-gray-800 to-gray-900 mx-4" />
                
                {/* Right side */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-800/50 rounded-xl" />
                  <div className="h-20 bg-gray-800/50 rounded-xl" />
                  <div className="h-20 bg-gray-800/50 rounded-xl" />
                  <div className="h-20 bg-gray-800/50 rounded-xl" />
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
      <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-linear-to-br from-red-900/10 via-black/50 to-red-900/10 
              border border-red-500/30 backdrop-blur-sm rounded-2xl p-8 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-red-900/30 to-black/50 
              rounded-full flex items-center justify-center border border-red-500/30">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-3">
              PIT STOP ERROR
            </h2>
            <p className="text-red-300/80 mb-6 text-sm font-mono">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchCircuits}
              className="px-6 py-3 bg-linear-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 
                text-white rounded-xl font-bold transition-all duration-300 text-sm uppercase tracking-widest"
            >
              RETRY CONNECTION
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* F1-style Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-red-600 via-yellow-500 to-red-600 bg-clip-text text-transparent mb-2">
                F1 CIRCUITS
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-400 text-sm md:text-base">
                  SEASON {new Date().getFullYear()} • {circuits.length} RACES
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-500 font-bold">LIVE</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-linear-to-r from-gray-900 to-black rounded-xl border border-gray-800">
                <span className="text-sm text-gray-400">TOTAL</span>
                <span className="text-xl font-bold text-white ml-2">{circuits.length}</span>
              </div>
            </div>
          </div>
          
          {/* F1 Red Line Divider */}
          <div className="h-1 bg-linear-to-r from-red-600 via-yellow-500 to-red-600 rounded-full" />
        </motion.header>

        {/* Main Content - Horizontal Cards */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Circuits List */}
          <div className={`flex-1 ${selectedCircuit && !isMobile ? 'lg:w-2/3' : 'w-full'}`}>
            <div className="space-y-4">
              <AnimatePresence>
                {circuits.map((circuit, index) => (
                  <CircuitCard
                    key={circuit.circuitId}
                    circuit={circuit}
                    index={index}
                    isSelected={selectedCircuit?.circuitId === circuit.circuitId}
                    onSelect={() => setSelectedCircuit(circuit)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Detail Panel */}
          <AnimatePresence>
            {selectedCircuit && !isMobile && (
              <motion.div
                layout
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '400px' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="shrink-0 hidden lg:block"
              >
                <DetailPanel
                  circuit={selectedCircuit}
                  onClose={() => setSelectedCircuit(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Detail Modal */}
        <AnimatePresence>
          {selectedCircuit && isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCircuit(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
              />
              
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 50 }}
                  className="w-full max-w-md h-[85vh]"
                >
                  <DetailPanel
                    circuit={selectedCircuit}
                    onClose={() => setSelectedCircuit(null)}
                  />
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* F1 Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-900 text-center"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-600">
              OFFICIAL FORMULA 1 DATA • © {new Date().getFullYear()} FIA FORMULA ONE WORLD CHAMPIONSHIP
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default CircuitsComponent;