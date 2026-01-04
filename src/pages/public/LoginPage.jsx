import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, GraduationCap, ArrowRight } from 'lucide-react'
import './LoginPage.css'

const LoginPage = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
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
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            // Save token and user info
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            // Redirect based on role
            if (['ADMIN', 'STAFF'].includes(data.user.role)) {
                navigate('/admin')
            } else {
                navigate('/portal')
            }
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
                    <h1>Login Portal</h1>
                    <p>Masuk untuk mengakses layanan akademik</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email / NIS / NIP</label>
                        <div className="input-wrapper">
                            <User size={20} />
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Masukkan Email, NIS, atau NIP"
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
                                placeholder="Masukkan password Anda"
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

                    <div className="form-footer">
                        <Link to="/forgot-password" className="forgot-password">
                            Lupa Password?
                        </Link>
                        <Link to="/register" className="forgot-password" style={{ marginLeft: 'auto' }}>
                            Daftar Akun
                        </Link>
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Memproses...' : (
                            <>
                                Masuk <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Belum punya akun? Hubungi Tata Usaha Sekolah.</p>
                    <Link to="/" className="back-home">Kembali ke Beranda</Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
