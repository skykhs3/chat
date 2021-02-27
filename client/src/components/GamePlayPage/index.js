import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './GamePlayPage.css'
import axios from 'axios';
import socket from '../../utills/socket'

class GamePlayPage extends React.Component {
    constructor(props) {
        super(props)
        this.alreadyAlert=false;
        this.state = {
            isAdmin: true,
            myNickname: "",
            myID: "",
            roomTitle: "",
            otherNickname: "",
            remainTime: 0,
            otherID: "",
            userInfo: {},
            roomInfo: {},
        }
    }
    aa = (type) => {
        axios.get('/api/users/auth').then(resUser => {
            console.log(resUser.data)
            this.setState({ userInfo: resUser.data });
            if (resUser.data.isAuth === false) {
                this.props.history.push('/login')
            }
            else {
                axios.post('/api/rooms/auth', { _id: resUser.data.joinedRoomID }).then(resRoom => {
                    console.log(resRoom.data)
                    this.setState({ roomTitle: resRoom.data.roomTitle })
                    if (resRoom.data.isAuth === false) {
                        this.props.history.push('/')
                    }
                    else {
                        this.setState({ roomInfo: resRoom.data }, () => {
                            if (this.state.roomInfo.winner !== 0) {
                                if(this.alreadyAlert==false){
                                    this.alreadyAlert=true;
                                alert("게임 종료 : " + this.state.roomInfo.winner==3?"무승부":((this.state.roomInfo.winner === 1 ? this.state.roomInfo.adminNickname : this.state.roomInfo.participantNickname) + " 의 승리"))
                                }
                            }
                        })
                        this.setState({
                            myID: resUser.data._id,
                            myNickname: resUser.data.nickname,
                        })
                        if (resRoom.data.adminID === resUser.data._id) {
                            this.setState({
                                isAdmin: true,
                                otherID: resRoom.data.participantID,
                                otherNickname: resRoom.data.participantNickname
                            })
                        }
                        else {
                            this.setState({
                                isAdmin: false,
                                otherID: resRoom.data.adminID,
                                otherNickname: resRoom.data.adminNickname
                            })
                        }
                    }
                })
            }
        })
    }
    componentDidMount() {

        var playAlert = setInterval(() => {
            this.setState({ remainTime: new Date(this.state.roomInfo.timeLimit).getTime() - new Date().getTime() });

        }, 100)

        this.aa(0);
        socket.on('/sToC/rooms/needToRefresh', () => {
            ///본인 방에 해당하는 것만 refresh 해야함. 방번호 인자 넘기자.
            this.aa(0);

        })
    }


