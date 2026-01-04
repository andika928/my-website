import { useState, useEffect } from 'react'
import { Users, Search, Edit, Trash2, Plus, Download, Loader2, Save, X, Lock, Key } from 'lucide-react'
import { useToast } from '../../components/ui/Toast'
import './AdminPages.css'

function DataSiswa() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showAccessModal, setShowAccessModal] = useState(false)
    const [accessData, setAccessData] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    const [formData, setFormData] = useState({
        registrationNumber: '',
        name: '',
        nisn: '',
        dateOfBirth: '',
        placeOfBirth: '',
        address: '',
        gender: 'L',
        parentName: '',
        parentPhone: '',
        status: 'ACTIVE'
    })

    const { addToast } = useToast()

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:5001/api/students')
            if (response.ok) {
                const data = await response.json()
                setStudents(data)
            }
        } catch (error) {
            console.error("Error fetching students:", error)
            addToast('Gagal memuat data siswa', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const resetForm = () => {
        setFormData({
            registrationNumber: '',
            name: '',
            nisn: '',
            dateOfBirth: '',
            placeOfBirth: '',
            address: '',
            gender: 'L',
            parentName: '',
            parentPhone: '',
            status: 'ACTIVE'
        })
        setEditMode(false)
        setCurrentId(null)
    }

    const handleEdit = (student) => {
        setFormData({
            registrationNumber: student.registrationNumber || '',
            name: student.name,
            nisn: student.nisn || '',
            dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
            placeOfBirth: student.placeOfBirth || '',
            address: student.address || '',
            gender: student.gender || 'L',
            parentName: student.parentName || '',
            parentPhone: student.parentPhone || '',
            status: student.status || 'ACTIVE'
        })
        setEditMode(true)
        setCurrentId(student.id)
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) return
        try {
            const response = await fetch(`http://localhost:5001/api/students/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                fetchStudents()
                addToast('Data siswa berhasil dihapus', 'success')
            } else {
                addToast('Gagal menghapus data', 'error')
            }
        } catch (error) {
            console.error("Error deleting student:", error)
        }
    }

    const handleCreateAccount = async (student) => {
        try {
            const response = await fetch(`http://localhost:5001/api/students/${student.id}/create-account`, {
                method: 'POST'
            })
            if (response.ok) {
                const data = await response.json()
                setAccessData(data)
                setShowAccessModal(true)
                addToast('Akses portal berhasil dibuat/diupdate', 'success')
            } else {
                if (response.status === 404) {
                    addToast('Data tidak ditemukan. Username dan Password tidak tersedia.', 'error')
                    // Refresh data because student might be deleted
                    fetchStudents()
                } else {
                    addToast('Gagal membuat akun akses', 'error')
                }
            }
        } catch (error) {
            console.error("Error creating account:", error)
            addToast('Terjadi kesalahan sistem', 'error')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = editMode
            ? `http://localhost:5001/api/students/${currentId}`
            : 'http://localhost:5001/api/students'
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
                fetchStudents()
                addToast(editMode ? 'Data berhasil diperbarui' : 'Siswa berhasil ditambahkan', 'success')
            } else {
                addToast('Gagal menyimpan data', 'error')
            }
        } catch (error) {
            console.error("Error saving student:", error)
            addToast('Terjadi kesalahan saat menyimpan', 'error')
        }
    }

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.nisn && s.nisn.includes(searchTerm)) ||
        (s.registrationNumber && s.registrationNumber.includes(searchTerm))
    )

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1><Users size={28} /> Data Siswa</h1>
                <p>Kelola data siswa SMA Negeri 1</p>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Cari siswa (Nama/NISN)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        <Plus size={18} /> Tambah Siswa
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    {loading ? (
                        <div className="loading-state"><Loader2 className="animate-spin" /> Memuat data...</div>
                    ) : (
                        <table className="table">
                            <thead><tr><th>No. Reg</th><th>NISN</th><th>Nama</th><th>Tgl Lahir</th><th>Wali</th><th>Status</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.registrationNumber}</td>
                                        <td>{s.nisn || '-'}</td>
                                        <td><strong>{s.name}</strong><br /><small>{s.address}</small></td>
                                        <td>{s.placeOfBirth}, {s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : '-'}</td>
                                        <td>{s.parentName}<br /><small>{s.parentPhone}</small></td>
                                        <td><span className={`status-tag ${s.status === 'ACTIVE' ? 'success' : 'default'}`}>{s.status}</span></td>
                                        <td className="action-cell">
                                            <button className="btn-icon" title="Buat Akses Portal" onClick={() => handleCreateAccount(s)}><Key size={18} /></button>
                                            <button className="btn-icon" title="Edit" onClick={() => handleEdit(s)}><Edit size={18} /></button>
                                            <button className="btn-icon danger" title="Hapus" onClick={() => handleDelete(s.id)}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="7" className="text-center">Tidak ada data siswa</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editMode ? 'Edit Siswa' : 'Tambah Siswa Baru'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nomor Registrasi / Induk</label>
                                    <input type="text" name="registrationNumber" className="form-input" value={formData.registrationNumber} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>NISN</label>
                                    <input type="text" name="nisn" className="form-input" value={formData.nisn} onChange={handleInputChange} />
                                </div>
                                <div className="form-group full-width">
                                    <label>Nama Lengkap</label>
                                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Tempat Lahir</label>
                                    <input type="text" name="placeOfBirth" className="form-input" value={formData.placeOfBirth} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Tanggal Lahir</label>
                                    <input type="date" name="dateOfBirth" className="form-input" value={formData.dateOfBirth} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Jenis Kelamin</label>
                                    <select name="gender" className="form-input" value={formData.gender} onChange={handleInputChange}>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" className="form-input" value={formData.status} onChange={handleInputChange}>
                                        <option value="ACTIVE">Aktif</option>
                                        <option value="GRADUATED">Lulus</option>
                                        <option value="MOVED">Pindah</option>
                                        <option value="DROPPED">Keluar</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>Alamat</label>
                                    <textarea name="address" className="form-input" rows="2" value={formData.address} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Nama Orang Tua</label>
                                    <input type="text" name="parentName" className="form-input" value={formData.parentName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>No. HP Orang Tua</label>
                                    <input type="text" name="parentPhone" className="form-input" value={formData.parentPhone} onChange={handleInputChange} />
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

            {/* Access Modal */}
            {showAccessModal && accessData && (
                <div className="modal-overlay" onClick={() => setShowAccessModal(false)}>
                    <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3><Lock size={20} /> Akses Portal Siswa</h3>
                            <button className="modal-close" onClick={() => setShowAccessModal(false)}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>Email / Username</p>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>{accessData.email}</p>
                            </div>
                            <div style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '5px' }}>Password Default</p>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' }}>{accessData.password}</p>
                            </div>
                            <p style={{ fontSize: '13px', color: '#ef4444', marginBottom: '20px' }}>
                                Mohon segera simpan informasi ini. Password hanya ditampilkan satu kali.
                            </p>
                            <button className="btn btn-primary btn-full" onClick={() => setShowAccessModal(false)}>Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DataSiswa
