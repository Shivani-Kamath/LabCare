import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import LabInchargeDashboard from './pages/LabInchargeDashboard';
import LabAnalyticsDashboard from './pages/LabAnalyticsDashboard';
import StudentChatbot from './pages/StudentChatbot';
import PredictFaultPage from './pages/PredictFaultPage'; // ✅
import ImagePredictor from './pages/ImagePredictor';
import PredictRandM from './pages/predictrandm';
import AdminDashboard from './pages/AdminDashboard';
import InventoryPage from './pages/InventoryPage';
import RepairsPage from './pages/RepairsPage';
// Navbar and Footer removed as per requirements

function AppShell() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/chatbot" element={<StudentChatbot />} />
        <Route path="/student/image-predictor" element={<ImagePredictor />} />
        <Route path="/technician" element={<TechnicianDashboard />} />
        <Route path="/labincharge" element={<LabInchargeDashboard />} />
        <Route path="/labincharge/analytics" element={<LabAnalyticsDashboard />} />
        <Route path="/labincharge/predict" element={<PredictRandM />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/technician/inventory" element={<InventoryPage />} />
        <Route path="/technician/repairs" element={<RepairsPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
export default App;
