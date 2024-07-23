import React, { useState } from 'react';

const RaviFilters = ({ jobList = [], nisbeList = [], onFilterApply }) => {
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [selectedNisbes, setSelectedNisbes] = useState([]);
    const [jobSearch, setJobSearch] = useState('');
    const [nisbeSearch, setNisbeSearch] = useState('');
    const [isJobOpen, setIsJobOpen] = useState(true);
    const [isNisbeOpen, setIsNisbeOpen] = useState(true);

    const handleJobToggle = (job) => {
        setSelectedJobs(prev =>
            prev.includes(job) ? prev.filter(b => b !== job) : [...prev, job]
        );
    };

    const handleNisbeToggle = (nisbe) => {
        setSelectedNisbes(prev =>
            prev.includes(nisbe) ? prev.filter(m => m !== nisbe) : [...prev, nisbe]
        );
    };

    const filteredJobs = jobList.filter(job =>
        job.toLowerCase().includes(jobSearch.toLowerCase())
    );

    const filteredNisbes = nisbeList.filter(nisbe =>
        nisbe.toLowerCase().includes(nisbeSearch.toLowerCase())
    );

    const handleFilter = () => {
        onFilterApply({ jobs: selectedJobs, nisbes: selectedNisbes });
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>

            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-100 p-2 rounded cursor-pointer"
                    onClick={() => setIsJobOpen(!isJobOpen)}
                >
                    <h3 className="text-lg font-semibold">Jobs</h3>
                    <span>{isJobOpen ? '▼' : '▲'}</span>
                </div>
                {isJobOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={jobSearch}
                            onChange={(e) => setJobSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 max-h-40 overflow-y-auto">
                            {filteredJobs.map((job, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedJobs.includes(job)}
                                        onChange={() => handleJobToggle(job)}
                                    />
                                    <span>{job}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="mb-6">
                <div 
                    className="flex justify-between items-center bg-gray-200 p-2 rounded cursor-pointer"
                    onClick={() => setIsNisbeOpen(!isNisbeOpen)}
                >
                    <h3 className="text-lg font-semibold">Nisbe</h3>
                    <span>{isNisbeOpen ? '▼' : '▲'}</span>
                </div>
                {isNisbeOpen && (
                    <>
                        <input
                            type="text"
                            placeholder="Search nisbes..."
                            value={nisbeSearch}
                            onChange={(e) => setNisbeSearch(e.target.value)}
                            className="w-full p-2 mt-2 border rounded"
                        />
                        <div className="mt-2 max-h-40 overflow-y-auto">
                            {filteredNisbes.map((nisbe, index) => (
                                <label key={index} className="flex items-center space-x-2 p-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedNisbes.includes(nisbe)}
                                        onChange={() => handleNisbeToggle(nisbe)}
                                    />
                                    <span>{nisbe}</span>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={handleFilter}
                className='w-full hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white'
            >
                Filter
            </button>
        </div>
    );
};

export default RaviFilters;