/**
 * Converts a standard Dropbox share URL into a direct download link.
 * e.g., https://www.dropbox.com/s/abc/file.mp4?dl=0 -> https://dl.dropboxusercontent.com/s/abc/file.mp4
 * @param url The original Dropbox URL
 * @returns The direct content URL
 */
export const correctDropboxUrl = (url: string): string => {
  if (typeof url !== 'string' || !url.includes('dropbox.com')) {
    return url;
  }

  try {
    const urlObject = new URL(url);
    if (urlObject.hostname === 'www.dropbox.com') {
      urlObject.hostname = 'dl.dropboxusercontent.com';
      urlObject.searchParams.delete('dl');
      return urlObject.toString();
    }
    return url;
  } catch (error) {
    // If URL parsing fails, return the original string
    return url;
  }
};
