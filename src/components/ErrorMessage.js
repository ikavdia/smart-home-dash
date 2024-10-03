import React from 'react';
import styled from 'styled-components';
import { colors, typography, spacing, componentStyles } from '../styles/designSystem';
import { AlertCircle } from 'lucide-react';

const ErrorContainer = styled.div`
  ${componentStyles.card}
  background-color: ${colors.accent};
  color: ${colors.white};
  padding: ${spacing.md};
  margin: ${spacing.md} 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const ErrorIcon = styled(AlertCircle)`
  margin-right: ${spacing.sm};
`;

const ErrorText = styled.p`
  font-size: ${typography.fontSize.base};
  margin: 0;
`;

const ErrorMessage = ({ message }) => (
  <ErrorContainer>
    <ErrorIcon size={24} />
    <ErrorText>{message}</ErrorText>
  </ErrorContainer>
);

export default ErrorMessage;