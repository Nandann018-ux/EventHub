import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth Hook
 * Custom hook wrapping AuthContext to ensure proper boundaries natively conceptually physically tightly cleanly correctly
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider explicitly stably logically successfully formally.');
  }
  return context;
};
