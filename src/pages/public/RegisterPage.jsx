import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, GraduationCap, ArrowRight, ShieldAlert } from 'lucide-react'
import './LoginPage.css' // Reuse login styles
import API_BASE_URL from '../../config/api'

const RegisterPage = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        adminSecret: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showSecret, setShowSecret] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // ... in fetch call:
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed')
            }

            // Redirect to login on success
            alert('Registrasi berhasil! Silakan login.')
            navigate('/login')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">
                        <GraduationCap size={40} />
                    </div>
                    <h1>Daftar Akun Baru</h1>
                    <p>Buat akun untuk akses sistem akademik</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Nama Lengkap</label>
                        <div className="input-wrapper">
                            <User size={20} />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Masukkan nama lengkap"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                            <User size={20} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Masukkan email aktif"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Buat password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="adminSecret" className="flex items-center gap-2">
                            <ShieldAlert size={16} /> Kode Rahasia (Opsional - Untuk Admin)
                        </label>
                        <div className="input-wrapper">
                            <Lock size={20} />
                            <input
                                type={showSecret ? 'text' : 'password'}
                                id="adminSecret"
                                name="adminSecret"
                                placeholder="Kosongkan jika bukan admin"
                                value={formData.adminSecret}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowSecret(!showSecret)}
                            >
                                {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <small className="text-gray-500 text-xs mt-1 block">
                            Hanya diisi jika Anda mendaftar sebagai Administrator Staff.
                        </small>
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Memproses...' : (
                            <>
                                Daftar Sekarang <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Sudah punya akun?</p>
                    <Link to="/login" className="font-bold text-primary hover:underline">Login disini</Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
