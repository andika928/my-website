import { useState, useEffect } from 'react'
import { Receipt, Search, Download, CheckCircle, AlertCircle, Plus, Loader2, Save, X, Eye, Clock, Printer } from 'lucide-react'
import { useToast } from '../../components/ui/Toast' // Import Toast
import InvoiceModal from '../../components/payment/InvoiceModal'
import './AdminPages.css'
import API_BASE_URL from '../../config/api'

function SPPManagement() {
    const { addToast } = useToast() // Init hook
    const [payments, setPayments] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [verifyModal, setVerifyModal] = useState(null) // For verification modal
    const [formData, setFormData] = useState({
        studentId: '',
        month: 'Januari',
        year: new Date().getFullYear().toString(),
        amount: '150000',
        status: 'PAID'
    })

    const fetchPayments = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_BASE_URL}/api/spp`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setPayments(data)
            } else {
                // If 401/403, just log for now to prevent auto-exit bug
                console.warn("Auth Error:", response.status)
                if (response.status === 401 || response.status === 403) {
                    // Temporary fix: Do NOT redirect, just show error
                    addToast('Sesi mungkin berakhir, silakan login ulang jika perlu', 'warning')
                }
            }
        } catch (error) {
            console.error("Error fetching payments:", error)
            addToast('Gagal memuat data pembayaran', 'error')
        } finally {
            setLoading(false)
        }
    }

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_BASE_URL}/api/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setStudents(data)
            }
        } catch (error) {
            console.error("Error fetching students:", error)
        }
    }

    useEffect(() => {
        fetchPayments()
        fetchStudents()
    }, [])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const resetForm = () => {
        setFormData({
            studentId: '',
            month: 'Januari',
            year: new Date().getFullYear().toString(),
            amount: '150000',
            status: 'PAID'
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_BASE_URL}/api/spp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setShowModal(false)
                resetForm()
                fetchPayments()
                addToast('Data pembayaran berhasil disimpan', 'success')
            } else {
                const err = await response.json()
                addToast(err.error || 'Gagal menyimpan pembayaran', 'error')
            }
        } catch (error) {
            console.error("Error saving payment:", error)
            addToast('Terjadi kesalahan sistem', 'error')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data pembayaran ini?')) return
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_BASE_URL}/api/spp/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                fetchPayments()
                addToast('Pembayaran dihapus', 'success')
            } else {
                addToast('Gagal menghapus pembayaran', 'error')
            }
        } catch (error) {
            console.error("Error deleting payment:", error)
        }
    }

    const handleManualPayment = async (id) => {
        if (!confirm('Tandai pembayaran ini sebagai LUNAS (Pembayaran Manual/Tunai)?')) return
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_BASE_URL}/api/spp/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'PAID' })
            })

            if (response.ok) {
                fetchPayments()
                addToast('Status diperbarui menjadi Lunas', 'success')
            } else {
                addToast('Gagal memperbarui status', 'error')
            }
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }

    const handleVerify = async (status) => {
        if (!verifyModal) return
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_BASE_URL}/api/spp/verify/${verifyModal.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            })

            if (response.ok) {
                addToast(`Pembayaran berhasil ${status === 'PAID' ? 'diterima' : 'ditolak'}`, 'success')
                setVerifyModal(null)
                fetchPayments()
            } else {
                addToast('Gagal memverifikasi pembayaran', 'error')
            }
        } catch (error) {
            console.error("Error verifying payment:", error)
        }
    }

    const filteredPayments = payments.filter(p =>
        p.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.student?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID':
                return <span className="status-tag success"><CheckCircle size={14} /> Lunas</span>
            case 'VERIFYING':
                return <span className="status-tag warning"><Clock size={14} /> Verifikasi</span>
            case 'REJECTED':
                return <span className="status-tag danger"><X size={14} /> Ditolak</span>
            default:
                return <span className="status-tag danger"><AlertCircle size={14} /> Belum</span>
        }
    }

    const [invoiceData, setInvoiceData] = useState(null)

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1><Receipt size={28} /> Administrasi SPP</h1>
                <p>Kelola pembayaran SPP siswa</p>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Cari siswa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-secondary" onClick={() => { fetchPayments(); fetchStudents(); }} title="Reload Data">
                        <Clock size={18} /> Refresh
                    </button>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        <Plus size={18} /> Catat Pembayaran
                    </button>
                    <button className="btn btn-secondary"><Download size={18} /> Export Rekap</button>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    {loading ? (
                        <div className="loading-state"><Loader2 className="animate-spin" /> Memuat data...</div>
                    ) : (
                        <table className="table">
                            <thead><tr><th>Nama Siswa</th><th>Kelas/No.Reg</th><th>Bulan</th><th>Jumlah</th><th>Tgl Bayar</th><th>Status</th><th>Bukti</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {filteredPayments.length > 0 ? filteredPayments.map((p) => (
                                    <tr key={p.id}>
                                        <td><strong>{p.student?.name}</strong></td>
                                        <td>{p.student?.registrationNumber}</td>
                                        <td>{p.month} {p.year}</td>
                                        <td>Rp {p.amount.toLocaleString('id-ID')}</td>
                                        <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}</td>
                                        <td>{getStatusBadge(p.status)}</td>
                                        <td>
                                            {p.proofFile ? (
                                                <button className="btn-icon" onClick={() => setVerifyModal(p)} title="Lihat Bukti">
                                                    <Eye size={18} />
                                                </button>
                                            ) : '-'}
                                        </td>
                                        <td className="action-cell">
                                            {(p.status === 'PENDING' || p.status === 'REJECTED') && (
                                                <button className="btn-icon success" title="Tandai Lunas Manual" onClick={() => handleManualPayment(p.id)}>
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button className="btn-icon danger" title="Hapus" onClick={() => handleDelete(p.id)}><div style={{ color: 'red' }}>X</div></button>

                                            {p.status === 'PAID' && (
                                                <button className="btn-icon" title="Cetak Invoice" onClick={() => setInvoiceData(p)}>
                                                    <Printer size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="8" className="text-center">Belum ada data pembayaran</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Invoice Modal */}
            {invoiceData && <InvoiceModal payment={invoiceData} onClose={() => setInvoiceData(null)} />}

            {/* Modal Create */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Catat Pembayaran SPP</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Siswa</label>
                                    <select name="studentId" className="form-input" value={formData.studentId} onChange={handleInputChange} required>
                                        <option value="">-- Pilih Siswa --</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} ({s.registrationNumber})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bulan</label>
                                    <select name="month" className="form-input" value={formData.month} onChange={handleInputChange}>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Tahun</label>
                                    <select name="year" className="form-input" value={formData.year} onChange={handleInputChange}>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Jumlah Pembayaran (Rp)</label>
                                    <input type="number" name="amount" className="form-input" value={formData.amount} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select name="status" className="form-input" value={formData.status} onChange={handleInputChange}>
                                        <option value="PAID">Lunas</option>
                                        <option value="PENDING">Belum Lunas</option>
                                    </select>
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

            {/* Verification Modal */}
            {verifyModal && (
                <div className="modal-overlay" onClick={() => setVerifyModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Verifikasi Pembayaran</h3>
                            <button className="modal-close" onClick={() => setVerifyModal(null)}><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Siswa:</strong> {verifyModal.student?.name}</p>
                            <p><strong>Bulan:</strong> {verifyModal.month} {verifyModal.year}</p>
                            <p><strong>Jumlah:</strong> Rp {verifyModal.amount.toLocaleString('id-ID')}</p>

                            <div className="proof-container mt-4 mb-4" style={{ textAlign: 'center' }}>
                                <img
                                    src={`${API_BASE_URL}/${verifyModal.proofFile}`}
                                    alt="Bukti Transfer"
                                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </div>

                            {verifyModal.status === 'VERIFYING' && (
                                <div className="modal-actions" style={{ justifyContent: 'center', gap: '10px' }}>
                                    <button className="btn btn-danger" onClick={() => handleVerify('REJECTED')}>Tolak</button>
                                    <button className="btn btn-success" style={{ backgroundColor: '#10b981', color: 'white' }} onClick={() => handleVerify('PAID')}>Terima (Lunas)</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SPPManagement
