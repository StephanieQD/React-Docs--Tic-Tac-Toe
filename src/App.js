import { useState } from 'react';
import './App.css';


function Square({value, onSquareClick }) {
  if ( value ) {
    return (
      <span className="square">
        {value}
      </span>
    );
  } else {
    return (
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    );
  }
}
/**
 * The current board.
 *
 * @param {{xIsNext: boolean, squares: Array, onPlay: method}} Is X next?
 * @returns 
 */
function Board({ xIsNext, squares, onPlay }) {
  const player1 = 'B';
  const player2 = 'A';

  /**
   * `onSquareClick` : What should happen when you click a square.
   * @param {number} i Position of the square within the grid array. 
   * @returns 
   */
  function handleClick( i ) {
    if ( calculateWinner( squares ) || squares[i] ) {
      return;
    }
    const nextSquares = squares.slice();
    if ( xIsNext ) {
      nextSquares[i] = player1;
    } else {
      nextSquares[i] = player2;
    }
    onPlay( nextSquares );
  }

  const winner = calculateWinner(squares);
  let winningRow;
  let status;
  if (winner !== null ) {
    status = 'Winner: ' + winner;
    winningRow = calculateWinner( squares, 'row' );
    console.log( winningRow );
  } else {
    status = 'Current player: ' + (xIsNext ? player1 : player2);
  }
  // Output all the square at once. There are nine total.
  let renderedSquares = squares.map( (square, n) =>  <Square key={'square-' + n} index={n} value={squares[n]} onSquareClick={() => handleClick(n)} /> );

  return (
    <>
      <div className="status">{status}</div>
      <div className='play-area'>
          {renderedSquares}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function JumpBtn({move, desc, onJumpClick}){
    return (
      <button onClick={() => onJumpClick(move)}>Go to {desc}</button>
    )
  }

  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      description = 'move #' + move;
    } else {
      description = 'game start';
    }

    let historyMessage;
    if (move === currentMove) {
      historyMessage = "You are on " + description;
    } else {
      historyMessage = <JumpBtn move={move} desc={description} onJumpClick={() => jumpTo(move)} />;
    }

    return (
      <li key={move}>
        {historyMessage}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner( squares, show = 'name' ) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if ( show === 'row' ) {
        return [ a, b, c ];
      } else {
        return squares[a];
      }
      
    }
  }
  return null;
}