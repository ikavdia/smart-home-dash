// src/components/Login.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { colors, typography, spacing, componentStyles } from '../styles/designSystem';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${colors.background};
`;

const LoginCard = styled.div`
  ${componentStyles.card}
  width: 100%;
  max-width: 400px;
  padding: ${spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  color: ${colors.text.primary};
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const Input = styled.input`
  ${componentStyles.input}
`;

const Button = styled.button`
  ${componentStyles.button}
  background-color: ${colors.primary};
  color: ${colors.white};
  font-weight: ${typography.fontWeight.medium};
  
  &:hover {
    background-color: ${colors.secondary};
  }
`;

const ErrorMessage = styled.p`
  color: ${colors.accent};
  font-size: ${typography.fontSize.sm};
  text-align: center;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Sign in to SmartHome</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Sign in</Button>
        </Form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;