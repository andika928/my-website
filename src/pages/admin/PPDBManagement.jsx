import { useState, useEffect } from 'react'
import { UserPlus, Search, CheckCircle, XCircle, Eye, Filter, Loader2, RefreshCw, Trash2, Printer } from 'lucide-react'
import PPDBProofModal from '../../components/ppdb/PPDBProofModal'
import './AdminPages.css'

function PPDBManagement() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('Semua Status')
    const [searchTerm, setSearchTerm] = useState('')

    // Modal State
    const [showProofModal, setShowProofModal] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5001/api/ppdb', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const result = await response.json()
                setData(result)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleUpdateStatus = async (id, newStatus) => {
        if (!confirm(`Ubah status menjadi ${newStatus}?`)) return

        try {
            const response = await fetch(`http://localhost:5001/api/ppdb/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                fetchData() // Refresh data
            } else {
                alert('Gagal memperbarui status')
            }
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }
    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data calon siswa ini? Data yang dihapus tidak dapat dikembalikan.')) return

        try {
            const response = await fetch(`http://localhost:5001/api/ppdb/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.ok) {
                fetchData() // Refresh data
            } else {
                alert('Gagal menghapus data')
            }
        } catch (error) {
            console.error("Error deleting data:", error)
        }
    }

    const handleViewDetail = (item) => {
        setSelectedSubmission(item)
        setShowProofModal(true)
    }

    const filteredData = data.filter(item => {
        const matchStatus = statusFilter === 'Semua Status' || item.status === statusFilter.toUpperCase() ||
            (statusFilter === 'Menunggu' && item.status === 'PENDING') ||
            (statusFilter === 'Diterima' && item.status === 'ACCEPTED') ||
            (statusFilter === 'Ditolak' && item.status === 'REJECTED')

        const matchSearch = item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.registrationId.toLowerCase().includes(searchTerm.toLowerCase())

        return matchStatus && matchSearch
    })

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1><UserPlus size={28} /> Manajemen PPDB</h1>
                    <p>Kelola pendaftaran peserta didik baru</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchData}><RefreshCw size={18} /> Refresh</button>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Cari pendaftar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <select
                        className="form-input form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>Semua Status</option>
                        <option>Menunggu</option>
                        <option>Diterima</option>
                        <option>Ditolak</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 size={32} className="animate-spin" />
                            <p>Memuat data...</p>
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>No Pendaftaran</th>
                                    <th>Nama Calon</th>
                                    <th>Asal Sekolah</th>
                                    <th>Tanggal</th>
                                    <th>Status</th>
                                    <th>Berkas</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? filteredData.map((p) => (
                                    <tr key={p.id}>
                                        <td><strong>{p.registrationId}</strong></td>
                                        <td>{p.fullName}<br /><small>{p.phone}</small></td>
                                        <td>{p.previousSchool}</td>
                                        <td>{new Date(p.createdAt).toLocaleDateString("id-ID")}</td>
                                        <td>
                                            <span className={`status-tag ${p.status === 'ACCEPTED' ? 'success' :
                                                p.status === 'PENDING' ? 'warning' : 'danger'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="file-links" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                                                {(() => {
                                                    try {
                                                        const docs = p.documents ? JSON.parse(p.documents) : {};
                                                        return Object.entries(docs).map(([key, path]) => (
                                                            <a
                                                                key={key}
                                                                href={`http://localhost:5001/${path.replace(/\\/g, '/')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ color: '#2563eb', textDecoration: 'underline' }}
                                                            >
                                                                {key.toUpperCase()}
                                                            </a>
                                                        ));
                                                    } catch (e) {
                                                        return <span className="text-muted">-</span>;
                                                    }
                                                })()}
                                            </div>
                                        </td>
                                        <td className="action-cell">
                                            <button
                                                className="btn-icon"
                                                title="Lihat Detail / Cetak Bukti"
                                                onClick={() => handleViewDetail(p)}
                                            >
                                                <Printer size={18} />
                                            </button>
                                            <button
                                                className="btn-icon success"
                                                title="Terima"
                                                onClick={() => handleUpdateStatus(p.id, 'ACCEPTED')}
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                className="btn-icon danger"
                                                title="Tolak"
                                                onClick={() => handleUpdateStatus(p.id, 'REJECTED')}
                                            >
                                                <XCircle size={18} />
                                            </button>
                                            <button
                                                className="btn-icon danger"
                                                title="Hapus"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">Belum ada data pendaftaran</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Proof Modal Reused for Admin View */}
            <PPDBProofModal
                isOpen={showProofModal}
                onClose={() => setShowProofModal(false)}
                data={selectedSubmission}
            />
        </div>
    )
}

export default PPDBManagement
