import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import './ContactPage.css'
import API_BASE_URL from '../../config/api'

function ContactPage() {
    const { settings } = useSettings()

    // Fallback values if settings not loaded yet
    const schoolAddress = settings?.schoolAddress || 'Jl. Pendidikan No. 123, Kota Contoh'
    const schoolPhone = settings?.schoolPhone || '(021) 1234-5678'
    const schoolEmail = settings?.schoolEmail || 'info@sekolah.sch.id'

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null) // success, error

    // Better handler utilizing name attribute which I will add to inputs
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', subject: '', message: '' })
            } else {
                setStatus('error')
            }
        } catch (error) {
            console.error("Error sending message:", error)
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="container">
                    <span className="section-badge">Hubungi Kami</span>
                    <h1>Kontak</h1>
                    <p>Hubungi kami untuk informasi lebih lanjut tentang {settings?.schoolName || 'Sekolah Kami'}</p>
                </div>
            </section>

            <section className="section contact-section">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h2>Informasi Kontak</h2>
                            <p>Silakan hubungi kami melalui informasi di bawah ini atau kirim pesan melalui formulir.</p>

                            <div className="info-cards">
                                <div className="info-card">
                                    <div className="info-icon"><MapPin size={24} /></div>
                                    <div className="info-content">
                                        <h4>Alamat</h4>
                                        <p>{schoolAddress}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon"><Phone size={24} /></div>
                                    <div className="info-content">
                                        <h4>Telepon</h4>
                                        <p>{schoolPhone}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon"><Mail size={24} /></div>
                                    <div className="info-content">
                                        <h4>Email</h4>
                                        <p>{schoolEmail}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon"><Clock size={24} /></div>
                                    <div className="info-content">
                                        <h4>Jam Operasional</h4>
                                        <p>Senin - Jumat: 07.00 - 15.00 WIB<br />Sabtu: 07.00 - 12.00 WIB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-container">
                            <div className="card contact-form-card">
                                <h3>Kirim Pesan</h3>
                                {status === 'success' && <div className="alert success" style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>Pesan berhasil dikirim! Kami akan segera membalasnya.</div>}
                                {status === 'error' && <div className="alert error" style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>Gagal mengirim pesan. Silakan coba lagi.</div>}

                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="form-row two-col">
                                        <div className="form-group">
                                            <label className="form-label">Nama Lengkap</label>
                                            <input type="text" name="name" className="form-input" placeholder="Nama Anda" value={formData.name} onChange={handleInputChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input type="email" name="email" className="form-input" placeholder="email@example.com" value={formData.email} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Subjek</label>
                                        <input type="text" name="subject" className="form-input" placeholder="Subjek pesan" value={formData.subject} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Pesan</label>
                                        <textarea name="message" className="form-input form-textarea" placeholder="Tulis pesan Anda..." rows={5} value={formData.message} onChange={handleInputChange} required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                        {loading ? 'Mengirim...' : 'Kirim Pesan'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="map-section">
                <div className="map-placeholder">
                    <MapPin size={48} />
                    <span>Google Maps akan ditampilkan di sini</span>
                </div>
            </section>
        </div>
    )
}

export default ContactPage
