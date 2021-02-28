import React from 'react'
import Button from '@material-ui/core/Button';
import axios from 'axios';
import './HomePage.css';
import socket from '../../utills/socket'
class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roomList: [],
            userInfo: {},
        }

        //  axios.get('/api/axiostest').then(res=>console.log(res.data));
    }
    aa = () => {
        axios.get('/api/users/auth').then(res => {
            //  console.log(res.data)
            this.setState({ userInfo: res.data });
            if (res.data.isAuth === false) {
                this.props.history.push('/login')
            }
            else {

                // if(res.data.onlineState==2){
                //    // home:1
                //    this.props.history.push('/roomcreate')
                // }
                // if(res.data.onlineState==3){
                //     // home:1
                //     this.props.history.push('/gameplay')
                //  }
            }
        })
        axios.get('/api/rooms/loadList').then(res => {
            this.setState({ roomList: res.data.docs })
        })
    }
    componentDidMount() {

        //TODO 에러처리
        this.aa();
        socket.on('/sToC/rooms/needToRefresh', () => {
            ///본인 방에 해당하는 것만 refresh 해야함. 방번호 인자 넘기자.
            this.aa(0);
        })
    }
    logoutOnClickHanlder = (e) => {
        axios.get('/api/users/logout').then(res => {
            if (res.data.success) {
                this.props.history.push("/login")
            }
            else {
                alert("로그아웃 실패")
            }
        })
    }
    createRoomOnClickHandler = (event) => {
        axios.post('/api/users/changeOnlineState', { _id: this.state.userInfo._id, onlineState: 2, joinedRoomID: "" }).then(res => {
            if (res.data.success === true) {
                this.props.history.push("/roomcreate")
            }
        })
    }
    roomCellOnClickHandler = (roomInfo) => (event) => {
        //참가할 수 있는지 확인하기

        // isDeleted:false,
        // participantID가 ""

        if (!roomInfo) return;
        axios.post('/api/rooms/joinRoom', {
            roomID: roomInfo._id,
            userID: this.state.userInfo._id,
        }).then(res => {
            if (res.data.success === true) {
                this.props.history.push("/gameplay")
            }
        })
    }
    render() {
        return (<div className="T">
            <div >
                <div className="navigationBar">SPARCS Newbie Project</div>

            </div>
            <div className="main">
                <div className="leftBigBox">
                    <div>닉네임 : {this.state.userInfo.nickname}&nbsp;</div>
                    <div><Button className="leftBtn" onClick={this.logoutOnClickHanlder}>
                        로그아웃
            </Button></div>
                  <div>  <Button onClick={this.createRoomOnClickHandler}>
                        방 만들기
            </Button></div>
                </div>
                <div className="rightBigBox">
                    방 목록
{this.state.roomList.map(item => (item.isDeleted === false && item.isStart === false && <div className="roomCell"><Button key={item.id} onClick={this.roomCellOnClickHandler(item)} className="roomCell">{item.roomTitle}&nbsp;<span> ( {item.participantID === "" ? 1 : 2} / 2 )</span></Button></div>))}
                </div>
            </div>





        </div>);
    }

}
export default HomePage;