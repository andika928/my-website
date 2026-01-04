import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import './PublicLayout.css'

function PublicLayout() {
    return (
        <div className="public-layout">
            <Navbar />
            <main className="main-content animate-fade-in">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout
