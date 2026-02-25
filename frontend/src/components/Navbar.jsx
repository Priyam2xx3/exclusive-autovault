import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/category/all?search=${searchQuery}`);
            setSearchQuery('');
            setIsMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { name: 'Cars', path: '/category/car' },
        { name: 'Bikes', path: '/category/bike' },
        { name: 'Old Classics', path: '/category/old' },
        { name: 'Modern', path: '/category/modern' },
        { name: 'Premium', path: '/category/premium' },
        { name: 'Free', path: '/category/free' },
    ];

    return (
        <nav className="fixed w-full z-50 glass border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="text-2xl font-heading font-bold gold-gradient tracking-wide uppercase">
                            AutoVault
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-gray-300 hover:text-gold-400 transition-colors px-3 py-2 text-sm font-medium uppercase tracking-wider"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-dark-600/50 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-gold-500/50 transition-colors w-48 lg:w-64"
                            />
                            <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                        </form>

                        {/* Auth Links */}
                        <div className="flex items-center pl-4 border-l border-white/10 space-x-4">
                            {user ? (
                                <>
                                    {user.isAdmin && (
                                        <Link to="/admin" className="text-gold-500 hover:text-gold-400 text-sm font-medium mr-2">Admin</Link>
                                    )}
                                    <Link to="/profile" className="text-gray-300 hover:text-gold-400 flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium">Login</Link>
                                    <Link to="/signup" className="bg-gold-500 hover:bg-gold-400 text-dark-900 px-4 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-gold-400 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass-card absolute w-full left-0 border-b border-white/10">
                    <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
                        <form onSubmit={handleSearch} className="relative mb-4 mt-2">
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-dark-600/50 w-full border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </form>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-gold-400 uppercase tracking-wider"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-3">
                            {user ? (
                                <>
                                    {user.isAdmin && (
                                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gold-500 hover:text-gold-400 font-bold">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white">
                                        <User className="h-5 w-5" /> Profile
                                    </Link>
                                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 text-left">
                                        <LogOut className="h-5 w-5" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex gap-4 px-3 py-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-dark-600 flex-1 text-center py-2 rounded-full text-white">Login</Link>
                                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-gold-500 flex-1 text-center py-2 rounded-full text-dark-900 font-bold">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
