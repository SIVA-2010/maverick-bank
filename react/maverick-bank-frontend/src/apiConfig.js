// This automatically detects if you are on localhost or AWS!
const currentHost = window.location.hostname;

export const API_BASE_URL = currentHost === "localhost" 
    ? "http://localhost:5000/api/v1" 
    : `http://${currentHost}:5000/api/v1`;
