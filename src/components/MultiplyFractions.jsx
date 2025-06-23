import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const Fraction = ({ numerator, denominator, whole = null, isCompleted = false }) => {
  return (
    <span className="inline-flex items-center">
      {whole !== null && <span className="mr-1">{whole}</span>}
      <span className="inline-flex flex-col items-center mx-1">
        <span className="text-center">{numerator}</span>
        <span className={`border-t w-full min-w-[1em] ${isCompleted ? 'border-green-600' : 'border-black'}`}></span>
        <span className="text-center">{denominator}</span>
      </span>
    </span>
  );
};

const MixedNumber = ({ whole, numerator, denominator, isCompleted = false }) => {
  return (
    <span className="inline-flex items-center">
      <span className="mr-1">{whole}</span>
      <Fraction numerator={numerator} denominator={denominator} isCompleted={isCompleted} />
    </span>
  );
};

const generateMixedNumber = () => {
  const whole = Math.floor(Math.random() * 5) + 1;
  const denominator = [2, 3, 4, 6, 8][Math.floor(Math.random() * 5)];
  const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
  return { whole, numerator, denominator };
};

const calculateImproperFraction = (mixed) => {
  return {
    numerator: (mixed.whole * mixed.denominator) + mixed.numerator,
    denominator: mixed.denominator
  };
};

// Helper function to render answer in visual format
const renderAnswer = (answer, stepIndex) => {
  if (stepIndex === 0 || stepIndex === 1) {
    // Steps 1 & 2: improper fractions
    const [numerator, denominator] = answer.split('/');
    return (
      <span className="inline-flex items-center">
        <span className="inline-flex flex-col items-center mx-1 text-sm">
          <span className="text-center">{numerator}</span>
          <span className="border-t w-full min-w-[0.8em] border-green-600"></span>
          <span className="text-center">{denominator}</span>
        </span>
      </span>
    );
  } else if (stepIndex === 2) {
    // Step 3: improper fraction
    const [numerator, denominator] = answer.split('/');
    return (
      <span className="inline-flex items-center">
        <span className="inline-flex flex-col items-center mx-1 text-sm">
          <span className="text-center">{numerator}</span>
          <span className="border-t w-full min-w-[0.8em] border-green-600"></span>
          <span className="text-center">{denominator}</span>
        </span>
      </span>
    );
  } else {
    // Step 4: mixed number
    const parts = answer.split(' ');
    if (parts.length === 2) {
      const [whole, fraction] = parts;
      const [numerator, denominator] = fraction.split('/');
      return (
        <span className="inline-flex items-center">
          <span className="mr-1">{whole}</span>
          <span className="inline-flex flex-col items-center mx-1 text-sm">
            <span className="text-center">{numerator}</span>
            <span className="border-t w-full min-w-[0.8em] border-green-600"></span>
            <span className="text-center">{denominator}</span>
          </span>
        </span>
      );
    }
    return answer;
  }
};

