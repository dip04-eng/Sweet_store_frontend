import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
