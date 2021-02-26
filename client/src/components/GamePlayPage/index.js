import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './GamePlayPage.css'
import axios from 'axios';
class GamePlayPage extends React.Component {
    constructor(props){
        super(props)
        this.state={isGameDone:false,
            isGameStart:false,
            isAdmin:true,
            myNickname:"",
            myID:"",
            roomTitle:"",
            otherNickname:"",
            otherID:"12",
            userInfo:{},
            roomInfo:{},
        }
    }
    componentDidMount(){
        axios.get('/api/users/auth').then(resUser=>{
              console.log(resUser.data)
              this.setState({userInfo:resUser.data});
              if(resUser.data.isAuth===false){
                  this.props.history.push('/login')
              }
              else{
                  axios.post('/api/rooms/auth',{_id:resUser.data.joinedRoomID}).then(resRoom=>{
                      console.log(resRoom.data)
                      this.setState({roomTitle:resRoom.data.roomTitle})
                      if(resRoom.data.isAuth===false){
                          this.props.history.push('/')
                      }
                      else{
                          this.setState({roomInfo:resRoom.data})
                          this.setState({myID:resUser.data._id,
                            myNickname:resUser.data.nickname,})
                            if(resRoom.data.adminID===resUser.data._id){
                                this.setState({isAdmin:true,
                                    otherID:resRoom.data.participantID,
                                    otherNickname:resRoom.data.participantNickname
                                })
                            }
                            else{
                                this.setState({isAdmin:false,
                                otherID:resRoom.data.adminID,
                                otherNickname:resRoom.data.adminNickname
                                })
                            }
                      }
                  })
              }
          })
    }
    test=()=>{
        if(this.state.isAdmin===true && this.state.otherID===""){
            return (<div>상대를 기다리는 중입니다...</div>);
        }
        else if(this.state.otherID!==""){
            return (<div>{this.state.myNickname} VS {this.state.otherNickname} </div>);
        }
        else{
            return (<div></div>);
        }
    }
    exitOnClickHanlder=(event)=>{
        axios.post('/api/users/changeOnlineState',{_id:this.state.userInfo._id,onlineState:1}).then(res=>{
            if(res.data.success===true){
                this.props.history.push("/")
            }
        })
    }
    render() {
        console.log(this.state)
        return (<div>
            
            <div><Button onClick={this.exitOnClickHanlder}>게임 나가기</Button></div>
            <div>방 제목 : {this.state.roomTitle}</div>
            <div>방장 : {this.state.isAdmin?this.state.myNickname:this.state.otherNickname}</div>
            <div>참가자 : {this.state.isAdmin?this.state.otherNickname:this.state.myNickname}</div>
            {this.test()}
            
            <div className="game_board">
            <Button className="game_board_cell"></Button>
            <Button className="game_board_cell"></Button>
            <Button className="game_board_cell"></Button>
            <Button className="game_board_cell"></Button>
            <Button className="game_board_cell"></Button>
            <Button className="game_board_cell"></Button>
            <Button className="game_board_cell"></Button>
            <Button className="game_board_cell"></Button>
            <Button className="game_board_cell"></Button>
            </div>
            </div>);
    }
}
export default GamePlayPage;