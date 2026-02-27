import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

interface AppLayoutProps {
  onToggleTheme: () => void;
}

const AppLayout = ({ onToggleTheme }: AppLayoutProps) => {
  return (
    <>
      <Navbar onToggleTheme={onToggleTheme} />
      <Outlet />
    </>
  );
};

export default AppLayout;
