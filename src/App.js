import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Sidebar, Dashboard, Settings, Login } from './components';
import { AppProvider, useAppContext } from './context/AppContext';
import { GlobalStyle, colors, breakpoints } from './styles/designSystem';
import ErrorBoundary from './components/ErrorBoundary';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: ${colors.background};
  transition: margin-left 0.3s ease;

  @media (max-width: ${breakpoints.md}) {
    margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '250px' : '0')};
  }
`;

const MenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  background-color: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.secondary};
  }

  @media (max-width: ${breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function AppContent() {
  const { isAuthenticated } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <AppContainer>
        <Sidebar isOpen={isSidebarOpen} />
        <MenuButton onClick={toggleSidebar}>
          {isSidebarOpen ? '×' : '☰'}
        </MenuButton>
        <MainContent isSidebarOpen={isSidebarOpen}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <GlobalStyle />
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}

export default App;