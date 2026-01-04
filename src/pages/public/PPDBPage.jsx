import { useState } from 'react'
import {
    FileText,
    Upload,
    CheckCircle,
    Search,
    ArrowRight,
    ArrowLeft,
    User,
    School,
    MapPin,
    Phone,
    Calendar,
    FileCheck,
    Printer,
    Loader2,
    X,
    XCircle
} from 'lucide-react'
import './PPDBPage.css'
import PPDBProofModal from '../../components/ppdb/PPDBProofModal'

const steps = [
    { id: 1, label: 'Data Diri', icon: User },
    { id: 2, label: 'Asal Sekolah', icon: School },
    { id: 3, label: 'Upload Berkas', icon: Upload },
    { id: 4, label: 'Konfirmasi', icon: FileCheck },
]

function PPDBPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [checkStatus, setCheckStatus] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [registrationId, setRegistrationId] = useState('')
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [statusResult, setStatusResult] = useState(null)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [isCheckingStatus, setIsCheckingStatus] = useState(false)

    // New State for Proof Modal
    const [showProofModal, setShowProofModal] = useState(false)
    const [submissionData, setSubmissionData] = useState(null)

    const [formData, setFormData] = useState({
        fullName: '',
        birthPlace: '',
        birthDate: '',
        gender: '',
        address: '',
        phone: '',
        parentName: '',
        parentPhone: '',
        previousSchool: '',
        previousSchoolAddress: '',
        graduationYear: '',
        nisn: '',
    })
    const [files, setFiles] = useState({
        ijazah: null,
        kk: null,
        akta: null,
        photo: null
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: e.target.files[0]
        })
    }

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleSubmit = async () => {
        if (!isConfirmed) {
            alert('Mohon centang pernyataan konfirmasi terlebih dahulu.')
            return
        }

        setIsLoading(true)

        try {
            const formDataToSend = new FormData();

            // Append text fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            // Append files
            if (files.ijazah) formDataToSend.append('ijazah', files.ijazah);
            if (files.kk) formDataToSend.append('kk', files.kk);
            if (files.akta) formDataToSend.append('akta', files.akta);
            if (files.photo) formDataToSend.append('photo', files.photo);

            const response = await fetch('http://localhost:5001/api/ppdb', {
                method: 'POST',
                // Content-Type header is automatically set by browser for FormData
                body: formDataToSend
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Terjadi kesalahan saat mendaftar')
            }

            const regId = result.registrationId || result.data?.registrationId
            setRegistrationId(regId)
            setSubmissionData(result) // Save full data for proof

            // Save to local storage for demo purposes/status check
            localStorage.setItem('lastRegistrationId', regId)

            setIsSubmitted(true)
            window.scrollTo(0, 0)

        } catch (error) {
            console.error('Submission error:', error)
            alert(error.message || 'Gagal mengirim pendaftaran. Silakan coba lagi.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCheckStatus = async () => {
        if (!checkStatus) {
            alert('Mohon masukkan nomor pendaftaran')
            return
        }

        setIsCheckingStatus(true)

        try {
            const response = await fetch(`http://localhost:5001/api/ppdb/${checkStatus}`)

            if (response.ok) {
                const data = await response.json()
                setSubmissionData(data) // Save full data for proof
                setStatusResult({
                    status: 'found',
                    message: data.status === 'PENDING' ? 'Berkas Sedang Diverifikasi' :
                        data.status === 'ACCEPTED' ? 'Selamat! Anda Diterima' :
                            data.status === 'REJECTED' ? 'Mohon Maaf, Anda Belum Diterima' : 'Status: ' + data.status,
                    id: data.registrationId
                })
            } else {
                setStatusResult({
                    status: 'not_found',
                    message: 'Data Tidak Ditemukan',
                    id: checkStatus
                })
                setSubmissionData(null)
            }
        } catch (error) {
            console.error("Error checking status:", error)
            setStatusResult({
                status: 'error',
                message: 'Terjadi Kesalahan Server',
                id: checkStatus
            })
        } finally {
            setIsCheckingStatus(false)
            setShowStatusModal(true)
        }
    }

    const handlePrint = () => {
        if (submissionData) {
            setShowProofModal(true)
        } else {
            window.print() // Fallback if no data
        }
    }

    return (
        <div className="ppdb-page">
            {/* Hero */}
            <section className="ppdb-hero">
                <div className="container">
                    <span className="section-badge">PPDB 2025/2026</span>
                    <h1>Pendaftaran Peserta Didik Baru</h1>
                    <p>Daftarkan diri Anda untuk menjadi bagian dari keluarga besar SMA Negeri 1</p>
                </div>
            </section>

            {/* Registration Form Section */}
            <section className="section ppdb-form-section">
                <div className="container">
                    <div className="ppdb-grid">
                        {/* Left - Form */}
                        <div className="ppdb-form-container">
                            <div className="card ppdb-card">
                                {isSubmitted ? (
                                    <div className="success-view animate-fade-in">
                                        <div className="success-icon">
                                            <CheckCircle size={64} />
                                        </div>
                                        <h2>Pendaftaran Berhasil!</h2>
                                        <p>Terima kasih telah mendaftar. Data Anda telah kami terima.</p>

                                        <div className="registration-details">
                                            <span className="label">Nomor Pendaftaran Anda:</span>
                                            <span className="registration-id">{registrationId}</span>
                                            <p className="note">Mohon simpan nomor pendaftaran ini untuk mengecek status seleksi.</p>
                                        </div>

                                        <div className="success-actions">
                                            <button className="btn btn-secondary" onClick={handlePrint}>
                                                <Printer size={18} />
                                                Cetak Bukti Pendaftaran
                                            </button>
                                            <button className="btn btn-primary" onClick={() => window.location.reload()}>
                                                <FileText size={18} />
                                                Daftar Baru
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Step Indicator */}
                                        <div className="step-indicator">
                                            {steps.map((step, index) => (
                                                <div
                                                    key={step.id}
                                                    className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                                                >
                                                    <div className="step-circle">
                                                        {currentStep > step.id ? (
                                                            <CheckCircle size={20} />
                                                        ) : (
                                                            <step.icon size={20} />
                                                        )}
                                                    </div>
                                                    <span className="step-label">{step.label}</span>
                                                    {index < steps.length - 1 && <div className="step-line"></div>}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Form Steps */}
                                        <div className="form-content">
                                            {currentStep === 1 && (
                                                <div className="form-step animate-fade-in">
                                                    <h3>Data Diri Calon Siswa</h3>
                                                    <div className="form-row">
                                                        <div className="form-group">
                                                            <label className="form-label">Nama Lengkap *</label>
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                name="fullName"
                                                                value={formData.fullName}
                                                                onChange={handleInputChange}
                                                                placeholder="Masukkan nama lengkap"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-row two-col">
                                                        <div className="form-group">
                                                            <label className="form-label">Tempat Lahir *</label>
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                name="birthPlace"
                                                                value={formData.birthPlace}
                                                                onChange={handleInputChange}
                                                                placeholder="Kota kelahiran"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Tanggal Lahir *</label>
                                                            <input
                                                                type="date"
                                                                className="form-input"
                                                                name="birthDate"
                                                                value={formData.birthDate}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Jenis Kelamin *</label>
                                                        <select
                                                            className="form-input form-select"
                                                            name="gender"
                                                            value={formData.gender}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <option value="">Pilih jenis kelamin</option>
                                                            <option value="L">Laki-laki</option>
                                                            <option value="P">Perempuan</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Alamat Lengkap *</label>
                                                        <textarea
                                                            className="form-input form-textarea"
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleInputChange}
                                                            placeholder="Masukkan alamat lengkap"
                                                            rows={3}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-row two-col">
                                                        <div className="form-group">
                                                            <label className="form-label">No. HP Siswa *</label>
                                                            <input
                                                                type="tel"
                                                                className="form-input"
                                                                name="phone"
                                                                value={formData.phone}
                                                                onChange={handleInputChange}
                                                                placeholder="08xxxxxxxxxx"
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">NISN</label>
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                name="nisn"
                                                                value={formData.nisn}
                                                                onChange={handleInputChange}
                                                                placeholder="10 digit NISN"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {currentStep === 2 && (
                                                <div className="form-step animate-fade-in">
                                                    <h3>Data Asal Sekolah & Orang Tua</h3>
                                                    <div className="form-group">
                                                        <label className="form-label">Nama Sekolah Asal *</label>
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            name="previousSchool"
                                                            value={formData.previousSchool}
                                                            onChange={handleInputChange}
                                                            placeholder="contoh: SMP Negeri 1 Contoh"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Alamat Sekolah Asal</label>
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            name="previousSchoolAddress"
                                                            value={formData.previousSchoolAddress}
                                                            onChange={handleInputChange}
                                                            placeholder="Alamat sekolah asal"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Tahun Lulus *</label>
                                                        <select
                                                            className="form-input form-select"
                                                            name="graduationYear"
                                                            value={formData.graduationYear}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="">Pilih tahun lulus</option>
                                                            <option value="2025">2025</option>
                                                            <option value="2024">2024</option>
                                                            <option value="2023">2023</option>
                                                        </select>
                                                    </div>
                                                    <hr className="form-divider" />
                                                    <div className="form-row two-col">
                                                        <div className="form-group">
                                                            <label className="form-label">Nama Orang Tua/Wali *</label>
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                name="parentName"
                                                                value={formData.parentName}
                                                                onChange={handleInputChange}
                                                                placeholder="Nama lengkap orang tua"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">No. HP Orang Tua *</label>
                                                            <input
                                                                type="tel"
                                                                className="form-input"
                                                                name="parentPhone"
                                                                value={formData.parentPhone}
                                                                onChange={handleInputChange}
                                                                placeholder="08xxxxxxxxxx"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {currentStep === 3 && (
                                                <div className="form-step animate-fade-in">
                                                    <h3>Upload Berkas Persyaratan</h3>
                                                    <p className="form-note">
                                                        Pastikan berkas yang diupload dalam format PDF atau gambar (JPG/PNG) dengan ukuran maksimal 2MB.
                                                    </p>
                                                    <div className="upload-grid">
                                                        <div className="upload-item">
                                                            <div className="upload-box">
                                                                <Upload size={32} />
                                                                <span>Ijazah / SKL</span>
                                                                <input
                                                                    type="file"
                                                                    className="file-input"
                                                                    name="ijazah"
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    onChange={handleFileChange}
                                                                />
                                                            </div>
                                                            <span className="upload-status required">Wajib</span>
                                                        </div>
                                                        <div className="upload-item">
                                                            <div className="upload-box">
                                                                <Upload size={32} />
                                                                <span>Kartu Keluarga</span>
                                                                <input
                                                                    type="file"
                                                                    className="file-input"
                                                                    name="kk"
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    onChange={handleFileChange}
                                                                />
                                                            </div>
                                                            <span className="upload-status required">Wajib</span>
                                                        </div>
                                                        <div className="upload-item">
                                                            <div className="upload-box">
                                                                <Upload size={32} />
                                                                <span>Akta Kelahiran</span>
                                                                <input
                                                                    type="file"
                                                                    className="file-input"
                                                                    name="akta"
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    onChange={handleFileChange}
                                                                />
                                                            </div>
                                                            <span className="upload-status required">Wajib</span>
                                                        </div>
                                                        <div className="upload-item">
                                                            <div className="upload-box">
                                                                <Upload size={32} />
                                                                <span>Pas Foto 3x4</span>
                                                                <input
                                                                    type="file"
                                                                    className="file-input"
                                                                    name="photo"
                                                                    accept=".jpg,.jpeg,.png"
                                                                    onChange={handleFileChange}
                                                                />
                                                            </div>
                                                            <span className="upload-status required">Wajib</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {currentStep === 4 && (
                                                <div className="form-step animate-fade-in">
                                                    <h3>Konfirmasi Data Pendaftaran</h3>
                                                    <div className="confirmation-box">
                                                        <div className="confirmation-section">
                                                            <h4><User size={18} /> Data Diri</h4>
                                                            <div className="confirmation-grid">
                                                                <div className="confirmation-item">
                                                                    <span className="label">Nama Lengkap</span>
                                                                    <span className="value">{formData.fullName || '-'}</span>
                                                                </div>
                                                                <div className="confirmation-item">
                                                                    <span className="label">Tempat, Tgl Lahir</span>
                                                                    <span className="value">{formData.birthPlace || '-'}, {formData.birthDate || '-'}</span>
                                                                </div>
                                                                <div className="confirmation-item">
                                                                    <span className="label">Alamat</span>
                                                                    <span className="value">{formData.address || '-'}</span>
                                                                </div>
                                                                <div className="confirmation-item">
                                                                    <span className="label">No. HP</span>
                                                                    <span className="value">{formData.phone || '-'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="confirmation-section">
                                                            <h4><School size={18} /> Data Sekolah & Orang Tua</h4>
                                                            <div className="confirmation-grid">
                                                                <div className="confirmation-item">
                                                                    <span className="label">Sekolah Asal</span>
                                                                    <span className="value">{formData.previousSchool || '-'}</span>
                                                                </div>
                                                                <div className="confirmation-item">
                                                                    <span className="label">Tahun Lulus</span>
                                                                    <span className="value">{formData.graduationYear || '-'}</span>
                                                                </div>
                                                                <div className="confirmation-item">
                                                                    <span className="label">Nama Orang Tua</span>
                                                                    <span className="value">{formData.parentName || '-'}</span>
                                                                </div>
                                                                <div className="confirmation-item">
                                                                    <span className="label">No. HP Orang Tua</span>
                                                                    <span className="value">{formData.parentPhone || '-'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="confirmation-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                id="confirm"
                                                                checked={isConfirmed}
                                                                onChange={(e) => setIsConfirmed(e.target.checked)}
                                                            />
                                                            <label htmlFor="confirm">
                                                                Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan.
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Form Actions */}
                                        <div className="form-actions">
                                            {currentStep > 1 && (
                                                <button className="btn btn-secondary" onClick={prevStep}>
                                                    <ArrowLeft size={18} />
                                                    Sebelumnya
                                                </button>
                                            )}
                                            {currentStep < 4 ? (
                                                <button className="btn btn-primary" onClick={nextStep}>
                                                    Selanjutnya
                                                    <ArrowRight size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={handleSubmit}
                                                    disabled={isLoading || !isConfirmed}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 size={18} className="animate-spin" />
                                                            Memproses...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileText size={18} />
                                                            Kirim Pendaftaran
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>


                        {/* Right - Status Check */}
                        <div className="ppdb-sidebar">
                            <div className="card status-check-card">
                                <h3><Search size={20} /> Cek Status Pendaftaran</h3>
                                <p>Masukkan nomor pendaftaran untuk mengecek status seleksi Anda.</p>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Nomor Pendaftaran (misal: PPDB2025001)"
                                        value={checkStatus}
                                        onChange={(e) => setCheckStatus(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary btn-full"
                                    onClick={handleCheckStatus}
                                    disabled={isCheckingStatus}
                                >
                                    {isCheckingStatus ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Mengecek...
                                        </>
                                    ) : (
                                        'Cek Status'
                                    )}
                                </button>
                            </div>

                            <div className="card info-card">
                                <h3><Calendar size={20} /> Jadwal PPDB</h3>
                                <ul className="info-list">
                                    <li>
                                        <span className="info-date">15 Jan - 28 Feb 2025</span>
                                        <span className="info-label">Pendaftaran Online</span>
                                    </li>
                                    <li>
                                        <span className="info-date">1 - 5 Mar 2025</span>
                                        <span className="info-label">Verifikasi Berkas</span>
                                    </li>
                                    <li>
                                        <span className="info-date">10 Mar 2025</span>
                                        <span className="info-label">Pengumuman Hasil</span>
                                    </li>
                                    <li>
                                        <span className="info-date">12 - 15 Mar 2025</span>
                                        <span className="info-label">Daftar Ulang</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="card info-card">
                                <h3><FileCheck size={20} /> Persyaratan</h3>
                                <ul className="checklist">
                                    <li><CheckCircle size={16} /> Fotokopi Ijazah / SKL (legalisir)</li>
                                    <li><CheckCircle size={16} /> Fotokopi Kartu Keluarga</li>
                                    <li><CheckCircle size={16} /> Fotokopi Akta Kelahiran</li>
                                    <li><CheckCircle size={16} /> Pas Foto 3x4 (3 lembar)</li>
                                    <li><CheckCircle size={16} /> Surat Keterangan Sehat</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section >


            {/* Status Modal */}
            {
                showStatusModal && (
                    <div className="modal-overlay animate-fade-in" onClick={() => setShowStatusModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setShowStatusModal(false)}>
                                <X size={24} />
                            </button>

                            <div className="status-result animate-scale-in">
                                <div className={`status-header ${statusResult?.status === 'found' && statusResult?.message.includes('Diterima') ? 'bg-success' :
                                    statusResult?.status === 'found' && statusResult?.message.includes('Ditolak') ? 'bg-danger' : 'bg-primary'}`}>
                                    {statusResult?.status === 'found' ? (
                                        statusResult.message.includes('Diterima') ? <CheckCircle size={64} className="text-white" /> :
                                            statusResult.message.includes('Ditolak') ? <XCircle size={64} className="text-white" /> :
                                                <FileText size={64} className="text-white" />
                                    ) : (
                                        <Search size={64} className="text-white" />
                                    )}
                                </div>

                                <div className="status-body">
                                    <h3>Status Pendaftaran</h3>
                                    <div className="status-card">
                                        <div className="status-row">
                                            <span className="label">Nomor Pendaftaran</span>
                                            <span className="value mono">{statusResult?.id}</span>
                                        </div>
                                        <div className="status-divider"></div>
                                        <div className="status-row center">
                                            <span className={`status-badge-lg ${statusResult?.message.includes('Diterima') ? 'success' :
                                                statusResult?.message.includes('Ditolak') ? 'danger' :
                                                    statusResult?.status === 'not_found' ? 'neutral' : 'warning'
                                                }`}>
                                                {statusResult?.message}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="status-note">
                                        {statusResult?.message.includes('Diterima')
                                            ? 'Selamat! Silakan lakukan daftar ulang sesuai jadwal yang ditentukan.'
                                            : statusResult?.message.includes('Ditolak')
                                                ? 'Tetap semangat! Masih ada kesempatan di lain waktu.'
                                                : statusResult?.status === 'not_found'
                                                    ? 'Data tidak ditemukan. Pastikan nomor pendaftaran Anda benar.'
                                                    : 'Mohon pantau terus halaman ini untuk update selanjutnya.'}
                                    </p>

                                    <div className="status-actions">
                                        {statusResult?.status === 'found' && (
                                            <button className="btn btn-secondary btn-full mb-2" onClick={() => setShowProofModal(true)}>
                                                <Printer size={18} style={{ marginRight: '8px' }} />
                                                Cetak Bukti Pendaftaran
                                            </button>
                                        )}
                                        <button className="btn btn-primary btn-full" onClick={() => setShowStatusModal(false)}>
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Proof Modal */}
            <PPDBProofModal
                isOpen={showProofModal}
                onClose={() => setShowProofModal(false)}
                data={submissionData}
            />
        </div >
    )
}

export default PPDBPage
