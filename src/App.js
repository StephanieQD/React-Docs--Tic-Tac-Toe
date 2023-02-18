import { useState } from 'react';
import './App.css';

/**
 * Square component.
 *
 * @param {*} param0 
 * @returns 
 */
function Square({value, onSquareClick, isWinner, atEnd, index }) {
  let css = "square";
  css += isWinner ? " winner" : "";
  css += atEnd ? " game-over" : "";
  if ( value || atEnd ) {
    return (
      <span className={css}>
        {value}
      </span>
    );
  } else {
    return (
      <button id={ "button-" + index } className={css} onClick={onSquareClick}>
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
function Board({ xIsNext, squares, onPlay, count }) {
  const player1 = '⚪';
  const player2 = '⚫';
  let gameOver = false;
  // let betweenGames = false; // We'll come back to this...

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
    onPlay( nextSquares, i );
  }

  const winner = calculateWinner(squares);
  let winningRow;
  let status;
  if (winner !== null ) {
    gameOver = true;
    status = 'Winner: ' + winner;
    winningRow = calculateWinner( squares, 'row' );
  } else {
    status = 'Current player: ' + (xIsNext ? player1 : player2);
  }
  // Output all the square at once. There are nine total.
  let renderedSquares = squares.map(
    (square, n) =>  
      <Square 
        key={'square-' + n} 
        index={n} 
        value={squares[n]} 
        onSquareClick={() => handleClick(n)}
        isWinner={ ( winningRow && winningRow.includes(n))}
        atEnd={ gameOver }
      />
  );

  return (
    <>
      <div className="status">{status}</div>
      <div className='board'>
          {renderedSquares}
      </div>
    </>
  );
}

export default function Game() {
  const btnCount = 9;
  const [history, setHistory] = useState([Array(btnCount).fill(null)]);
  // Like history, but better
  const [timeline, setTimeline] = useState(
    [
      {
        'board' : Array(btnCount).fill(null),
        'position' : null
      }
    ]);
  const [positions, setPositions] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortOrder, setSortOrder] = useState( 'desc' );
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  

  function handlePlay(nextSquares, buttonPosition ) {
    const roundState = {
      board : nextSquares,
      position : buttonPosition
    };
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);

    const nextTimeline = [...timeline.slice(0, currentMove + 1), roundState];
    setTimeline(nextTimeline);

    console.log('timeline', timeline)
    
    // positions.
    const nextPosition = [...positions.slice(0, currentMove + 1), buttonPosition];
    setPositions(nextPosition);
    console.log('START positions')
    console.log(positions)
    console.log('START positions')

    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function updateSortOrder( order ){
    let newOrder;
    newOrder = order === 'desc' ? 'asc' : 'desc';
    setSortOrder( newOrder );
  }

  function JumpBtn( { move, desc, onJumpClick }){
    return (
      <button 
        onClick={() => onJumpClick(move)}
      >
        Go to {desc}
      </button>
    )
  }

  function SortHistoryButton({order, onSortClick}){
    return (
      <button
        onClick={onSortClick}
      >
        Sort order ({order})
      </button>
    );
  }

  let sortButton = <SortHistoryButton 
    order={sortOrder} 
    onSortClick={() => { 
      updateSortOrder(sortOrder);
      console.log(sortOrder);
    } }
  />;

  function TimelineItem({}){
    return(
      <span>
        Timeline item sutaato
      </span>
    );
  }
  
  const movesList = [...timeline].map( ( snapshot, move ) => {
    let description;
    let position;

    if (move > 0) {
      description = 'move #' + move;
      // Determine Position (Col, row) in a hideously ineffecient fashion.
      const pos = snapshot.position
      let row = 'A';
      let col = 1;

      if ( pos === 1 || pos === 4 || pos === 7 ) {
        col = 2;
      }

      if ( pos === 2 || pos === 5 || pos === 8 ) {
        col = 3;
      }
      
      if ( pos > 5 ) {
        row = 'C';
      } else if ( pos > 3 ) {
        row = 'B';
      }

      position = " (" + row + ", " + col + ")"
      description += position;
      // End Determine Position (Col, row).
    } else {
      description = 'game start';
    }

    let historyMessage;
    if (move === currentMove) {
      historyMessage = "You are on " + description;
    } else {

      historyMessage = <JumpBtn
        move={move}
        desc={description} 
        onJumpClick={() => jumpTo(move)}
      />;
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
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          count={btnCount} 
        />
      </div>
      <div className="game-info">
        {sortButton}
        <ol>{ sortOrder === 'desc'? movesList : movesList.reverse()}</ol>
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