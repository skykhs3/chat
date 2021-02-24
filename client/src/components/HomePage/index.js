import React from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios';
class HomePage extends React.Component{

    renderRoomList=()=>{

    }
    constructor(props){
        super(props);
        console.log("TEST");
        axios.get('/axiostest').then(res=>console.log(res.data));
    }
    render(){
        return(<div>
            <div >
            <div className="navigationBar">SPARCS Newbie Project</div>
            <Button className="navigationBar">Log out</Button>
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