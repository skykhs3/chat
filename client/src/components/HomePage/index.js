import React from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './HomePage.css';
class HomePage extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            roomList:[],
            userInfo:{},
        }
        
      //  axios.get('/api/axiostest').then(res=>console.log(res.data));
    }
    componentDidMount(){

        //TODO 에러처리
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
       axios.post('/api/rooms/joinRoom', {
        _id:roomInfo._id,
        userInfo:this.state.userInfo,
      }).then(res=>{
        console.log(res.data)
          if(res.data.success===true){
              console.log("canjoion")
//Todo this.state.userInfo._id 같은 항목들이 null이거나 초기화 상태면 누르지 못하도록 막기.

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

        {this.state.roomList.map(item=>(<div className="roomCell"><Button key={item.id} onClick={this.roomCellOnClickHandler(item)} className="roomCell">{item.roomTitle}&nbsp;<span> ( 1 / 2 )</span></Button></div>))}
            </div>);
    }

}
export default HomePage;