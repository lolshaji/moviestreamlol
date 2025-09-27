import React, { useState, useEffect } from 'react';
import { DownloadedContent, Episode, Movie } from '../types';
import PlayIcon from './icons/PlayIcon';
import CloseIcon from './icons/CloseIcon';

const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

interface DownloadingItemInfo {
    progress: number;
    status: 'downloading' | 'error';
    name: string;
}
type DownloadState = Record<number, DownloadingItemInfo>;

interface DownloadsPageProps {
    downloads: DownloadedContent[];
    downloadingItems: DownloadState;
    onDelete: (id: number) => void;
    onCancel: (id: number) => void;
    onPlay: (item: DownloadedContent) => void;
}

const DownloadsPage: React.FC<DownloadsPageProps> = ({ downloads, downloadingItems, onDelete, onCancel, onPlay }) => {
    const [storage, setStorage] = useState({ usage: 0, quota: 0 });

    useEffect(() => {
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(({ usage, quota }) => {
                setStorage({ usage: usage || 0, quota: quota || 0 });
            });
        }
    }, [downloads]);

    const usagePercent = storage.quota > 0 ? (storage.usage / storage.quota) * 100 : 0;
    const activeDownloads = Object.entries(downloadingItems);

    const renderCompletedItem = (item: DownloadedContent) => {
        const { content } = item;
        let poster: string, title: string, description: string, id: number;

        if ('type' in content && content.type === 'movie') {
            poster = content.posterPath;
            title = content.title;
            description = content.genres.join(', ');
            id = content.id;
        } else {
            const episode = content as Episode & { showTitle: string };
            poster = episode.thumbnailPath;
            title = episode.showTitle;
            description = `S${(item.content as any).seasonNumber || 1}:E${episode.episodeNumber} - ${episode.title}`;
            id = episode.id;
        }

        return (
            <div key={id} className="bg-brand-dark rounded-lg flex p-3 items-center space-x-4">
                <img src={poster} alt={title} className="w-20 h-28 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                    <h3 className="font-bold truncate text-white">{title}</h3>
                    <p className="text-sm text-gray-400 truncate">{description}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button onClick={() => onPlay(item)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                       <PlayIcon className="w-5 h-5 text-white" />
                    </button>
                    <button onClick={() => onDelete(id)} className="p-2 bg-red-600/50 rounded-full hover:bg-red-600/80 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                           <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 md:pt-32 px-4 sm:px-6 lg:px-8 pb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">My Downloads</h1>

            {activeDownloads.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 text-gray-300">Active Downloads</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* FIX: Explicitly type `info` to resolve properties 'name' and 'progress' not existing on type 'unknown'. */}
                        {activeDownloads.map(([id, info]: [string, DownloadingItemInfo]) => (
                            <div key={id} className="bg-brand-dark rounded-lg p-3 flex items-center space-x-4">
                                <div className="flex-grow overflow-hidden">
                                    <h3 className="font-semibold truncate text-white">{info.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div className="w-full h-2 bg-gray-700 rounded-full">
                                            <div className="h-2 bg-brand-red rounded-full transition-all duration-300" style={{ width: `${info.progress}%` }}></div>
                                        </div>
                                        <span className="text-sm text-gray-300">{info.progress}%</span>
                                    </div>
                                </div>
                                <button onClick={() => onCancel(Number(id))} className="p-2 bg-red-600/50 rounded-full hover:bg-red-600/80 transition flex-shrink-0">
                                    <CloseIcon className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Storage</h2>
                <div className="bg-brand-dark p-6 rounded-lg border border-gray-700 storage-glow">
                     <div className="flex justify-between items-center mb-2 text-gray-400">
                        <span>Browser Storage</span>
                        <span>{formatBytes(storage.usage)} / {formatBytes(storage.quota)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-brand-red h-2.5 rounded-full" style={{ width: `${usagePercent}%` }}></div>
                    </div>
                </div>
            </div>

            <div>
                 <h2 className="text-xl font-semibold mb-4 text-gray-300">Completed</h2>
                {downloads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {downloads.map(renderCompletedItem)}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-brand-dark rounded-lg">
                        <h2 className="text-2xl font-semibold text-gray-300">Nothing Downloaded Yet</h2>
                        <p className="text-gray-500 mt-2">Movies and shows you download will appear here.</p>
                    </div>
                )}
            </div>
            <style>{`
                .storage-glow {
                    box-shadow: 0 0 15px 2px rgba(229, 9, 20, 0.4);
                    animation: pulse-glow 3s infinite alternate;
                }
                @keyframes pulse-glow {
                    from {
                        box-shadow: 0 0 15px 2px rgba(229, 9, 20, 0.4);
                    }
                    to {
                        box-shadow: 0 0 25px 5px rgba(229, 9, 20, 0.6);
                    }
                }
            `}</style>
        </div>
    );
};

export default DownloadsPage;