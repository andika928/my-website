import { Link } from 'react-router-dom'
import {
    GraduationCap,
    MapPin,
    Phone,
    Mail,
    Clock,
    Facebook,
    Instagram,
    Youtube,
    ArrowRight
} from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import './Footer.css'

const quickLinks = [
    { label: 'Tentang Kami', path: '/profil' },
    { label: 'PPDB Online', path: '/ppdb' },
    { label: 'Berita Terbaru', path: '/berita' },
    { label: 'Hubungi Kami', path: '/kontak' },
]

const academicLinks = [
    { label: 'Download Center', path: '/berita' }, // Adjusted remaining links
    { label: 'FAQ', path: '/kontak' },
]

function Footer() {
    const { settings } = useSettings()

    return (
        <footer className="footer">
            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand Column */}
                        <div className="footer-brand">
                            <Link to="/" className="footer-logo">
                                <div className="footer-logo-icon">
                                    <GraduationCap size={28} />
                                </div>
                                <div className="footer-logo-text">
                                    <span className="footer-logo-title">{settings?.schoolName || 'SMA Negeri 1'}</span>
                                    <span className="footer-logo-tagline">Excellence in Education</span>
                                </div>
                            </Link>
                            <p className="footer-description">
                                Membentuk generasi unggul yang berkarakter, berprestasi, dan siap menghadapi tantangan masa depan dengan bekal ilmu pengetahuan dan akhlak mulia.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="social-link" aria-label="YouTube">
                                    <Youtube size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Tautan Cepat</h4>
                            <ul className="footer-links">
                                {quickLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer-link">
                                            <ArrowRight size={14} />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Academic Links */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Akademik</h4>
                            <ul className="footer-links">
                                {academicLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer-link">
                                            <ArrowRight size={14} />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-column">
                            <h4 className="footer-heading">Kontak Kami</h4>
                            <ul className="footer-contact">
                                <li>
                                    <MapPin size={18} />
                                    <span>{settings?.schoolAddress || 'Jl. Pendidikan No. 123, Kota Contoh'}</span>
                                </li>
                                <li>
                                    <Phone size={18} />
                                    <span>{settings?.schoolPhone || '(021) 1234-5678'}</span>
                                </li>
                                <li>
                                    <Mail size={18} />
                                    <span>{settings?.schoolEmail || 'info@sekolah.sch.id'}</span>
                                </li>
                                <li>
                                    <Clock size={18} />
                                    <span>Senin - Jumat: 07.00 - 15.00 WIB</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} {settings?.schoolName || 'SMA Negeri 1'}. Hak Cipta Dilindungi.</p>
                    <div className="footer-bottom-links">
                        <Link to="/profil">Kebijakan Privasi</Link>
                        <Link to="/profil">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
