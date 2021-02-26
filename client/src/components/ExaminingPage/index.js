import axios from 'axios';
import React from 'react'
class ExaminingPage extends React.Component {
    onClickHandler=()=>{
        axios.get("/api/axiostest",(req,res)=>{
            console.log(res);
        })
    }
    render() {
        return (<div>테스트 페이지입니다.<button onClick={this.onClickHandler}>버튼</button></div>);
    }
}
export default ExaminingPage;