import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Play, RotateCcw } from 'lucide-react';

const QuizGame = () => {
  const styles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    .container { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; padding: 20px; }
    .loading-screen { color: white; font-size: 24px; }
    .card { background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); padding: 40px; max-width: 700px; width: 100%; }
    .title { font-size: 36px; font-weight: bold; text-align: center; color: #667eea; margin-bottom: 10px; }
    .subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 18px; }
    .error-banner { background: #fef3cd; border: 1px solid #f6e05e; color: #975a16; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
    .input { width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 16px; margin-bottom: 25px; }
    .input:focus { outline: none; border-color: #667eea; }
    .btn { width: 100%; padding: 16px; border: none; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; }
    .btn-primary { background: #667eea; color: white; }
    .btn-primary:hover { background: #5568d3; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
    .leaderboard-section { margin-top: 30px; }
    .section-title { font-size: 24px; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; color: #333; }
    .icon-gold { color: #f59e0b; }
    .leaderboard-list { display: flex; flex-direction: column; gap: 10px; }
    .leaderboard-item { display: flex; justify-content: space-between; align-items: center; background: #f3f4f6; padding: 15px; border-radius: 10px; }
    .leaderboard-item.highlight { background: #ede9fe; }
    .leaderboard-name { font-weight: 600; }
    .leaderboard-score { color: #667eea; font-weight: bold; }
    .text-center { text-align: center; }
    .trophy-icon { color: #f59e0b; margin: 0 auto 20px; }
    .congrats-text { font-size: 24px; margin-bottom: 10px; }
    .final-score { font-size: 60px; font-weight: bold; color: #667eea; margin: 20px 0; }
    .percentage { font-size: 20px; color: #666; margin-bottom: 30px; }
    .quiz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
    .question-counter { font-size: 14px; font-weight: 600; color: #666; }
    .header-right { display: flex; align-items: center; gap: 20px; }
    .timer { display: flex; align-items: center; gap: 8px; color: #667eea; font-weight: bold; font-size: 18px; }
    .timer-warning { color: #dc2626; }
    .timer-text { font-size: 20px; }
    .score-display { color: #667eea; font-weight: bold; font-size: 18px; }
    .progress-bar { width: 100%; height: 8px; background: #e5e7eb; border-radius: 10px; margin-bottom: 30px; overflow: hidden; }
    .progress-fill { height: 100%; background: #667eea; transition: width 0.3s ease; }
    .question-text { font-size: 24px; font-weight: bold; margin-bottom: 30px; color: #333; line-height: 1.4; }
    .options-container { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .option-btn { width: 100%; padding: 16px; border: 2px solid #e5e7eb; border-radius: 10px; background: #f9fafb; text-align: left; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .option-btn:hover:not(:disabled) { background: #f3f4f6; border-color: #667eea; }
    .option-btn:disabled { cursor: not-allowed; }
    .option-selected { background: #ede9fe; border-color: #667eea; }
    .option-correct { background: #10b981; color: white; border-color: #10b981; }
    .option-wrong { background: #ef4444; color: white; border-color: #ef4444; }
    .feedback { padding: 16px; border-radius: 10px; text-align: center; font-weight: bold; font-size: 18px; margin-top: 20px; }
    .feedback-correct { background: #d1fae5; color: #065f46; }
    .feedback-wrong { background: #fee2e2; color: #991b1b; }
    @media (max-width: 600px) {
      .card { padding: 20px; }
      .title { font-size: 28px; }
      .question-text { font-size: 20px; }
      .final-score { font-size: 48px; }
    }
  `;

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timer, setTimer] = useState(15);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sampleQuestions = [
    {
      question: "What is the capital of Nigeria?",
      options: ["Accra", "Berlin", "Abuja", "Madrid"],
      correct: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correct: 2
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3
    },
    {
      question: "Which programming language is known for web development?",
      options: ["Python", "JavaScript", "C++", "Swift"],
      correct: 1
    },
    {
      question: "What year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correct: 2
    },
    {
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correct: 2
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      correct: 1
    },
    {
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correct: 2
    }
  ];

  useEffect(() => {
    loadQuestions();
    loadLeaderboard();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      const data = await response.json();
      
      if (data.response_code === 0 && data.results) {
        const formatted = data.results.map(q => ({
          question: decodeHTML(q.question),
          options: [...q.incorrect_answers, q.correct_answer]
            .map(a => decodeHTML(a))
            .sort(() => Math.random() - 0.5),
          correct: [...q.incorrect_answers, q.correct_answer]
            .map(a => decodeHTML(a))
            .sort(() => Math.random() - 0.5)
            .indexOf(decodeHTML(q.correct_answer))
        }));
        setQuestions(formatted);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Using offline questions');
      setQuestions(sampleQuestions);
    } finally {
      setLoading(false);
    }
  };

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const loadLeaderboard = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('quizLeaderboard') || '[]');
      setLeaderboard(saved);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setLeaderboard([]);
    }
  };

  const saveToLeaderboard = (name, finalScore) => {
    try {
      const newEntry = { name, score: finalScore, date: new Date().toISOString() };
      const updated = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      window.localStorage.setItem('quizLeaderboard', JSON.stringify(updated));
      setLeaderboard(updated);
    } catch (err) {
      console.error('Error saving to leaderboard:', err);
    }
  };

  useEffect(() => {
    if (gameStarted && !gameFinished && !showFeedback && timer > 0) {
      const interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0 && !showFeedback) {
      handleTimeout();
    }
  }, [timer, gameStarted, gameFinished, showFeedback]);

  const handleTimeout = () => {
    setShowFeedback(true);
    setTimeout(() => {
      moveToNext();
    }, 2000);
  };

  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(15);
  };

  const handleAnswerClick = (index) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      moveToNext();
    }, 1500);
  };

  const moveToNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimer(15);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameFinished(true);
    if (playerName.trim()) {
      saveToLeaderboard(playerName.trim(), score);
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setGameFinished(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimer(15);
    setPlayerName('');
    loadQuestions();
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="container loading-screen">
          <div className="loading-text">Loading questions...</div>
        </div>
      </>
    );
  }

  if (!gameStarted) {
    return (
      <>
        <style>{styles}</style>
        <div className="container">
        <div className="card">
          <h1 className="title">Quiz Master</h1>
          <p className="subtitle">Test your knowledge!</p>
          
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="input"
            onKeyPress={(e) => e.key === 'Enter' && startGame()}
          />

          <button onClick={startGame} className="btn btn-primary">
            <Play size={24} />
            Start Quiz
          </button>

          {leaderboard.length > 0 && (
            <div className="leaderboard-section">
              <h2 className="section-title">
                <Trophy className="icon-gold" size={24} />
                Leaderboard
              </h2>
              <div className="leaderboard-list">
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="leaderboard-item">
                    <span className="leaderboard-name">#{idx + 1} {entry.name}</span>
                    <span className="leaderboard-score">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </>
    );
  }

  if (gameFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <>
        <style>{styles}</style>
        <div className="container">
        <div className="card text-center">
          <Trophy size={64} className="trophy-icon" />
          <h1 className="title">Quiz Complete!</h1>
          <p className="congrats-text">Congratulations, {playerName}!</p>
          <p className="final-score">{score}/{questions.length}</p>
          <p className="percentage">{percentage}% Correct</p>
          
          <button onClick={restartGame} className="btn btn-primary">
            <RotateCcw size={24} />
            Play Again
          </button>

          {leaderboard.length > 0 && (
            <div className="leaderboard-section">
              <h2 className="section-title">
                <Trophy className="icon-gold" size={24} />
                Top Scores
              </h2>
              <div className="leaderboard-list">
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <div 
                    key={idx} 
                    className={`leaderboard-item ${entry.name === playerName && entry.score === score ? 'highlight' : ''}`}
                  >
                    <span className="leaderboard-name">#{idx + 1} {entry.name}</span>
                    <span className="leaderboard-score">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <>
      <style>{styles}</style>
      <div className="container">
      <div className="card">
        <div className="quiz-header">
          <div className="question-counter">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="header-right">
            <div className={`timer ${timer <= 5 ? 'timer-warning' : ''}`}>
              <Clock size={20} />
              <span className="timer-text">{timer}s</span>
            </div>
            <div className="score-display">Score: {score}</div>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <h2 className="question-text">{currentQ.question}</h2>
        
        <div className="options-container">
          {currentQ.options.map((option, index) => {
            let className = 'option-btn';
            
            if (showFeedback) {
              if (index === currentQ.correct) {
                className += ' option-correct';
              } else if (index === selectedAnswer) {
                className += ' option-wrong';
              }
            } else if (selectedAnswer === index) {
              className += ' option-selected';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={showFeedback}
                className={className}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`feedback ${selectedAnswer === currentQ.correct ? 'feedback-correct' : 'feedback-wrong'}`}>
            {selectedAnswer === currentQ.correct ? '✓ Correct!' : '✗ Wrong Answer'}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default QuizGame;