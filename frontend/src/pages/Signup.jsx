import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { Lock, Mail, User } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user, login } = useAuthStore();

    useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setLoading(true);
            setError('');
            const { data } = await api.post('/auth/register', { name, email, password });
            login(data);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 glass-card p-10 rounded-2xl">
                <div>
                    <h2 className="mt-2 text-center text-4xl font-heading font-extrabold text-white">
                        Join the Club
                    </h2>
                    <p className="mt-3 text-center text-sm text-gray-400">
                        Create an account to gain exclusive access.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded relative text-center text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-12 py-3 bg-dark-600/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-lg relative block w-full px-12 py-3 bg-dark-600/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-12 py-3 bg-dark-600/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-12 py-3 bg-dark-600/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-dark-900 bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 focus:ring-offset-dark-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-gold-500 hover:text-gold-400 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
