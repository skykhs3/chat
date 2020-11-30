import React from 'react'
import Button from '@material-ui/core/Button';
class HomePage extends React.Component{

    renderRoomList=()=>{

    }
    render(){
        return(<div>
            <div >
            <div className="navigationBar">SPARCS Newbie Project</div>
            <div className="navigationBar">Log out</div>
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