import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-orange-100 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white "><Link to="/">Datateam</Link></div>
        <div className="flex space-x-4">
          <Link to="/hadiths" className="hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white">Hadiths</Link>
          <Link to="/ravis" className="hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white">Ravis</Link>
          <Link to="/analysis" className="hover:underline px-4 py-2 text-sm bg-primary-orange rounded-full text-white">Dashboard</Link>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;