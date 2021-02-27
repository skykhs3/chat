import axios from 'axios';
import React from 'react'
import socket from '../../utills/socket'
class ExaminingPage extends React.Component {
    onClickHandler=()=>{
        axios.get("/api/axiostest").then((res)=>{
            console.log(res.data);
        })
        console.log("TEst");
    //    socket.emit('test',{err:"GG"});
    }
    componentDidMount() {
        socket.on('/cToS/rooms/endTime',(item)=>{
            console.log(item);
        })
    }
    render() {
        return (<div>테스트 페이지입니다.<button onClick={this.onClickHandler}>버튼</button></div>);
    }
}
export default ExaminingPage;