import React, { useState } from 'react';
import { useAuth } from '../auth';
import UserIcon from './icons/UserIcon';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [profilePic, setProfilePic] = useState(user?.profilePic || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ name, profilePic });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    }

    return (
         <div className="min-h-screen flex items-center justify-center pt-20 px-4">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 space-y-6">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">Your Profile</h1>
                    
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-600 ring-4 ring-brand-red/50">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-full h-full text-gray-400 p-4" />
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 cursor-not-allowed text-gray-400"
                        />
                    </div>
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition"
                        />
                    </div>
                     <div>
                        <label htmlFor="profilePic" className="block text-sm font-medium text-gray-300">Profile Picture URL</label>
                        <input
                            id="profilePic"
                            type="text"
                            value={profilePic}
                            onChange={(e) => setProfilePic(e.target.value)}
                            className="mt-1 block w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition"
                        />
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-brand-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition">
                            Save Changes
                        </button>
                        {isSaved && <p className="text-green-400 text-center mt-4 animate-fade-in">Profile updated successfully!</p>}
                    </div>

                </form>
            </div>
             <style>{`
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default ProfilePage;
