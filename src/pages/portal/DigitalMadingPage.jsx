import { Newspaper, Award, Calendar } from 'lucide-react'
import { newsData } from '../../data/mockData'
import './DigitalMadingPage.css'

function DigitalMadingPage() {
    return (
        <div className="mading-page">
            <div className="page-header">
                <h1><Newspaper size={28} /> Digital Mading</h1>
                <p>Berita internal dan prestasi siswa</p>
            </div>

            <div className="mading-grid">
                {newsData.map((news) => (
                    <div key={news.id} className="card mading-card">
                        <div className="mading-image">
                            <div className="image-placeholder">
                                {news.category === 'Prestasi' ? <Award size={32} /> : <Newspaper size={32} />}
                            </div>
                            <span className="mading-category">{news.category}</span>
                        </div>
                        <div className="mading-content">
                            <div className="mading-meta"><Calendar size={14} /><span>{news.date}</span></div>
                            <h4>{news.title}</h4>
                            <p>{news.excerpt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DigitalMadingPage
