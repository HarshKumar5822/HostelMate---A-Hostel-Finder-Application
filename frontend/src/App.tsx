import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PreferencesProvider } from './hooks/usePreferences';
import { CollectionsProvider } from './hooks/useCollections';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import OwnerLayout from './components/layout/OwnerLayout';

import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import MapPage from './pages/MapPage';
import HostelDetails from './pages/HostelDetails';
import Compare from './pages/Compare';
import Saved from './pages/Saved';
import Insights from './pages/Insights';
import CityPage from './pages/CityPage';
import Profile from './pages/Profile';
import AIAssistantPage from './pages/AIAssistantPage';
import EnquirePage from './pages/EnquirePage';
import Login from './pages/Login';
import Signup from './pages/Signup';

import OwnerOverview from './pages/owner/OwnerOverview';
import OwnerHostels from './pages/owner/OwnerHostels';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';
import OwnerAddHostel from './pages/owner/OwnerAddHostel';

export default function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <CollectionsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route element={<AppShell />}>
                <Route path="/" element={<Landing />} />
                <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
                <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                <Route path="/hostel/:id" element={<ProtectedRoute><HostelDetails /></ProtectedRoute>} />
                <Route path="/enquire/:id" element={<ProtectedRoute><EnquirePage /></ProtectedRoute>} />
                <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
                <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                <Route path="/city/:city" element={<ProtectedRoute><CityPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
              </Route>

              <Route path="/owner" element={<OwnerLayout />}>
                <Route index element={<OwnerOverview />} />
                <Route path="hostels" element={<OwnerHostels />} />
                <Route path="analytics" element={<OwnerAnalytics />} />
                <Route path="add-hostel" element={<OwnerAddHostel />} />
              </Route>

              <Route path="*" element={<Landing />} />
            </Routes>
          </BrowserRouter>
        </CollectionsProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}
