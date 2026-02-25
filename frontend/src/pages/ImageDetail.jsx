import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { Loader, Download, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [purchasing, setPurchasing] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);

    // Magnifier state
    const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
    const imageRef = useRef(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const { data } = await api.get(`/images/${id}`);
                setImage(data);

                // Check if user already purchased
                if (user && data.isPremium) {
                    const profileRes = await api.get('/auth/profile');
                    const isPurchased = profileRes.data.purchasedImages.some(img => img._id === id || img === id);
                    setHasPurchased(isPurchased);
                }
            } catch (err) {
                setError('Image not found');
            } finally {
                setLoading(false);
            }
        };
        fetchImage();
    }, [id, user]);

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Background multiplier
        const bgX = (x / width) * 100;
        const bgY = (y / height) * 100;

        setZoomStyle({
            display: 'block',
            backgroundImage: `url(${image.imageUrl})`,
            backgroundPosition: `${bgX}% ${bgY}%`,
            left: `${x - 100}px`, // 100 is half of magnifier width
            top: `${y - 100}px`,
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: 'none' });
    };

    const handleDownload = async () => {
        try {
            // Force download via fetch
            const response = await fetch(image.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    const handlePurchase = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setPurchasing(true);
            const { data } = await api.post('/payments/create-checkout-session', { imageId: id });
            window.location.href = data.url; // Redirect to stripe checkout
        } catch (error) {
            alert(error.response?.data?.message || 'Payment initiation failed');
            setPurchasing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="h-12 w-12 text-gold-500 animate-spin" /></div>;
    if (error || !image) return <div className="min-h-screen pt-32 text-center text-red-500 text-xl">{error}</div>;

    return (
        <div className="min-h-[calc(100vh-80px)] pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="glass-card rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/10 shadow-2xl">

                {/* Left: Image Viewer with Magnifier */}
                <div
                    className="relative bg-dark-900 border-r border-white/5 overflow-hidden flex items-center justify-center p-4 cursor-crosshair min-h-[50vh]"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    ref={imageRef}
                >
                    <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                    />
                    {/* Magnifier glass */}
                    <div
                        className="absolute border-4 border-gold-500 rounded-full pointer-events-none shadow-[0_0_20px_rgba(212,175,55,0.6)] z-50 bg-no-repeat"
                        style={{
                            width: '200px',
                            height: '200px',
                            backgroundSize: '300% 300%', // Zoom level
                            ...zoomStyle
                        }}
                    />
                </div>

                {/* Right: Details */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <span className="uppercase tracking-widest text-gold-500 text-sm font-bold mb-2 block">
                                {image.category} Collection
                            </span>
                            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-2 leading-tight">
                                {image.title}
                            </h1>
                        </div>
                    </div>

                    <div className="h-px w-full bg-white/10 my-6"></div>

                    <p className="text-gray-300 text-lg leading-relaxed mb-10">
                        {image.description}
                    </p>

                    <div className="mt-auto flex flex-col gap-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Price</p>
                                <p className="text-5xl font-heading font-bold gold-gradient">
                                    {image.isPremium ? `$${image.price}` : 'Free'}
                                </p>
                            </div>
                        </div>

                        {image.isPremium && !hasPurchased ? (
                            <button
                                onClick={handlePurchase}
                                disabled={purchasing}
                                className="w-full bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:hover:scale-100 uppercase tracking-wider text-xl"
                            >
                                {purchasing ? (
                                    <><Loader className="animate-spin w-6 h-6" /> Processing...</>
                                ) : (
                                    <><ShoppingCart className="w-6 h-6" /> Complete Purchase</>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleDownload}
                                className="w-full glass bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] border border-white/20 uppercase tracking-wider text-xl"
                            >
                                <Download className="w-6 h-6" /> Download Full Resolution
                            </button>
                        )}

                        {hasPurchased && (
                            <p className="text-center text-green-400 text-sm flex items-center justify-center gap-1 font-medium mt-2">
                                <Check className="w-4 h-4" /> Purchased via Vault
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageDetail;
