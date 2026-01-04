import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import './AdminLayout.css'

const adminMenuItems = [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/admin' },
    { icon: 'UserPlus', label: 'Manajemen PPDB', path: '/admin/ppdb' },
    {
        icon: 'Users',
        label: 'Data Master',
        children: [
            { label: 'Data Siswa', path: '/admin/siswa' },
            { label: 'Data Guru', path: '/admin/guru' },
        ]
    },
    { icon: 'Newspaper', label: 'Berita & Pengumuman', path: '/admin/berita' },
    { icon: 'MessageSquare', label: 'Pesan Masuk', path: '/admin/pesan' },
    { icon: 'Receipt', label: 'Administrasi SPP', path: '/admin/spp' },
    { icon: 'Settings', label: 'Pengaturan', path: '/admin/pengaturan' },
]

function AdminLayout() {
    const token = localStorage.getItem('token');

    // Simple protection: Redirect to login if no token found
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Optional: Check if user is admin based on localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    /* 
    if (user.role !== 'ADMIN') {
        return <Navigate to="/portal" replace />;
    }
    */

    return (
        <div className="admin-layout">
            <Sidebar
                menuItems={adminMenuItems}
                userType="admin"
                userName={user.name || "Administrator"}
                userRole={user.role || "Super Admin"}
            />
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
