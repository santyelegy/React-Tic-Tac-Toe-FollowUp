import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';

  function Square(props){
    return(
        <button className="square" 
        onClick={props.onClick}>
          {props.value}
        </button>
    );
  }
  function calculateWinner(squares){
    const lines=[
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for( let i=0;i<lines.length;i++){
        const [a,b,c] = lines[i];
        //square[a] is not null
        if(squares[a]&&squares[a]==squares[b]&&squares[a]==squares[c]){
            return squares[a];
        }
    }
    return null;
  }
  class Board extends React.Component {

    renderSquare(i) {
      return <Square 
                value={this.props.squares[i]}
                onClick={()=> this.props.onClick(i)}/>;
    }
  
    render() {
      let count=0;
      var rows=[];
      for (let row=0;row<3;row++){
          var columns=[];
          for(let column=0;column<3;column++){
              columns.push(this.renderSquare(count));
              count++;
          }
          rows.push(<div className="board-row">
            {columns}
          </div>);
        }
      return (
        <div>
          {rows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            history: [{
                squares: Array(9).fill(null),
                location: Array(1).fill(null),
            }],
            
            stepNumber: 0,
            xIsNext:true,
            reverseDisplay:false,
        };
    }
    handleClick(i){
        const history=this.state.history.slice(0,this.state.stepNumber+1);
        const current=history[history.length-1];
        const squares=current.squares.slice();
        if(calculateWinner(squares)||squares[i]){
            return;
        }
        squares[i]=this.state.xIsNext ? 'X':'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    location: current.location.concat([i]),
                }]),
            
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step%2)===0,
      });
    }
    changeReverse(){
      this.setState({
        reverseDisplay: !this.state.reverseDisplay,
      });
    }
    render() {
        let history=this.state.history;
        const current=history[this.state.stepNumber];
        const winner=calculateWinner(current.squares);
        //map((element, index) => { /* … */ })
        //move is the index
        const moves=history.map((step,move)=>{
            let y=0;
            let x=0;
            if(step.location[move]!=null){
              y=step.location[move]%3;
              x=(step.location[move]-y)/3;
            }        
            const desc = move ? 'Go to move #' + move + ' at (' + x+','+y+')'  : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={()=> this.jumpTo(move)}>{move== this.state.stepNumber?<b>{desc}</b>:desc}</button>
                </li>
            );
        }
        );

        let status;
        if(winner){
            status='Winner: '+ winner;
        }else{
            status = 'Next player: '+ (this.state.xIsNext ? 'X':'O');
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{this.state.reverseDisplay?moves.reverse():moves}</ol>
          <button onClick={()=>this.changeReverse()}>Reverse display</button>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  