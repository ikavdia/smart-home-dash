import React from 'react';
import styled from 'styled-components';
import { colors, typography, spacing } from '../styles/designSystem';

const ErrorContainer = styled.div`
  background-color: ${colors.accent};
  color: ${colors.white};
  padding: ${spacing.lg};
  margin: ${spacing.md} 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ErrorTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  margin-bottom: ${spacing.sm};
`;

const ErrorMessage = styled.p`
  font-size: ${typography.fontSize.base};
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Oops! Something went wrong.</ErrorTitle>
          <ErrorMessage>{this.state.error.toString()}</ErrorMessage>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;