import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Search, BookOpen, Tag, Loader2 } from 'lucide-react'
import './NewsPage.css'

function NewsPage() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('Semua')

    const categories = ['Semua', 'Berita', 'Pengumuman', 'Prestasi', 'Kegiatan', 'Akademik']

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/news')
                if (response.ok) {
                    const data = await response.json()
                    // Filter only published news for public view
                    setNews(data.filter(n => n.published))
                }
            } catch (error) {
                console.error("Error fetching news:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [])

    const filteredNews = news.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'Semua' || n.category === filterCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="news-page">
            <section className="news-hero">
                <div className="container">
                    <span className="section-badge">Informasi Terkini</span>
                    <h1>Berita & Pengumuman</h1>
                    <p>Informasi terbaru seputar kegiatan dan prestasi SMA Negeri 1</p>
                </div>
            </section>

            <section className="section news-content">
                <div className="container">
                    <div className="news-layout">
                        <div className="news-main">
                            <div className="news-toolbar">
                                <div className="search-box">
                                    <Search size={20} />
                                    <input
                                        type="text"
                                        placeholder="Cari berita..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="category-filter">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                                            onClick={() => setFilterCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="news-articles">
                                {loading ? (
                                    <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>
                                        <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
                                        <p>Memuat berita...</p>
                                    </div>
                                ) : filteredNews.length > 0 ? (
                                    filteredNews.map((item) => (
                                        <article key={item.id} className="article-card card">
                                            <div className="article-image">
                                                <div className="article-image-placeholder">
                                                    {item.thumbnail ? <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} /> : null}
                                                    <div className="placeholder-icon" style={{ display: item.thumbnail ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))', color: 'white' }}>
                                                        <BookOpen size={40} />
                                                    </div>
                                                </div>
                                                <span className="article-category">{item.category}</span>
                                            </div>
                                            <div className="article-content">
                                                <div className="article-meta">
                                                    <Calendar size={14} />
                                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="article-title">{item.title}</h3>
                                                <p className="article-excerpt">
                                                    {item.content.substring(0, 150)}...
                                                </p>
                                                <Link to={`/berita/${item.id}`} className="article-link">
                                                    Baca Selengkapnya
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <div className="no-data">Tidak ada berita ditemukan.</div>
                                )}
                            </div>
                        </div>

                        <aside className="news-sidebar">
                            <div className="card sidebar-card">
                                <h4>Berita Terbaru</h4>
                                <div className="recent-list">
                                    {news.slice(0, 4).map((item) => (
                                        <Link key={item.id} to={`/berita/${item.id}`} className="recent-item">
                                            <div className="recent-image">
                                                <BookOpen size={18} />
                                            </div>
                                            <div className="recent-info">
                                                <span className="recent-title">{item.title}</span>
                                                <span className="recent-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default NewsPage
