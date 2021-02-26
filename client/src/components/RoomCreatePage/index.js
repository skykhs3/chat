import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
class RoomCreatePage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      roomTitle:"",
      adminID:"",
      adminEmail:"",
      adminNickname:"",
    }
    // axios.post('/api/users/findByID',{
    //   _id:"60375c991c30fa0ed78145b2"
    // }).then(res=>console.log(JSON.stringify(res.data)));
    axios.get('/api/users/auth').then(res=>{
     // console.log(res.data);
      if(res.data.isAuth===false){
          this.props.history.push('/login')
      }
      else{
        this.state.adminID=res.data._id;
        this.state.adminNickname=res.data.nickname;
      }
  })
  }
  onSubmitHandler=(event)=>{
    event.preventDefault();
    // console.log()
    axios.post('/api/users/createRoom', {
      roomTitle:this.state.roomTitle,
      adminID:this.state.adminID,
      adminNickname:this.state.adminNickname,
    }).then(res=>{
      console.log(res.data)
      if(res.data.success===false){

      }
      else{
        this.props.history.push('/gameplay')
      }
    })
  }
  roomTitleOnChange=(event)=>{
    this.setState({ roomTitle: event.currentTarget.value });
  }
  exitOnClickHandler=(event)=>{
    this.props.history.push('/')
  }
    render(){
         return (<div>

<Button onClick={this.exitOnClickHandler}>나가기</Button>
            <form className="form" onSubmit={this.onSubmitHandler}>
            <TextField 
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="방 이름"
            inputProps={{
                maxLength: 50,
              }}
            onChange={this.roomTitleOnChange}
            >
                
            </TextField>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
            >만들기</Button>
            </form>
            
            
            </div>);
    }

}
export default RoomCreatePage;