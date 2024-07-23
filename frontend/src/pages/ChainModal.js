import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChainModal = ({ chain, onClose }) => {
  const [ravis, setRavis] = useState([]);

  useEffect(() => {
    const fetchRavis = async () => {
      const raviIds = chain.split(',');
      try {
        const response = await axios.get(`http://localhost:5031/api/ravis/bulk?ids=${raviIds.join(',')}`);
        setRavis(response.data);
      } catch (error) {
        console.error('Error fetching ravi details:', error);
      }
    };

    fetchRavis();
  }, [chain]);

  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Chain Visualization</h2>
        <div className="flex flex-col items-center">
          {ravis.map((ravi, index) => (
            <div key={ravi.ravi_id} className="mb-4 w-full">
              <div className="border p-4 rounded-lg shadow">
                <p><strong>Ravi #{index + 1}:</strong></p>
                <p><strong>Ravi ID:</strong> {ravi.ravi_id}</p>
                <p><strong>Name:</strong> {ravi.narrator_name || '-'}</p>
                <p><strong>Tribe:</strong> {ravi.tribe || '-'}</p>
                <p><strong>Nisbe:</strong> {ravi.nisbe || '-'}</p>
                <p><strong>Degree:</strong> {ravi.degree || '-'}</p>
                <p><strong>Reliability:</strong> {ravi.reliability || '-'}</p>
                <p><strong>Birth Year (Hijri):</strong> {ravi.birth_year_h || '-'}</p>
                <p><strong>Birth Year (Miladi):</strong> {ravi.birth_year_m || '-'}</p>
                <p><strong>Death Year (Hijri):</strong> {ravi.death_year_h || '-'}</p>
                <p><strong>Death Year (Miladi):</strong> {ravi.death_year_m || '-'}</p>
                <p><strong>Places Lived:</strong> {ravi.placed_lived || '-'}</p>
                <p><strong>Job:</strong> {ravi.job || '-'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChainModal;
