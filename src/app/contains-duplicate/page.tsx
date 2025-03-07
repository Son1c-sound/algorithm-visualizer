"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AlgorithmVisualizer = () => {
  const [nums, setNums] = useState([1, 2, 3, 1, 4, 5]);
  const [outerIndex, setOuterIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(1000); 
  const [comparisons, setComparisons] = useState(0);

  const resetVisualization = () => {
    setOuterIndex(0);
    setInnerIndex(1);
    setIsDuplicate(false);
    setIsComplete(false);
    setComparisons(0);
  };

  const startVisualization = () => {
    resetVisualization();
    setIsRunning(true);
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

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-3xl bg-slate-800 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-violet-400">Contains Duplicate Visualization</h1>
        
        <div className="bg-slate-900 p-4 rounded-lg mb-6 font-mono text-sm overflow-x-auto">
          <pre>
            <code className="text-gray-300">
{`class Solution:
    def hasDuplicate(self, nums: List[int]) -> bool:
        for i in range(len(nums)):            ${outerIndex === 0 ? '👈' : ''}
            for j in range(i + 1, len(nums)): ${innerIndex === 1 && outerIndex === 0 ? '👈' : ''}
                if nums[i] == nums[j]:        ${comparisons > 0 && !isDuplicate && !isComplete ? '👈' : ''}
                    return True               ${isDuplicate ? '👈' : ''}
        return False                          ${isComplete ? '👈' : ''}`}
            </code>
          </pre>
        </div>
        
        <div className="flex justify-center gap-3 mb-6 overflow-x-auto py-4">
          {nums.map((num, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-center w-16 h-16 rounded-lg text-xl font-bold
                ${index === outerIndex ? 'bg-violet-500' : 
                  index === innerIndex ? 'bg-rose-500' : 
                  'bg-slate-700'}
                ${(index === outerIndex || index === innerIndex) ? '' : ''}
                text-white`}
              initial={{ scale: 1 }}
              animate={
                (index === outerIndex || index === innerIndex) ? 
                { scale: [1, 1.1, 1], y: [0, -10, 0] } : 
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
            className="mb-8 bg-slate-700 p-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-2 text-gray-300">Comparing elements:</div>
            <div className="flex items-center justify-center gap-6">
              <motion.div
                className="p-4 rounded-lg flex flex-col items-center bg-violet-500"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
              >
                <div className="text-xs mb-1">nums[{outerIndex}]</div>
                <div className="text-2xl font-bold">{nums[outerIndex]}</div>
              </motion.div>
              
              <div className="text-2xl font-bold">{isDuplicate ? "==" : "!="}</div>
              
              <motion.div
                className="p-4 rounded-lg flex flex-col items-center bg-rose-500"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, delay: 0.2, repeat: isRunning ? Infinity : 0 }}
              >
                <div className="text-xs mb-1">nums[{innerIndex}]</div>
                <div className="text-2xl font-bold">{nums[innerIndex]}</div>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {isDuplicate && (
          <motion.div 
            className="p-4 bg-rose-500/20 border-2 border-rose-500 rounded-lg mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xl font-bold">Duplicate found!</span>
            <div>nums[{outerIndex}] = nums[{innerIndex}] = {nums[outerIndex]}</div>
            <div className="text-sm mt-2">After {comparisons} comparisons</div>
          </motion.div>
        )}
        
        {isComplete && (
          <motion.div 
            className="p-4 bg-emerald-500/20 border-2 border-emerald-500 rounded-lg mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xl font-bold">No duplicates found</span>
            <div className="text-sm mt-2">After {comparisons} comparisons</div>
          </motion.div>
        )}
        
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={startVisualization}
            disabled={isRunning}
            className="px-6 py-3 rounded-lg font-bold bg-violet-500 disabled:opacity-50 transition-all transform hover:scale-105"
          >
            {isRunning ? 'Running...' : 'Start Visualization'}
          </button>
          
          <button
            onClick={() => {
              const newArray = [...nums];
              newArray.sort(() => Math.random() - 0.5);
              setNums(newArray);
              resetVisualization();
            }}
            disabled={isRunning}
            className="px-6 py-3 rounded-lg font-bold bg-emerald-500 disabled:opacity-50 transition-all transform hover:scale-105"
          >
            Shuffle Array
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;