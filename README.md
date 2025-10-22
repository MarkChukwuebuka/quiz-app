# Quiz Master - Dynamic Quiz Game

An interactive quiz game built with React that tests your knowledge across various topics.

## Features

- **Dynamic Question Loading**: Fetches questions from Open Trivia DB API with offline fallback
- **Real-time Feedback**: Instant visual feedback on answer correctness
- **Score Tracking**: Live score display and comprehensive results
- **Timer System**: 15-second countdown per question
- **Leaderboard**: Top 10 high scores saved locally
- **Responsive Design**: Optimized for all screen sizes
- **Error Handling**: Graceful fallback for API failures

## Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd quiz-game

# Install dependencies
npm install

# Start development server
npm start
```

## How to Play

1. Enter your name on the start screen
2. Click "Start Quiz" to begin
3. Answer each question within 15 seconds
4. Select your answer by clicking on an option
5. Get instant feedback (green = correct, red = incorrect)
6. View your final score and leaderboard ranking
7. Click "Play Again" to restart

## Technologies Used

- **React** (Hooks: useState, useEffect)
- **Lucide React** for icons
- **Open Trivia DB API** for questions
- **LocalStorage** for leaderboard persistence

## Project Structure
```
quiz-game/
├── src/
│   ├── App.js          # Main quiz component
│   |─ index.js        # Entry point
│         
├── public/
├── package.json
└── README.md
```

## Game Logic

- 10 questions per game
- 4 multiple choice options per question
- 15 seconds to answer each question
- 1 point per correct answer
- Timer automatically moves to next question at 0
- Leaderboard saves top 10 scores

## Error Handling

- API failures fallback to local question set
- Invalid data handled gracefully
- Leaderboard errors don't break the game
- Missing player names prevented at start
