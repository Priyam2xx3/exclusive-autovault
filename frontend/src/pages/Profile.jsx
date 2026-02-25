import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { Loader, Download, Image as ImageIcon } from 'lucide-react';
import ImageCard from '../components/ImageCard';

const Profile = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate]);

    const handleDownload = async (imageUrl, title) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="h-10 w-10 text-gold-500 animate-spin" /></div>;
    if (error) return <div className="min-h-screen pt-24 text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

            <div className="glass-card rounded-2xl p-8 mb-10 flex items-center gap-6">
                <div className="bg-dark-600 h-24 w-24 rounded-full flex items-center justify-center text-4xl font-heading font-bold gold-gradient border-2 border-gold-500/50">
                    {profile?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">{profile?.name}</h1>
                    <p className="text-gray-400">{profile?.email}</p>
                    {profile?.isAdmin && (
                        <span className="inline-block mt-3 bg-red-500/20 text-red-400 text-xs px-3 py-1 rounded-full font-bold border border-red-500/30">
                            ADMINISTRATOR
                        </span>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                    <ImageIcon className="h-6 w-6 text-gold-500" />
                    Your Vault (Purchased & Free Downloads)
                </h2>

                {profile?.purchasedImages?.length === 0 ? (
                    <div className="text-center p-12 glass rounded-2xl border border-white/5">
                        <p className="text-gray-400 text-lg">Your vault is currently empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile?.purchasedImages?.map((img) => (
                            <div key={img._id} className="glass-card rounded-xl overflow-hidden flex flex-col">
                                <div className="aspect-video relative overflow-hidden">
                                    <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <h3 className="font-bold text-lg mb-2 truncate">{img.title}</h3>
                                    <p className="text-xs text-gold-500 mb-4 uppercase tracking-widest font-semibold">{img.category}</p>
                                    <button
                                        onClick={() => handleDownload(img.imageUrl, img.title)}
                                        className="mt-auto w-full bg-dark-600 hover:bg-dark-400 border border-white/10 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Profile;
