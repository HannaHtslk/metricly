import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { getTheme } from './theme/theme';
import { auth } from './firebase/firebase';
import { setUser } from './store/authSlice';
import LandingPage from './pages/Landing/LandingPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import UsersPage from './pages/Users/UsersPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }),
        );
      } else {
        dispatch(setUser(null));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return null;
}

function AppRoutes({ onToggleTheme }: { onToggleTheme: () => void }) {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout onToggleTheme={onToggleTheme} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <BrowserRouter>
        <AuthListener />
        <AppRoutes onToggleTheme={toggleTheme} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
