import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  AuthContextType,
  User,
  LoginCredentials,
  LoginResult,
} from '../types/auth';
import { loginAPI } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkExistingToken();
  }, []);

  const checkExistingToken = async (): Promise<void> => {
    try {
      const token = await EncryptedStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await loginAPI(credentials);

      if (response.token) {
        await EncryptedStorage.setItem('userToken', response.token);
        setUserToken(response.token);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await EncryptedStorage.removeItem('userToken');
      setUserToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    userToken,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
