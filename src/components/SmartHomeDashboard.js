// src/components/SmartHomeDashboard.js

import React, { useState, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Thermometer, LightbulbIcon, Droplets, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { colors, typography, spacing, componentStyles } from '../styles/designSystem';
import ErrorBoundary from './ErrorBoundary';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xl};
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  color: ${colors.text.primary};
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.lg};
`;

const Card = styled.div`
  ${componentStyles.card}
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.sm};
`;

const CardValue = styled.p`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleSlider = styled.span`
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

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${ToggleSlider} {
    background-color: ${colors.primary};
  }

  &:checked + ${ToggleSlider}:before {
    transform: translateX(26px);
  }

  &:checked + ${ToggleSlider} {
    animation: ${pulse} 1.5s infinite;
  }
`;

const ChartContainer = styled.div`
  ${componentStyles.card}
  height: 400px;
`;

const ChartTitle = styled.h2`
  font-size: ${typography.fontSize['2xl']};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.md};
`;

const TooltipContainer = styled.div`
  ${componentStyles.card}
  padding: ${spacing.sm};
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid ${colors.primary};
`;

const TooltipText = styled.p`
  margin: ${spacing.xs} 0;
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
`;

const SmartHomeDashboard = () => {
  const { deviceData, historicalData, handleDeviceControl, loading, error } = useAppContext();
  const [zoomState, setZoomState] = useState(null);

  const formatXAxis = useCallback((tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <TooltipContainer>
          <TooltipText>Time: {date.toLocaleString()}</TooltipText>
          <TooltipText style={{ color: colors.primary }}>
            Temperature: {payload[0].value}°C
          </TooltipText>
          <TooltipText style={{ color: colors.secondary }}>
            Humidity: {payload[1].value}%
          </TooltipText>
        </TooltipContainer>
      );
    }
    return null;
  }, []);

  const handleZoom = useCallback((_, { refAreaLeft, refAreaRight }) => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setZoomState(null);
      return;
    }

    if (refAreaLeft > refAreaRight) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }

    setZoomState([refAreaLeft, refAreaRight]);
  }, []);

  const zoomOut = useCallback(() => {
    setZoomState(null);
  }, []);

  const chartData = useMemo(() => {
    if (zoomState) {
      const [fromIndex, toIndex] = zoomState.map(x => historicalData.findIndex(d => d.time === x));
      return historicalData.slice(fromIndex, toIndex);
    }
    return historicalData;
  }, [historicalData, zoomState]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <ErrorBoundary>
      <DashboardContainer>
        <Title>Smart Home Dashboard</Title>
        <CardGrid>
          <Card>
            <Thermometer size={48} color={colors.primary} />
            <CardTitle>Temperature</CardTitle>
            <CardValue>{deviceData.thermostat.temperature}°C</CardValue>
          </Card>
          <Card>
            <Droplets size={48} color={colors.secondary} />
            <CardTitle>Humidity</CardTitle>
            <CardValue>{deviceData.humidity}%</CardValue>
          </Card>
          <Card>
            <LightbulbIcon size={48} color={deviceData.lights.status ? colors.accent : colors.text.secondary} />
            <CardTitle>Lights</CardTitle>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={deviceData.lights.status}
                onChange={() => handleDeviceControl('lights', 'toggle', !deviceData.lights.status)}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </Card>
          <Card>
            <Lock size={48} color={deviceData.security.status === 'Armed' ? colors.secondary : colors.text.secondary} />
            <CardTitle>Security</CardTitle>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={deviceData.security.status === 'Armed'}
                onChange={() => handleDeviceControl('security', 'toggle', deviceData.security.status === 'Armed' ? 'Disarmed' : 'Armed')}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </Card>
        </CardGrid>
        <ChartContainer>
          <ChartTitle>24-Hour History</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              onMouseDown={(e) => setZoomState([e.activeLabel, e.activeLabel])}
              onMouseMove={(e) => zoomState && setZoomState([zoomState[0], e.activeLabel])}
              onMouseUp={handleZoom}
            >
              <XAxis
                dataKey="time"
                tickFormatter={formatXAxis}
                domain={zoomState || ['dataMin', 'dataMax']}
              />
              <YAxis yAxisId="left" orientation="left" stroke={colors.primary} />
              <YAxis yAxisId="right" orientation="right" stroke={colors.secondary} />
              <Tooltip content={<CustomTooltip />} />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke={colors.primary} dot={false} strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="humidity" stroke={colors.secondary} dot={false} strokeWidth={2} />
              {zoomState && (
                <ReferenceArea
                  yAxisId="left"
                  x1={zoomState[0]}
                  x2={zoomState[1]}
                  strokeOpacity={0.3}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          {zoomState && (
            <button onClick={zoomOut}>Zoom Out</button>
          )}
        </ChartContainer>
      </DashboardContainer>
    </ErrorBoundary>
  );
};

export default SmartHomeDashboard;