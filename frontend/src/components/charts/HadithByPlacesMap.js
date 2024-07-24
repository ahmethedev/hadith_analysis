import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const HadithByPlacesMap = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5031/api/Ravis/hadith-by-places');
        setPlaces(response.data);
      } catch (error) {
        console.error('Error fetching hadith by places data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCoordinates = (place) => {
    const coordinates = {
      'Medine': [24.5247, 39.5692],
      'Mekke': [21.4225, 39.8262],
      'Basra': [30.5085, 47.7804],
      'Kufe': [32.0246, 44.4056],
      'Yemen': [15.5527, 48.5164],
      'Bahreyn': [26.0667, 50.5577],
      'Taif': [21.2703, 40.4158],
      'Şam': [33.5138, 36.2765],
      'Habeşistan': [9.145, 40.4897],
      'Mısır': [26.8206, 30.8025],
      'Bağdat': [33.3152, 44.3661],
      'Kudüs': [31.7683, 35.2137],
      'İskenderiye': [31.2001, 29.9187],
      'Horasan': [36.5000, 59.2000],
      'Endülüs': [37.8882, -4.7794]
    };
    
    return coordinates[place] || [0, 0];
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <MapContainer center={[24.5247, 39.5692]} zoom={5} style={{ height: '100%', width: '100%'}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {places.map((place, idx) => (
        <Marker key={idx} position={getCoordinates(place.place)}>
          <Popup>
            {place.place}: {place.count} Hadiths
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default HadithByPlacesMap;