'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  Trophy, Users, RefreshCw, X, ChevronRight, Flag, Calendar, 
  Target, Award, Globe, Car, User, Image as ImageIcon, 
  BarChart3, Timer, TrendingUp, Shield, Sparkles, Zap,
  Crown, Medal, Star, CheckCircle, ChevronDown, Menu, Grid,
  Flame, Target as TargetIcon, Zap as ZapIcon, LayoutDashboard,
  Maximize2, Minimize2, Award as AwardIcon, Info, ExternalLink
} from 'lucide-react';

const F1ChampionshipStandings = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [driversData, setDriversData] = useState(null);
  const [constructorsData, setConstructorsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [driverPictures, setDriverPictures] = useState({});
  const [loadingPictures, setLoadingPictures] = useState({});
  const [podiumPicturesLoaded, setPodiumPicturesLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [statsMode, setStatsMode] = useState(false); // Show detailed stats
  const [podiumDesign, setPodiumDesign] = useState('modern'); // 'modern' or 'timeline'
  const [expandedPodium, setExpandedPodium] = useState(false);
  const [podiumDetailDriver, setPodiumDetailDriver] = useState(null);
  
  const loadingRef = useRef(new Set());
  const picturesCache = useRef({});

  useEffect(() => {
    fetchStandings();
  }, []);

  useEffect(() => {
    if (driversData?.drivers_championship && !podiumPicturesLoaded) {
      loadPodiumPictures();
    }
  }, [driversData, podiumPicturesLoaded]);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [driversResponse, constructorsResponse] = await Promise.all([
        fetch('https://f1api.dev/api/current/drivers-championship'),
        fetch('https://f1api.dev/api/current/constructors-championship')
      ]);

      if (!driversResponse.ok || !constructorsResponse.ok) {
        throw new Error('Failed to fetch standings data');
      }

      const drivers = await driversResponse.json();
      const constructors = await constructorsResponse.json();

      setDriversData(drivers);
      setConstructorsData(constructors);
      setPodiumPicturesLoaded(false);
      
      // Set initial selection
      if (drivers?.drivers_championship?.length > 0) {
        setSelectedItem(drivers.drivers_championship[0]);
      }
    } catch (err) {
      console.error('Error fetching F1 standings:', err);
      setError('Failed to load championship standings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getDriverPicture = useCallback(async (driverId, driverName) => {
    // Check cache first
    if (picturesCache.current[driverId]) {
      return picturesCache.current[driverId];
    }

    try {
      const driverMap = {
        hamilton: "Lewis Hamilton", bottas: "Valtteri Bottas",
        max_verstappen: "Max Verstappen", perez: "Sergio Pérez",
        leclerc: "Charles Leclerc", sainz: "Carlos Sainz",
        norris: "Lando Norris", piastri: "Oscar Piastri",
        alonso: "Fernando Alonso", stroll: "Lance Stroll",
        ocon: "Esteban Ocon", gasly: "Pierre Gasly",
        albon: "Alexander Albon", sargeant: "Logan Sargeant",
        tsunoda: "Yuki Tsunoda", ricciardo: "Daniel Ricciardo",
        zhou: "Zhou Guanyu", hulkenberg: "Nico Hülkenberg",
        magnussen: "Kevin Magnussen", russell: "George Russell",
      };

      let wikipediaName = driverMap[driverId.toLowerCase()] || driverName;
      const searchAttempts = [
        `${wikipediaName} Formula One driver`,
        `${wikipediaName} racing driver`,
        wikipediaName,
      ];

      for (const searchTerm of searchAttempts) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          searchTerm
        )}&prop=pageimages&format=json&pithumbsize=400&origin=*`;

        const response = await fetch(url);
        if (!response.ok) continue;

        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId !== "-1" && pages[pageId].thumbnail) {
          const picture = pages[pageId].thumbnail.source;
          picturesCache.current[driverId] = picture;
          return picture;
        }
      }

      const placeholder = generateDriverPlaceholder(driverId);
      picturesCache.current[driverId] = placeholder;
      return placeholder;
    } catch (error) {
      const placeholder = generateDriverPlaceholder(driverId);
      picturesCache.current[driverId] = placeholder;
      return placeholder;
    }
  }, []);

  const generateDriverPlaceholder = useCallback((driverId) => {
    const initials = driverId
      .split('_')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    
    const colors = ['#DC2626', '#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777'];
    const colorIndex = driverId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:${colors[colorIndex]};stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:${colors[(colorIndex + 2) % colors.length]};stop-opacity:0.7" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="200" fill="url(#grad)"/>
        <text x="200" y="220" font-family="Arial, sans-serif" font-size="140" font-weight="bold" 
              fill="white" text-anchor="middle" dy=".35em">${initials}</text>
      </svg>
    `)}`;
  }, []);

  const loadPodiumPictures = useCallback(async () => {
    if (!driversData?.drivers_championship || podiumPicturesLoaded) return;

    setPodiumPicturesLoaded(true);
    const topDrivers = driversData.drivers_championship.slice(0, 3);
    const pictures = { ...driverPictures };
    
    // Load all podium pictures in parallel
    const picturePromises = topDrivers.map(async (driver) => {
      if (!loadingRef.current.has(driver.driverId) && !pictures[driver.driverId]) {
        loadingRef.current.add(driver.driverId);
        setLoadingPictures(prev => ({ ...prev, [driver.driverId]: true }));
        
        try {
          const picture = await getDriverPicture(
            driver.driverId, 
            `${driver.driver.name} ${driver.driver.surname}`
          );
          pictures[driver.driverId] = picture;
        } catch (error) {
          pictures[driver.driverId] = generateDriverPlaceholder(driver.driverId);
        } finally {
          setLoadingPictures(prev => ({ ...prev, [driver.driverId]: false }));
          loadingRef.current.delete(driver.driverId);
        }
      }
    });
    
    await Promise.all(picturePromises);
    setDriverPictures(pictures);
  }, [driversData, driverPictures, podiumPicturesLoaded, getDriverPicture, generateDriverPlaceholder]);

  const getTeamColor = useCallback((teamId) => {
    const colors = {
      mclaren: '#FF8000', mercedes: '#00D2BE',
      red_bull: '#0600EF', ferrari: '#DC0000',
      williams: '#005AFF', rb: '#6692FF',
      aston_martin: '#006F62', haas: '#FFFFFF',
      sauber: '#52E252', alpine: '#0090FF'
    };
    return colors[teamId] || '#DC2626';
  }, []);

  

  const loadDriverPicture = useCallback(async (driver) => {
    if (driverPictures[driver.driverId] || loadingRef.current.has(driver.driverId)) return;
    
    loadingRef.current.add(driver.driverId);
    setLoadingPictures(prev => ({ ...prev, [driver.driverId]: true }));
    
    try {
      const picture = await getDriverPicture(
        driver.driverId, 
        `${driver.driver.name} ${driver.driver.surname}`
      );
      setDriverPictures(prev => ({ ...prev, [driver.driverId]: picture }));
    } catch (error) {
      setDriverPictures(prev => ({ 
        ...prev, 
        [driver.driverId]: generateDriverPlaceholder(driver.driverId) 
      }));
    } finally {
      setLoadingPictures(prev => ({ ...prev, [driver.driverId]: false }));
      loadingRef.current.delete(driver.driverId);
    }
  }, [driverPictures, getDriverPicture, generateDriverPlaceholder]);

  const handleItemSelect = useCallback(async (item) => {
    setSelectedItem(item);
    
    if (activeTab === 'drivers' && !driverPictures[item.driverId] && !loadingRef.current.has(item.driverId)) {
      await loadDriverPicture(item);
    }
    
    if (window.innerWidth < 1024) {
      setShowMobileDetail(true);
    }
  }, [activeTab, driverPictures, loadDriverPicture]);
  // ========== COMPONENTS ==========

  const LoadingState = () => (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-black to-gray-900">
      <div className="relative">
        <div className="w-32 h-32 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-32 h-32 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-8 space-y-4">
          <div className="text-center">
            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>
            </div>
            <p className="mt-4 text-gray-400 font-medium tracking-wider">LOADING CHAMPIONSHIP DATA</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-black to-gray-900 p-6">
      <div className="max-w-md text-center bg-gray-900/50 backdrop-blur-xl rounded-3xl p-10 border border-gray-800 shadow-2xl">
        <div className="w-24 h-24 mx-auto mb-8 bg-linear-to-br from-red-900/40 to-red-800/20 rounded-full flex items-center justify-center border border-red-800/30 animate-pulse">
          <Zap className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-3xl font-bold text-transparent mb-4 bg-linear-to-r from-white to-red-200 bg-clip-text">CONNECTION ERROR</h3>
        <p className="text-gray-400 mb-8">{error}</p>
        <button
          onClick={fetchStandings}
          className="group px-8 py-4 bg-linear-to-r from-red-600 via-red-500 to-red-600 text-white font-bold rounded-2xl hover:from-red-700 hover:via-red-600 hover:to-red-700 transition-all duration-300 shadow-2xl shadow-red-900/50 hover:shadow-red-900/70 uppercase tracking-widest text-sm flex items-center justify-center gap-3 mx-auto"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          RETRY CONNECTION
        </button>
      </div>
    </div>
  );

  // ========== RESPONSIVE PODIUM LIST ==========
  const MobilePodiumList = memo(({ topDrivers }) => {
    if (!topDrivers || topDrivers.length < 3) return null;

    return (
      <div className="lg:hidden space-y-4 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-white">Championship Leaders</h2>
        </div>
        
        <div className="space-y-4">
          {topDrivers.map((driver, index) => {
            const colors = [
              { bg: 'bg-linear-to-r from-yellow-600/20 to-amber-700/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
              { bg: 'bg-linear-to-r from-gray-500/20 to-gray-600/10', border: 'border-gray-400/30', text: 'text-gray-300' },
              { bg: 'bg-linear-to-r from-amber-800/20 to-amber-900/10', border: 'border-amber-700/30', text: 'text-amber-400' }
            ];
            
            const colorSet = colors[index];
            
            return (
              <motion.div
                key={driver.classificationId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setPodiumDetailDriver(driver)}
                className={`relative ${colorSet.bg} border ${colorSet.border} rounded-2xl p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-center gap-4">
                  {/* Position Medal */}
                  <div className={`relative w-16 h-16 rounded-full ${colorSet.bg} border ${colorSet.border} flex items-center justify-center`}>
                    <span className={`text-2xl font-bold ${colorSet.text}`}>{index + 1}</span>
                    {index === 0 && (
                      <Crown className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  
                  {/* Driver Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg truncate">
                      {driver.driver.shortName}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {driver.team.teamName}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-white font-semibold">{driver.points} pts</span>
                      </div>
                      {driver.wins > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-yellow-400">{driver.wins} wins</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Chevron */}
                  <ChevronRight className="w-6 h-6 text-gray-500" />
                </div>
                
                {/* Team color indicator */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                  style={{ backgroundColor: getTeamColor(driver.teamId) }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  });

  MobilePodiumList.displayName = 'MobilePodiumList';

  // ========== PODIUM DETAIL MODAL ==========
const PodiumDetailModal = memo(({ driver, onClose }) => {
  if (!driver) return null;

  const teamColor = getTeamColor(driver.teamId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${
                driver.position === 1 ? 'bg-gradient-to-br from-yellow-500 to-amber-600' :
                driver.position === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                'bg-gradient-to-br from-amber-700 to-amber-900'
              } flex items-center justify-center`}>
                <span className="text-xl font-bold text-white">P{driver.position}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{driver.driver.shortName}</h3>
                <p className="text-sm text-gray-400">{driver.team.teamName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Driver Image */}
          <div className="relative w-32 h-32 mx-auto mb-6 rounded-full border-4 border-gray-800 overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            {loadingPictures[driver.driverId] ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-gray-600 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <img
                src={driverPictures[driver.driverId] || generateDriverPlaceholder(driver.driverId)}
                alt={`${driver.driver.name} ${driver.driver.surname}`}
                className="w-full h-full object-cover"
              />
            )}
            {/* Team color ring */}
            <div 
              className="absolute inset-0 rounded-full border-4 opacity-30"
              style={{ borderColor: teamColor }}
            />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-800/30 to-black/30 p-4 rounded-2xl border border-gray-700/30">
              <div className="text-sm text-gray-400 mb-2">POINTS</div>
              <div className="text-2xl font-bold text-white">{driver.points}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800/30 to-black/30 p-4 rounded-2xl border border-gray-700/30">
              <div className="text-sm text-gray-400 mb-2">WINS</div>
              <div className="text-2xl font-bold text-white">{driver.wins}</div>
            </div>
          </div>
          
          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/20 rounded-xl">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Driver</span>
              </div>
              <span className="text-white font-medium">{driver.driver.name} {driver.driver.surname}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Nationality</span>
              </div>
              <span className="text-white font-medium">{driver.driver.nationality}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Team</span>
              </div>
              <span className="text-white font-medium">{driver.team.teamName}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Number</span>
              </div>
              <span className="text-white font-medium">#{driver.driver.number}</span>
            </div>
          </div>
          
          {/* Wikipedia Button */}
          <a
            href={driver.driver.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-900 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <ExternalLink className="w-5 h-5" />
            View Wikipedia Profile
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
});

PodiumDetailModal.displayName = 'PodiumDetailModal';

  // ========== MODERN PODIUM DESIGN ==========
  const ModernPodium = memo(({ topDrivers }) => {
    if (!topDrivers || topDrivers.length < 3) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-linear-to-br from-gray-900/40 to-black/60 backdrop-blur-xl rounded-3xl border border-gray-800/30 shadow-2xl overflow-hidden ${
          expandedPodium ? 'lg:col-span-2' : ''
        } hidden lg:block`}
      >
        <div className="relative">
          {/* Header */}
          <div className="p-8 border-b border-gray-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-linear-to-br from-yellow-500 to-amber-600 rounded-2xl rotate-45 flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-white rotate-45" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <Flame className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Race Leaders</h2>
                  <p className="text-gray-400 text-sm">Current Championship Podium</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-600/20 to-red-800/20 rounded-full border border-red-800/30">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">LIVE STANDINGS</span>
              </div>
            </div>
          </div>

          {/* Podium Container */}
          <div className="p-8">
            <div className="relative h-70 mb-32">
              {/* Podium Platform */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-gray-900/80 to-gray-800/40 rounded-3xl border border-gray-800/50">
                {/* Platform levels */}
                <div className="absolute bottom-0 left-1/4 w-1/4 h-24 bg-linear-to-t from-gray-800 to-gray-900 rounded-t-2xl border-l border-r border-t border-gray-700/50">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-6 bg-linear-to-b from-gray-400 to-gray-600 rounded-t-full"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/4 h-28 bg-linear-to-t from-amber-900/30 to-yellow-900/20 rounded-t-2xl border-l border-r border-t border-amber-800/30">
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
                    <div className="w-14 h-7 bg-linear-to-b from-yellow-500 to-amber-600 rounded-t-full"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-1/4 w-1/4 h-20 bg-linear-to-t from-gray-800 to-gray-900 rounded-t-2xl border-l border-r border-t border-gray-700/50">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-6 bg-linear-to-b from-amber-800 to-amber-900 rounded-t-full"></div>
                  </div>
                </div>
              </div>

              {/* Driver Cards */}
              <div className="absolute -bottom-32 left-0 right-0 px-8 top-7">
                <div className="grid grid-cols-3 gap-8">
                  {topDrivers.map((driver, index) => (
                    <motion.div
                      key={driver.classificationId}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                      onClick={() => handleItemSelect(driver)}
                      className={`relative group cursor-pointer ${
                        index === 1 ? '-mt-4' : ''
                      }`}
                    >
                      {/* Driver Card */}
                      <div className={`relative rounded-3xl overflow-hidden backdrop-blur-sm border transition-all duration-500 group-hover:scale-105 ${
                        index === 0 
                          ? 'bg-linear-to-b from-yellow-900/30 to-amber-900/20 border-amber-800/30' 
                          : index === 1
                          ? 'bg-linear-to-b from-gray-800/40 to-gray-900/30 border-gray-700/30'
                          : 'bg-linear-to-b from-amber-900/30 to-amber-950/20 border-amber-800/30'
                      }`}>
                        {/* Position indicator */}
                        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-2xl rotate-45 border-2 shadow-xl flex items-center justify-center ${
                          index === 0 
                            ? 'bg-linear-to-br from-yellow-500 to-amber-600 border-yellow-400' 
                            : index === 1
                            ? 'bg-linear-to-br from-gray-400 to-gray-600 border-gray-300'
                            : 'bg-linear-to-br from-amber-700 to-amber-900 border-amber-600'
                        }`}>
                          <span className="text-xl font-bold text-white -rotate-45">P{index + 1}</span>
                        </div>

                        {/* Driver Image */}
                        <div className="pt-12 px-6">
                          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-white/10 bg-linear-to-b from-gray-900 to-black">
                            {loadingPictures[driver.driverId] ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              <img
                                src={driverPictures[driver.driverId] || generateDriverPlaceholder(driver.driverId)}
                                alt={`${driver.driver.name} ${driver.driver.surname}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.src = generateDriverPlaceholder(driver.driverId);
                                }}
                              />
                            )}
                            <div 
                              className="absolute bottom-0 left-0 right-0 h-2"
                              style={{ backgroundColor: getTeamColor(driver.teamId) }}
                            />
                          </div>
                        </div>

                        {/* Driver Info */}
                        <div className="p-4">
                          <div className="text-center mb-3">
                            <h3 className="text-lg font-bold text-white truncate">
                              {driver.driver.shortName}
                            </h3>
                            <p className="text-xs text-gray-400 truncate">
                              {driver.team.teamName}
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="text-center p-2 rounded-lg bg-gray-900/30">
                              <div className="text-lg font-bold text-white">{driver.points}</div>
                              <div className="text-xs text-gray-400">PTS</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-gray-900/30">
                              <div className="text-lg font-bold text-white">{driver.wins}</div>
                              <div className="text-xs text-gray-400">WINS</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Leader badge */}
                      {index === 0 && (
                        <div className="absolute top-4">
                          <div className="flex items-center gap-2 bg-linear-to-r from-yellow-600/30 to-amber-600/20 px-3 py-1.5 rounded-full border border-yellow-500/30">
                            <Crown className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-300">LEADER</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  ModernPodium.displayName = 'ModernPodium';

  // ========== TIMELINE PODIUM DESIGN ==========
  const TimelinePodium = memo(({ topDrivers }) => {
    if (!topDrivers || topDrivers.length < 3) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-linear-to-br from-gray-900/40 to-black/60 backdrop-blur-xl rounded-3xl border border-gray-800/30 shadow-2xl overflow-hidden hidden lg:block"
      >
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center">
                <ZapIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Race to the Top</h2>
                <p className="text-gray-400 text-sm">Current Championship Leaders</p>
              </div>
            </div>
          </div>

          {/* Timeline track */}
          <div className="relative h-32 mb-12">
            {/* Main track line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-linear-to-r from-gray-800 via-gray-700 to-gray-800"></div>
            
            {/* Driver markers */}
            {topDrivers.map((driver, index) => {
              const position = (index + 1) / (topDrivers.length + 1);
              const leftPosition = `${position * 100}%`;
              
              return (
                <motion.div
                  key={driver.classificationId}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="absolute top-1/2 transform -translate-y-1/2"
                  style={{ left: leftPosition }}
                >
                  {/* Driver marker */}
                  <div 
                    onClick={() => handleItemSelect(driver)}
                    className={`relative w-16 h-16 rounded-full border-4 cursor-pointer group hover:scale-110 transition-transform duration-300 ${
                      index === 0 
                        ? 'border-yellow-500 bg-linear-to-br from-yellow-600/20 to-amber-700/20' 
                        : index === 1
                        ? 'border-gray-400 bg-linear-to-br from-gray-700/20 to-gray-800/20'
                        : 'border-amber-600 bg-linear-to-br from-amber-800/20 to-amber-900/20'
                    }`}
                  >
                    {/* Driver image */}
                    <div className="w-full h-full rounded-full overflow-hidden p-1">
                      {loadingPictures[driver.driverId] ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <img
                          src={driverPictures[driver.driverId] || generateDriverPlaceholder(driver.driverId)}
                          alt={`${driver.driver.name} ${driver.driver.surname}`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </div>
                    
                    {/* Position badge */}
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-gray-900 flex items-center justify-center shadow-lg ${
                      index === 0 
                        ? 'bg-linear-to-br from-yellow-500 to-amber-600' 
                        : index === 1
                        ? 'bg-linear-to-br from-gray-400 to-gray-600'
                        : 'bg-linear-to-br from-amber-700 to-amber-900'
                    }`}>
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Driver stats */}
          <div className="grid grid-cols-3 gap-6">
            {topDrivers.map((driver, index) => (
              <motion.div
                key={driver.classificationId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 }}
                onClick={() => handleItemSelect(driver)}
                className={`p-4 rounded-2xl cursor-pointer group hover:scale-[1.02] transition-all duration-300 ${
                  index === 0 
                    ? 'bg-linear-to-br from-yellow-900/20 to-amber-900/10 border border-amber-800/30' 
                    : index === 1
                    ? 'bg-linear-to-br from-gray-800/20 to-gray-900/10 border border-gray-700/30'
                    : 'bg-linear-to-br from-amber-900/20 to-amber-950/10 border border-amber-800/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 
                      ? 'bg-linear-to-br from-yellow-500/20 to-amber-600/20' 
                      : index === 1
                      ? 'bg-linear-to-br from-gray-500/20 to-gray-600/20'
                      : 'bg-linear-to-br from-amber-700/20 to-amber-800/20'
                  }`}>
                    <span className={`text-xl font-bold ${
                      index === 0 ? 'text-yellow-400' : 
                      index === 1 ? 'text-gray-300' : 
                      'text-amber-400'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">
                      {driver.driver.shortName}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {driver.team.teamName}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Points</span>
                    <span className="text-lg font-bold text-white">{driver.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Wins</span>
                    <span className="text-lg font-bold text-white">{driver.wins}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  });

  TimelinePodium.displayName = 'TimelinePodium';

  // ========== MEMOIZED DRIVER CARD ==========
  const DriverCard = memo(({ driver, index }) => {
    const shouldLoadPicture = index < 8;
    
    useEffect(() => {
      if (shouldLoadPicture && !driverPictures[driver.driverId] && !loadingRef.current.has(driver.driverId)) {
        loadDriverPicture(driver);
      }
    }, [shouldLoadPicture, driver.driverId, driverPictures, loadDriverPicture]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        onClick={() => handleItemSelect(driver)}
        className={`group relative p-4 sm:p-6 rounded-2xl border border-gray-800/50 bg-linear-to-br from-gray-900/50 to-black/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-900/20 ${
          selectedItem?.classificationId === driver.classificationId 
            ? 'ring-2 ring-red-500 border-red-500/50 bg-linear-to-br from-gray-800/60 to-black/60' 
            : ''
        }`}
      >
        <div className="relative flex items-center gap-3 sm:gap-4">
          {/* Position */}
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xl ${
            driver.position <= 3 
              ? driver.position === 1 ? 'bg-linear-to-br from-yellow-500 to-yellow-600' : 
                driver.position === 2 ? 'bg-linear-to-br from-gray-400 to-gray-500' : 
                'bg-linear-to-br from-amber-700 to-amber-800'
              : 'bg-linear-to-br from-red-600 to-red-800'
          } text-white`}>
            {driver.position}
          </div>
          
          {/* Driver Photo */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-700/50 overflow-hidden bg-linear-to-br from-gray-800 to-black">
            {loadingPictures[driver.driverId] && !driverPictures[driver.driverId] ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <img
                src={driverPictures[driver.driverId] || generateDriverPlaceholder(driver.driverId)}
                alt={`${driver.driver.name} ${driver.driver.surname}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.src = generateDriverPlaceholder(driver.driverId);
                }}
              />
            )}
            <div 
              className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-900 shadow-lg"
              style={{ backgroundColor: getTeamColor(driver.teamId) }}
            />
          </div>
          
          {/* Driver Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-red-400 truncate">
                <span className="hidden sm:inline">{driver.driver.name} </span>
                <span className="text-red-400">{driver.driver.surname}</span>
              </h4>
              <span className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-800/50 text-gray-300 rounded border border-gray-700">
                #{driver.driver.number}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{driver.team.teamName}</p>
            
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs px-2 py-1 bg-gray-800/30 text-gray-300 rounded-full border border-gray-700 flex items-center gap-1">
                <Flag className="w-3 h-3" />
                <span className="hidden sm:inline">{driver.driver.nationality}</span>
              </span>
              {driver.wins > 0 && (
                <span className="text-xs px-2 py-1 bg-yellow-900/20 text-yellow-200 rounded-full border border-yellow-800/30 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {driver.wins} wins
                </span>
              )}
            </div>
          </div>
          
          {/* Points */}
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
              {driver.points}
            </div>
            <div className="text-xs text-gray-500 mt-1">PTS</div>
          </div>
        </div>
        
        {/* Progress bar */}
        {/* <div className="mt-4 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-red-600 to-red-800 rounded-full transition-all duration-700"
            style={{ 
              width: `${Math.min((driver.points / 500) * 100, 100)}%` 
            }}
          />
        </div> */}
      </motion.div>
    );
  });

  DriverCard.displayName = 'DriverCard';

    const ConstructorCard = memo(({ constructor, index }) => {
    const isSelected = selectedItem?.teamId === constructor.teamId;

    return (
      <div
        onClick={() => handleItemSelect(constructor)}
        className={`group p-4 rounded-xl border border-gray-800 bg-gray-900/50 cursor-pointer transition-all hover:border-blue-500/30 hover:bg-gray-800/50 ${
          isSelected ? 'ring-2 ring-blue-500 border-blue-500/50' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            constructor.position <= 3 
              ? constructor.position === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 
                constructor.position === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 
                'bg-gradient-to-br from-amber-700 to-amber-800'
              : 'bg-gradient-to-br from-blue-600 to-blue-800'
          } text-white`}>
            {constructor.position}
          </div>
          
          <div className="relative w-10 h-10 rounded-full border-2 border-gray-700 overflow-hidden bg-gray-800 flex items-center justify-center">
            <Car className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-white truncate">
                {constructor.team.teamName}
              </h4>
            </div>
            <p className="text-sm text-gray-400 truncate">{constructor.team.country}</p>
            {constructor.team.constructorsChampionships > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Trophy className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-yellow-400">
                  {constructor.team.constructorsChampionships} titles
                </span>
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-500">
              {constructor.points}
            </div>
            <div className="text-xs text-gray-500">PTS</div>
          </div>
        </div>
      </div>
    );
  });

  ConstructorCard.displayName = 'ConstructorCard';

  // ========== DETAIL PANEL ==========
  const DetailPanel = () => {
    if (!selectedItem) return null;
    
    const isDriver = activeTab === 'drivers';
    const driverPicture = isDriver ? driverPictures[selectedItem.driverId] : null;
    const pictureLoading = isDriver ? loadingPictures[selectedItem.driverId] : false;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="lg:sticky lg:top-6 h-fit rounded-3xl border border-gray-800/50 bg-linear-to-br from-gray-900/80 to-black/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl"
      >
        {/* Mobile close button */}
        {showMobileDetail && (
          <button
            onClick={() => setShowMobileDetail(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors z-10 border border-gray-700"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        )}
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Image */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-gray-800/50 overflow-hidden shadow-2xl bg-linear-to-br from-gray-900 to-black">
                {isDriver ? (
                  pictureLoading && !driverPicture ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 border-3 border-gray-600 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img
                      src={driverPicture || generateDriverPlaceholder(selectedItem.driverId)}
                      alt={isDriver ? `${selectedItem.driver.name} ${selectedItem.driver.surname}` : selectedItem.team.teamName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = generateDriverPlaceholder(selectedItem.driverId);
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-16 h-16 sm:w-24 sm:h-24 text-gray-600" />
                  </div>
                )}
              </div>
              
              {/* Position Badge */}
              <div className="absolute -top-2 -right-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-linear-to-br from-red-600 to-red-800 border-4 border-black flex items-center justify-center shadow-2xl">
                <span className="text-xl sm:text-2xl font-bold text-white">P{selectedItem.position}</span>
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 truncate bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {isDriver ? `${selectedItem.driver.name} ${selectedItem.driver.surname}` : selectedItem.team.teamName}
              </h3>
              <p className="text-gray-400 text-base sm:text-lg mb-4 truncate">
                {isDriver ? selectedItem.team.teamName : selectedItem.team.country}
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-linear-to-br from-gray-800/30 to-black/30 p-3 sm:p-4 rounded-2xl border border-gray-700/30">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">POINTS</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{selectedItem.points}</div>
                </div>
                <div className="bg-linear-to-br from-gray-800/30 to-black/30 p-3 sm:p-4 rounded-2xl border border-gray-700/30">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">WINS</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{selectedItem.wins}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {isDriver ? (
            <>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-linear-to-r from-gray-800/20 to-black/20 rounded-2xl border border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-900/30 to-red-800/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-400">NATIONALITY</div>
                    <div className="text-base sm:text-lg font-medium text-white">{selectedItem.driver.nationality}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-gray-400">DRIVER #</div>
                  <div className="text-xl sm:text-2xl font-bold text-white">#{selectedItem.driver.number}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {selectedItem.team.constructorsChampionships > 0 && (
                <div className="p-4 sm:p-5 bg-linear-to-br from-amber-900/20 to-amber-800/10 rounded-2xl border border-amber-700/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    <div className="text-base sm:text-lg font-semibold text-amber-300">CONSTRUCTORS TITLES</div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-amber-300 text-center">
                    {selectedItem.team.constructorsChampionships}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Wikipedia Button */}
        <a
          href={isDriver ? selectedItem.driver.url : selectedItem.team.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full px-4 py-3 sm:px-6 sm:py-4 bg-linear-to-r from-red-600 via-red-500 to-red-600 text-white font-bold rounded-2xl hover:from-red-700 hover:via-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-900/30 hover:shadow-red-900/50 text-center uppercase tracking-widest text-xs sm:text-sm items-center justify-center gap-2 sm:gap-3"
        >
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          VIEW WIKIPEDIA
        </a>
      </motion.div>
    );
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  const currentData = activeTab === 'drivers' ? driversData : constructorsData;
  const topDrivers = driversData?.drivers_championship?.slice(0, 3) || [];
  const standingsData = activeTab === 'drivers' 
    ? driversData?.drivers_championship?.slice(3) 
    : constructorsData?.constructors_championship;

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-950 to-gray-900">
      {/* Mobile Detail Overlay */}
      <AnimatePresence>
        {showMobileDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setShowMobileDetail(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-linear-to-b from-gray-950 to-black shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <DetailPanel />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Podium Detail Modal */}
      <AnimatePresence>
        {podiumDetailDriver && (
          <PodiumDetailModal
            driver={podiumDetailDriver}
            onClose={() => setPodiumDetailDriver(null)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center px-2"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-linear-to-r from-red-600/20 via-red-500/30 to-red-600/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 shadow-xl sm:shadow-2xl shadow-red-900/20 border border-red-800/30 backdrop-blur-sm">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-bold tracking-widest text-xs sm:text-sm">F1 {currentData?.season} CHAMPIONSHIP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-white via-red-100 to-red-300 bg-clip-text text-transparent px-2">
            {activeTab === 'drivers' ? 'DRIVERS' : 'CONSTRUCTORS'} STANDINGS
          </h1>
          <div className="w-32 sm:w-40 h-1 bg-linear-to-r from-red-600 via-red-500 to-red-600 mx-auto rounded-full shadow-lg shadow-red-600/30" />
          <p className="text-gray-400 mt-4 sm:mt-6 max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Real-time standings for the {currentData?.season} Formula 1 season • {currentData?.total} entries
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mb-8 sm:mb-10 space-y-4 sm:space-y-6 px-2">
          {/* Tabs and Stats Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="flex bg-gray-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-0.5 sm:p-1 border border-gray-800 max-w-sm sm:max-w-md w-full">
              {['drivers', 'constructors'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowMobileDetail(false);
                    setSelectedItem(
                      tab === 'drivers' 
                        ? driversData?.drivers_championship?.[0]
                        : constructorsData?.constructors_championship?.[0]
                    );
                  }}
                  className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold sm:font-bold transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm ${
                    activeTab === tab
                      ? 'bg-linear-to-r from-red-600 to-red-800 text-white shadow-lg'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
                  }`}
                >
                  {tab === 'drivers' ? <Users className="w-3 h-3 sm:w-4 sm:h-4" /> : <Car className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {tab === 'drivers' ? 'DRIVERS' : 'CONSTRUCTORS'}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              {activeTab === 'drivers' && (
                <button
                  onClick={() => setPodiumDesign(podiumDesign === 'modern' ? 'timeline' : 'modern')}
                  className="px-3 sm:px-4 py-2 bg-gray-900/50 text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-800/50 transition-all duration-300 flex items-center gap-2 sm:gap-3 font-semibold border border-gray-800 hover:border-red-800/50 text-xs sm:text-sm"
                >
                  <TargetIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{podiumDesign === 'modern' ? 'TIMELINE VIEW' : 'MODERN VIEW'}</span>
                  <span className="sm:hidden">VIEW</span>
                </button>
              )}
              
              <button
                onClick={() => setStatsMode(!statsMode)}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm ${
                  statsMode
                    ? 'bg-linear-to-r from-blue-600 to-blue-800 text-white'
                    : 'bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800/30 border border-gray-800'
                }`}
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{statsMode ? 'HIDE STATS' : 'SHOW STATS'}</span>
                <span className="sm:hidden">STATS</span>
              </button>
              
              <button
                onClick={fetchStandings}
                className="px-3 sm:px-4 py-2 bg-gray-900/50 text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-800/50 transition-all duration-300 flex items-center gap-2 sm:gap-3 font-semibold border border-gray-800 hover:border-red-800/50 text-xs sm:text-sm"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">REFRESH</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center">
            <div className="flex bg-gray-900/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-0.5 sm:p-1 border border-gray-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm ${
                  viewMode === 'grid'
                    ? 'bg-linear-to-r from-gray-800 to-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">GRID</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm ${
                  viewMode === 'list'
                    ? 'bg-linear-to-r from-gray-800 to-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Menu className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">LIST</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview (Conditional) */}
        {statsMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8 lg:mb-10 bg-linear-to-r from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-800/50 shadow-xl sm:shadow-2xl mx-2"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-linear-to-br from-gray-800/30 to-black/30 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-700/30">
                <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">TOTAL ENTRIES</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{currentData?.total}</div>
              </div>
              <div className="bg-linear-to-br from-gray-800/30 to-black/30 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-700/30">
                <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">SEASON</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{currentData?.season}</div>
              </div>
              <div className="bg-linear-to-br from-gray-800/30 to-black/30 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-700/30">
                <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">LAST UPDATE</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">LIVE</div>
              </div>
              <div className="bg-linear-to-br from-gray-800/30 to-black/30 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-700/30">
                <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">CHAMPIONSHIP</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">F1</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2">
          {/* Main Standings */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Mobile Podium List */}
            {activeTab === 'drivers' && topDrivers.length > 0 && (
              <MobilePodiumList topDrivers={topDrivers} />
            )}

            {/* Desktop Podium */}
            {activeTab === 'drivers' && topDrivers.length > 0 && (
              <>
                {podiumDesign === 'modern' ? (
                  <ModernPodium topDrivers={topDrivers} />
                ) : (
                  <TimelinePodium topDrivers={topDrivers} />
                )}
              </>
            )}

            {/* Standings List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-linear-to-br from-gray-900/50 to-black/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-gray-800/50 shadow-xl sm:shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 lg:mb-10 gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {activeTab === 'drivers' ? 'DRIVERS STANDINGS' : 'CONSTRUCTORS STANDINGS'}
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-gray-400 bg-gray-900/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-800">
                  {standingsData?.length || 0} ENTRIES
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {standingsData?.map((item, index) => (
  activeTab === 'drivers' ? (
    <DriverCard key={item.classificationId} driver={item} index={index} />
  ) : (
    <ConstructorCard key={item.teamId} constructor={item} index={index} />
  )
))}
              </div>
            </motion.div>
          </div>

          {/* Detail Panel - Desktop */}
          <div className="hidden lg:block">
            {selectedItem ? (
              <DetailPanel />
            ) : (
              <div className="sticky top-6 h-fit rounded-3xl border-2 border-dashed border-gray-800/50 bg-linear-to-br from-gray-900/50 to-black/50 backdrop-blur-xl p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-gray-800/30 to-black/30 rounded-full flex items-center justify-center border border-gray-700/50">
                  <Target className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">SELECT FOR DETAILS</h3>
                <p className="text-gray-500 mb-2 text-sm">
                  Click on any {activeTab === 'drivers' ? 'driver' : 'constructor'}
                </p>
                <p className="text-xs text-gray-600">to view detailed information here</p>
                <div className="w-12 h-1 bg-linear-to-r from-red-600 to-red-800 mx-auto rounded-full mt-4 shadow-lg shadow-red-600/30" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-10 border-t border-gray-800/50 px-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-500">Data provided by F1 API • Season {currentData?.season}</p>
              <p className="text-xs text-gray-600 mt-1">Driver photos from Wikipedia • All data updates in real-time</p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-600 animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-gray-400">LIVE DATA</span>
                </div>
                <div className="w-px h-4 sm:h-6 bg-gray-800"></div>
                <div className="text-xs text-gray-600 px-3 py-1 sm:px-4 sm:py-2 bg-gray-900/50 rounded-full border border-gray-800">
                  F1 STANDINGS v3.1
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default F1ChampionshipStandings;