import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Make sure you have react-router-dom installed

const API_URL = 'http://localhost:5000/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [deviceData, setDeviceData] = useState({
    thermostat: { temperature: 0 },
    humidity: 0,
    lights: { status: false },
    security: { status: 'Disarmed' }
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(`${API_URL}/refresh-token`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const { newToken } = response.data;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return null;
    }
  }, [token, logout]);

  const apiCall = useCallback(async (method, url, data = null) => {
    try {
      const response = await axios({
        method,
        url: `${API_URL}${url}`,
        data,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          return apiCall(method, url, data);
        } else {
          throw new Error('Authentication failed');
        }
      }
      throw error;
    }
  }, [token, refreshToken]);

  const fetchDeviceData = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiCall('get', '/devices');
      setDeviceData(data);
    } catch (error) {
      console.error('Error fetching device data:', error);
      setError('Failed to fetch device data. Please try again later.');
    }
  }, [token, apiCall]);

  const fetchHistoricalData = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiCall('get', '/historical-data');
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  }, [token, apiCall]);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      const fetchInitialData = async () => {
        setLoading(true);
        try {
          await Promise.all([fetchDeviceData(), fetchHistoricalData()]);
        } catch (error) {
          console.error('Error fetching initial data:', error);
          setError('Failed to fetch initial data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchInitialData();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
      setError(null);
    }
  }, [token, fetchDeviceData, fetchHistoricalData]);

  useEffect(() => {
    let deviceDataInterval;
    let historicalDataInterval;

    if (token && isAuthenticated) {
      deviceDataInterval = setInterval(fetchDeviceData, 5000);
      historicalDataInterval = setInterval(fetchHistoricalData, 300000);
    }

    return () => {
      if (deviceDataInterval) clearInterval(deviceDataInterval);
      if (historicalDataInterval) clearInterval(historicalDataInterval);
    };
  }, [token, isAuthenticated, fetchDeviceData, fetchHistoricalData]);

  const handleDeviceControl = async (device, action, value) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall('post', '/control', { device, action, value });
      setDeviceData(response.devices);
    } catch (error) {
      console.error('Error controlling device:', error);
      setError('Failed to control device. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ 
      deviceData, 
      historicalData, 
      handleDeviceControl, 
      loading, 
      error, 
      login, 
      logout,
      isAuthenticated
    }}>
      {children}
    </AppContext.Provider>
  );
};