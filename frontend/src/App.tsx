import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="documents" element={<div className="p-8 text-white">Documents View (Coming Soon)</div>} />
          <Route path="vectors" element={<div className="p-8 text-white">Vector Store Details (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-8 text-white">Settings View (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
