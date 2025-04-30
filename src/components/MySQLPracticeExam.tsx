import React, { useState, useEffect } from 'react';
import { BookOpen, Database, ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionNavigator from './QuestionNavigator';

interface Option {
  letter: string;
  text: string;
}

interface Question {
  number: string;
  stem: string;
  options: Option[];
  correct_answers: string[];
}

interface QuestionsData {
  questions: Question[];
}

const MySQLPracticeExam: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [answered, setAnswered] = useState<boolean[]>([]);

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then((data: QuestionsData) => {
        setQuestions(data.questions);
        setAnswered(new Array(data.questions.length).fill(false));
      })
      .catch(error => console.error('Error loading the questions:', error));
  }, []);

  useEffect(() => {
    // Mark as answered if any option is selected for this question
    if (selectedOptions.length > 0) {
      setAnswered(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = true;
        return updated;
      });
    }
  }, [selectedOptions, currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (letter: string) => {
    if (showFeedback) return;
    setSelectedOptions(prev => {
      if (prev.includes(letter)) {
        return prev.filter(opt => opt !== letter);
      } else {
        return [...prev, letter];
      }
    });
  };

  const checkAnswer = () => {
    if (selectedOptions.length === 0) return;
    
    const isAnswerCorrect = 
      selectedOptions.length === currentQuestion?.correct_answers?.length &&
      selectedOptions.every(option => currentQuestion?.correct_answers?.includes(option));
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (isAnswerCorrect) {
        goToNextQuestion();
      }
      setShowFeedback(false);
    }, 1500);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptions([]);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOptions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-700 flex items-center">
            <Database className="mr-2" /> MySQL Practice Exam
          </div>
          <div className="flex items-center">
            <span
              className="text-gray-600 mr-2 cursor-pointer hover:underline"
              onClick={() => setShowNavigator(true)}
            >
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <button 
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <BookOpen size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-lg"
            >
              <div className="container mx-auto px-4 py-2 grid grid-cols-5 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`w-full h-10 rounded-md flex items-center justify-center ${
                      currentQuestionIndex === index 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setSelectedOptions([]);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Question card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                {currentQuestionIndex + 1}
              </div>
              <h2 className="text-xl font-semibold">Question {currentQuestion?.number}</h2>
            </div>
            
            <div className="prose max-w-none mb-6">
              {currentQuestion?.stem &&
                (/([+|\-]{2,}|\s{2,})/.test(currentQuestion.stem)
                  ? <pre className="whitespace-pre-wrap">{currentQuestion.stem}</pre>
                  : currentQuestion.stem.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))
                )
              }
            </div>

            <div className="space-y-3">
              {currentQuestion?.options?.map(option => (
                <div
                  key={option.letter}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedOptions.includes(option.letter)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleOptionClick(option.letter)}
                >
                  <div className="flex items-start">
                    <div className="w-5 h-5 border-2 rounded mr-3 flex items-center justify-center">
                      {selectedOptions.includes(option.letter) && (
                        <Check className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                    <span className="font-medium text-blue-600 mr-3">{option.letter}.</span>
                    <span className="text-gray-700">{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg text-white font-medium ${
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              } shadow-lg`}
            >
              <div className="flex items-center">
                {isCorrect ? <Check className="mr-2" /> : <X className="mr-2" />}
                {isCorrect ? 'Correct! Moving to next question...' : 'Incorrect, please try again'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-1" size={18} />
            Previous
          </button>
          
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            onClick={selectedOptions.length > 0 ? checkAnswer : goToNextQuestion}
          >
            {selectedOptions.length > 0 ? 'Check Answer' : 'Skip'}
          </button>
        </div>
      </div>

      {showNavigator && (
        <QuestionNavigator
          questionsCount={questions.length}
          currentIndex={currentQuestionIndex}
          answered={answered}
          onSelect={idx => {
            setCurrentQuestionIndex(idx);
            setSelectedOptions([]);
            setShowNavigator(false);
          }}
          onClose={() => setShowNavigator(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t bg-white mt-12 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          Created by <a href="https://github.com/Zjianru" className="text-blue-600 hover:underline">Zjianru</a> | 页面内容均由 AI 生成，仅供参考
        </div>
      </footer>
    </div>
  );
};

export default MySQLPracticeExam; 