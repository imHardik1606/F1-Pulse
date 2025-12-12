const API_BASE_URL = "https://f1api.dev/api";

export const f1Api = {
  // Get driver championship standings
  async getDriverChampionship() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/current/drivers-championship`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store", // Remove caching for fresh data
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      // Return only the first 10 drivers
      return data.drivers_championship.slice(0, 10);
    } catch (error) {
      console.error("Error fetching driver championship:", error);
      throw error;
    }
  },

  // You can add more API methods here
  async getConstructorChampionship() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/current/constructors-championship`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.constructors_championship || []; // Adjust based on actual API response
    } catch (error) {
      console.error("Error fetching constructor championship:", error);
      throw error;
    }
  },

  // Add other endpoints as needed
  async getNextRace() {
    try {
      const response = await fetch(`${API_BASE_URL}/current/next`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching next race:", error);
      throw error;
    }
  },

  // Get All drivers
  async getAllDrivers() {
    try {
      const response = await fetch(`${API_BASE_URL}/current/drivers`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store", // Remove caching for fresh data
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      // Return only the first 10 drivers
      return data.drivers.slice(0, 20);
    } catch (error) {
      console.error("Error fetching all drivers:", error);
      throw error;
    }
  },

  // Get Driver Picture by driverId
  async getDriverPicture(driverId) {
    try {
      // Map driver IDs to Wikipedia search terms
      const driverMap = {
        // Format: 'api_id': 'Wikipedia Name'
        hamilton: "Lewis Hamilton",
        bottas: "Valtteri Bottas",
        max_verstappen: "Max Verstappen",
        perez: "Sergio Pérez",
        leclerc: "Charles Leclerc",
        sainz: "Carlos Sainz",
        norris: "Lando Norris",
        piastri: "Oscar Piastri",
        alonso: "Fernando Alonso",
        stroll: "Lance Stroll",
        ocon: "Esteban Ocon",
        gasly: "Pierre Gasly",
        albon: "Alexander Albon",
        sargeant: "Logan Sargeant",
        tsunoda: "Yuki Tsunoda",
        ricciardo: "Daniel Ricciardo",
        zhou: "Zhou Guanyu",
        hulkenberg: "Nico Hülkenberg",
        magnussen: "Kevin Magnussen",
        russell: "George Russell",

        // Common variations
        max: "Max Verstappen",
        lando: "Lando Norris",
        daniel: "Daniel Ricciardo",
        lando_norris: "Lando Norris",
        max_verstappen: "Max Verstappen",
        charles_leclerc: "Charles Leclerc",
        carlos_sainz: "Carlos Sainz",
        lando_norris: "Lando Norris",
        oscar_piastri: "Oscar Piastri",
      };

      // Get Wikipedia name from driverId
      let wikipediaName = driverMap[driverId.toLowerCase()];

      // If not in map, convert underscores to spaces and capitalize
      if (!wikipediaName) {
        wikipediaName = driverId
          .replace(/_/g, " ")
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
      }

      // Try multiple search strategies
      const searchAttempts = [
        `${wikipediaName} Formula One driver`,
        `${wikipediaName} racing driver`,
        wikipediaName,
      ];

      for (const searchTerm of searchAttempts) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          searchTerm
        )}&prop=pageimages&format=json&pithumbsize=500&origin=*`;

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "F1App/1.0",
          },
          cache: "no-store",
        });

        if (!response.ok) continue;

        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        // Check if page exists and has thumbnail
        if (pageId !== "-1" && pages[pageId].thumbnail) {
          return pages[pageId].thumbnail.source;
        }
      }

      // If all attempts fail, return placeholder
      return this.generateDriverPlaceholder(driverId);
    } catch (error) {
      console.error(`Error fetching picture for ${driverId}:`, error);
      return this.generateDriverPlaceholder(driverId);
    }
  },

  // Helper function for consistent placeholders
  async generateDriverPlaceholder(driverId) {
    // Extract initials from driverId
    let initials = "";
    if (driverId.includes("_")) {
      // For names like "max_verstappen" -> "MV"
      initials = driverId
        .split("_")
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
    } else {
      // For single names like "norris" -> "NO"
      initials = driverId.substring(0, 2).toUpperCase();
    }

    // Generate consistent color based on driverId
    const colors = [
      "FF6B6B", // Red
      "4ECDC4", // Teal
      "45B7D1", // Blue
      "96CEB4", // Green
      "FFEAA7", // Yellow
      "DDA0DD", // Purple
      "F7DC6F", // Gold
      "85C1E9", // Light Blue
      "FFB347", // Orange
      "77DD77", // Light Green
    ];

    // Create hash from driverId for consistent color
    const hash = driverId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = colors[hash % colors.length];

    return `https://via.placeholder.com/500/${color}/FFFFFF?text=${encodeURIComponent(
      initials
    )}`;
  },

  async getSeasons() {
    try {
      const response = await fetch(`${API_BASE_URL}/seasons`);
      if (!response.ok) {
        throw new Error(`Failed to fetch seasons: ${response.status}`);
      }
      const data = await response.json();
      return data.championships || [];
    } catch (error) {
      console.error("Error fetching seasons:", error);
      throw error;
    }
  },

  // Fetch driver championship for a specific year
  async getDriverChampionshipByYear(year) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${year}/drivers-championship`
      );
      if (!response.ok) {
        // Some years might not have data, return empty array
        if (response.status === 404) {
          return { drivers_championship: [] };
        }
        throw new Error(
          `Failed to fetch driver championship: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching driver championship for ${year}:`, error);
      // Return empty structure instead of throwing
      return { drivers_championship: [] };
    }
  },

  // Fetch constructor championship for a specific year
  async getConstructorChampionshipByYear(year) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${year}/constructors-championship`
      );
      if (!response.ok) {
        // Some years might not have data, return empty array
        if (response.status === 404) {
          return { constructor_championship: [] };
        }
        throw new Error(
          `Failed to fetch constructor championship: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(
        `Error fetching constructor championship for ${year}:`,
        error
      );
      // Return empty structure instead of throwing
      return { constructor_championship: [] };
    }
  },

  async getCurrentSeason() {
    try {
      const response = await fetch(`${API_BASE_URL}/current`);
      if (!response.ok) {
        throw new Error(`Failed to fetch current season: ${response.status}`);
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error fetching seasons:", error);
      throw error;
    }
  },

  async fetchTeams() {
    try {
      const teamsResponse = await fetch("https://f1api.dev/api/current/teams");

      if (!teamsResponse.ok) {
        throw new Error(`HTTP error! Status: ${teamsResponse.status}`);
      }

      const teamsData = await teamsResponse.json();
      const allTeams = teamsData.teams || [];

      return allTeams;
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    }
  },

  async fetchTeamDrivers(teamId) {
    try {
      const driversResponse = await fetch(
        `${API_BASE_URL}/current/teams/${teamId}/drivers`
      );

      if (!driversResponse.ok) {
        throw new Error(`HTTP error! Status: ${driversResponse.status}`);
      }
      const driversData = await driversResponse.json();

      return driversData || [];
    } catch (error) {
      console.error("Error in fetching team drivers");
      return [];
    }
  },

  async getResults(currentYear,round, session) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${currentYear}/${round}/${session}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const resultsData = await response.json();

      return resultsData;
    } catch (error) {
      console.error("Error in fetching race results");
      return null;
    }
  },
};
