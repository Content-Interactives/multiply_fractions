import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const MultiplyFractions = ({ numerator, denominator, whole = null, isCompleted = false }) => {
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

const MixedNumbersLesson = () => {
  const [number1, setNumber1] = useState(generateMixedNumber());
  const [number2, setNumber2] = useState(generateMixedNumber());
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({ step1First: '', step1Second: '', step2: '', step3: '' });
  const [hasError, setHasError] = useState({
    step1First: false,
    step1Second: false,
    step2: false,
    step3: false
  });
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false);

  const improper1 = calculateImproperFraction(number1);
  const improper2 = calculateImproperFraction(number2);
  const multipliedNumerator = improper1.numerator * improper2.numerator;
  const multipliedDenominator = improper1.denominator * improper2.denominator;
  const finalWhole = Math.floor(multipliedNumerator / multipliedDenominator);
  const finalNumerator = multipliedNumerator % multipliedDenominator;

  const checkStep = (step) => {
    let isCorrect = false;
    
    switch(step) {
      case 1:
        const firstAnswer = `${improper1.numerator}/${improper1.denominator}`;
        const secondAnswer = `${improper2.numerator}/${improper2.denominator}`;
        const isFirstCorrect = answers.step1First.replace(/\s/g, '') === firstAnswer.replace(/\s/g, '');
        const isSecondCorrect = answers.step1Second.replace(/\s/g, '') === secondAnswer.replace(/\s/g, '');
        isCorrect = isFirstCorrect && isSecondCorrect;
        setHasError({
          ...hasError,
          step1First: !isFirstCorrect,
          step1Second: !isSecondCorrect
        });
        break;
      case 2:
        const answer2 = `${multipliedNumerator}/${multipliedDenominator}`;
        isCorrect = answers.step2.replace(/\s/g, '') === answer2.replace(/\s/g, '');
        setHasError(prev => ({ ...prev, step2: !isCorrect }));
        break;
      case 3:
        const answer3 = `${finalWhole} ${finalNumerator}/${multipliedDenominator}`;
        isCorrect = answers.step3.replace(/\s/g, '') === answer3.replace(/\s/g, '');
        setHasError(prev => ({ ...prev, step3: !isCorrect }));
        break;
    }

    if (isCorrect) {
      setCompletedSteps(prev => [...prev, step]);
      setCurrentStep(step + 1);
    }
  };

  const handleInputChange = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    setHasError(prev => ({ ...prev, [field]: undefined }));
  };

  const skipStep = (step) => {
    setCompletedSteps(prev => [...prev, step]);
    setCurrentStep(step + 1);
  };

  const generateNewProblem = () => {
    setNumber1(generateMixedNumber());
    setNumber2(generateMixedNumber());
    setCurrentStep(1);
    setAnswers({ step1First: '', step1Second: '', step2: '', step3: '' });
    setHasError({ step1First: false, step1Second: false, step2: false, step3: false });
    setCompletedSteps([]);
    setShowSteps(false);
  };

  return (
    <div className="bg-gray-100 p-8 w-full max-w-4xl mx-auto">
      <Card className="w-full shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">Mixed Numbers Multiplication</h1>
          <p className="text-sky-800">Learn how to multiply mixed numbers step by step!</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What are Mixed Numbers?</h2>
            <p className="text-blue-600">
              Mixed numbers are whole numbers combined with a fraction, like <MixedNumber whole={2} numerator={1} denominator={2} /> or <MixedNumber whole={3} numerator={3} denominator={4} />. 
              To multiply mixed numbers, we first need to convert them into improper fractions, then multiply the numerators and denominators, 
              and finally convert back to a mixed number if necessary.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Example</h2>
            <Card className="border border-gray-200">
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-bold pt-4">
                  <MixedNumber whole={2} numerator={3} denominator={4} /> × <MixedNumber whole={3} numerator={1} denominator={6} />
                </p>
                <div className="space-y-2">
                  <p className="font-medium">1. Convert to improper fractions:</p>
                  <div className="ml-6 flex items-center gap-2">
                    <MixedNumber whole={2} numerator={3} denominator={4} />
                    <span className="inline-block">=</span>
                    <Fraction numerator={11} denominator={4} />
                  </div>
                  <div className="ml-6 flex items-center gap-2">
                    <MixedNumber whole={3} numerator={1} denominator={6} />
                    <span className="inline-block">=</span>
                    <Fraction numerator={19} denominator={6} />
                  </div>
                  <p className="font-medium mt-4">2. Multiply numerators and denominators:</p>
                  <div className="ml-6">
                    <Fraction numerator="11 × 19" denominator="4 × 6" />
                  </div>
                  <p className="font-medium mt-4">3. Simplify:</p>
                  <div className="ml-6 flex items-center gap-2">
                    <Fraction numerator={209} denominator={24} />
                    <span className="inline-block">=</span>
                    <MixedNumber whole={8} numerator={17} denominator={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <Button 
                onClick={generateNewProblem}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Problem
              </Button>
            </div>

            <div className="text-center text-2xl mb-4">
              <span className="font-mono">
                <MixedNumber whole={number1.whole} numerator={number1.numerator} denominator={number1.denominator} /> 
                × <MixedNumber whole={number2.whole} numerator={number2.numerator} denominator={number2.denominator} />
              </span>
            </div>

            <Button 
              onClick={() => setShowSteps(true)}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Solve Step by Step
            </Button>

            {showSteps && (
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="mb-4">1. Convert each mixed number to an improper fraction:</p>
                {completedSteps.includes(1) ? (
                  <div className="ml-6 text-green-600 font-bold mb-4">
                    <div className="space-y-2">
                      <div>
                        <Fraction 
                          numerator={improper1.numerator} 
                          denominator={improper1.denominator}
                          isCompleted={true} 
                        />
                      </div>
                      <div>
                        <Fraction 
                          numerator={improper2.numerator} 
                          denominator={improper2.denominator}
                          isCompleted={true} 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MixedNumber whole={number1.whole} numerator={number1.numerator} denominator={number1.denominator} />
                        <span>=</span>
                        {answers.step1First === `${improper1.numerator}/${improper1.denominator}` && hasError.step1First === false && hasError.step1First !== undefined ? (
                          <span className="text-green-600 font-bold">
                            <Fraction 
                              numerator={improper1.numerator} 
                              denominator={improper1.denominator}
                              isCompleted={true} 
                            />
                          </span>
                        ) : (
                          <Input
                            type="text"
                            placeholder="Enter as: a/b"
                            value={answers.step1First}
                            onChange={(e) => handleInputChange('step1First', e.target.value)}
                            className={`w-24 ${hasError.step1First ? 'border-red-500' : ''}`}
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MixedNumber whole={number2.whole} numerator={number2.numerator} denominator={number2.denominator} />
                        <span>=</span>
                        {answers.step1Second === `${improper2.numerator}/${improper2.denominator}` && hasError.step1Second === false && hasError.step1Second !== undefined ? (
                          <span className="text-green-600 font-bold">
                            <Fraction 
                              numerator={improper2.numerator} 
                              denominator={improper2.denominator}
                              isCompleted={true} 
                            />
                          </span>
                        ) : (
                          <Input
                            type="text"
                            placeholder="Enter as: a/b"
                            value={answers.step1Second}
                            onChange={(e) => handleInputChange('step1Second', e.target.value)}
                            className={`w-24 ${hasError.step1Second ? 'border-red-500' : ''}`}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button 
                        onClick={() => checkStep(1)}
                        className="bg-blue-400 hover:bg-blue-500"
                      >
                        Check
                      </Button>
                      <Button
                        onClick={() => skipStep(1)}
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                )}

                {completedSteps.includes(1) && (
                  <>
                    <p className="mb-4">2. Multiply the numerators and denominators:</p>
                    {completedSteps.includes(2) ? (
                      <div className="ml-6 text-green-600 font-bold mb-4">
                        <Fraction 
                          numerator={multipliedNumerator} 
                          denominator={multipliedDenominator}
                          isCompleted={true}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 mb-4">
                        <Input
                          type="text"
                          placeholder="Enter as: a/b"
                          value={answers.step2}
                          onChange={(e) => handleInputChange('step2', e.target.value)}
                          className={`w-48 ${hasError.step2 ? 'border-red-500' : ''}`}
                        />
                        <Button 
                          onClick={() => checkStep(2)}
                          className="bg-blue-400 hover:bg-blue-500"
                        >
                          Check
                        </Button>
                        <Button
                          onClick={() => skipStep(2)}
                          className="bg-gray-400 hover:bg-gray-500 text-white"
                        >
                          Skip
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {completedSteps.includes(2) && (
                  <>
                    <p className="mb-4">3. Convert to a mixed number:</p>
                    {completedSteps.includes(3) ? (
                      <>
                        <div className="ml-6 text-green-600 font-bold mb-4">
                          <MixedNumber 
                            whole={finalWhole} 
                            numerator={finalNumerator} 
                            denominator={multipliedDenominator}
                            isCompleted={true}
                          />
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                          <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                          <p className="text-green-700">
                            You've successfully multiplied the mixed numbers!
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4 mb-4">
                        <Input
                          type="text"
                          placeholder="Enter as: a b/c"
                          value={answers.step3}
                          onChange={(e) => handleInputChange('step3', e.target.value)}
                          className={`w-48 ${hasError.step3 ? 'border-red-500' : ''}`}
                        />
                        <Button 
                          onClick={() => checkStep(3)}
                          className="bg-blue-400 hover:bg-blue-500"
                        >
                          Check
                        </Button>
                        <Button
                          onClick={() => skipStep(3)}
                          className="bg-gray-400 hover:bg-gray-500 text-white"
                        >
                          Skip
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Practice makes perfect! Keep solving mixed number multiplication problems to improve your skills.
      </p>
    </div>
  );
};

export default MultiplyFractions;
                      