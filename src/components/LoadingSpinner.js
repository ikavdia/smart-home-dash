import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors, spacing } from '../styles/designSystem';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: ${spacing.xl};
`;

const Spinner = styled.div`
  border: 4px solid ${colors.background};
  border-top: 4px solid ${colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner = () => (
  <SpinnerContainer>
    <Spinner />
  </SpinnerContainer>
);

export default LoadingSpinner;