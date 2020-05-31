import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      key={i}
    />;
  }

  render() {
    let count = 0;
    return (
      <div>
        {[...Array(rows)].map((e, i) => {
          return (<div className="board-row" key={count}>
            {[...Array(cols)].map((e, i) => {
              return this.renderSquare(count++);
            })}
          </div>);
        })}
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
        blockNumber: null
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        blockNumber: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;

    const moves = history.map((hist, move) => {
      const desc = move ?
        'Go to move #' + move + ' ' + getBlockLocation(hist.blockNumber) :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    });

    let status;
    const winner = calculateWinner(squares);
    if (winner) {
      status = 'Winner is: ' + winner;
    } else if (calculateDraw(squares)) {
      status = 'Match draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

const rows = 3;
const cols = 3;
const calculateWinner = function (squares) {
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
      return squares[a];
    }
  }
  return null;
}

const calculateDraw = function (squares) {
  for (let i = 0; i < rows * cols; i++) {
    if (!squares[i]) {
      return false;
    }
  }
  return true;
}

const getBlockLocation = function (i) {
  return '(' + Math.floor(i / rows) + ',' + (i % cols) + ')';
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
