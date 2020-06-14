import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
  renderSquare(i) {
	let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
	<Square
	value={this.props.squares[i]} 
	onClick={() => this.props.onClick(i)}
	winningSquare = {winningSquare}
	/>
	);
  }

  render () {
	  let boardSquares = [];
	  for (let col = 0; col < 3; col++) {
		  let boardRow = [];
		  for (let row = 0; row < 3; row++) {
			  boardRow.push(<span key={(col*3)+row}> {this.renderSquare((col*3)+row)} </span>)
		  }
		  boardSquares.push(<div className="board-row" key={col}>{boardRow}</div>)
	  }
	  
	  return (
		<div>
			{boardSquares}
		</div>
	  );
  }
}

class Game extends React.Component {
  constructor(props) {
	  super(props);
	  this.state = {
		  history: [{
			  squares: Array(9).fill(null),
			  col: null,
			  row: null,
		  }],
		  stepNumber: 0,
		  xIsNext: true,
		  moveOrder: true,
	  };
  }
  
  handleClick(i) {
	  const history = this.state.history.slice(0, this.state.stepNumber + 1);
	  const current = history[history.length - 1];
	  const squares =  current.squares.slice();
	  const col = current.col;
	  const row = current.row;
	  
	  if (calculateWinner(squares) || squares[i]) {
		  return;
	  }
	  squares[i] = this.state.xIsNext ? 'X' : 'O';
	  this.setState({
		  history: history.concat([{
			  squares: squares,
			  col: (i % 3) + 1,
			  row: Math.floor(i / 3) + 1,
		  }]),
		  stepNumber: history.length,
		  xIsNext: !this.state.xIsNext,
	  });
  }
  
  jumpTo(step) {
	  this.setState({
		stepNumber: step,
		xIsNext: (step % 2) == 0,
	  });
  }
  
  reverseMoveOrder() {
	  this.setState({
		  moveOrder: !this.state.moveOrder,
	  });
  }
  
  render() {
	const history = this.state.history;
	const current = history[this.state.stepNumber];
	const winner = calculateWinner(current.squares);
	const tie = calculateTie(current.squares);
	const moveOrder = this.state.moveOrder;
	
	const moves = history.map((step, move) => {
		let moveKey;
		if (moveOrder) {
			moveKey = move;
		} else {
			moveKey = (history.length - 1) - move;
		}
		
		const temp = moveKey ?
			'Go to move #' + moveKey + ' ('+history[moveKey].col+', '+history[moveKey].row+')':
			'Go to game start';
			
		const desc = (moveKey === this.state.stepNumber) ?
			<strong>{temp}</strong> :
			temp;
		
		return (
		<li key={moveKey}>
			<button onClick={() => this.jumpTo(moveKey)}>{desc}</button>
		</li>
		);
	});
	
	let status;
	if (winner) {
		status = 'Winner: ' + winner.winner;
	} else {
		status = tie ?
		'The game is a draw':
		'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	}
	
	const toggle = <button onClick={() => this.reverseMoveOrder()}>Change Move Order</button>;
	
	
    return (
      <div className="game">
        <div className="game-board">
          <Board 
			squares={current.squares}
			onClick={(i) => this.handleClick(i)}
			winner={winner && winner.winningSquares}
		  />
        </div>
        <div className="game-info">
          <div>{status}</div>
		  <div>{toggle}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function Square(props) {
	const winningSquareStyle = {
    backgroundColor: '#ff0'
  };
	
	return (
		<button className="square" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null}>
			{props.value}
		</button>
	);
}


function calculateWinner(squares) {
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6],
	];
	
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				winner: squares[a],
				winningSquares: lines[i],
			};
		}
	}
	return null;
}

function calculateTie(squares) {
	for (let i = 0; i < 9; i++) {
		if (!squares[i]) {
			return false;
		}
	}
	return true;
}