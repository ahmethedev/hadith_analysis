import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RaviList = () => {
    const [ravis, setRavis] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRavis, setTotalRavis] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTribe, setSelectedTribe] = useState([]);
    const [selectedNisbe, setSelectedNisbe] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
        fetchTotalRavis();
    }, [currentPage, searchTerm]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5031/api/ravis?page=${currentPage}&search=${searchTerm}`);
            setRavis(response.data);
            setTotalPages(response.headers['x-total-pages']);
        } catch (error) {
            console.error('Error fetching ravis:', error);
        }
    };
    const fetchTotalRavis = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5031/api/ravis/count', {
                params: {
                    search: searchTerm,
                    tribe: selectedTribe,
                    nisbe: selectedNisbe,
                },
                paramsSerializer: params => {
                    return Object.keys(params)
                        .map(key => Array.isArray(params[key])
                            ? params[key].map(val => `${key}=${val}`).join('&')
                            : `${key}=${params[key]}`)
                        .join('&');
                },
            });
            console.log('Total ravis response:', response.data);
            setTotalRavis(response.data);
            console.log('Total ravis set to:', response.data.TotalCount);
        } catch (error) {
            console.error('Error fetching total ravis count:', error);
            setTotalRavis(0);
        } finally {
            setIsLoading(false);
        }
    };
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const renderPagination = () => {
        if (totalPages === 0) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`mx-1 px-4 py-2 border rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return (
            <div className="mt-5 flex justify-center">
                {pages}
            </div>
        );
    };

    return (
        <div className="flex justify-center">
            <div className="w-3/4 mt-5">
                <h1 className="text-center text-4xl font-extrabold p-10 text-gray-700">Ravi List</h1>

                {/* Search bar */}
                <div className="mb-5 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search ravis..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full max-w-md p-3 text-lg border rounded-full"
                    />
                    
                </div>

                <div className="mb-5 p-4 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg" key={totalRavis}>
                    <p className="text-xl font-bold text-gray-800 mb-2">
                        Total Ravis Found: {isLoading ? 'Loading...' : totalRavis}
                    </p>
                    </div>
                <ul className="space-y-5">
                    {ravis.map((ravi) => (
                        <li key={ravi.ravi_id} className="p-4 border rounded-lg shadow-lg bg-white/80 backdrop-blur-lg shadow-orange-300 transform transition-transform duration-300  hover:shadow-orange-100">
                            <p className="text-center text-gray-700"><strong>Ravi ID:</strong> {ravi.ravi_id}</p>
                            <p className="text-center text-gray-700"><strong>Narrator Name:</strong> {ravi.narrator_name || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Tribe:</strong> {ravi.tribe || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Nisbesi:</strong> {ravi.nisbesi || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Degree:</strong> {ravi.degree || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Reliability:</strong> {ravi.reliability || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Birth Year (Hijri):</strong> {ravi.birth_year_h || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Birth Year (Miladi):</strong> {ravi.birth_year_m || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Death Year (Hijri):</strong> {ravi.death_year_h || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Death Year (Miladi):</strong> {ravi.death_year_m || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Places Lived:</strong> {ravi.placed_lived || '-'}</p>
                            <p className="text-center text-gray-700"><strong>Job:</strong> {ravi.job || '-'}</p>
                            
                        </li>
                    ))}
                </ul>


                {/* Pagination controls */}
                <div className="flex justify-center mt-5 space-x-3">
                    <button
                        onClick={() => setCurrentPage((prev) => prev > 1 ? prev - 1 : prev)}
                        className="px-4 py-2 text-sm bg-primary-orange rounded-full text-white"
                    >
                        Previous
                    </button>
                    {renderPagination()}
                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-4 py-2 text-sm bg-primary-orange rounded-full text-white"
                    >
                        Next
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RaviList;