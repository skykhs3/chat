import React from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './HomePage.css';
import socket from '../../utills/socket'
class HomePage extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            roomList:[],
            userInfo:{},
        }
        
      //  axios.get('/api/axiostest').then(res=>console.log(res.data));
    }
    aa=()=>{
        axios.get('/api/users/auth').then(res=>{
            //  console.log(res.data)
              this.setState({userInfo:res.data});
              if(res.data.isAuth===false){
                  this.props.history.push('/login')
              }
              else{
  
              }
          })
        axios.get('/api/rooms/loadList').then(res=>{
            this.setState({roomList:res.data.docs})
        })
    }
    componentDidMount(){

        //TODO 에러처리
        this.aa();
        socket.on('/sToC/rooms/needToRefresh', () => {
            ///본인 방에 해당하는 것만 refresh 해야함. 방번호 인자 넘기자.
            this.aa(0);
        })
    }
    logoutOnClickHanlder=(e)=>{
        axios.get('/api/users/logout').then(res=>{
            if (res.data.success) {
                this.props.history.push("/login")
              }
              else {
                alert("로그아웃 실패")
              }
        })
    }
    createRoomOnClickHandler=(event)=>{
        axios.post('/api/users/changeOnlineState',{_id:this.state.userInfo._id,onlineState:2,joinedRoomID:""}).then(res=>{
            if(res.data.success===true){
                this.props.history.push("/roomcreate")
            }
        })
    }
    roomCellOnClickHandler=(roomInfo)=>(event)=>{
        //참가할 수 있는지 확인하기

       // isDeleted:false,
       // participantID가 ""
       console.log(this.state.userInfo)
       //Todo user의 참가한 방이 빈칸일 때만 방에 참가가 가능하게 하기.
       axios.post('/api/rooms/joinRoom', {
        _id:roomInfo._id,
        userInfo:this.state.userInfo,
      }).then(res=>{
        console.log(res.data)
          if(res.data.success===true){
              axios.post('/api/users/changeOnlineState',{
                  _id:this.state.userInfo._id,
                  onlineState:3,
                  joinedRoomID:roomInfo._id,
              }).then(res=>{
                  if(res.data.success===true){
                    this.props.history.push("/gameplay")
                    
                  }
              })
          }
          else{

          }
      })
    }
    render(){
        return(<div>
            <div >
            <div className="navigationBar">SPARCS Newbie Project</div>
            <Button className="navigationBar" onClick={this.logoutOnClickHanlder}>Log out</Button>
            </div>
            
            <span>닉네임 : {this.state.userInfo.nickname }&nbsp;</span>
            <Button onClick={this.createRoomOnClickHandler}>
                새로운 방 만들기
            </Button>

        {this.state.roomList.map(item=>(item.isDeleted===false && item.isStart===false && <div className="roomCell"><Button key={item.id} onClick={this.roomCellOnClickHandler(item)} className="roomCell">{item.roomTitle}&nbsp;<span> ( 1 / 2 )</span></Button></div>))}
            </div>);
    }

}
export default HomePage;