    exitOnClickHanlder = (event) => {
  // {
  //   adminID:
  //    participantID:
  //   roomID:
  //    isAdmin:
  // }
  axios.post('/api/rooms/exitGameRoom',{adminID:this.state.roomInfo.adminID,participantID:this.state.roomInfo.participantID,roomID:this.state.roomInfo._id,isAdmin:this.state.isAdmin}).then(res=>{
if(res.data.success===true){
    this.props.history.push('/')
}
})
        
    }
    gameStartOnClickHandler = (event) => {
        if(this.state.isAdmin===true){
            axios.post('/api/rooms/startgame',{_id:this.state.roomInfo._id}).then(res=>{

            })
        }
        else{
           
            if(this.state.roomInfo.isReady===true){
                console.log("A"+this.state.roomInfo.isReady)
                axios.post('/api/rooms/readygame',{_id:this.state.roomInfo._id,isReady:true}).then(res=>{console.log(res)})
            }
            else{
                console.log("B"+this.state.roomInfo.isReady)
                axios.post('/api/rooms/readygame',{_id:this.state.roomInfo._id,isReady:false}).then(res=>{console.log(res)})
            }
        }
    }
    cellOnClick = (event) => {
        // {
        //   _id :  룸번호
        //   isAdmin:  어드민인가?
        //   position:돌을 둔 위치 : Number,
        // }
        console.log(Number(event.target.name))
        axios.post('/api/users/didTurn', { _id: this.state.roomInfo._id, isAdmin: (this.state.isAdmin === true ? 1 : 2), position: Number(event.target.name) }).then(res => {
            console.log(res.data);
        })
    }
    render() {
     //   console.log(this.state)
        var OX = [];
        for (var i = 0; i < 9; i++){OX.push(0)}
        
        if (this.state.roomInfo.gameHistory != null) {

       //   console.log(this.state.roomInfo.whoFirst)
            for (var i = 0; i < Object.keys(this.state.roomInfo.gameHistory).length; i++) {
                if (i % 2 === 0) {
                    OX[Number(Object.values(this.state.roomInfo.gameHistory)[i])] = this.state.roomInfo.whoFirst;
                }
                else {
                    OX[Number(Object.values(this.state.roomInfo.gameHistory)[i])] = 3 - this.state.roomInfo.whoFirst;
                }
            }
        }

        const test = () => {
            if (this.state.isAdmin === true && this.state.otherID === "") {
                return (<div>상대를 기다리는 중입니다...</div>);
            }
            //Todo 게임 준비버튼을 눌러주세요, 게임 시작버튼을 눌러주세요.
            else if (this.state.otherID !== "") {
                return (<div>{this.state.myNickname} VS {this.state.otherNickname} </div>);
            }
            else {
                return (<div></div>);
            }
        }
        const renderRemainTime = () => {
            if (this.state.roomInfo.winner !== 0) {
                return (<div>{this.state.roomInfo.winner===3 ? "무승부":(this.state.roomInfo.winner === 1 ? this.state.roomInfo.adminNickname : (this.state.roomInfo.participantNickname+ " 승리!"))}</div>)
            }
            else if (this.state.roomInfo.isStart === true) {

                return (<div><div>{(this.state.roomInfo.whoseTurn === 1 && this.state.isAdmin === true) || (this.state.roomInfo.whoseTurn === 2 && this.state.isAdmin === false) ? "본인" : "상대방"} 의 차례입니다.</div><div>남은 시간 : {parseInt(this.state.remainTime / 1000)} 초</div></div>)
            }
            return (<div></div>)
        }
        // console.log(this.state.roomInfo.isReady);
        return (<div>
            <div><Button onClick={this.exitOnClickHanlder}>게임 나가기</Button><Button onClick={this.gameStartOnClickHandler}>{this.state.isAdmin ? "게임 시작하기" : (this.state.roomInfo.isReady===true?"게임 준비 취소하기":"게임 준비하기")}</Button></div>
            <div>방 제목 : {this.state.roomTitle}</div>
            <div>방장 : {this.state.isAdmin ? this.state.myNickname : this.state.otherNickname} ( 준비완료 )</div>
            <div>참가자 : {this.state.isAdmin ? this.state.otherNickname : this.state.myNickname} {this.state.roomInfo.isReady===true? "( 준비 완료 )" : "( 대기중 )"}</div>
            {test()}
            {renderRemainTime()}

            <div className="game_board">
                <Button className="game_board_cell" onClick={this.cellOnClick} name="0">{OX[0] === 0 ? "" : (OX[0] === 1 ? 'O' : 'X')}</Button>
                <Button className="game_board_cell" onClick={this.cellOnClick} name="1">{OX[1] === 0 ? "" : (OX[1] === 1 ? 'O' : 'X')}</Button>
                <Button className="game_board_cell" onClick={this.cellOnClick} name="2">{OX[2] === 0 ? "" : (OX[2] === 1 ? 'O' : 'X')}</Button>
                <Button className="game_board_cell" onClick={this.cellOnClick} name="3">{OX[3] === 0 ? "" : (OX[3] === 1 ? 'O' : 'X')}</Button>
                <Button className="game_board_cell" onClick={this.cellOnClick} name="4">{OX[4] === 0 ? "" : (OX[4] === 1 ? 'O' : 'X')}</Button>
                <Button className="game_board_cell" onClick={this.cellOnClick} name="5">{OX[5] === 0 ? "" : (OX[5] === 1 ? 'O' : 'X')}</Button>
                <Button className="game_board_cell" onClick={this.cellOnClick} name="6">{OX[6] === 0 ? "" : (OX[6] === 1 ? 'O' : 'X')}</Button>
                <Button className="game_board_cell" onClick={this.cellOnClick} name="7">{OX[7] === 0 ? "" : (OX[7] === 1 ? 'O' : 'X')}</Button>
                <Button className="game_board_cell" onClick={this.cellOnClick} name="8">{OX[8] === 0 ? "" : (OX[8] === 1 ? 'O' : 'X')}</Button>
            </div>
        </div>);
    }
}
export default GamePlayPage;