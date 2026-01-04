import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, GraduationCap } from 'lucide-react'
import './Navbar.css'

const navItems = [
    { label: 'Beranda', path: '/' },
    { label: 'PPDB', path: '/ppdb' },
    { label: 'Profil', path: '/profil' },
    { label: 'Berita', path: '/berita' },
    { label: 'Kontak', path: '/kontak' },
]

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <GraduationCap size={28} />
                    </div>
                    <div className="logo-text">
                        <span className="logo-title">SMA Negeri 1</span>
                        <span className="logo-subtitle">Excellence in Education</span>
                    </div>
                </Link>

                <nav className={`navbar-nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'nav-link-active' : ''}`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    <Link to="/login" className="btn btn-primary nav-cta">
                        Login Portal
                    </Link>
                </nav>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    )
}

export default Navbar
