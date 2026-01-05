import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Users, UserPlus, Newspaper, Receipt, ArrowRight, TrendingUp, AlertCircle, CheckCircle, Globe, Home, User, Phone } from 'lucide-react'
import { studentsData, paymentsData } from '../../data/mockData'
import './AdminDashboard.css'
import API_BASE_URL from '../../config/api'

function AdminDashboard() {
    const [ppdbCount, setPpdbCount] = useState(0)
    const [ppdbPending, setPpdbPending] = useState(0)
    const [recentPPDB, setRecentPPDB] = useState([])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/ppdb`)
                if (response.ok) {
                    const data = await response.json()
                    setPpdbCount(data.length)
                    setPpdbPending(data.filter(p => p.status === 'PENDING').length)
                    setRecentPPDB(data.slice(0, 5))
                }
            } catch (error) {
                console.error("Failed to fetch stats", error)
            }
        }
        fetchStats()
    }, [])

    const totalStudents = studentsData.length
    const totalPaid = paymentsData.filter(p => p.status === 'Lunas').length
    const totalPending = paymentsData.filter(p => p.status !== 'Lunas').length

    const stats = [
        { icon: UserPlus, label: 'Pendaftar PPDB', value: ppdbCount, sub: `${ppdbPending} menunggu verifikasi`, color: 'blue', link: '/admin/ppdb' },
        { icon: Users, label: 'Total Siswa', value: totalStudents, sub: 'Siswa aktif', color: 'green', link: '/admin/siswa' },
        { icon: Newspaper, label: 'Berita', value: 5, sub: 'Artikel dipublikasi', color: 'purple', link: '/admin/berita' },
        { icon: Receipt, label: 'Pembayaran SPP', value: `${totalPaid}/${totalPaid + totalPending}`, sub: 'Lunas bulan ini', color: 'gold', link: '/admin/spp' },
    ]

    const shortcuts = [
        { icon: Home, label: 'Beranda', path: '/' },
        { icon: User, label: 'Profil Sekolah', path: '/profil' },
        { icon: Newspaper, label: 'Berita', path: '/berita' },
        { icon: Users, label: 'PPDB Online', path: '/ppdb' },
        { icon: Phone, label: 'Kontak', path: '/kontak' },
    ]

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Admin</h1>
                    <p>Selamat datang di panel administrasi SMA Negeri 1</p>
                </div>
                <Link to="/" target="_blank" className="btn btn-outline">
                    <Globe size={18} /> Lihat Website
                </Link>
            </div>

            <div className="admin-stats">
                {stats.map((stat, i) => (
                    <Link key={i} to={stat.link} className={`admin-stat-card ${stat.color}`}>
                        <div className="stat-icon"><stat.icon size={24} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-sub">{stat.sub}</span>
                        </div>
                        <ArrowRight size={20} className="stat-arrow" />
                    </Link>
                ))}
            </div>

            <h3 className="section-title" style={{ margin: '2rem 0 1rem' }}>Akses Cepat Website</h3>
            <div className="dashboard-shortcuts">
                {shortcuts.map((item, index) => (
                    <Link key={index} to={item.path} target="_blank" className="shortcut-card">
                        <div className="shortcut-icon">
                            <item.icon size={24} />
                        </div>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="admin-grid">
                <div className="card admin-card">
                    <div className="card-header"><h3>Pendaftar PPDB Terbaru</h3><Link to="/admin/ppdb" className="view-all">Kelola <ArrowRight size={16} /></Link></div>
                    <div className="table-container">
                        <table className="table">
                            <thead><tr><th>Nama</th><th>Asal Sekolah</th><th>Status</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {recentPPDB.length > 0 ? recentPPDB.map((p) => (
                                    <tr key={p.id}>
                                        <td><strong>{p.fullName}</strong><br /><small>{p.registrationId}</small></td>
                                        <td>{p.previousSchool}</td>
                                        <td>
                                            <span className={`status-tag ${p.status === 'ACCEPTED' ? 'success' :
                                                p.status === 'PENDING' ? 'warning' : 'danger'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td><Link to="/admin/ppdb" className="btn btn-sm btn-primary">Lihat</Link></td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="text-center">Belum ada data terbaru</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card admin-card">
                    <div className="card-header"><h3>Ringkasan SPP</h3><Link to="/admin/spp" className="view-all">Detail <ArrowRight size={16} /></Link></div>
                    <div className="spp-summary-grid">
                        <div className="spp-box success"><CheckCircle size={20} /><span className="value">{totalPaid}</span><span className="label">Lunas</span></div>
                        <div className="spp-box danger"><AlertCircle size={20} /><span className="value">{totalPending}</span><span className="label">Belum Bayar</span></div>
                    </div>
                    <div className="spp-progress">
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${(totalPaid / (totalPaid + totalPending)) * 100}%` }}></div></div>
                        <span className="progress-text">{Math.round((totalPaid / (totalPaid + totalPending)) * 100)}% tingkat kelulusan pembayaran</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
