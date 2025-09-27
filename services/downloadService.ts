import { IDBPDatabase, openDB } from 'idb';
import { Episode, Movie } from '../types';

const DB_NAME = 'ThelDenDB';
const STORE_NAME = 'downloads';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

const initDB = () => {
    if (dbPromise) return dbPromise;
    dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
    return dbPromise;
};

export const downloadContent = async (
    item: Movie | Episode,
    showTitle: string,
    onProgress: (progress: number) => void,
    signal: AbortSignal
): Promise<void> => {
    const db = await initDB();
    const videoUrl = item.videoSources[0]?.url;
    
    if (!videoUrl) {
      throw new Error(`No video source found for item ID: ${item.id}`);
    }

    try {
        const response = await fetch(videoUrl, { signal });
        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        if (!response.body) {
            throw new Error('Response body is null');
        }

        const contentLength = Number(response.headers.get('Content-Length'));
        let loaded = 0;

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
             if (signal.aborted) {
                reader.cancel();
                throw new DOMException('Download aborted by user.', 'AbortError');
            }
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            loaded += value.length;
            if (contentLength) {
                onProgress(Math.round((loaded / contentLength) * 100));
            }
        }

        const videoBlob = new Blob(chunks, { type: response.headers.get('Content-Type') || 'video/mp4' });
        
        const contentToStore = 'type' in item 
            ? item // It's a Movie
            : { ...item, showTitle }; // It's an Episode, add show title for context

        await db.put(STORE_NAME, { id: item.id, content: contentToStore, videoBlob });
        onProgress(100);

    } catch (error) {
        console.error('Error downloading content:', error);
        throw error;
    }
};

export const getDownloadedContent = async (): Promise<{ id: number, content: Movie | (Episode & { showTitle: string }), blob: Blob }[]> => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

export const deleteDownloadedItem = async (id: number): Promise<void> => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const isDownloaded = async (id: number): Promise<boolean> => {
    const db = await initDB();
    const item = await db.get(STORE_NAME, id);
    return !!item;
};