import React from 'react';

const ArabicKeyboard = ({ onKeyPress }) => {
    const keys = [
        
        'ض','ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د',
        'ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط',
        'ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'
      ];
      

  return (
    <div className="arabic-keyboard bg-gray-100 rounded-lg p-4 shadow-lg w-[350px] mx-auto my-4">
      <div className='grid grid-cols-8 gap-1'>
        {keys.map((key, index) => (
          <button
            key={index}
            onClick={() => onKeyPress(key)}
            className="w-10 h-10 text-lg font-medium rounded bg-white hover:bg-gray-200
                       transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {key}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between">
        <button
          onClick={() => onKeyPress(' ')}
          className="space h-10 bg-white hover:bg-gray-200 rounded text-sm font-medium
                     transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          space
        </button>
        <button
          onClick={() => onKeyPress('delete')}
          className="delete h-10 rounded text-sm font-medium
                     transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          delete
        </button>
      </div>
    </div>
  );
};

export default ArabicKeyboard;
