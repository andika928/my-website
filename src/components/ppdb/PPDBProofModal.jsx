import React from 'react'
import { X, Printer, Download } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import './PPDBProofModal.css'

const PPDBProofModal = ({ isOpen, onClose, data }) => {
    const { settings } = useSettings()

    if (!isOpen || !data) return null

    const handlePrint = () => {
        window.print()
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="ppdb-proof-overlay" onClick={onClose}>
            <div className="ppdb-proof-modal" onClick={e => e.stopPropagation()}>
                {/* Header (Screen Only) */}
                <div className="ppdb-proof-header">
                    <h2>
                        <Printer size={20} />
                        Cetak Bukti Pendaftaran
                    </h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Printable Content */}
                <div className="ppdb-proof-content">
                    <div className="proof-document">
                        {/* Letterhead */}
                        <div className="proof-letterhead">
                            <img src="/logo-sekolah.png" alt="Logo" className="school-logo-print" onError={(e) => e.target.style.display = 'none'} />
                            <div className="school-info">
                                <h1>{settings?.schoolName || 'SMA NEGERI 1 CONTOH'}</h1>
                                <p>{settings?.schoolAddress || 'Jl. Pendidikan No. 123, Kota Contoh, Prov. Jawa Barat'}</p>
                                <p>Telp: {settings?.schoolPhone || '(021) 1234-5678'} | Email: {settings?.schoolEmail || 'info@sekolah.sch.id'}</p>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="proof-title">
                            <h2>BUKTI PENDAFTARAN PESERTA DIDIK BARU</h2>
                            <p>TAHUN AJARAN 2025/2026</p>
                        </div>

                        {/* Registration ID Badge */}
                        <div className="proof-details-box">
                            <div className="proof-reg-number">
                                <label>NOMOR PENDAFTARAN:</label>
                                <div className="number">{data.registrationId}</div>
                            </div>
                            <div className="proof-reg-status">
                                <label>STATUS:</label>
                                <strong>{data.status === 'PENDING' ? 'MENUNGGU VERIFIKASI' : data.status}</strong>
                            </div>
                        </div>

                        {/* Data Table */}
                        <table className="proof-table">
                            <tbody>
                                <tr>
                                    <td className="td-label">Nama Lengkap</td>
                                    <td className="td-sep">:</td>
                                    <td>{data.fullName}</td>
                                </tr>
                                <tr>
                                    <td className="td-label">NISN</td>
                                    <td className="td-sep">:</td>
                                    <td>{data.nisn || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="td-label">Tempat, Tanggal Lahir</td>
                                    <td className="td-sep">:</td>
                                    <td>{data.birthPlace}, {formatDate(data.birthDate)}</td>
                                </tr>
                                <tr>
                                    <td className="td-label">Jenis Kelamin</td>
                                    <td className="td-sep">:</td>
                                    <td>{data.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                </tr>
                                <tr>
                                    <td className="td-label">Asal Sekolah</td>
                                    <td className="td-sep">:</td>
                                    <td>{data.previousSchool}</td>
                                </tr>
                                <tr>
                                    <td className="td-label">Tahun Lulus</td>
                                    <td className="td-sep">:</td>
                                    <td>{data.graduationYear}</td>
                                </tr>
                                <tr>
                                    <td className="td-label">Nama Orang Tua</td>
                                    <td className="td-sep">:</td>
                                    <td>{data.parentName}</td>
                                </tr>
                                <tr>
                                    <td className="td-label">Alamat</td>
                                    <td className="td-sep">:</td>
                                    <td>{data.address}</td>
                                </tr>
                                <tr>
                                    <td className="td-label">Tanggal Daftar</td>
                                    <td className="td-sep">:</td>
                                    <td>{formatDate(data.createdAt)}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Footer / Signature */}
                        <div className="proof-footer">
                            <div className="proof-note">
                                <strong>Catatan:</strong>
                                <ul>
                                    <li>Simpan bukti pendaftaran ini sebagai syarat verifikasi berkas.</li>
                                    <li>Silakan cek status penerimaan secara berkala di website sekolah.</li>
                                    <li>Membawa dokumen asli saat daftar ulang.</li>
                                </ul>
                            </div>
                            <div className="proof-signature">
                                <div className="sign-place">Diketahui Oleh,<br />Panitia PPDB</div>
                                <div className="sign-space"></div>
                                <div className="sign-name">______________________</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions (Screen Only) */}
                <div className="ppdb-proof-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Tutup
                    </button>
                    <button className="btn btn-primary" onClick={handlePrint}>
                        <Printer size={18} />
                        Cetak Bukti
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PPDBProofModal
