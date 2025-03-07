"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const AlgorithmVisualizer = () => {
  const [nums, setNums] = useState([1, 2, 3, 1, 4, 5]);
  const [outerIndex, setOuterIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(800); 
  const [comparisons, setComparisons] = useState(0);
  const [customArray, setCustomArray] = useState('');
  
  const resetVisualization = useCallback(() => {
    setOuterIndex(0);
    setInnerIndex(1);
    setIsDuplicate(false);
    setIsComplete(false);
    setComparisons(0);
  }, []);

  const startVisualization = () => {
    resetVisualization();
    setIsRunning(true);
  };

  const handleCustomArray = () => {
    try {
      const parsed = JSON.parse(`[${customArray}]`);
      if (Array.isArray(parsed) && parsed.length > 1) {
        setNums(parsed);
        resetVisualization();
      }
    } catch (e) {
      // Handle invalid input silently
    }
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 4; // 4-8 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 9) + 1);
    setNums(newArray);
    resetVisualization();
  };

  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setTimeout(() => {
      setComparisons(prev => prev + 1);
      
      if (nums[outerIndex] === nums[innerIndex]) {
        setIsDuplicate(true);
        setIsRunning(false);
        return;
      }
      
      if (innerIndex < nums.length - 1) {
        setInnerIndex(innerIndex + 1);
      } else {
        if (outerIndex < nums.length - 2) {
          setOuterIndex(outerIndex + 1);
          setInnerIndex(outerIndex + 2);
        } else {
          setIsComplete(true);
          setIsRunning(false);
        }
      }
    }, speed);
    
    return () => clearTimeout(timer);
  }, [isRunning, outerIndex, innerIndex, nums, speed]);

  const getItemColor = (index: number) => {
    if (index === outerIndex) return 'bg-indigo-500';
    if (index === innerIndex) return 'bg-rose-400';
    return 'bg-slate-700';
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <div className="w-full max-w-2xl bg-gray-900/50 rounded-xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-300">Contains Duplicate</h1>
        
        <div className="bg-slate-900 p-3 rounded-lg mb-5 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-300 text-xs sm:text-sm">
            <code>
{`function hasDuplicate(nums) {
  for (let i = 0; i < nums.length; i++) {${outerIndex === 0 ? ' ←' : ''}
    for (let j = i + 1; j < nums.length; j++) {${innerIndex === 1 && outerIndex === 0 ? ' ←' : ''}
      if (nums[i] === nums[j]) {${comparisons > 0 && !isDuplicate && !isComplete ? ' ←' : ''}
        return true;${isDuplicate ? ' ←' : ''}
      }
    }
  }
  return false;${isComplete ? ' ←' : ''}
}`}
            </code>
          </pre>
        </div>
        
        <div className="flex justify-center gap-2 mb-6 overflow-x-auto py-3">
          {nums.map((num, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-center w-12 h-12 rounded-md text-lg font-bold
                ${getItemColor(index)} text-white shadow-md`}
              initial={{ scale: 1 }}
              animate={
                (index === outerIndex || index === innerIndex) ? 
                { scale: [1, 1.1, 1], y: [0, -8, 0] } : 
                { scale: 1 }
              }
              transition={{ duration: 0.5 }}
            >
              {num}
            </motion.div>
          ))}
        </div>
        
        {(isRunning || isDuplicate || isComplete) && (
          <motion.div 
            className="mb-6 bg-slate-700 p-3 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-2 text-gray-300 text-sm">Comparing:</div>
            <div className="flex items-center justify-center gap-4">
              <motion.div
                className="p-3 rounded-md flex flex-col items-center bg-indigo-500 shadow-md"
                animate={{ y: isRunning ? [0, -4, 0] : 0 }}
                transition={{ duration: 0.8, repeat: isRunning ? Infinity : 0 }}
              >
                <div className="text-xs mb-1">nums[{outerIndex}]</div>
                <div className="text-xl font-bold">{nums[outerIndex]}</div>
              </motion.div>
              
              <div className="text-xl font-bold">{isDuplicate ? "=" : "≠"}</div>
              
              <motion.div
                className="p-3 rounded-md flex flex-col items-center bg-rose-400 shadow-md"
                animate={{ y: isRunning ? [0, -4, 0] : 0 }}
                transition={{ duration: 0.8, delay: 0.2, repeat: isRunning ? Infinity : 0 }}
              >
                <div className="text-xs mb-1">nums[{innerIndex}]</div>
                <div className="text-xl font-bold">{nums[innerIndex]}</div>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {isDuplicate && (
          <motion.div 
            className="p-3 bg-rose-400/10 border border-rose-400 rounded-lg mb-5 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg font-bold text-rose-300">Found duplicate: {nums[outerIndex]}</span>
            <div className="text-sm mt-1 text-gray-300">Comparisons: {comparisons}</div>
          </motion.div>
        )}
        
        {isComplete && (
          <motion.div 
            className="p-3 bg-emerald-500/10 border border-emerald-400 rounded-lg mb-5 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg font-bold text-emerald-300">No duplicates found</span>
            <div className="text-sm mt-1 text-gray-300">Comparisons: {comparisons}</div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Custom array (e.g. 1,2,3,1)"
              value={customArray}
              onChange={(e) => setCustomArray(e.target.value)}
              className="flex-1 bg-slate-700 border-0 rounded-l-md p-2 text-sm focus:ring-1 focus:ring-indigo-400 focus:outline-none"
            />
            <button
              onClick={handleCustomArray}
              disabled={isRunning}
              className="bg-slate-600 px-3 rounded-r-md hover:bg-slate-500 disabled:opacity-50"
            >
              Set
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Speed:</span>
            <input
              type="range"
              min="200"
              max="1500"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              disabled={isRunning}
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={startVisualization}
            disabled={isRunning}
            className="px-4 py-2 rounded-md font-medium bg-indigo-500 disabled:opacity-50 hover:bg-indigo-400 transition-colors text-sm"
          >
            {isRunning ? 'Running...' : 'Start'}
          </button>
          
          <button
            onClick={generateRandomArray}
            disabled={isRunning}
            className="px-4 py-2 rounded-md font-medium bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 transition-colors text-sm"
          >
            Random Array
          </button>
          
          <button
            onClick={resetVisualization}
            disabled={isRunning}
            className="px-4 py-2 rounded-md font-medium bg-slate-600 disabled:opacity-50 hover:bg-slate-500 transition-colors text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;