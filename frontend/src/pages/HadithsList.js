import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChainModal from './ChainModal';

const HadithsList = () => {
    const [hadiths, setHadiths] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChain, setSelectedChain] = useState(null);
    const [musannifList, setMusannifList] = useState([]);
    const [bookList, setBookList] = useState([]);
    const [selectedMusannif, setSelectedMusannif] = useState('');
    const [selectedBook, setSelectedBook] = useState('');

    useEffect(() => {
        fetchData();
        fetchMusannifList();
        fetchBookList();
    }, [currentPage, searchTerm, selectedMusannif, selectedBook]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5031/api/hadiths`, {
                params: {
                    page: currentPage,
                    search: searchTerm,
                    musannif: selectedMusannif,
                    book: selectedBook,
                },
            });
            setHadiths(response.data);
            setTotalPages(response.headers['x-total-pages']);
        } catch (error) {
            console.error('Error fetching hadiths:', error);
        }
    };

    const fetchMusannifList = async () => {
        try {
            const response = await axios.get('http://localhost:5031/api/hadiths/musannif-list');
            setMusannifList(response.data);
        } catch (error) {
            console.error('Error fetching musannif list:', error);
        }
    };

    const fetchBookList = async () => {
        try {
            const response = await axios.get('http://localhost:5031/api/hadiths/book-list');
            setBookList(response.data);
        } catch (error) {
            console.error('Error fetching book list:', error);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleChainClick = (chain) => {
        const cleanChain = chain.replace(/[^\d;]/g, ''); // Replace anything that is not a digit or semicolon with empty string
        const formattedChain = cleanChain.replace(/;/g, ','); // Replace semicolons with commas

        setSelectedChain(formattedChain);
    };

    const renderPagination = () => {
        if (totalPages === 0) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`mx-1 px-3 py-2 rounded border ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return <div className="mt-5 text-center">{pages}</div>;
    };

    return (
        <div className="flex justify-center">
            <div className="w-3/5 mt-5">
                <h1 className="text-center text-4xl font-extrabold p-10 text-gray-700">Hadiths List</h1>
                <div className="mb-5 text-center">
                    <input
                        type="text"
                        placeholder="Search hadiths..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-6/12 p-2 text-lg rounded-full border border-gray-300"
                    />
                </div>
                <div className="mb-5 text-center">
                    <select
                        value={selectedMusannif}
                        onChange={(e) => setSelectedMusannif(e.target.value)}
                        className="w-6/12 p-2 text-lg rounded-full border border-gray-300"
                    >
                        <option value="">Select Musannif</option>
                        {musannifList.map((musannif, index) => (
                            <option key={index} value={musannif}>
                                {musannif}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedBook}
                        onChange={(e) => setSelectedBook(e.target.value)}
                        className="w-6/12 p-2 text-lg rounded-full border border-gray-300 mt-3"
                    >
                        <option value="">Select Book</option>
                        {bookList.map((book, index) => (
                            <option key={index} value={book}>
                                {book}
                            </option>
                        ))}
                    </select>
                </div>
                <ul className="space-y-5 text-center">
                    {hadiths.map((hadith) => (
                        <li
                            key={hadith.id}
                            className="p-4 border rounded-lg shadow-lg bg-white/80 backdrop-blur-lg shadow-orange-300 transform transition-transform duration-300 hover:shadow-orange-100"
                        >
                            <div className="flex flex-col space-y-2">
                                <strong className="text-gray-700">Hadith ID:</strong> {hadith.id}
                                {hadith.arabic && (
                                    <>
                                        <strong className="text-gray-700">Arabic:</strong> {hadith.arabic}
                                    </>
                                )}
                                {hadith.turkish && (
                                    <>
                                        <strong className="text-gray-700">Turkish:</strong> {hadith.turkish}
                                    </>
                                )}
                                {hadith.musannif && (
                                    <>
                                        <strong className="text-gray-700">Musannif:</strong> {hadith.musannif}
                                    </>
                                )}
                                {hadith.book && (
                                    <>
                                        <strong className="text-gray-700">Book:</strong> {hadith.book}
                                    </>
                                )}
                                {hadith.topic && (
                                    <>
                                        <strong className="text-gray-700">Topic:</strong> {hadith.topic}
                                    </>
                                )}
                                {hadith.chain && (
                                    <>
                                        <strong className="text-gray-700">Chain:</strong> {hadith.chain}
                                        <button
                                            onClick={() => handleChainClick(hadith.chain)}
                                            className="mt-2 px-4 py-2 bg-orange-200 text-white rounded hover:bg-orange-300"
                                        >
                                            View Senet
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-center mt-5 space-x-3">
                    <button
                        onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
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
            {selectedChain && (
                <ChainModal chain={selectedChain} onClose={() => setSelectedChain(null)} />
            )}
        </div>
    );
};

export default HadithsList;
