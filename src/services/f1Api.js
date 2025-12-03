const API_BASE_URL = 'https://f1api.dev/api';

export const f1Api = {
  // Get driver championship standings
  async getDriverChampionship() {
    try {
      const response = await fetch(`${API_BASE_URL}/current/drivers-championship`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Remove caching for fresh data
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      const data = await response.json();
      // Return only the first 10 drivers
      return data.drivers_championship.slice(0, 10);
    } catch (error) {
      console.error('Error fetching driver championship:', error);
      throw error;
    }
  },

  // You can add more API methods here
  async getConstructorChampionship() {
   try {
      const response = await fetch(`${API_BASE_URL}/current/constructors-championship`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.constructors_championship || []; // Adjust based on actual API response
    } catch (error) {
      console.error('Error fetching constructor championship:', error);
      throw error;
    }
  },

  // Add other endpoints as needed
  async getNextRace() {
    try {
      const response = await fetch(`${API_BASE_URL}/current/next`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching next race:', error);
      throw error;
    }
  }
};