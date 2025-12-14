// Create a mapping of circuit names to characteristics
export const circuitCharacteristicsMap = {
  "Bahrain": {
    powerSensitivity: 75,
    downforceRequirement: 65,
    overtakingDifficulty: 40,
    tireWear: 85,
    fuelConsumption: 70,
    brakingDifficulty: 60
  },
  "Jeddah": {
    powerSensitivity: 85,
    downforceRequirement: 70,
    overtakingDifficulty: 35,
    tireWear: 60,
    fuelConsumption: 75,
    brakingDifficulty: 90
  },
  "Albert Park": {
    powerSensitivity: 65,
    downforceRequirement: 75,
    overtakingDifficulty: 60,
    tireWear: 55,
    fuelConsumption: 65,
    brakingDifficulty: 70
  },
  "Suzuka": {
    powerSensitivity: 70,
    downforceRequirement: 90,
    overtakingDifficulty: 65,
    tireWear: 70,
    fuelConsumption: 75,
    brakingDifficulty: 85
  },
  "Miami": {
    powerSensitivity: 65,
    downforceRequirement: 70,
    overtakingDifficulty: 50,
    tireWear: 60,
    fuelConsumption: 70,
    brakingDifficulty: 65
  },
  "Imola": {
    powerSensitivity: 60,
    downforceRequirement: 80,
    overtakingDifficulty: 80,
    tireWear: 65,
    fuelConsumption: 65,
    brakingDifficulty: 75
  },
  "Monaco": {
    powerSensitivity: 40,
    downforceRequirement: 95,
    overtakingDifficulty: 90,
    tireWear: 30,
    fuelConsumption: 50,
    brakingDifficulty: 85
  },
  "Gilles Villeneuve": {
    powerSensitivity: 80,
    downforceRequirement: 60,
    overtakingDifficulty: 45,
    tireWear: 70,
    fuelConsumption: 75,
    brakingDifficulty: 75
  },
  "Montmelo": {
    powerSensitivity: 70,
    downforceRequirement: 85,
    overtakingDifficulty: 70,
    tireWear: 75,
    fuelConsumption: 70,
    brakingDifficulty: 70
  },
  "Red Bull Ring": {
    powerSensitivity: 85,
    downforceRequirement: 50,
    overtakingDifficulty: 30,
    tireWear: 65,
    fuelConsumption: 75,
    brakingDifficulty: 60
  },
  "Silverstone": {
    powerSensitivity: 70,
    downforceRequirement: 85,
    overtakingDifficulty: 65,
    tireWear: 75,
    fuelConsumption: 70,
    brakingDifficulty: 80
  },
  "Hungaroring": {
    powerSensitivity: 55,
    downforceRequirement: 85,
    overtakingDifficulty: 80,
    tireWear: 70,
    fuelConsumption: 65,
    brakingDifficulty: 70
  },
  "Zandvoort": {
    powerSensitivity: 60,
    downforceRequirement: 80,
    overtakingDifficulty: 70,
    tireWear: 60,
    fuelConsumption: 65,
    brakingDifficulty: 75
  },
  "Spa": {
    powerSensitivity: 85,
    downforceRequirement: 80,
    overtakingDifficulty: 50,
    tireWear: 65,
    fuelConsumption: 85,
    brakingDifficulty: 90
  },
  "Monza": {
    powerSensitivity: 95,
    downforceRequirement: 20,
    overtakingDifficulty: 40,
    tireWear: 60,
    fuelConsumption: 80,
    brakingDifficulty: 50
  },
  "Baku": {
    powerSensitivity: 80,
    downforceRequirement: 65,
    overtakingDifficulty: 35,
    tireWear: 50,
    fuelConsumption: 70,
    brakingDifficulty: 80
  },
  "Marina Bay": {
    powerSensitivity: 30,
    downforceRequirement: 75,
    overtakingDifficulty: 85,
    tireWear: 85,
    fuelConsumption: 90,
    brakingDifficulty: 70
  },
  "Hermanos Rodriguez": {
    powerSensitivity: 75,
    downforceRequirement: 70,
    overtakingDifficulty: 45,
    tireWear: 65,
    fuelConsumption: 75,
    brakingDifficulty: 80
  },
  "Austin": {
    powerSensitivity: 75,
    downforceRequirement: 75,
    overtakingDifficulty: 45,
    tireWear: 70,
    fuelConsumption: 75,
    brakingDifficulty: 75
  },
  "Interlagos": {
    powerSensitivity: 70,
    downforceRequirement: 75,
    overtakingDifficulty: 40,
    tireWear: 75,
    fuelConsumption: 70,
    brakingDifficulty: 80
  },
  "Lusail": {
    powerSensitivity: 80,
    downforceRequirement: 65,
    overtakingDifficulty: 50,
    tireWear: 85,
    fuelConsumption: 80,
    brakingDifficulty: 65
  },
  "Yas Marina": {
    powerSensitivity: 75,
    downforceRequirement: 70,
    overtakingDifficulty: 55,
    tireWear: 60,
    fuelConsumption: 75,
    brakingDifficulty: 70
  },
  "Vegas": {
    powerSensitivity: 85,
    downforceRequirement: 60,
    overtakingDifficulty: 40,
    tireWear: 55,
    fuelConsumption: 80,
    brakingDifficulty: 75
  },
  "Mugello": {
    powerSensitivity: 70,
    downforceRequirement: 85,
    overtakingDifficulty: 75,
    tireWear: 80,
    fuelConsumption: 75,
    brakingDifficulty: 85
  },
  "Portimao": {
    powerSensitivity: 65,
    downforceRequirement: 80,
    overtakingDifficulty: 65,
    tireWear: 75,
    fuelConsumption: 70,
    brakingDifficulty: 80
  },
  "Istanbul": {
    powerSensitivity: 70,
    downforceRequirement: 80,
    overtakingDifficulty: 60,
    tireWear: 70,
    fuelConsumption: 75,
    brakingDifficulty: 85
  },
  "Paul Ricard": {
    powerSensitivity: 75,
    downforceRequirement: 70,
    overtakingDifficulty: 55,
    tireWear: 60,
    fuelConsumption: 70,
    brakingDifficulty: 65
  },
  "Sochi": {
    powerSensitivity: 70,
    downforceRequirement: 65,
    overtakingDifficulty: 50,
    tireWear: 55,
    fuelConsumption: 70,
    brakingDifficulty: 60
  },
  "Nurburgring": {
    powerSensitivity: 65,
    downforceRequirement: 80,
    overtakingDifficulty: 60,
    tireWear: 70,
    fuelConsumption: 75,
    brakingDifficulty: 80
  },
  "Adelaide": {
    powerSensitivity: 60,
    downforceRequirement: 70,
    overtakingDifficulty: 55,
    tireWear: 65,
    fuelConsumption: 70,
    brakingDifficulty: 75
  }
};
  
