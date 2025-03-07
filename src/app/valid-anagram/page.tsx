"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const AnagramVisualizer = () => {
  const [string1, setString1] = useState<string>("listen");
  const [string2, setString2] = useState<string>("silent");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [speed] = useState<number>(800);
  const [phase, setPhase] = useState<number>(0); 
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentChar, setCurrentChar] = useState<string>('');
  const [map1, setMap1] = useState<Record<string, number>>({});
  const [map2, setMap2] = useState<Record<string, number>>({});
  const [compareChar, setCompareChar] = useState<string>('');
  const [failReason, setFailReason] = useState<string>('');

  const resetVisualization = useCallback(() => {
    setCurrentIndex(-1);
    setCurrentChar('');
    setMap1({});
    setMap2({});
    setPhase(0);
    setIsComplete(false);
    setResult(null);
    setCompareChar('');
    setFailReason('');
  }, []);

  const startVisualization = () => {
    resetVisualization();
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      // Phase 0: Length check
      if (phase === 0) {
        if (string1.length !== string2.length) {
          setFailReason('Strings have different lengths');
          setResult(false);
          setIsComplete(true);
          setIsRunning(false);
          return;
        }
        setPhase(1);
        setCurrentIndex(0);
        return;
      }

      // Phase 1: Building character maps
      if (phase === 1) {
        if (currentIndex < string1.length) {
          const char1 = string1[currentIndex];
          const char2 = string2[currentIndex];
          
          setCurrentChar(char1);
          
          setMap1(prev => ({
            ...prev,
            [char1]: (prev[char1] || 0) + 1
          }));
          
          setMap2(prev => ({
            ...prev,
            [char2]: (prev[char2] || 0) + 1
          }));
          
          setCurrentIndex(currentIndex + 1);
        } else {
          setPhase(2);
          setCurrentIndex(-1);
          const chars = Object.keys(map1);
          if (chars.length > 0) {
            setCompareChar(chars[0]);
            setCurrentIndex(0);
          } else {
            setResult(true);
            setIsComplete(true);
            setIsRunning(false);
          }
        }
        return;
      }

      // Phase 2: Comparison
      if (phase === 2) {
        const chars = Object.keys(map1);
        
        if (currentIndex < chars.length) {
          const char = chars[currentIndex];
          setCompareChar(char);
          
          if (map1[char] !== (map2[char] || 0)) {
            setFailReason(`Character '${char}' count mismatch: ${map1[char]} vs ${map2[char] || 0}`);
            setResult(false);
            setIsComplete(true);
            setIsRunning(false);
            return;
          }
          
          setCurrentIndex(currentIndex + 1);
        } else {
          setResult(true);
          setIsComplete(true);
          setIsRunning(false);
        }
        return;
      }

    }, speed);
    
    return () => clearTimeout(timer);
  }, [isRunning, phase, currentIndex, string1, string2, map1, map2, speed]);

  const getCharStyle = (str: string, idx: number, activeIdx: number) => {
    if (phase === 1 && idx === activeIdx) {
      return "bg-indigo-500 text-white";
    }
    if (phase === 2 && str[idx] === compareChar) {
      return "bg-rose-400 text-white";
    }
    return "bg-slate-700";
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-gray-900/50 rounded-xl p-6 text-white shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-300">Valid Anagram</h1>
        <p className="text-sm text-gray-300 mb-4 text-center">
          An anagram is a word or phrase formed by rearranging the letters of a different word or phrase,
          using all the original letters exactly once.
        </p>
        
        <div className="bg-slate-900 p-3 rounded-lg mb-5 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-300 text-xs sm:text-sm">
            <code>
{`def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):${phase === 0 ? ' ←' : ''}
        return False${failReason === 'Strings have different lengths' ? ' ←' : ''}
    
    countS, countT = {}, {}${phase === 1 && currentIndex === 0 ? ' ←' : ''}

    for i in range(len(s)):${phase === 1 && currentIndex > 0 ? ' ←' : ''}
        countS[s[i]] = 1 + countS.get(s[i], 0)
        countT[t[i]] = 1 + countT.get(t[i], 0)
    
    for c in countS:${phase === 2 ? ' ←' : ''}
        if countS[c] != countT.get(c,0):${result === false && phase === 2 ? ' ←' : ''}
            return False
    
    return True${result === true ? ' ←' : ''}`}
            </code>
          </pre>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm mb-2 text-indigo-300 font-medium">String 1 (s):</div>
            <div className="flex gap-1 mb-2 flex-wrap">
              {string1.split('').map((char, idx) => (
                <motion.div
                  key={`s-${idx}`}
                  className={`flex items-center justify-center w-10 h-10 rounded-md text-lg font-bold ${getCharStyle(string1, idx, currentIndex)} text-white shadow-md`}
                  initial={{ scale: 1 }}
                  animate={
                    phase === 1 && idx === currentIndex ? 
                    { scale: [1, 1.1, 1], y: [0, -8, 0] } : 
                    { scale: 1 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
            {phase === 1 && (
              <div className="bg-slate-800 p-3 rounded-lg text-sm">
                <div className="mb-2 text-gray-300">Character Map 1:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(map1).map(([char, count]) => (
                    <div 
                      key={`map1-${char}`} 
                      className={`px-2 py-1 rounded ${char === currentChar ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    >
                      '{char}': {count}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="text-sm mb-2 text-rose-300 font-medium">String 2 (t):</div>
            <div className="flex gap-1 mb-2 flex-wrap">
              {string2.split('').map((char, idx) => (
                <motion.div
                  key={`t-${idx}`}
                  className={`flex items-center justify-center w-10 h-10 rounded-md text-lg font-bold ${getCharStyle(string2, idx, currentIndex)} text-white shadow-md`}
                  initial={{ scale: 1 }}
                  animate={
                    phase === 1 && idx === currentIndex ? 
                    { scale: [1, 1.1, 1], y: [0, -8, 0] } : 
                    { scale: 1 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  {char}
                </motion.div>
              ))}
            </div>
            {phase === 1 && (
              <div className="bg-slate-800 p-3 rounded-lg text-sm">
                <div className="mb-2 text-gray-300">Character Map 2:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(map2).map(([char, count]) => (
                    <div 
                      key={`map2-${char}`} 
                      className={`px-2 py-1 rounded ${char === currentChar ? 'bg-rose-400' : 'bg-slate-700'}`}
                    >
                      '{char}': {count}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {phase === 2 && compareChar && (
          <motion.div 
            className="mb-6 bg-slate-700 p-3 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-2 text-gray-300 text-sm">Comparing character counts:</div>
            <div className="flex items-center justify-center gap-4">
              <motion.div
                className="p-3 rounded-md flex flex-col items-center bg-indigo-500 shadow-md"
                animate={{ y: isRunning ? [0, -4, 0] : 0 }}
                transition={{ duration: 0.8, repeat: isRunning ? Infinity : 0 }}
              >
                <div className="text-xs mb-1">countS['{compareChar}']</div>
                <div className="text-xl font-bold">{map1[compareChar]}</div>
              </motion.div>
              
              <div className="text-xl font-bold">
                {result === false ? "≠" : "="}
              </div>
              
              <motion.div
                className="p-3 rounded-md flex flex-col items-center bg-rose-400 shadow-md"
                animate={{ y: isRunning ? [0, -4, 0] : 0 }}
                transition={{ duration: 0.8, delay: 0.2, repeat: isRunning ? Infinity : 0 }}
              >
                <div className="text-xs mb-1">countT['{compareChar}']</div>
                <div className="text-xl font-bold">{map2[compareChar] || 0}</div>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {result === false && (
          <motion.div 
            className="p-3 bg-rose-400/10 border border-rose-400 rounded-lg mb-5 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg font-bold text-rose-300">Not an anagram</span>
            <div className="text-sm mt-1 text-gray-300">{failReason}</div>
          </motion.div>
        )}
        
        {result === true && (
          <motion.div 
            className="p-3 bg-emerald-500/10 border border-emerald-400 rounded-lg mb-5 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg font-bold text-emerald-300">Valid Anagram!</span>
            <div className="text-sm mt-1 text-gray-300">All character counts match</div>
          </motion.div>
        )}
        
        <div className="mb-4"></div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={startVisualization}
            disabled={isRunning}
            className="px-4 py-2 rounded-md font-medium bg-indigo-500 disabled:opacity-50 hover:bg-indigo-400 transition-colors text-sm"
          >
            {isRunning ? 'Running...' : 'Start'}
          </button>
          
          <button
            onClick={() => {
              setString1("anagram");
              setString2("nagaram");
              resetVisualization();
            }}
            disabled={isRunning}
            className="px-4 py-2 rounded-md font-medium bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 transition-colors text-sm"
          >
            Example 1
          </button>
          
          <button
            onClick={() => {
              setString1("rat");
              setString2("car");
              resetVisualization();
            }}
            disabled={isRunning}
            className="px-4 py-2 rounded-md font-medium bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 transition-colors text-sm"
          >
            Example 2
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

export default AnagramVisualizer;