const MultiplyFractions = () => {
  // State management
  const [number1, setNumber1] = useState(generateMixedNumber());
  const [number2, setNumber2] = useState(generateMixedNumber());
  const [showSteps, setShowSteps] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({
    step1: '',
    step2: '',
    step3: '',
    step4: ''
  });
  const [inputStatus, setInputStatus] = useState({
    step1: null,
    step2: null,
    step3: null,
    step4: null
  });
  const [stepCompleted, setStepCompleted] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });
  const [stepSkipped, setStepSkipped] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });
  const [steps, setSteps] = useState([]);
  const [showNavigationButtons, setShowNavigationButtons] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState(null);

  // Calculate values
  const improper1 = calculateImproperFraction(number1);
  const improper2 = calculateImproperFraction(number2);
  const multipliedNumerator = improper1.numerator * improper2.numerator;
  const multipliedDenominator = improper1.denominator * improper2.denominator;
  const finalWhole = Math.floor(multipliedNumerator / multipliedDenominator);
  const finalNumerator = multipliedNumerator % multipliedDenominator;

  // Show navigation buttons when all steps are completed
  useEffect(() => {
    if (stepCompleted.step1 && stepCompleted.step2 && stepCompleted.step3 && stepCompleted.step4) {
      setShowNavigationButtons(true);
    }
  }, [stepCompleted]);

  // Generate new problem
  const generateNewProblem = () => {
    setNumber1(generateMixedNumber());
    setNumber2(generateMixedNumber());
    setShowSteps(false);
    setCurrentStepIndex(0);
    setUserInputs({ step1: '', step2: '', step3: '', step4: '' });
    setStepCompleted({ step1: false, step2: false, step3: false, step4: false });
    setInputStatus({ step1: null, step2: null, step3: null, step4: null });
    setShowNavigationButtons(false);
  };

  // Calculate steps
  const calculateSteps = () => {
    const newSteps = [
      {
        main: 'Step 1: Convert first mixed number to improper fraction',
        formula: (
          <span className="inline-flex items-center">
            <span className="mr-1">{number1.whole}</span>
            <span className="inline-flex flex-col items-center mx-1 text-sm">
              <span className="text-center">{number1.numerator}</span>
              <span className="border-t w-full min-w-[0.8em] border-black"></span>
              <span className="text-center">{number1.denominator}</span>
            </span>
            <span className="mx-2">= ?</span>
          </span>
        ),
        answer: `${improper1.numerator}/${improper1.denominator}`
      },
      {
        main: 'Step 2: Convert second mixed number to improper fraction',
        formula: (
          <span className="inline-flex items-center">
            <span className="mr-1">{number2.whole}</span>
            <span className="inline-flex flex-col items-center mx-1 text-sm">
              <span className="text-center">{number2.numerator}</span>
              <span className="border-t w-full min-w-[0.8em] border-black"></span>
              <span className="text-center">{number2.denominator}</span>
            </span>
            <span className="mx-2">= ?</span>
          </span>
        ),
        answer: `${improper2.numerator}/${improper2.denominator}`
      },
      {
        main: 'Step 3: Multiply numerators and denominators',
        formula: (
          <span className="inline-flex items-center">
            <span className="inline-flex flex-col items-center mx-1 text-sm">
              <span className="text-center">{improper1.numerator}</span>
              <span className="border-t w-full min-w-[0.8em] border-black"></span>
              <span className="text-center">{improper1.denominator}</span>
            </span>
            <span className="mx-2">×</span>
            <span className="inline-flex flex-col items-center mx-1 text-sm">
              <span className="text-center">{improper2.numerator}</span>
              <span className="border-t w-full min-w-[0.8em] border-black"></span>
              <span className="text-center">{improper2.denominator}</span>
            </span>
            <span className="mx-2">= ?</span>
          </span>
        ),
        answer: `${multipliedNumerator}/${multipliedDenominator}`
      },
      {
        main: 'Step 4: Convert to mixed number',
        formula: (
          <span className="inline-flex items-center">
            <span className="inline-flex flex-col items-center mx-1 text-sm">
              <span className="text-center">{multipliedNumerator}</span>
              <span className="border-t w-full min-w-[0.8em] border-black"></span>
              <span className="text-center">{multipliedDenominator}</span>
            </span>
            <span className="mx-2">= ?</span>
          </span>
        ),
        answer: `${finalWhole} ${finalNumerator}/${multipliedDenominator}`
      }
    ];

    setSteps(newSteps);
    setShowSteps(true);
    setUserInputs({ step1: '', step2: '', step3: '', step4: '' });
    setCurrentStepIndex(0);
    setStepCompleted({ step1: false, step2: false, step3: false, step4: false });
    setInputStatus({ step1: null, step2: null, step3: null, step4: null });
    setShowNavigationButtons(false);
  };

  // Handle step input change
  const handleStepInputChange = (e, step) => {
    setUserInputs({ ...userInputs, [step]: e.target.value });
    setInputStatus({ ...inputStatus, [step]: null });
  };

  // Skip step
  const skipStep = (step) => {
    setUserInputs({ ...userInputs, [step]: steps[currentStepIndex].answer });
    setInputStatus({ ...inputStatus, [step]: 'correct' });
    setStepCompleted(prev => ({ ...prev, [step]: true }));
    setStepSkipped(prev => ({ ...prev, [step]: true }));
  };

  // Check step answer
  const checkStep = (step) => {
    const correctAnswer = steps[currentStepIndex].answer;
    const userAnswer = userInputs[step];
    const isCorrect = userAnswer.replace(/\s/g, '') === correctAnswer.replace(/\s/g, '');

    setInputStatus({ ...inputStatus, [step]: isCorrect ? 'correct' : 'incorrect' });
    
    if (isCorrect) {
      setStepCompleted(prev => ({ ...prev, [step]: true }));
      setStepSkipped(prev => ({ ...prev, [step]: false }));
    }
  };

  // Handle navigation
  const handleNavigateHistory = (direction) => {
    setNavigationDirection(direction);
    
    if (direction === 'back' && currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (direction === 'forward' && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }

    setTimeout(() => {
      setNavigationDirection(null);
    }, 300);
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: #fff;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .nav-button {
          opacity: 1;
          cursor: default !important;
          position: relative;
          z-index: 2;
          outline: 2px white solid;
        }

        .nav-button-orbit {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          z-index: 0;
        }

        .nav-button-orbit::before {
          content: "";
          position: absolute;
          inset: 2px;
          background: transparent;
          border-radius: 50%;
          z-index: 0;
        }

        .nav-button svg {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Mixed Numbers Multiplication</h2>
            <Button 
              onClick={generateNewProblem}
              className="bg-[#008545] hover:bg-[#00703d] text-white px-4 h-[42px] flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Problem
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-center text-lg font-mono bg-gray-50 p-4 rounded-md border border-gray-200">
              <MixedNumber whole={number1.whole} numerator={number1.numerator} denominator={number1.denominator} /> 
              × <MixedNumber whole={number2.whole} numerator={number2.numerator} denominator={number2.denominator} />
            </div>

            <div className={`glow-button ${!showSteps ? 'simple-glow' : 'simple-glow stopped'}`}>
              <button 
                onClick={calculateSteps}
                className="w-full bg-[#008545] hover:bg-[#00703d] text-white text-sm py-2 rounded"
              >
                Solve Step by Step
              </button>
            </div>
          </div>
        </div>

        {showSteps && (
          <div className="p-4 bg-gray-50">
            <div className="space-y-2">
              <h3 className="text-[#5750E3] text-sm font-medium mb-2">
                Steps to multiply mixed numbers:
              </h3>
              <div className="space-y-4">
                <div className="w-full p-2 mb-1 bg-white border border-[#5750E3]/30 rounded-md">
                  <p className="text-sm">{steps[currentStepIndex].main}</p>
                  <pre className="text-sm whitespace-pre-wrap mt-1">{steps[currentStepIndex].formula}</pre>
                  {stepCompleted[`step${currentStepIndex + 1}`] && (
                    <p className="text-sm text-[#008545] font-medium mt-1">
                      = {renderAnswer(steps[currentStepIndex].answer, currentStepIndex)}
                    </p>
                  )}
                  {!stepCompleted[`step${currentStepIndex + 1}`] && (
                    <div className="flex items-center space-x-1 mt-2">
                      <input
                        type="text"
                        value={userInputs[`step${currentStepIndex + 1}`]}
                        onChange={(e) => handleStepInputChange(e, `step${currentStepIndex + 1}`)}
                        placeholder="Enter Answer"
                        className={`w-full text-sm p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5750E3] ${
                          inputStatus[`step${currentStepIndex + 1}`] === 'correct'
                            ? 'border-green-500'
                            : inputStatus[`step${currentStepIndex + 1}`] === 'incorrect'
                            ? 'border-yellow-500'
                            : 'border-gray-300'
                        }`}
                      />
                      <div className="glow-button simple-glow">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => checkStep(`step${currentStepIndex + 1}`)} 
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Check
                          </button>
                          <button 
                            onClick={() => skipStep(`step${currentStepIndex + 1}`)} 
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {stepCompleted[`step${currentStepIndex + 1}`] && !showNavigationButtons && (
                    <div className="flex items-center gap-4 mt-2 justify-end">
                      {!stepSkipped[`step${currentStepIndex + 1}`] && (
                        <span className="text-green-600 font-bold select-none">Great Job!</span>
                      )}
                      {currentStepIndex < steps.length - 1 && (
                        <div className="glow-button simple-glow">
                          <button 
                            onClick={() => {
                              if (currentStepIndex < steps.length - 1) {
                                setCurrentStepIndex(prev => prev + 1);
                              }
                            }}
                            className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded-md min-w-[80px]"
                          >
                            Continue
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <div
                    className="nav-orbit-wrapper"
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: showNavigationButtons && currentStepIndex > 0 ? 'visible' : 'hidden',
                      opacity: showNavigationButtons && currentStepIndex > 0 ? 1 : 0,
                      pointerEvents: showNavigationButtons && currentStepIndex > 0 ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div className="nav-button-orbit"></div>
                    <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                    <button
                      onClick={() => handleNavigateHistory('back')}
                      className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 min-w-[100px] text-center">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <div
                    className="nav-orbit-wrapper"
                    style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      visibility: showNavigationButtons && currentStepIndex < steps.length - 1 ? 'visible' : 'hidden',
                      opacity: showNavigationButtons && currentStepIndex < steps.length - 1 ? 1 : 0,
                      pointerEvents: showNavigationButtons && currentStepIndex < steps.length - 1 ? 'auto' : 'none',
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    <div className="nav-button-orbit"></div>
                    <div style={{ position: 'absolute', width: '32px', height: '32px', borderRadius: '50%', background: 'white', zIndex: 1 }}></div>
                    <button
                      onClick={() => handleNavigateHistory('forward')}
                      className={`nav-button w-8 h-8 flex items-center justify-center rounded-full bg-[#008545]/20 text-[#008545] hover:bg-[#008545]/30 relative z-50`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MultiplyFractions;
                      