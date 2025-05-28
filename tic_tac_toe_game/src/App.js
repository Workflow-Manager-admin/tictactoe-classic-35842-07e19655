import React, { useState } from 'react';
import './App.css';

/**
 * Theme variables – can be further customized or placed in a global context.
 */
const theme = {
  primary: '#858080',    // neutral (used for grid lines, X)
  secondary: '#222222',  // background, O
  accent: '#2196f3',     // restart button, status highlight
  mode: 'light'
};

/**
 * Utility to determine if a player has won or it's a draw.
 * @param {Array} squares - flat array of 9 elements (string or null)
 * @returns {'X'|'O'|'draw'|null}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a]; // 'X' or 'O'
    }
  }
  if (squares.every(Boolean)) return 'draw';
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // State for 3x3 board (array of 9), current player, and status.
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // X always starts

  const winner = calculateWinner(squares);

  // Status display logic
  let status;
  if (winner === 'X' || winner === 'O') {
    status = `Winner: ${winner}`;
  } else if (winner === 'draw') {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  // Handle a player clicking a square
  function handleClick(index) {
    // Ignore if game over or square taken
    if (winner || squares[index]) return;
    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // Restart the game
  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // Board cell render
  function renderSquare(index) {
    return (
      <button
        className="ttt-square"
        style={{
          color: squares[index] === 'X' ? theme.primary : theme.accent,
          background: theme.mode === 'light' ? '#fff' : '#333',
          borderColor: theme.primary,
          cursor: winner || squares[index] ? 'default' : 'pointer',
        }}
        key={index}
        onClick={() => handleClick(index)}
        aria-label={`Square ${index + 1}`}
        disabled={!!winner || squares[index]}
      >
        {squares[index]}
      </button>
    );
  }

  return (
    <div className="app" style={{ background: theme.mode === 'light' ? '#f4f6fa' : theme.secondary, minHeight: '100vh' }}>
      <main>
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <h1
            className="title"
            style={{
              color: theme.secondary,
              fontSize: '2.8rem',
              marginTop: '40px',
              textAlign: 'center',
            }}
          >
            TicTacToe Classic
          </h1>
          <div
            className="ttt-status"
            style={{
              margin: '18px 0 24px 0',
              fontSize: '1.25rem',
              color: theme.primary,
              fontWeight: 500,
              textAlign: 'center',
            }}
            data-testid="status"
          >
            {status}
          </div>
          <div
            className="ttt-board"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 64px)',
              gridTemplateRows: 'repeat(3, 64px)',
              gap: '0',
              border: `2px solid ${theme.primary}`,
              background: '#fff',
              marginBottom: '32px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(33, 33, 33, 0.04)',
            }}
            role="grid"
            aria-label="TicTacToe board"
          >
            {Array(9)
              .fill(null)
              .map((_, i) => renderSquare(i))}
          </div>
          <button
            className="btn btn-large"
            style={{
              background: theme.accent,
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '6px',
              minWidth: '140px',
              marginBottom: '24px'
            }}
            onClick={restartGame}
            data-testid="restart-btn"
          >
            Restart Game
          </button>
        </div>
      </main>
      {/* Embedded component styles */}
      <style>
        {`
        .ttt-square {
          width: 64px;
          height: 64px;
          font-size: 2.1rem;
          font-weight: 700;
          border: 2px solid ${theme.primary};
          background: #fff;
          outline: none;
          transition: background 0.18s;
          border-radius: 0;
        }
        .ttt-board > .ttt-square {
          border-right: none;
          border-bottom: none;
        }
        .ttt-board > .ttt-square:nth-child(3n) {
          border-right: 2px solid ${theme.primary};
        }
        .ttt-board > .ttt-square:nth-child(n+7) {
          border-bottom: 2px solid ${theme.primary};
        }
        .ttt-square:disabled {
          opacity: 0.71;
          cursor: default;
        }
        `}
      </style>
    </div>
  );
}

export default App;