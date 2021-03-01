import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './GamePlayPage.css'
import axios from 'axios';
import socket from '../../utills/socket'

class GamePlayPage extends React.Component {
    constructor(props) {
        super(props)
        this.alreadyAlert = false;
        this.state = {
            test: 1,
            isAdmin: true,
            myNickname: "",
            myID: "",
            roomTitle: "",
            otherNickname: "",
            remainTime: 0,
            otherID: "",
            userInfo: {},
            roomInfo: {},
            cellState: ["", "", "", "", "", "", "", "", ""]
        }
    }
    aa = (type) => {
        axios.get('/api/users/auth').then(resUser => {

            this.setState({ userInfo: resUser.data });
            if (resUser.data.isAuth === false) {
                this.props.history.push('/login')
            }
            else {
                axios.post('/api/rooms/auth', { _id: resUser.data.joinedRoomID }).then(resRoom => {
                    this.setState({ roomTitle: resRoom.data.roomTitle })
                    if (resRoom.data.isAuth === false) {
                        this.props.history.push('/')
                    }
                    else {
                        this.setState({ roomInfo: resRoom.data, test: 2 }, () => {

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
    componentDidUpdate() {
        if (this.state.roomInfo.winner !== 0 && this.state.roomInfo.winner != null) {
            if (this.alreadyAlert == false) {

                this.alreadyAlert = true;
                alert("게임 종료 : " + (this.state.roomInfo.winner === 3 ? "무승부" : ((this.state.roomInfo.winner === 1 ? this.state.roomInfo.adminNickname : this.state.roomInfo.participantNickname) + " 의 승리")))
            }
        }
    }

    exitOnClickHanlder = (event) => {
        // {
        //   adminID:
        //    participantID:
        //   roomID:
        //    isAdmin:
        // }
        axios.post('/api/rooms/exitGameRoom', { adminID: this.state.roomInfo.adminID, participantID: this.state.roomInfo.participantID, roomID: this.state.roomInfo._id, isAdmin: this.state.isAdmin }).then(res => {
            if (res.data.success === true) {
                this.props.history.push('/')
            }
        })

    }
    gameStartOnClickHandler = (event) => {
        if (this.state.isAdmin === true) {
            axios.post('/api/rooms/startgame', { _id: this.state.roomInfo._id }).then(res => {

            })
        }
        else {

            if (this.state.roomInfo.isReady === true) {

                axios.post('/api/rooms/readygame', { _id: this.state.roomInfo._id, isReady: true }).then(res => { console.log(res) })
            }
            else {

                axios.post('/api/rooms/readygame', { _id: this.state.roomInfo._id, isReady: false }).then(res => { console.log(res) })
            }
        }
    }
    cellOnClickHanlder = (num) => (event) => {
        // {
        //   _id :  룸번호
        //   isAdmin:  어드민인가?
        //   position:돌을 둔 위치 : Number,
        // }

        axios.post('/api/users/didTurn', { _id: this.state.roomInfo._id, isAdmin: (this.state.isAdmin === true ? 1 : 2), position: num }).then(res => {

        })
    }
    cellOnMouseEnterHadler = (num) => (event) => {
        const { cellState } = this.state
        cellState[num] = this.state.isAdmin ? "O" : "X"
        this.setState({ cellState: cellState })
    }
    cellOnMouseLeaveHandler = (num) => () => {
        const { cellState } = this.state
        cellState[num] = ""
        this.setState({ cellState: cellState })
    }
    render() {
        var OX = [];
        for (var i = 0; i < 9; i++) { OX.push(0) }

        if (this.state.roomInfo.gameHistory != null) {

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
            else if (this.state.otherID !== "") {
                return (<div>{this.state.myNickname} (나) VS {this.state.otherNickname} (상대) </div>);
            }
            else {
                return (<div></div>);
            }
        }
        const renderRemainTime = () => {
            if (this.state.roomInfo.winner !== 0) {
                return (<div>{this.state.roomInfo.winner === 3 ? "무승부" : ((this.state.roomInfo.winner === 1 ? this.state.roomInfo.adminNickname : this.state.roomInfo.participantNickname) + " 승리!")}</div>)
            }
            else if (this.state.roomInfo.isStart === true) {

                return (<div><div>{(this.state.roomInfo.whoseTurn === 1 && this.state.isAdmin === true) || (this.state.roomInfo.whoseTurn === 2 && this.state.isAdmin === false) ? "본인" : "상대방"} 의 차례입니다.</div><div>남은 시간 : {parseInt(this.state.remainTime / 1000)} 초</div></div>)
            }
            return (<div></div>)
        }
        const renderTableCell=()=>{
            var tempList=[];
            for(var i=0;i<9;i++){
                if(this.state.roomInfo.ansHistory!=null){
                console.log(Object.values(this.state.roomInfo.ansHistory))
                }
                tempList.push(
                <Button  color={(this.state.roomInfo.ansHistory!=null && Object.keys(this.state.roomInfo.ansHistory).length==3 && (Object.values(this.state.roomInfo.ansHistory)[0]===i || Object.values(this.state.roomInfo.ansHistory)[1]===i||Object.values(this.state.roomInfo.ansHistory)[2]===i))?'secondary':'default'} onClick={this.cellOnClickHanlder(i)} onMouseEnter={this.cellOnMouseEnterHadler(i)} onMouseLeave={this.cellOnMouseLeaveHandler(i)} name="0">
                    
                    <div className="ansCell">
                    {OX[i] === 0 ? this.state.cellState[i] : (OX[i] === 1 ? 'O' : 'X')}
                    </div>
                    </Button>
                
                )
            }
            return tempList;
        }

        var alertMsg = "게임 로딩중입니다. 잠시 기다려주세요";
        if (this.state.roomTitle == "") {

        }
        else if (this.state.roomInfo.isStart === false) {
            alertMsg = "참가자가 준비 완료해야 방장이 게임 시작할 수 있습니다."
        }
        else if (this.state.roomInfo.winner === 0) {
            if ((this.state.roomInfo.whoseTurn === 1 && this.state.isAdmin === true) || (this.state.roomInfo.whoseTurn === 2 && this.state.isAdmin === false)) {
                alertMsg = "본인 차례입니다."
            }
            else {
                alertMsg = "상대방 차례입니다."
            }
        }
        else {
            if (this.state.roomInfo.winner === 3) {
                alertMsg = "무승부!"
            }
            else {
                alertMsg = (this.state.roomInfo.winner === 1 ? this.state.roomInfo.adminNickname : this.state.roomInfo.participantNickname) + " 승리!"
            }
        }

        return (<div>
            <div >
                <div className="navigationBar">SPARCS Newbie Project</div>

            </div>
            <div className="main">
                <div className="leftBigBox">
                    <div>닉네임 : {this.state.myNickname}&nbsp;</div>
                    <div><Button onClick={this.exitOnClickHanlder}>방 나가기</Button></div>
                    <div>  <Button onClick={this.gameStartOnClickHandler}>{this.state.isAdmin ? "게임 시작하기" : (this.state.roomInfo.isReady === true ? "준비 취소하기" : "준비 완료하기")}</Button></div>
                    <div>남은 시간 : {parseInt(this.state.remainTime / 1000)} 초</div>
                </div>
                <div className="rightBigBox">
                    <div>방 제목 : {this.state.roomTitle}</div>
                    <div className="alertMsg">{alertMsg}</div>
                    <div className="portrait">

                        <div className={this.state.roomInfo.whoseTurn===1 && this.state.roomInfo.isStart===true?"te":""}>
                            <div>{this.state.isAdmin ? this.state.myNickname : this.state.otherNickname}</div><div> (방장)</div>
                        </div>
                        <div className="VS">VS</div>
                        <div className={this.state.roomInfo.whoseTurn===2 && this.state.roomInfo.isStart===true?"te":""}>
                            <div>{(this.state.isAdmin ? this.state.otherNickname : this.state.myNickname) === "" ? "참가자 기다리는 중" : (this.state.isAdmin ? this.state.otherNickname : this.state.myNickname)}</div><div> {this.state.roomInfo.isReady === true ? "( 준비 완료 )" : "( 준비 중 )"}</div>
                        </div>

                    </div>
                    <div className="game_board">
                        {renderTableCell()}
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default GamePlayPage;