export const normalizeCircuitName = (circuitKey) => {
  const nameMap = {
    "bahrein": "Bahrain",
    "jeddah": "Jeddah",
    "albert_park": "Albert Park",
    "suzuka": "Suzuka",
    "miami": "Miami",
    "imola": "Imola",
    "monaco": "Monaco",
    "gilles_villeneuve": "Gilles Villeneuve",
    "montmelo": "Montmelo",
    "red_bull_ring": "Red Bull Ring",
    "silverstone": "Silverstone",
    "hungaroring": "Hungaroring",
    "zandvoort": "Zandvoort",
    "spa": "Spa",
    "monza": "Monza",
    "baku": "Baku",
    "marina_bay": "Marina Bay",
    "hermanos_rodriguez": "Hermanos Rodriguez",
    "austin": "Austin",
    "interlagos": "Interlagos",
    "lusail": "Lusail",
    "yas_marina": "Yas Marina",
    "vegas": "Vegas",
    "mugello": "Mugello",
    "portimao": "Portimao",
    "istanbul": "Istanbul",
    "paul_ricard": "Paul Ricard",
    "sochi": "Sochi",
    "nurburgring": "Nurburgring",
    "adelaide": "Adelaide"
  };
  
  return nameMap[circuitKey] || circuitKey;
};

// Fallback calculation
export const calculateCharacteristics = (circuit) => {
  const defaultCharacteristics = {
    powerSensitivity: 70,
    downforceRequirement: 70,
    overtakingDifficulty: 60,
    tireWear: 65,
    fuelConsumption: 70,
    brakingDifficulty: 70
  };
  
  if (circuit.circuitLength && circuit.numberOfCorners) {
    const powerSensitivity = Math.min(100, Math.round((circuit.circuitLength / 7) * 100));
    const downforceRequirement = Math.min(100, Math.round((circuit.numberOfCorners / 25) * 100));
    
    return {
      ...defaultCharacteristics,
      powerSensitivity,
      downforceRequirement
    };
  }
  
  return defaultCharacteristics;
};

// Helper functions for labels
export const getPowerSensitivityLabel = (value) => {
  if (value >= 85) return "Very High";
  if (value >= 70) return "High";
  if (value >= 50) return "Medium";
  if (value >= 30) return "Low";
  return "Very Low";
};

export const getDownforceLabel = (value) => {
  if (value >= 85) return "Very High";
  if (value >= 70) return "High";
  if (value >= 50) return "Medium";
  if (value >= 30) return "Low";
  return "Very Low";
};

export const getOvertakingLabel = (value) => {
  if (value >= 80) return "Very Hard";
  if (value >= 65) return "Hard";
  if (value >= 45) return "Medium";
  if (value >= 25) return "Easy";
  return "Very Easy";
};

export const getTireWearLabel = (value) => {
  if (value >= 75) return "Very High";
  if (value >= 60) return "High";
  if (value >= 40) return "Medium";
  return "Low";
};

export const getFuelLabel = (value) => {
  if (value >= 80) return "Very High";
  if (value >= 65) return "High";
  if (value >= 45) return "Medium";
  return "Low";
};

export const getBrakingLabel = (value) => {
  if (value >= 80) return "Very Hard";
  if (value >= 65) return "Hard";
  if (value >= 45) return "Medium";
  if (value >= 25) return "Easy";
  return "Very Easy";
};