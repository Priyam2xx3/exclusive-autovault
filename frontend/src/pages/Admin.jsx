import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { Loader, Plus, UploadCloud, Trash2 } from 'lucide-react';

const Admin = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('car');
    const [price, setPrice] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [file, setFile] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user || (!user.isAdmin && user.email !== 'admin@example.com')) {
            navigate('/');
            return;
        }

        fetchImages();
    }, [user, navigate]);

    const fetchImages = async () => {
        try {
            const { data } = await api.get('/images');
            setImages(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!file && !uploading) return setMessage('Please select an image file');

        try {
            setUploading(true);
            setMessage('');

            // 1. Upload Image to local storage first (until cloudinary is integrated)
            const formData = new FormData();
            formData.append('image', file);

            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Need to adjust URL. If local, it's http://localhost:5000 + path
            const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
            const imageUrl = `${API_BASE}${uploadRes.data}`;

            // 2. Create Image Record
            await api.post('/images', {
                title,
                description,
                category,
                price: Number(price),
                imageUrl,
                isPremium
            });

            setMessage('Image added successfully!');

            // Reset form
            setTitle('');
            setDescription('');
            setPrice(0);
            setIsPremium(false);
            setFile(null);
            e.target.reset();

            fetchImages();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding image');
        } finally {
            setUploading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await api.delete(`/images/${id}`);
                fetchImages();
            } catch (err) {
                console.error(err);
                alert('Error deleting image');
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="h-10 w-10 text-gold-500 animate-spin" /></div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">Manage your exclusive vault collection.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ADD NEW ITEM FORM */}
                <div className="lg:col-span-1 glass-card p-6 rounded-2xl h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="text-gold-500" /> Add New Vehicle
                    </h2>

                    {message && (
                        <div className={`p-3 mb-4 rounded text-sm ${message.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-dark-600/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="e.g. Bugatti Chiron Pur Sport" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-dark-600 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold-500 outline-none">
                                <option value="car">Car (Modern)</option>
                                <option value="old">Car (Classic/Old)</option>
                                <option value="bike">Bike</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-dark-600/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold-500 outline-none resize-none" placeholder="Brief details..."></textarea>
                        </div>

                        <div className="flex items-center gap-3 py-2">
                            <input type="checkbox" id="isPremium" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4 accent-gold-500 rounded focus:ring-gold-500 focus:ring-2 bg-dark-600 border-gray-600" />
                            <label htmlFor="isPremium" className="text-sm font-medium text-white">Premium Content?</label>
                        </div>

                        {isPremium && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Price (USD)</label>
                                <input type="number" step="0.01" min="1" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-dark-600/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-gold-500 outline-none" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Upload High-Res Image</label>
                            <input type="file" required accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gold-500 file:text-dark-900 hover:file:bg-gold-400 focus:outline-none" />
                        </div>

                        <button type="submit" disabled={uploading} className="w-full mt-4 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                            {uploading ? <Loader className="animate-spin h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
                            {uploading ? 'Uploading...' : 'Publish to Vault'}
                        </button>
                    </form>
                </div>

                {/* INVENTORY LIST */}
                <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
                    <h2 className="text-xl font-bold mb-6">Current Inventory</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="pb-3 px-2">Image</th>
                                    <th className="pb-3 px-2">Title</th>
                                    <th className="pb-3 px-2">Category</th>
                                    <th className="pb-3 px-2">Type</th>
                                    <th className="pb-3 px-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {images.map(img => (
                                    <tr key={img._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-2">
                                            <img src={img.imageUrl} alt={img.title} className="w-12 h-12 object-cover rounded shadow" />
                                        </td>
                                        <td className="py-3 px-2 font-medium truncate max-w-[150px]">{img.title}</td>
                                        <td className="py-3 px-2 uppercase text-xs">{img.category}</td>
                                        <td className="py-3 px-2">
                                            {img.isPremium ? <span className="text-gold-500 text-xs font-bold border border-gold-500/50 px-2 py-1 rounded">PREMIUM</span> : <span className="text-gray-400 text-xs font-bold border border-gray-500/50 px-2 py-1 rounded">FREE</span>}
                                        </td>
                                        <td className="py-3 px-2">
                                            <button onClick={() => deleteHandler(img._id)} className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-400/10 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {images.length === 0 && (
                            <p className="text-center text-gray-400 py-6">No images found. Add some!</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Admin;
