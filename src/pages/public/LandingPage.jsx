import { Link } from 'react-router-dom'
import {
    ArrowRight,
    Users,
    Award,
    BookOpen,
    Building2,
    Trophy,
    GraduationCap,
    HeartHandshake,
    Calendar,
    Clock
} from 'lucide-react'
import './LandingPage.css'
import { newsData } from '../../data/mockData'

import { useSettings } from '../../hooks/useSettings'

function LandingPage() {
    const { settings } = useSettings()
    const schoolName = settings?.schoolName || 'SMA Negeri 1'

    const stats = [
        { icon: Users, value: '520+', label: 'Siswa Aktif' },
        { icon: GraduationCap, value: '52', label: 'Tenaga Pengajar' },
        { icon: Award, value: '25+', label: 'Ekstrakurikuler' },
        { icon: Trophy, value: '95%', label: 'Tingkat Kelulusan' },
    ]

    const features = [
        {
            icon: BookOpen,
            title: 'Kurikulum Modern',
            description: 'Menerapkan Kurikulum Merdeka dengan pendekatan pembelajaran yang inovatif dan berpusat pada siswa.'
        },
        {
            icon: Trophy,
            title: 'Prestasi Gemilang',
            description: 'Meraih berbagai penghargaan di tingkat nasional dan internasional dalam bidang akademik maupun non-akademik.'
        },
        {
            icon: Building2,
            title: 'Fasilitas Lengkap',
            description: 'Dilengkapi laboratorium, perpustakaan digital, lapangan olahraga, dan ruang multimedia berstandar tinggi.'
        },
        {
            icon: HeartHandshake,
            title: 'Pembinaan Karakter',
            description: 'Program pembentukan karakter yang terintegrasi untuk mencetak generasi berakhlak mulia.'
        },
    ]

    const upcomingEvents = [
        { date: '15 Jan', title: 'Pembukaan PPDB 2025', time: '08:00 WIB' },
        { date: '20 Jan', title: 'Ujian Semester Genap', time: '07:30 WIB' },
        { date: '25 Jan', title: 'Rapat Orang Tua', time: '09:00 WIB' },
    ]

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background">
                    <div className="hero-pattern"></div>
                    <div className="hero-gradient"></div>
                </div>
                <div className="container hero-container">
                    <div className="hero-content">
                        <span className="hero-badge">
                            <Award size={16} />
                            Sekolah Unggulan Terakreditasi A
                        </span>
                        <h1 className="hero-title">
                            Membentuk Generasi <span className="text-gradient">Unggul</span> dan Berkarakter
                        </h1>
                        <p className="hero-description">
                            {schoolName} berkomitmen untuk mencetak lulusan yang tidak hanya cerdas secara akademis,
                            tetapi juga memiliki integritas, kreativitas, dan kepedulian sosial yang tinggi.
                        </p>
                        <div className="hero-actions">
                            <Link to="/ppdb" className="btn btn-primary btn-lg">
                                Daftar Sekarang
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="btn btn-white btn-lg">
                                Login Portal
                            </Link>
                            <Link to="/profil" className="btn btn-secondary btn-lg">
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-image-wrapper">
                            <div className="hero-image-placeholder">
                                <GraduationCap size={80} />
                                <span>Masa Depan Cerah</span>
                            </div>
                        </div>
                        <div className="hero-float-card float-card-1">
                            <Users size={20} />
                            <span>500+ Siswa Berprestasi</span>
                        </div>
                        <div className="hero-float-card float-card-2">
                            <Trophy size={20} />
                            <span>50+ Penghargaan</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="stat-icon">
                                    <stat.icon size={28} />
                                </div>
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="section about-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-badge">Tentang Kami</span>
                        <h2>Mengapa Memilih {schoolName}?</h2>
                        <p className="section-subtitle">
                            Kami menyediakan lingkungan belajar yang kondusif dengan berbagai keunggulan
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card">
                                <div className="feature-icon">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Section */}
            <section className="section news-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <span className="section-badge">Berita & Informasi</span>
                            <h2>Berita Terbaru</h2>
                        </div>
                        <Link to="/berita" className="btn btn-secondary">
                            Lihat Semua
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                    <div className="news-grid">
                        {newsData.slice(0, 3).map((news) => (
                            <article key={news.id} className="news-card card">
                                <div className="news-image">
                                    <div className="news-image-placeholder">
                                        <BookOpen size={40} />
                                    </div>
                                    <span className="news-category">{news.category}</span>
                                </div>
                                <div className="news-content">
                                    <div className="news-meta">
                                        <Calendar size={14} />
                                        <span>{news.date}</span>
                                    </div>
                                    <h3 className="news-title">{news.title}</h3>
                                    <p className="news-excerpt">{news.excerpt}</p>
                                    <Link to={`/berita/${news.id}`} className="news-link">
                                        Baca Selengkapnya
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="section events-section">
                <div className="container">
                    <div className="events-wrapper">
                        <div className="events-content">
                            <span className="section-badge">Agenda</span>
                            <h2>Kegiatan Mendatang</h2>
                            <p className="section-subtitle">
                                Jadwal kegiatan penting yang akan datang di sekolah kami
                            </p>
                            <Link to="/portal/kalender" className="btn btn-primary">
                                Lihat Kalender Lengkap
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="events-list">
                            {upcomingEvents.map((event, index) => (
                                <div key={index} className="event-card">
                                    <div className="event-date">
                                        <span className="event-day">{event.date.split(' ')[0]}</span>
                                        <span className="event-month">{event.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="event-info">
                                        <h4 className="event-title">{event.title}</h4>
                                        <div className="event-time">
                                            <Clock size={14} />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Siap Bergabung dengan Keluarga {schoolName}?</h2>
                        <p>Pendaftaran Peserta Didik Baru (PPDB) tahun ajaran 2025/2026 telah dibuka!</p>
                        <div className="cta-actions">
                            <Link to="/ppdb" className="btn btn-primary btn-lg">
                                Daftar PPDB Online
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/kontak" className="btn btn-ghost btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
