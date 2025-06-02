import axios from 'axios';

export async function fetchPlaylistVideos(playlistId, pageToken = '') {
    const apiKey = import.meta.env.VITE_REACT_APP_YOUTUBE_API_KEY;
    const url = 'https://www.googleapis.com/youtube/v3/playlistItems';
    const params = {
        part: 'snippet',
        maxResults: 12,
        playlistId,
        key: apiKey,
        pageToken,
    };
    const response = await axios.get(url, { params });
    return response.data;
}
