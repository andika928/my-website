import React from 'react'
import { X, Printer } from 'lucide-react'
import './InvoiceModal.css'

function InvoiceModal({ payment, onClose }) {
    if (!payment) return null

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="invoice-overlay" onClick={onClose}>
            <div className="invoice-box" onClick={e => e.stopPropagation()}>
                {/* Actions (Hidden on Print) */}
                <div className="invoice-actions no-print">
                    <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Printer size={18} /> Cetak / Simpan PDF
                    </button>
                    <button className="btn btn-secondary" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <X size={18} /> Tutup
                    </button>
                </div>

                {/* Invoice Content */}
                <div className="invoice-header">
                    <div className="school-name">SEKOLAH UNGGULAN INDONESIA</div>
                    <div className="school-address">
                        Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta<br />
                        Telp: (021) 555-6789 | Email: admin@sekolahunggulan.sch.id
                    </div>
                </div>

                <div className="invoice-title">BUKTI PEMBAYARAN SPP</div>

                <div className="invoice-details">
                    <div className="left-col">
                        <div className="detail-row">
                            <span className="detail-label">No. Referensi</span>
                            : #INV-{payment.id.toString().slice(0, 8).toUpperCase()}
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Tanggal Cetak</span>
                            : {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div className="right-col">
                        <div className="detail-row">
                            <span className="detail-label">Status</span>
                            : <strong>LUNAS</strong>
                        </div>
                    </div>
                </div>

                <div className="student-info" style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px' }}>
                    <div className="detail-row">
                        <span className="detail-label">Nama Siswa</span>
                        : {payment.student?.name || 'N/A'}
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">NISN / Reg</span>
                        : {payment.student?.registrationNumber || 'N/A'}
                    </div>
                </div>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Keterangan</th>
                            <th>Bulan / Tahun</th>
                            <th style={{ textAlign: 'right' }}>Jumlah (IDR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center' }}>1</td>
                            <td>Pembayaran SPP Sekolah</td>
                            <td>{payment.month} {payment.year}</td>
                            <td style={{ textAlign: 'right' }}>Rp {payment.amount.toLocaleString('id-ID')}</td>
                        </tr>
                        <tr className="total-row">
                            <td colSpan="3" style={{ textAlign: 'right', paddingRight: '20px' }}>TOTAL DIBAYARKAN</td>
                            <td style={{ textAlign: 'right' }}>Rp {payment.amount.toLocaleString('id-ID')}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="invoice-footer">
                    <div className="signature-box">
                        <p>Penyetor</p>
                        <div className="signature-line" style={{ marginTop: '80px' }}></div>
                        <p>{payment.student?.name}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="stamp-box">LUNAS</div>
                    </div>

                    <div className="signature-box">
                        <p>Bendahara Sekolah</p>
                        <div className="signature-line" style={{ marginTop: '80px' }}></div>
                        <p>Admin Keuangan</p>
                    </div>
                </div>

                <div style={{ marginTop: '40px', fontSize: '12px', color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
                    * Bukti pembayaran ini sah dan diterbitkan secara elektronik oleh sistem sekolah.
                </div>
            </div>
        </div>
    )
}

export default InvoiceModal
