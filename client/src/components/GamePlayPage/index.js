import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './GamePlayPage.css'
class GamePlayPage extends React.Component {
    constructor(props){
        super(props)
        this.state={isGameDone:false,
        }
    }
    render() {
        const isGameDone= this.state.isGameDone;
        return (<div>
            
            <div>김현수</div> 
            <div>VS</div> 
            <div>김현숙</div>
            {isGameDone===false?(<div>
            <div>상대방 차례입니다.</div>
            <div> 1:00 </div>
            </div>) :(<div><div> 게임에서 이겼습니다.</div></div>)} 
            <Button>게임 나가기</Button>
            <div class="game_board">
            <Button class="game_board_cell"></Button>
            <Button class="game_board_cell"></Button>
            <Button class="game_board_cell"></Button>
            <Button class="game_board_cell"></Button>
            <Button class="game_board_cell"></Button>
            <Button class="game_board_cell"></Button>
            <Button class="game_board_cell"></Button>
            <Button class="game_board_cell"></Button>
            <Button class="game_board_cell"></Button>
            </div>
            </div>);
    }
}
export default GamePlayPage;