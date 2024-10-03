// src/components/Settings.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { colors, typography, spacing, componentStyles } from '../styles/designSystem';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  color: ${colors.text.primary};
`;

const Card = styled.div`
  ${componentStyles.card}
`;

const SettingGroup = styled.div`
  margin-bottom: ${spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.md};
`;

const SettingLabel = styled.span`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
`;

const Select = styled.select`
  ${componentStyles.input}
  width: auto;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${colors.primary};
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.text.secondary};
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: ${colors.white};
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const InputNumber = styled.input`
  ${componentStyles.input}
  width: 80px;
`;

const Settings = () => {
  const { deviceData, handleDeviceControl } = useAppContext();
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleTemperatureUnitChange = (unit) => {
    setTemperatureUnit(unit);
    // Here you would typically update this in your backend or global state
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // Here you would typically update the app's theme
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    // Here you would typically update this in your backend or global state
  };

  return (
    <SettingsContainer>
      <Title>Settings</Title>
      <Card>
        <SettingGroup>
          <SettingTitle>General Settings</SettingTitle>
          <SettingRow>
            <SettingLabel>Temperature Unit</SettingLabel>
            <Select
              value={temperatureUnit}
              onChange={(e) => handleTemperatureUnitChange(e.target.value)}
            >
              <option>Celsius</option>
              <option>Fahrenheit</option>
            </Select>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Dark Mode</SettingLabel>
            <ToggleSwitch>
              <ToggleInput type="checkbox" checked={darkMode} onChange={handleDarkModeToggle} />
              <Slider />
            </ToggleSwitch>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Notifications</SettingLabel>
            <ToggleSwitch>
              <ToggleInput type="checkbox" checked={notifications} onChange={handleNotificationsToggle} />
              <Slider />
            </ToggleSwitch>
          </SettingRow>
        </SettingGroup>
        <SettingGroup>
          <SettingTitle>Device Controls</SettingTitle>
          <SettingRow>
            <SettingLabel>Thermostat</SettingLabel>
            <InputNumber
              type="number"
              value={deviceData.thermostat.temperature}
              onChange={(e) => handleDeviceControl('thermostat', 'set', parseInt(e.target.value))}
            />
          </SettingRow>
          <SettingRow>
            <SettingLabel>Lights</SettingLabel>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={deviceData.lights.status}
                onChange={() => handleDeviceControl('lights', 'toggle', !deviceData.lights.status)}
              />
              <Slider />
            </ToggleSwitch>
          </SettingRow>
        </SettingGroup>
      </Card>
    </SettingsContainer>
  );
};

export default Settings;