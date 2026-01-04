import { useState, useEffect, useRef } from 'react'
import { Wallet, CheckCircle, AlertCircle, Download, Loader2, Upload, X, Clock, FileText } from 'lucide-react'
import { useToast } from '../../components/ui/Toast' // Adjusted path
import InvoiceModal from '../../components/payment/InvoiceModal'
import './SPPStatusPage.css'

function SPPStatusPage() {
    const { addToast } = useToast()
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPayment, setSelectedPayment] = useState(null)
    const fileInputRef = useRef(null)

    const fetchPayments = async () => {
        // ... (existing code, unchanged until handleUploadSubmit)
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5001/api/spp/my-payments', {
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
            console.error("Error fetching my payments:", error)
            addToast('Gagal memuat data pembayaran', 'error')
        } finally {
            setLoading(false)
        }
    }

    // ... (useEffect and other handlers unchanged)



    useEffect(() => {
        fetchPayments()
    }, [])

    const [imagePreview, setImagePreview] = useState(null)

    const handleUploadClick = (payment) => {
        setSelectedPayment(payment)
        setImagePreview(null)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const formData = new FormData()
            formData.append('proof', file)
            setSelectedPayment({ ...selectedPayment, file: formData, rawFile: file }) // Store file temporarily

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUploadSubmit = async () => {
        if (!selectedPayment?.file) return

        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const response = await fetch(`http://localhost:5001/api/spp/upload-proof/${selectedPayment.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: selectedPayment.file
            })

            if (response.ok) {
                addToast('Bukti pembayaran berhasil diupload! Mohon tunggu verifikasi admin.', 'success')
                setSelectedPayment(null)
                fetchPayments()
            } else {
                const err = await response.json()
                if (response.status === 404) {
                    addToast(err.error || 'Data pembayaran tidak ditemukan', 'error')
                    setSelectedPayment(null) // Close modal since data is gone
                    fetchPayments() // Refresh list to remove stale item
                } else {
                    addToast(err.error || 'Gagal mengupload bukti pembayaran', 'error')
                }
            }
        } catch (error) {
            console.error("Error uploading proof:", error)
            addToast('Terjadi kesalahan saat upload', 'error')
        } finally {
            setLoading(false)
        }
    }

    const totalPaid = payments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0)
    const totalPending = payments.filter(p => p.status !== 'PAID').reduce((acc, p) => acc + p.amount, 0)

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID':
                return <span className="status-badge paid"><CheckCircle size={14} /> Lunas</span>
            case 'VERIFYING':
                return <span className="status-badge warning"><Clock size={14} /> Verifikasi</span>
            case 'REJECTED':
                return <span className="status-badge danger"><X size={14} /> Ditolak</span>
            default:
                return <span className="status-badge pending"><AlertCircle size={14} /> Belum Bayar</span>
        }
    }

    const [invoiceData, setInvoiceData] = useState(null)

    return (
        <div className="spp-page">
            <div className="page-header">
                <h1><Wallet size={28} /> Status Pembayaran SPP</h1>
                <p>Pantau riwayat pembayaran SPP Anda</p>
            </div>

            <div className="spp-summary">
                <div className="summary-card paid">
                    <CheckCircle size={24} />
                    <div className="summary-info">
                        <span className="amount">Rp {totalPaid.toLocaleString('id-ID')}</span>
                        <span className="label">Total Terbayar</span>
                    </div>
                </div>
                <div className="summary-card pending">
                    <AlertCircle size={24} />
                    <div className="summary-info">
                        <span className="amount">Rp {totalPending.toLocaleString('id-ID')}</span>
                        <span className="label">Tunggakan</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-header">
                    <h3>Riwayat Pembayaran</h3>
                    <div className="header-actions">
                        <button className="btn btn-secondary btn-sm" onClick={fetchPayments}><Clock size={16} /> Refresh</button>
                    </div>
                </div>
                <div className="table-container">
                    {loading ? (
                        <div className="loading-state"><Loader2 className="animate-spin" /> Memuat data...</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Bulan</th>
                                    <th>Tahun</th>
                                    <th>Jumlah</th>
                                    <th>Tgl Bayar</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? payments.map((pay) => (
                                    <tr key={pay.id}>
                                        <td>{pay.month}</td>
                                        <td>{pay.year}</td>
                                        <td>Rp {pay.amount.toLocaleString('id-ID')}</td>
                                        <td>{pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString() : '-'}</td>
                                        <td>{getStatusBadge(pay.status)}</td>
                                        <td>
                                            {(pay.status === 'PENDING' || pay.status === 'REJECTED') && (
                                                <button className="btn btn-primary btn-sm" onClick={() => handleUploadClick(pay)}>
                                                    <Upload size={14} /> Upload Bukti
                                                </button>
                                            )}
                                            {pay.status === 'PAID' && (
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => setInvoiceData(pay)} title="Download Invoice">
                                                    <FileText size={14} /> Invoice
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="6" className="text-center">Belum ada data pembayaran</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Invoice Modal */}
            {invoiceData && <InvoiceModal payment={invoiceData} onClose={() => setInvoiceData(null)} />}

            {/* Premium Upload Modal */}
            {selectedPayment && (
                <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
                    <div className="modal-content upload-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Upload Bukti Pembayaran</h3>
                            <button className="modal-close" onClick={() => setSelectedPayment(null)}><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="payment-details-mini">
                                <p>Pembayaran Bulan: <strong>{selectedPayment.month} {selectedPayment.year}</strong></p>
                                <p>Nominal: <strong>Rp {selectedPayment.amount.toLocaleString('id-ID')}</strong></p>
                            </div>

                            <div className="bank-transfer-info">
                                <p className="info-title">Silakan transfer ke:</p>
                                <div className="bank-card">
                                    <div className="bank-logo">MANDIRI</div>
                                    <div className="bank-details">
                                        <span className="acc-number">123-456-7890</span>
                                        <span className="acc-name">SEKOLAH UNGGULAN</span>
                                    </div>
                                </div>
                            </div>

                            <div className="upload-zone-wrapper">
                                <label className={`upload-zone ${imagePreview ? 'has-image' : ''}`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        hidden
                                    />
                                    {imagePreview ? (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <div className="overlay">
                                                <Upload size={24} />
                                                <span>Ganti Foto</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Upload size={40} />
                                            <p>Klik untuk upload bukti transfer</p>
                                            <span className="sub-text">Format: JPG, PNG (Max 200MB)</span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            <button
                                className="btn btn-primary btn-full"
                                disabled={!selectedPayment.file || loading}
                                onClick={handleUploadSubmit}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Kirim Bukti Pembayaran'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SPPStatusPage
