import { useState, useEffect } from 'react'
import { MessageSquare, Search, Trash2, Loader2, RefreshCw, Mail } from 'lucide-react'
import './AdminPages.css'

function ContactManagement() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:5001/api/contact')
            if (response.ok) {
                const data = await response.json()
                setMessages(data)
            }
        } catch (error) {
            console.error("Error fetching messages:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return
        try {
            const response = await fetch(`http://localhost:5001/api/contact/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) fetchMessages()
        } catch (error) {
            console.error("Error deleting message:", error)
        }
    }

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1><MessageSquare size={28} /> Pesan Masuk</h1>
                <p>Kelola pesan dari halaman kontak</p>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Cari pesan (Nama/Email/Subjek)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-secondary" onClick={fetchMessages}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    {loading ? (
                        <div className="loading-state"><Loader2 className="animate-spin" /> Memuat pesan...</div>
                    ) : (
                        <table className="table">
                            <thead><tr><th>Tanggal</th><th>Pengirim</th><th>Subjek</th><th>Pesan</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {filteredMessages.length > 0 ? filteredMessages.map((m) => (
                                    <tr key={m.id}>
                                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(m.createdAt).toLocaleDateString()} <br /><small>{new Date(m.createdAt).toLocaleTimeString()}</small></td>
                                        <td>
                                            <strong>{m.name}</strong><br />
                                            <a href={`mailto:${m.email}`} className="text-secondary" style={{ fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Mail size={12} /> {m.email}
                                            </a>
                                        </td>
                                        <td>{m.subject}</td>
                                        <td style={{ maxWidth: '300px' }}>{m.message}</td>
                                        <td className="action-cell">
                                            <button className="btn-icon danger" title="Hapus" onClick={() => handleDelete(m.id)}><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="5" className="text-center">Tidak ada pesan masuk</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContactManagement
