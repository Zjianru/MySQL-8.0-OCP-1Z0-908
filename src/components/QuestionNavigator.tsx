import React from 'react';

interface QuestionNavigatorProps {
  questionsCount: number;
  currentIndex: number;
  answered: boolean[];
  onSelect: (index: number) => void;
  onClose: () => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questionsCount,
  currentIndex,
  answered,
  onSelect,
  onClose,
}) => {
  const numbers = Array.from({ length: questionsCount }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">题目导航</h2>
        <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto pr-2">
          {numbers.map(idx => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`w-10 h-10 rounded flex items-center justify-center font-bold border transition-colors
                ${idx === currentIndex ? 'bg-blue-500 text-white border-blue-500' : ''}
                ${answered[idx] ? 'bg-green-500 text-white border-green-500' : ''}
                ${!answered[idx] && idx !== currentIndex ? 'bg-gray-200 text-gray-600 border-gray-300' : ''}
              `}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator; 