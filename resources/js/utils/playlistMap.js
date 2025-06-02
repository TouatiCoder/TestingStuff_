export function getPlaylistIdBySlug(slug) {
    switch (slug) {
        case 'python-programming':
            return import.meta.env.VITE_REACT_APP_PYTHON_PLAYLIST_ID;
        case 'php-development':
            return import.meta.env.VITE_REACT_APP_PHP_PLAYLIST_ID;
        case 'cpp-programming':
            return import.meta.env.VITE_REACT_APP_CPP_PLAYLIST_ID;
        default:
            return null;
    }
}
