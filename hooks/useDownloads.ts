import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Movie, Episode, DownloadedContent } from '../types';
import * as downloadService from '../services/downloadService';

interface DownloadingItemInfo {
    progress: number;
    status: 'downloading' | 'error';
    name: string;
}
type DownloadState = Record<number, DownloadingItemInfo>;


interface DownloadsContextType {
    downloads: DownloadedContent[];
    downloadingItems: DownloadState;
    startDownload: (item: Movie | Episode, showTitle: string) => void;
    deleteDownload: (id: number) => void;
    cancelDownload: (id: number) => void;
    isDownloaded: (id: number) => boolean;
}

const DownloadsContext = createContext<DownloadsContextType | null>(null);

export const DownloadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [downloads, setDownloads] = useState<DownloadedContent[]>([]);
    const [downloadingItems, setDownloadingItems] = useState<DownloadState>({});
    const abortControllers = useRef<Record<number, AbortController>>({});

    const refreshDownloads = useCallback(async () => {
        const items = await downloadService.getDownloadedContent();
        const mappedItems = items.map(item => ({
            content: item.content,
            blobUrl: URL.createObjectURL(item.blob),
        }));
        setDownloads(mappedItems);
    }, []);

    useEffect(() => {
        refreshDownloads();
        
        return () => {
            downloads.forEach(d => URL.revokeObjectURL(d.blobUrl));
            // FIX: Explicitly type `controller` as AbortController to resolve 'abort' property not existing on type 'unknown'.
            Object.values(abortControllers.current).forEach((controller: AbortController) => controller.abort());
        };
    }, []);

    const startDownload = async (item: Movie | Episode, showTitle: string) => {
        if (downloadingItems[item.id] || downloads.some(d => d.content.id === item.id)) {
            console.log("Already downloading or downloaded");
            return;
        }

        const controller = new AbortController();
        abortControllers.current[item.id] = controller;
        
        const name = 'type' in item ? item.title : `${showTitle}: ${item.title}`;
        setDownloadingItems(prev => ({ ...prev, [item.id]: { progress: 0, status: 'downloading', name } }));
        
        try {
            await downloadService.downloadContent(item, showTitle, (progress) => {
                setDownloadingItems(prev => {
                    if (!prev[item.id]) return prev; // It might have been cancelled
                    return { ...prev, [item.id]: { ...prev[item.id], progress } };
                });
            }, controller.signal);
            await refreshDownloads();
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                 console.log(`Download for ${name} cancelled.`);
            } else {
                console.error("Download failed:", error);
                setDownloadingItems(prev => ({ ...prev, [item.id]: { ...prev[item.id], status: 'error' } }));
            }
        } finally {
             delete abortControllers.current[item.id];
             setTimeout(() => {
                setDownloadingItems(prev => {
                    const newState = { ...prev };
                    delete newState[item.id];
                    return newState;
                });
            }, 2000);
        }
    };
    
    const cancelDownload = (id: number) => {
        const controller = abortControllers.current[id];
        if (controller) {
            controller.abort();
        }
        setDownloadingItems(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const deleteDownload = async (id: number) => {
        const itemToDelete = downloads.find(d => d.content.id === id);
        if (itemToDelete) {
            URL.revokeObjectURL(itemToDelete.blobUrl);
        }

        await downloadService.deleteDownloadedItem(id);
        await refreshDownloads();
    };
    
    const isDownloaded = (id: number) => downloads.some(d => d.content.id === id);

    return React.createElement(DownloadsContext.Provider, { value: { downloads, downloadingItems, startDownload, deleteDownload, cancelDownload, isDownloaded } }, children);
};

export const useDownloads = () => {
    const context = useContext(DownloadsContext);
    if (!context) {
        throw new Error('useDownloads must be used within a DownloadsProvider');
    }
    return context;
};