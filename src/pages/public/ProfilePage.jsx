import {
    Building2,
    Users,
    Award,
    BookOpen,
    Monitor,
    Microscope,
    Library,
    Dumbbell,
    Music,
    Palette,
    Target,
    Eye,
    Heart
} from 'lucide-react'
import './ProfilePage.css'

function ProfilePage() {
    const facilities = [
        { icon: Monitor, name: 'Lab Komputer', desc: '40 unit komputer modern' },
        { icon: Microscope, name: 'Lab IPA', desc: 'Peralatan lengkap' },
        { icon: Library, name: 'Perpustakaan', desc: '10.000+ koleksi buku' },
        { icon: Dumbbell, name: 'Lapangan Olahraga', desc: 'Indoor & outdoor' },
        { icon: Music, name: 'Ruang Musik', desc: 'Alat musik lengkap' },
        { icon: Palette, name: 'Ruang Seni', desc: 'Studio kreatif' },
    ]

    const achievements = [
        { year: '2024', title: 'Juara 1 OSN Matematika Tingkat Provinsi', level: 'Provinsi' },
        { year: '2024', title: 'Medali Emas Olimpiade Fisika', level: 'Nasional' },
        { year: '2024', title: 'Juara Umum Lomba Debat Bahasa Inggris', level: 'Nasional' },
        { year: '2023', title: 'Finalis Kompetisi Robotik Indonesia', level: 'Nasional' },
        { year: '2023', title: 'Juara 1 Festival Seni Pelajar', level: 'Provinsi' },
        { year: '2023', title: 'Best School Award', level: 'Kota' },
    ]

    return (
        <div className="profile-page">
            {/* Hero */}
            <section className="profile-hero">
                <div className="container">
                    <span className="section-badge">Tentang Kami</span>
                    <h1>Profil SMA Negeri 1</h1>
                    <p>Mengenal lebih dekat sekolah unggulan dengan tradisi prestasi yang gemilang</p>
                </div>
            </section>

            {/* About Section */}
            <section className="section about-school">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-image">
                            <div className="image-placeholder">
                                <Building2 size={60} />
                                <span>Gedung Sekolah</span>
                            </div>
                        </div>
                        <div className="about-content">
                            <h2>Sejarah & Identitas Sekolah</h2>
                            <p>
                                SMA Negeri 1 didirikan pada tahun 1974 sebagai salah satu sekolah menengah atas unggulan
                                di Indonesia. Selama lebih dari 50 tahun, kami telah menghasilkan ribuan alumni yang sukses
                                di berbagai bidang, mulai dari akademisi, profesional, hingga pengusaha.
                            </p>
                            <p>
                                Dengan mengusung motto "Excellence in Education", kami berkomitmen untuk memberikan
                                pendidikan berkualitas yang tidak hanya mengembangkan kecerdasan intelektual, tetapi juga
                                membentuk karakter dan kepribadian yang unggul.
                            </p>
                            <div className="about-stats">
                                <div className="about-stat">
                                    <span className="stat-number">50+</span>
                                    <span className="stat-text">Tahun Berdiri</span>
                                </div>
                                <div className="about-stat">
                                    <span className="stat-number">15.000+</span>
                                    <span className="stat-text">Alumni</span>
                                </div>
                                <div className="about-stat">
                                    <span className="stat-number">A</span>
                                    <span className="stat-text">Akreditasi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section vision-mission">
                <div className="container">
                    <div className="vm-grid">
                        <div className="vm-card vision">
                            <div className="vm-icon">
                                <Eye size={32} />
                            </div>
                            <h3>Visi</h3>
                            <p>
                                Menjadi sekolah unggulan yang menghasilkan lulusan beriman, berilmu, berkarakter,
                                dan berwawasan global serta mampu berkompetisi di era modern.
                            </p>
                        </div>
                        <div className="vm-card mission">
                            <div className="vm-icon">
                                <Target size={32} />
                            </div>
                            <h3>Misi</h3>
                            <ul>
                                <li>Menyelenggarakan pendidikan yang bermutu dan inovatif</li>
                                <li>Mengembangkan potensi peserta didik secara optimal</li>
                                <li>Membangun karakter dan akhlak mulia</li>
                                <li>Menciptakan lingkungan belajar yang kondusif</li>
                                <li>Membekali siswa dengan keterampilan abad 21</li>
                            </ul>
                        </div>
                        <div className="vm-card values">
                            <div className="vm-icon">
                                <Heart size={32} />
                            </div>
                            <h3>Nilai-Nilai</h3>
                            <div className="values-list">
                                <span className="value-tag">Integritas</span>
                                <span className="value-tag">Inovasi</span>
                                <span className="value-tag">Kolaborasi</span>
                                <span className="value-tag">Keunggulan</span>
                                <span className="value-tag">Peduli</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <section className="section facilities-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-badge">Fasilitas</span>
                        <h2>Sarana & Prasarana</h2>
                        <p className="section-subtitle">
                            Fasilitas lengkap untuk mendukung proses pembelajaran yang optimal
                        </p>
                    </div>
                    <div className="facilities-grid">
                        {facilities.map((facility, index) => (
                            <div key={index} className="facility-card card">
                                <div className="facility-icon">
                                    <facility.icon size={28} />
                                </div>
                                <h4>{facility.name}</h4>
                                <p>{facility.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="section achievements-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-badge">Prestasi</span>
                        <h2>Prestasi Terbaru</h2>
                        <p className="section-subtitle">
                            Pencapaian gemilang yang diraih oleh siswa-siswi kami
                        </p>
                    </div>
                    <div className="achievements-timeline">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="achievement-item">
                                <div className="achievement-year">{achievement.year}</div>
                                <div className="achievement-content">
                                    <span className={`achievement-level ${achievement.level.toLowerCase()}`}>
                                        {achievement.level}
                                    </span>
                                    <h4>{achievement.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Placeholder */}
            <section className="section gallery-section">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="section-badge">Galeri</span>
                        <h2>Galeri Foto</h2>
                        <p className="section-subtitle">
                            Dokumentasi kegiatan dan aktivitas sekolah
                        </p>
                    </div>
                    <div className="gallery-grid">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="gallery-item">
                                <div className="gallery-placeholder">
                                    <Building2 size={32} />
                                    <span>Foto {item}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProfilePage
