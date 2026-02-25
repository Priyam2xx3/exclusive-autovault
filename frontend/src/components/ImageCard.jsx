import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ImageCard = ({ image }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8 }}
            className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
        >
            <Link to={`/image/${image._id}`} className="block relative overflow-hidden aspect-[4/3]">
                <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 right-4">
                    {image.isPremium ? (
                        <span className="bg-gold-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                            PREMIUM
                        </span>
                    ) : (
                        <span className="bg-gray-200 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                            FREE
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-heading font-bold text-xl mb-1 group-hover:text-gold-400 transition-colors truncate">
                    {image.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {image.description}
                </p>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-2xl font-bold font-heading">
                        {image.isPremium ? `$${image.price}` : 'Free'}
                    </span>
                    <Link
                        to={`/image/${image._id}`}
                        className="text-sm font-semibold text-gold-500 hover:text-gold-400 flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                        View Details <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ImageCard;
