import { Bell, Filter } from 'lucide-react'
import { announcementsData } from '../../data/mockData'
import './AnnouncementsPage.css'

function AnnouncementsPage() {
    return (
        <div className="announcements-page">
            <div className="page-header">
                <h1><Bell size={28} /> Pengumuman</h1>
                <p>Informasi dan pengumuman penting dari sekolah</p>
            </div>

            <div className="filter-bar">
                <button className="filter-btn active">Semua</button>
                <button className="filter-btn">Umum</button>
                <button className="filter-btn">Siswa</button>
                <button className="filter-btn">Orang Tua</button>
            </div>

            <div className="announcements-list">
                {announcementsData.map((ann) => (
                    <div key={ann.id} className={`card announcement-card ${ann.priority}`}>
                        <div className="announcement-header">
                            <span className={`category-badge ${ann.category.toLowerCase()}`}>{ann.category}</span>
                            <span className="date">{ann.date}</span>
                        </div>
                        <h3>{ann.title}</h3>
                        <p>{ann.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AnnouncementsPage
