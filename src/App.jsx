import { Routes, Route } from 'react-router-dom'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import PortalLayout from './layouts/PortalLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import PPDBPage from './pages/public/PPDBPage'
import ProfilePage from './pages/public/ProfilePage'
import NewsPage from './pages/public/NewsPage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

// Portal Pages
import PortalDashboard from './pages/portal/PortalDashboard'
import AnnouncementsPage from './pages/portal/AnnouncementsPage'
import CalendarPage from './pages/portal/CalendarPage'
import SPPStatusPage from './pages/portal/SPPStatusPage'
import DigitalMadingPage from './pages/portal/DigitalMadingPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import PPDBManagement from './pages/admin/PPDBManagement'
import DataSiswa from './pages/admin/DataSiswa'
import DataGuru from './pages/admin/DataGuru'
import NewsManagement from './pages/admin/NewsManagement'
import ContactManagement from './pages/admin/ContactManagement'
import SPPManagement from './pages/admin/SPPManagement'
import SettingsPage from './pages/admin/SettingsPage'

import { ToastProvider } from './components/ui/Toast'

function App() {
    return (
        <ToastProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<LandingPage />} />
                    <Route path="ppdb" element={<PPDBPage />} />
                    <Route path="profil" element={<ProfilePage />} />
                    <Route path="berita" element={<NewsPage />} />
                    <Route path="kontak" element={<ContactPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                {/* Portal (Siswa/Orang Tua) Routes */}
                <Route path="/portal" element={<PortalLayout />}>
                    <Route index element={<PortalDashboard />} />
                    <Route path="pengumuman" element={<AnnouncementsPage />} />
                    <Route path="kalender" element={<CalendarPage />} />
                    <Route path="spp" element={<SPPStatusPage />} />
                    <Route path="mading" element={<DigitalMadingPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="ppdb" element={<PPDBManagement />} />
                    <Route path="siswa" element={<DataSiswa />} />
                    <Route path="guru" element={<DataGuru />} />
                    <Route path="berita" element={<NewsManagement />} />
                    <Route path="pesan" element={<ContactManagement />} />
                    <Route path="spp" element={<SPPManagement />} />
                    <Route path="pengaturan" element={<SettingsPage />} />
                </Route>
            </Routes>
        </ToastProvider>
    )
}

export default App
