import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const Scheduling = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ device: 'thermostat', time: '', action: 'set', value: '' });
  const { token } = useAppContext();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/schedules', newSchedule, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSchedules();
      setNewSchedule({ device: 'thermostat', time: '', action: 'set', value: '' });
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/schedules/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Device Scheduling</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Device</label>
          <select
            value={newSchedule.device}
            onChange={(e) => setNewSchedule({ ...newSchedule, device: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="thermostat">Thermostat</option>
            <option value="lights">Lights</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={newSchedule.time}
            onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Action</label>
          <select
            value={newSchedule.action}
            onChange={(e) => setNewSchedule({ ...newSchedule, action: e.target.value })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="set">Set</option>
            <option value="toggle">Toggle</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Value</label>
          <input
            type="text"
            value={newSchedule.value}
            onChange={(e) => setNewSchedule({ ...newSchedule, value: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Schedule
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-medium">Current Schedules</h3>
        <ul className="mt-4 space-y-4">
          {schedules.map((schedule) => (
            <li key={schedule.id} className="flex items-center justify-between bg-white shadow overflow-hidden sm:rounded-md p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{schedule.device}</p>
                <p className="text-sm text-gray-500">{schedule.time} - {schedule.action} {schedule.value}</p>
              </div>
              <button
                onClick={() => handleDelete(schedule.id)}
                className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Scheduling;