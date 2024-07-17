
import axios from 'axios';

const API_URL = 'http://localhost:5031/api/Ravis';

export const fetchHadithByTribe = () => axios.get(`${API_URL}/hadith-by-tribe`);
export const fetchRaviToRavi = () => axios.get(`${API_URL}/ravi-to-ravi`);
export const fetchRaviPlaces = () => axios.get(`${API_URL}/ravi-places`);