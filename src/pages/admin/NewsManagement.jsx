import { useState, useEffect } from 'react'
import { Newspaper, Search, Edit, Trash2, Plus, Loader2, Save, X, Eye } from 'lucide-react'
import './AdminPages.css'
import API_BASE_URL from '../../config/api'

function NewsManagement() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        category: 'Berita',
        content: '',
        thumbnail: '',
        published: true
    })

    const fetchNews = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/news`)
            if (response.ok) {
                const data = await response.json()
                setNews(data)
            }
        } catch (error) {
            console.error("Error fetching news:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNews()
    }, [])

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setFormData({ ...formData, [e.target.name]: value })
    }

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'Berita',
            content: '',
            thumbnail: '',
            published: true
        })
        setEditMode(false)
        setCurrentId(null)
    }

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            category: item.category,
            content: item.content,
            thumbnail: item.thumbnail || '',
            published: item.published
        })
        setEditMode(true)
        setCurrentId(item.id)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return
        try {
            const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) fetchNews()
        } catch (error) {
            console.error("Error deleting news:", error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = editMode
            ? `${API_BASE_URL}/api/news/${currentId}`
            : `${API_BASE_URL}/api/news`
        const method = editMode ? 'PUT' : 'POST'

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                setShowModal(false)
                resetForm()
                fetchNews()
            } else {
                alert('Gagal menyimpan berita')
            }
        } catch (error) {
            console.error("Error saving news:", error)
        }
    }

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1><Newspaper size={28} /> Berita & Pengumuman</h1>
                <p>Kelola konten berita dan pengumuman sekolah</p>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Cari berita..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        <Plus size={18} /> Tambah Berita
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    {loading ? (
                        <div className="loading-state"><Loader2 className="animate-spin" /> Memuat data...</div>
                    ) : (
                        <table className="table">
                            <thead><tr><th>Tanggal</th><th>Judul</th><th>Kategori</th><th>Status</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {filteredNews.length > 0 ? filteredNews.map((n) => (
                                    <tr key={n.id}>
                                        <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                                        <td><strong>{n.title}</strong></td>
                                        <td>{n.category}</td>
                                        <td>
                                            <span className={`status-tag ${n.published ? 'success' : 'warning'}`}>
                                                {n.published ? 'Terbit' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="action-cell">
                                            <button className="btn-icon" title="Edit" onClick={() => handleEdit(n)}><Edit size={18} /></button>
                                            <button className="btn-icon danger" title="Hapus" onClick={() => handleDelete(n.id)}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="5" className="text-center">Tidak ada berita</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editMode ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Judul</label>
                                    <input type="text" name="title" className="form-input" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Kategori</label>
                                    <select name="category" className="form-input" value={formData.category} onChange={handleInputChange}>
                                        <option value="Berita">Berita</option>
                                        <option value="Pengumuman">Pengumuman</option>
                                        <option value="Prestasi">Prestasi</option>
                                        <option value="Agenda">Agenda</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status Publikasi</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                                        <input type="checkbox" name="published" checked={formData.published} onChange={handleInputChange} />
                                        <span>Terbitkan Langsung</span>
                                    </div>
                                </div>
                                <div className="form-group full-width">
                                    <label>Konten</label>
                                    <textarea name="content" className="form-input" rows="10" value={formData.content} onChange={handleInputChange} required></textarea>
                                </div>
                                <div className="form-group full-width">
                                    <label>URL Gambar Thumbnail (Opsional)</label>
                                    <input type="text" name="thumbnail" className="form-input" value={formData.thumbnail} onChange={handleInputChange} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary"><Save size={18} /> Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NewsManagement
