import React from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './HomePage.css';
class HomePage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            roomList:[],
        }
        axios.get('/api/users/auth').then(res=>{
          //  console.log(res.data)
            if(res.data.isAuth===false){
                this.props.history.push('/login')
            }
            else{

            }
        })
        console.log("TEST");
      //  axios.get('/api/axiostest').then(res=>console.log(res.data));
    }
    componentDidMount(){
        axios.get('/api/rooms/loadlist').then(res=>{
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
        this.props.history.push("/roomcreate")
    }
    render(){
        return(<div>
            <div >
            <div className="navigationBar">SPARCS Newbie Project</div>
            <Button className="navigationBar" onClick={this.logoutOnClickHanlder}>Log out</Button>
            </div>
            
            
            <Button onClick={this.createRoomOnClickHandler}>
                새로운 방 만들기
            </Button>

        {this.state.roomList.map(item=>(<div className="roomCell"><Button key={item.id} className="roomCell">{item.roomTitle}&nbsp;<span> ( 1 / 2 )</span></Button></div>))}
            </div>);
    }

}
export default HomePage;