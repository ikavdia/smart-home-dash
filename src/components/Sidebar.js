// src/components/Sidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Home, Settings, LogOut } from 'lucide-react';
import { colors, typography, breakpoints } from '../styles/designSystem';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  background-color: ${colors.white};
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  @media (max-width: ${breakpoints.md}) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background-color: ${colors.primary};
  color: ${colors.white};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem;
  color: ${({ isActive }) => (isActive ? colors.primary : colors.text.secondary)};
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.background};
  }
`;

const Icon = styled.span`
  margin-right: 1rem;
`;

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <SidebarContainer isOpen={isOpen}>
      <Logo>SmartHome</Logo>
      <NavList>
        <NavItem>
          <NavLink to="/" isActive={isActive('/')}>
            <Icon><Home size={20} /></Icon>
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/settings" isActive={isActive('/settings')}>
            <Icon><Settings size={20} /></Icon>
            Settings
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/logout" onClick={(e) => e.preventDefault()}>
            <Icon><LogOut size={20} /></Icon>
            Logout
          </NavLink>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;