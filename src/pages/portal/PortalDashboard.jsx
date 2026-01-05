import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Calendar, Wallet, Newspaper, ArrowRight, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { announcementsData, calendarEvents } from '../../data/mockData'
import './PortalDashboard.css'
import API_BASE_URL from '../../config/api'

function PortalDashboard() {
    // const recentPayments = paymentsData.filter(p => p.studentId === 1).slice(0, 3)
    const upcomingEvents = calendarEvents.slice(0, 3)
    const [recentPayments, setRecentPayments] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        fetchPayments();
    }, [])

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_BASE_URL}/api/spp/my-payments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setRecentPayments(data.slice(0, 3)) // Take top 3
            }
        } catch (error) {
            console.error("Error fetching payments:", error)
        }
    }

    const currentMonthStatus = recentPayments.length > 0 && recentPayments[0].month === new Date().toLocaleString('default', { month: 'long' })
        ? recentPayments[0].status
        : 'Belum Lunas'

    return (
        <div className="portal-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Selamat Datang, {user.name || 'Siswa'}! 👋</h1>
                    <p>Pantau informasi terbaru dan status akademik Anda di sini.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main">
                    {/* Quick Stats */}
                    <div className="quick-stats">
                        <div className="stat-box">
                            <div className="stat-icon announcement"><Bell size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-value">3</span>
                                <span className="stat-label">Pengumuman Baru</span>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-icon calendar"><Calendar size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-value">2</span>
                                <span className="stat-label">Agenda Minggu Ini</span>
                            </div>
                        </div>
                        <div className="stat-box">
                            <div className={`stat-icon payment ${currentMonthStatus === 'PAID' ? 'success' : 'warning'}`}><Wallet size={24} /></div>
                            <div className="stat-info">
                                <span className="stat-value">{currentMonthStatus === 'PAID' ? 'Lunas' : 'Belum'}</span>
                                <span className="stat-label">Status SPP Terakhir</span>
                            </div>
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className="card dashboard-card">
                        <div className="card-header">
                            <h3><Bell size={20} /> Pengumuman Terbaru</h3>
                            <Link to="/portal/pengumuman" className="view-all">Lihat Semua <ArrowRight size={16} /></Link>
                        </div>
                        <div className="announcement-list">
                            {announcementsData.slice(0, 3).map((ann) => (
                                <div key={ann.id} className={`announcement-item ${ann.priority}`}>
                                    <div className="announcement-content">
                                        <span className={`announcement-cat ${ann.category.toLowerCase().replace(' ', '-')}`}>{ann.category}</span>
                                        <h4>{ann.title}</h4>
                                        <p>{ann.content}</p>
                                    </div>
                                    <span className="announcement-date">{ann.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dashboard-sidebar">
                    {/* SPP Status */}
                    <div className="card dashboard-card">
                        <div className="card-header">
                            <h3><Wallet size={20} /> Status SPP</h3>
                            <Link to="/portal/spp" className="view-all">Detail <ArrowRight size={16} /></Link>
                        </div>
                        <div className="spp-list">
                            {recentPayments.length > 0 ? recentPayments.map((pay) => (
                                <div key={pay.id} className="spp-item">
                                    <div className="spp-info">
                                        <span className="spp-month">{pay.month} {pay.year}</span>
                                        <span className="spp-amount">Rp {pay.amount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <span className={`spp-status ${pay.status === 'PAID' ? 'paid' : 'pending'}`}>
                                        {pay.status === 'PAID' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {pay.status === 'PAID' ? 'Lunas' : 'Pending'}
                                    </span>
                                </div>
                            )) : <div className="text-center p-4">Belum ada data pembayaran</div>}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="card dashboard-card">
                        <div className="card-header">
                            <h3><Calendar size={20} /> Agenda Terdekat</h3>
                            <Link to="/portal/kalender" className="view-all">Lihat Semua <ArrowRight size={16} /></Link>
                        </div>
                        <div className="events-list">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="event-item">
                                    <div className={`event-type ${event.type}`}><Clock size={16} /></div>
                                    <div className="event-info">
                                        <span className="event-title">{event.title}</span>
                                        <span className="event-date">{event.startDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortalDashboard
