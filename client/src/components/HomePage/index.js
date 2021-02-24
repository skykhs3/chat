import React from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios';
class HomePage extends React.Component{


    renderRoomList=()=>{

    }
    constructor(props){
        super(props);
        axios.get('/api/users/auth').then(res=>{
            console.log(res.data)
            if(res.data.isAuth===false){
                this.props.history.push('/login')
            }
            else{

            }
        })
        console.log("TEST");
      //  axios.get('/api/axiostest').then(res=>console.log(res.data));
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
    render(){
        return(<div>
            <div >
            <div className="navigationBar">SPARCS Newbie Project</div>
            <Button className="navigationBar" onClick={this.logoutOnClickHanlder}>Log out</Button>
            </div>
            
            
            <Button>
                새로운 방 만들기
            </Button>

            {this.renderRoomList()}

            <div > 김현수</div>
                <div> 같이 밥 먹을 사람 구해요~</div>
            {/* <Button>
                <div > 김현수</div>
                <div> 같이 밥 먹을 사람 구해요~</div>
                <div> 심심해요</div>
            </Button> */}
            
            
            
            </div>);
    }

}
export default HomePage;