import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import './Sidebar.css'

function Sidebar({ menuItems, userType, userName, userRole }) {
    const [expandedItems, setExpandedItems] = useState([])
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const navigate = useNavigate()

    const toggleExpand = (label) => {
        setExpandedItems(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        )
    }

    const getIcon = (iconName) => {
        const IconComponent = Icons[iconName]
        return IconComponent ? <IconComponent size={20} /> : null
    }

    const handleLogout = () => {
        navigate('/')
    }

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="sidebar-mobile-toggle"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle sidebar"
            >
                {isMobileOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
            </button>

            {/* Overlay */}
            {isMobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${userType} ${isMobileOpen ? 'is-open' : ''}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Icons.GraduationCap size={24} />
                        <span>{userType === 'admin' ? 'Admin Panel' : 'Portal Siswa'}</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {userName.charAt(0)}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{userName}</span>
                        <span className="user-role">{userRole}</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {menuItems.map((item, index) => (
                        <div key={index} className="nav-item-wrapper">
                            {item.children ? (
                                // Parent with children
                                <>
                                    <button
                                        className={`sidebar-nav-item has-children ${expandedItems.includes(item.label) ? 'is-expanded' : ''
                                            }`}
                                        onClick={() => toggleExpand(item.label)}
                                    >
                                        {getIcon(item.icon)}
                                        <span>{item.label}</span>
                                        <Icons.ChevronDown size={16} className="chevron" />
                                    </button>
                                    <div className={`nav-children ${expandedItems.includes(item.label) ? 'is-open' : ''
                                        }`}>
                                        {item.children.map((child, childIndex) => (
                                            <NavLink
                                                key={childIndex}
                                                to={child.path}
                                                className={({ isActive }) =>
                                                    `sidebar-nav-child ${isActive ? 'active' : ''}`
                                                }
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                {child.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                // Regular item
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/portal' || item.path === '/admin'}
                                    className={({ isActive }) =>
                                        `sidebar-nav-item ${isActive ? 'active' : ''}`
                                    }
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    {getIcon(item.icon)}
                                    <span>{item.label}</span>
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <button className="sidebar-nav-item logout-btn" onClick={handleLogout}>
                        <Icons.LogOut size={20} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
