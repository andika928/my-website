import { useState, useEffect } from 'react'
import { Users, Search, Edit, Trash2, Plus, Download, Loader2, Save, X } from 'lucide-react'
import './AdminPages.css'

function DataGuru() {
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        nip: '',
        subject: '',
        bio: ''
    })

    const fetchTeachers = async () => {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:5001/api/teachers')
            if (response.ok) {
                const data = await response.json()
                setTeachers(data)
            }
        } catch (error) {
            console.error("Error fetching teachers:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTeachers()
    }, [])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const resetForm = () => {
        setFormData({
            name: '',
            nip: '',
            subject: '',
            bio: ''
        })
        setEditMode(false)
        setCurrentId(null)
    }

    const handleEdit = (teacher) => {
        setFormData({
            name: teacher.name,
            nip: teacher.nip || '',
            subject: teacher.subject,
            bio: teacher.bio || ''
        })
        setEditMode(true)
        setCurrentId(teacher.id)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data guru ini?')) return
        try {
            const response = await fetch(`http://localhost:5001/api/teachers/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) fetchTeachers()
        } catch (error) {
            console.error("Error deleting teacher:", error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = editMode
            ? `http://localhost:5001/api/teachers/${currentId}`
            : 'http://localhost:5001/api/teachers'
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
                fetchTeachers()
            } else {
                alert('Gagal menyimpan data')
            }
        } catch (error) {
            console.error("Error saving teacher:", error)
        }
    }

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1><Users size={28} /> Data Guru & Staf</h1>
                <p>Kelola data pendidik dan tenaga kependidikan</p>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Cari guru..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        <Plus size={18} /> Tambah Guru
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    {loading ? (
                        <div className="loading-state"><Loader2 className="animate-spin" /> Memuat data...</div>
                    ) : (
                        <table className="table">
                            <thead><tr><th>NIP</th><th>Nama</th><th>Mata Pelajaran</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {filteredTeachers.length > 0 ? filteredTeachers.map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.nip || '-'}</td>
                                        <td><strong>{t.name}</strong></td>
                                        <td>{t.subject}</td>
                                        <td className="action-cell">
                                            <button className="btn-icon" title="Edit" onClick={() => handleEdit(t)}><Edit size={18} /></button>
                                            <button className="btn-icon danger" title="Hapus" onClick={() => handleDelete(t.id)}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="4" className="text-center">Tidak ada data guru</td></tr>}
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
                            <h3>{editMode ? 'Edit Guru' : 'Tambah Guru Baru'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Nama Lengkap</label>
                                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>NIP</label>
                                    <input type="text" name="nip" className="form-input" value={formData.nip} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Mata Pelajaran / Posisi</label>
                                    <input type="text" name="subject" className="form-input" value={formData.subject} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group full-width">
                                    <label>Biografi Singkat</label>
                                    <textarea name="bio" className="form-input" rows="3" value={formData.bio} onChange={handleInputChange}></textarea>
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

export default DataGuru
