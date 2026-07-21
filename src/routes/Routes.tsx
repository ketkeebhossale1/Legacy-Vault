import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './ProtectedRoute'
import SidebarLayout from '../layouts/SidebarLayout'
import AuthLayout from '../layouts/AuthLayout'
import PublicLayout from '../layouts/PublicLayout'

import LandingPage from '../pages/LandingPage'
import AuthPage from '../components/AuthPage'
import ForgotPassword from '../pages/ForgotPassword'
import HomePage from '../components/HomePage'
import MyLegacy from '../pages/MyLegacy'
import DigitalWill from '../pages/DigitalWill'
import AIAdvisor from '../pages/AIAdvisor'
import ActivityLogs from '../pages/ActivityLogs'
import Settings from '../pages/Settings'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Terms from '../pages/Terms'
import Contact from '../pages/Contact'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<PublicLayout />}>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<AuthPage mode="signin" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-legacy" element={<MyLegacy />} />
        <Route path="/digital-will" element={<DigitalWill />} />
        <Route path="/ai-advisor" element={<AIAdvisor />} />
        <Route path="/activity" element={<ActivityLogs />} />
        <Route path="/settings" element={<Settings />} />

        {/* Legacy redirects */}
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        <Route path="/nominees" element={<Navigate to="/my-legacy" replace />} />
        <Route path="/vault" element={<Navigate to="/my-legacy" replace />} />
        <Route path="/will" element={<Navigate to="/digital-will" replace />} />
        <Route path="/reminders" element={<Navigate to="/activity" replace />} />
        <Route path="/access-requests" element={<Navigate to="/home" replace />} />
        <Route path="/verify" element={<Navigate to="/home" replace />} />
        <Route path="/security-centre" element={<Navigate to="/home" replace />} />
        <Route path="/security" element={<Navigate to="/home" replace />} />
        <Route path="/collaborate" element={<Navigate to="/ai-advisor" replace />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />
        <Route path="/help" element={<Navigate to="/settings" replace />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
