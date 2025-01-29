import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';
import { useState, useEffect, ReactNode } from 'react';
import App from '../App';
import Home from '../pages/Home';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../pages/NotFound';
import { API_BASE_URL } from '../config';
import Calender from '../components/Calender';
import Loading from '../components/Loading';

// Types and Interfaces
interface AuthWrapperProps {
  children: ReactNode;
}

interface UserResponse {
  id: string;
  // Add other user properties you expect from the API
  [key: string]: any;
}

interface ApiError {
  message: string;
  [key: string]: any;
}

// AuthWrapper component with TypeScript
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const params = useParams<{ access_token: string }>();
  const access_token = params.access_token;

  useEffect(() => {
    const validateUser = async (): Promise<void> => {
      try {
        if (!access_token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/user/me-new`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        });

        if (response.ok) {
          await response.json();
          setIsAuthenticated(true);
        } else {
          const errorData: ApiError = await response.json().catch(() => ({
            message: 'Unknown error occurred'
          }));
          console.error('Authentication failed:', errorData.message);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication error:', error instanceof Error ? error.message : 'Unknown error');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateUser();
  }, [access_token]);

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return isAuthenticated ? <>{children}</> : <NotFound />;
};

// Router configuration with explicit types
const router: RouteObject[] = [
  {
    path: '/:access_token',
    element: (
      <AuthWrapper>
        <MainLayout>
          <App />
        </MainLayout>
      </AuthWrapper>
    ),
    children: [
      { 
        path: '', // This matches exactly /:access_token
        element: <Home /> 
      },
      { 
        path: '/:access_token/meeting', // Remove the leading slash to make it relative
        element: <Calender /> 
      },
      
    ],
  },
  { 
    path: '*', 
    element: <NotFound /> 
  },
  { 
    path: '/success', // Remove the leading slash to make it relative
    element: <Loading />
  },
];

export default createBrowserRouter(router);