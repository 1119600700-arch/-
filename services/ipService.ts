import { IpData } from '../types';

const API_BASE = 'https://ipwho.is/';

export const fetchIpData = async (ipAddress: string = ''): Promise<IpData> => {
  try {
    // If ipAddress is empty, ipwho.is returns the caller's IP data automatically
    const url = ipAddress ? `${API_BASE}${ipAddress}` : API_BASE;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch IP details');
    }
    
    return data as IpData;
  } catch (error) {
    console.error('Error fetching IP data:', error);
    throw error;
  }
};