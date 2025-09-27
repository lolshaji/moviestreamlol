import React, { useState, useEffect } from 'react';

const StarIcon: React.FC<{ filled: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void; }> = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg 
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-12 h-12 cursor-pointer transition-transform duration-200 hover:scale-110 ${filled ? 'text-yellow-400' : 'text-gray-600'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const RateUsPage: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const hasRated = localStorage.getItem('thelden_rated');
        if (hasRated) {
            setSubmitted(true);
        }
    }, []);

    const handleSubmit = () => {
        if (rating > 0) {
            console.log("Rating submitted:", rating);
            localStorage.setItem('thelden_rated', 'true');
            setSubmitted(true);
        }
    }

    if(submitted) {
        return (
             <div className="min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
                <div className="relative">
                    <div className="animate-burst">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className={`confetti piece-${i}`}></div>
                        ))}
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 animate-fade-in-up">
                        <h1 className="text-5xl font-bold text-white mb-4">Thank You!</h1>
                        <p className="text-xl text-gray-200">We appreciate your feedback.</p>
                    </div>
                </div>
                <style>{`
                    .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
                    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-burst { position: absolute; top: 50%; left: 50%; width: 1px; height: 1px; }
                    .confetti { position: absolute; width: 8px; height: 16px; background: #f00; opacity: 0; animation: confetti-fall 2s ease-out forwards; }
                    .confetti.piece-0 { transform: rotate(15deg); left: -100px; top: -50px; background-color: #f9c400; animation-delay: 0s; }
                    .confetti.piece-1 { transform: rotate(30deg); left: 100px; top: -100px; background-color: #f53d5a; animation-delay: 0.1s; }
                    .confetti.piece-2 { transform: rotate(45deg); left: 50px; top: -80px; background-color: #2ab7ca; animation-delay: 0.2s; }
                    .confetti.piece-3 { transform: rotate(60deg); left: -150px; top: 0px; background-color: #f9c400; animation-delay: 0.3s; }
                    .confetti.piece-4 { transform: rotate(75deg); left: 120px; top: 20px; background-color: #f53d5a; animation-delay: 0.4s; }
                    .confetti.piece-5 { transform: rotate(90deg); left: -80px; top: 80px; background-color: #2ab7ca; animation-delay: 0.5s; }
                    .confetti.piece-6 { transform: rotate(105deg); left: 150px; top: -30px; background-color: #f9c400; animation-delay: 0.6s; }
                    .confetti.piece-7 { transform: rotate(120deg); left: -50px; top: 100px; background-color: #f53d5a; animation-delay: 0.7s; }
                    .confetti.piece-8 { transform: rotate(135deg); left: 80px; top: -120px; background-color: #2ab7ca; animation-delay: 0.8s; }
                    .confetti.piece-9 { transform: rotate(150deg); left: -120px; top: 50px; background-color: #f9c400; animation-delay: 0.9s; }
                    @keyframes confetti-fall { 0% { opacity: 1; transform: translateY(-100px) rotateZ(0deg); } 100% { opacity: 0; transform: translateY(200px) rotateZ(360deg); } }
                `}</style>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className="w-full max-w-2xl text-center">
                 <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Rate Your Experience</h1>
                    <p className="text-gray-300 mb-8">Tell us how you feel about ThelDen!</p>
                    <div className="flex justify-center space-x-2 mb-8">
                        {[1, 2, 3, 4, 5].map(star => (
                            <StarIcon 
                                key={star}
                                filled={(hoverRating || rating) >= star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>
                    <button onClick={handleSubmit} disabled={rating === 0} className="bg-brand-red font-semibold text-white px-8 py-3 rounded-full hover:bg-red-700 transition transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100">
                        Submit Rating
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default RateUsPage;
