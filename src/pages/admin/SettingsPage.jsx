import { useState, useEffect } from 'react'
import { Settings, Upload, Save, Loader2 } from 'lucide-react'
import './AdminPages.css'
import API_BASE_URL from '../../config/api'

function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        schoolName: '',
        schoolAddress: '',
        schoolPhone: '',
        schoolEmail: '',
        ppdbStatus: 'OPEN',
        ppdbStartDate: '',
        ppdbEndDate: ''
    })

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/settings`)
            if (response.ok) {
                const data = await response.json()
                setSettings({
                    ...data,
                    ppdbStartDate: data.ppdbStartDate ? data.ppdbStartDate.split('T')[0] : '',
                    ppdbEndDate: data.ppdbEndDate ? data.ppdbEndDate.split('T')[0] : ''
                })
            }
        } catch (error) {
            console.error("Error fetching settings:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleInputChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            // Convert date strings back to ISO if needed, or backend handles it
            const dataToSend = {
                ...settings,
                ppdbStartDate: settings.ppdbStartDate ? new Date(settings.ppdbStartDate) : null,
                ppdbEndDate: settings.ppdbEndDate ? new Date(settings.ppdbEndDate) : null
            }

            const response = await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            })

            if (response.ok) {
                alert('Pengaturan berhasil disimpan')
            } else {
                alert('Gagal menyimpan pengaturan')
            }
        } catch (error) {
            console.error("Error saving settings:", error)
            alert('Terjadi kesalahan')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="loading-state"><Loader2 className="animate-spin" /> Memuat pengaturan...</div>

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1><Settings size={28} /> Pengaturan Website</h1>
                <p>Kelola pengaturan umum website sekolah</p>
            </div>

            <form onSubmit={handleSubmit} className="settings-grid" style={{ padding: 0 }}>
                <div className="card settings-card">
                    <h3>Informasi Sekolah</h3>
                    <div className="form-group">
                        <label className="form-label">Nama Sekolah</label>
                        <input type="text" name="schoolName" className="form-input" value={settings.schoolName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Alamat</label>
                        <textarea name="schoolAddress" className="form-input form-textarea" rows={3} value={settings.schoolAddress || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-row two-col">
                        <div className="form-group"><label className="form-label">Telepon</label><input type="text" name="schoolPhone" className="form-input" value={settings.schoolPhone || ''} onChange={handleInputChange} /></div>
                        <div className="form-group"><label className="form-label">Email</label><input type="email" name="schoolEmail" className="form-input" value={settings.schoolEmail || ''} onChange={handleInputChange} /></div>
                    </div>
                </div>

                <div className="card settings-card">
                    <h3>Logo & Branding</h3>
                    <div className="upload-area">
                        <div className="upload-box">
                            <Upload size={32} />
                            <span>Upload Logo Sekolah</span>
                            <p>PNG, JPG maksimal 2MB</p>
                            <button type="button" className="btn btn-sm btn-secondary">Pilih File</button>
                        </div>
                    </div>
                </div>

                <div className="card settings-card">
                    <h3>Pengaturan PPDB</h3>
                    <div className="form-group">
                        <label className="form-label">Status Pendaftaran</label>
                        <select name="ppdbStatus" className="form-input form-select" value={settings.ppdbStatus} onChange={handleInputChange}>
                            <option value="OPEN">Buka</option>
                            <option value="CLOSED">Tutup</option>
                        </select>
                    </div>
                    <div className="form-row two-col">
                        <div className="form-group"><label className="form-label">Tanggal Buka</label><input type="date" name="ppdbStartDate" className="form-input" value={settings.ppdbStartDate} onChange={handleInputChange} /></div>
                        <div className="form-group"><label className="form-label">Tanggal Tutup</label><input type="date" name="ppdbEndDate" className="form-input" value={settings.ppdbEndDate} onChange={handleInputChange} /></div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SettingsPage
