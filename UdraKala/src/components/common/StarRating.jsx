import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, setRating, readOnly = false, size = 20 }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={`cursor-pointer transition-colors ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        } ${readOnly ? 'cursor-default' : 'hover:scale-110'}`}
                    onClick={() => !readOnly && setRating && setRating(star)}
                />
            ))}
        </div>
    );
};

export default StarRating;
