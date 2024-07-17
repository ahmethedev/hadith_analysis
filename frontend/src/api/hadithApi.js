
import axios from 'axios';

const API_URL = 'http://localhost:5031/api/Hadiths';

export const fetchHadithByYear = () => axios.get(`${API_URL}/hadith-by-year`);