import React, { useState } from 'react';

const Filters = ({ bookList, musannifList, onFilterApply }) => {
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [selectedMusannifs, setSelectedMusannifs] = useState([]);
    const [bookSearch, setBookSearch] = useState('');
    const [musannifSearch, setMusannifSearch] = useState('');

    const handleBookToggle = (book) => {
        setSelectedBooks(prev => 
            prev.includes(book) ? prev.filter(b => b !== book) : [...prev, book]
        );
    };

    const handleMusannifToggle = (musannif) => {
        setSelectedMusannifs(prev => 
            prev.includes(musannif) ? prev.filter(m => m !== musannif) : [...prev, musannif]
        );
    };

    const filteredBooks = bookList.filter(book => 
        book.toLowerCase().includes(bookSearch.toLowerCase())
    );

    const filteredMusannifs = musannifList.filter(musannif => 
        musannif.toLowerCase().includes(musannifSearch.toLowerCase())
    );

    const handleFilter = () => {
        onFilterApply({ books: selectedBooks, musannifs: selectedMusannifs });
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            
            <div className="mb-6">
                <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
                    <h3 className="text-lg font-semibold">Books</h3>
                    <span>▲</span>
                </div>
                <input
                    type="text"
                    placeholder="Search books..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    className="w-full p-2 mt-2 border rounded"
                />
                <div className="mt-2 max-h-40 overflow-y-auto">
                    {filteredBooks.map((book, index) => (
                        <label key={index} className="flex items-center space-x-2 p-1">
                            <input
                                type="checkbox"
                                checked={selectedBooks.includes(book)}
                                onChange={() => handleBookToggle(book)}
                            />
                            <span>{book}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <div className="mb-6">
                <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
                    <h3 className="text-lg font-semibold">Musannif</h3>
                    <span>▲</span>
                </div>
                <input
                    type="text"
                    placeholder="Search musannifs..."
                    value={musannifSearch}
                    onChange={(e) => setMusannifSearch(e.target.value)}
                    className="w-full p-2 mt-2 border rounded"
                />
                <div className="mt-2 max-h-40 overflow-y-auto">
                    {filteredMusannifs.map((musannif, index) => (
                        <label key={index} className="flex items-center space-x-2 p-1">
                            <input
                                type="checkbox"
                                checked={selectedMusannifs.includes(musannif)}
                                onChange={() => handleMusannifToggle(musannif)}
                            />
                            <span>{musannif}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <button
                onClick={handleFilter}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Filter
            </button>
        </div>
    );
};

export default Filters;