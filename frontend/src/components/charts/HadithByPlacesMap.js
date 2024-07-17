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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5031/api/Ravis/hadith-by-places');
        setPlaces(response.data);
      } catch (error) {
        console.error('Error fetching hadith by places data:', error);
      }
    };

    fetchData();
  }, []);

  //coordinates for places
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

    };
    return coordinates[place] || [0, 0];
  };

  return (
    <MapContainer center={[24.5247, 39.5692]} zoom={5} style={{ height: '500px', width: '100%' }}>
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
