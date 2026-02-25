import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ImageCard from '../components/ImageCard';
import { Loader } from 'lucide-react';

const Category = () => {
    const { type } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                let url = `/images`;
                const params = new URLSearchParams();

                if (type !== 'all') {
                    if (['car', 'bike', 'old', 'modern'].includes(type)) {
                        params.append('category', type);
                    } else if (['premium', 'free'].includes(type)) {
                        params.append('type', type);
                    }
                }

                if (searchQuery) {
                    params.append('search', searchQuery);
                }

                const queryStr = params.toString();
                if (queryStr) {
                    url += `?${queryStr}`;
                }

                const { data } = await api.get(url);
                if (Array.isArray(data)) {
                    setImages(data);
                } else {
                    console.error('API returned non-array data:', data);
                    setError('Error: API did not return data correctly.');
                }
            } catch (err) {
                console.error("API Request Error:", err);
                setError('Failed to load images');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [type, searchQuery]);

    // Format title safely
    const displayType = type || 'all';
    const title = displayType === 'all' ? (searchQuery ? `Search Results for "${searchQuery}"` : 'All Collection') : `${displayType.charAt(0).toUpperCase() + displayType.slice(1)} Collection`;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold gold-gradient pb-2">{title}</h1>
                <div className="h-1 w-20 bg-gold-500 mx-auto rounded-full mt-4"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="h-10 w-10 text-gold-500 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500 p-8 glass-card rounded-2xl">
                    <p>{error}</p>
                </div>
            ) : images.length === 0 ? (
                <div className="text-center text-gray-400 p-12 glass border border-white/5 rounded-2xl">
                    <p className="text-xl">No vehicles found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images.map((img) => (
                        <ImageCard key={img._id} image={img} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Category;
