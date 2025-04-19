import { useState, useEffect } from 'react';

// Default empty data to avoid null checks everywhere
const DEFAULT_HEATMAP_DATA = {
  grid: [] as number[][],
  gridSize: 0,
  stats: {
    maxValue: 1,
    totalActivity: 0,
    bounds: {
      x: 0,
      z: 0
    }
  }
};

interface HeatmapData {
  grid: number[][];
  gridSize: number;
  stats: {
    maxValue: number;
    totalActivity: number;
    bounds: {
      x: number;
      z: number;
    };
  };
}

const useHeatmap = (gridSize = 10, refreshInterval = 5000) => {
  // Start with default data instead of null
  const [heatmapData, setHeatmapData] = useState<HeatmapData>(DEFAULT_HEATMAP_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHeatmap = async () => {
    try {
      setLoading(true);
      
      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        `http://localhost:4000/api/heatmap?gridSize=${gridSize}`, 
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch heatmap: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the data
      if (!data || !data.grid || !Array.isArray(data.grid) || !data.stats) {
        throw new Error('Invalid heatmap data received');
      }
      
      setHeatmapData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching heatmap:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Don't update heatmapData on error, keep the previous state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch on mount
    fetchHeatmap();
    
    // Set up interval for refreshes
    const intervalId = setInterval(fetchHeatmap, refreshInterval);
    
    // Clean up
    return () => clearInterval(intervalId);
  }, [gridSize, refreshInterval]);
  
  return { heatmapData, loading, error, refetch: fetchHeatmap };
};

export default useHeatmap;