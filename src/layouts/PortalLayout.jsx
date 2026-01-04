import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import './PortalLayout.css'

const portalMenuItems = [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/portal' },
    { icon: 'Megaphone', label: 'Pengumuman', path: '/portal/pengumuman' },
    { icon: 'Calendar', label: 'Kalender Akademik', path: '/portal/kalender' },
    { icon: 'Wallet', label: 'Status SPP', path: '/portal/spp' },
    { icon: 'Newspaper', label: 'Digital Mading', path: '/portal/mading' },
]

function PortalLayout() {
    const token = localStorage.getItem('token');

    // Redirect to login if no token found
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="portal-layout">
            <Sidebar
                menuItems={portalMenuItems}
                userType="portal"
                userName={user.name || "Siswa"}
                userRole={user.role === 'STUDENT' ? "Siswa" : "User Portal"}
            />
            <main className="portal-main">
                <Outlet />
            </main>
        </div>
    )
}

export default PortalLayout
