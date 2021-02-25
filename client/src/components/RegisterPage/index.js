import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
class RegisterPage extends React.Component{

  constructor(props){
    super(props);
    
    this.state={
      email:"",
      password:"",
      password_confirmed:"",
      nickname:"",
      emailHelperText:"",
      passwordHelperText:"",
      password_confirmedHelperText:"",
      nicknameHelperText:"",

    }
    axios.get('/api/users/auth').then(res=>{
      console.log(res.data)
      if(res.data.isAuth!==false){
          this.props.history.push('/')
      }
      else{

      }
  })
  }
    loginOnClickHanlder=(e)=>{
      this.props.history.push('/login')
    }
    emailOnChangeHandler=(event)=>{
      this.setState({ email: event.currentTarget.value });
    }
    passwordOnChangeHandler=(event)=>{
      this.setState({password:event.currentTarget.value});
    }
    password_confirmedOnChangedHandler=(event)=>{
      this.setState({password_confirmed:event.currentTarget.value});
    }
    nicknameOnChangeHandler=(event)=>{
      this.setState({nickname:event.currentTarget.value});
    }
    onSubmitHandler = (event) => {
      event.preventDefault();
      console.log(this.state.email);
      console.log(this.state.nickname);
      if(this.state.password.length<=5){
        this.setState({
          passwordHelperText:"비밀번호는 6자리이상으로 설정해주세요"
        })
      }
      else{
        this.setState({
          passwordHelperText:""
        })
      }
      if(this.state.password_confirmed!==this.state.password){
        this.setState({
          password_confirmedHelperText:"비밀번호가 일치하지 않습니다"
        })
      }
      else{
        this.setState({
          password_confirmedHelperText:""
        })
      }
      if(this.state.nickname.length<=2){
        this.setState({
          nicknameHelperText:"닉네임은 3글자 이상으로 해주세요"
        })
      }
      else{
        this.setState({
          nicknameHelperText:""
        })
      }
      if(this.state.emailHelperText==="" && this.state.passwordHelperText==="" && this.state.password_confirmedHelperText==="" && this.state.nicknameHelperText===""){
      axios.post('/api/users/register', {
        email: this.state.email,
        password: this.state.password,
        nickname:this.state.nickname
      }).then(res=>{
        if(res.data.success===true){
          this.props.history.push('/login')
          alert("성공적으로 회원가입되었습니다")
        }
        else{
          //Todo 회원 가입 실패시 오류 메세지
          alert("알 수 없는 오류가 발생하였습니다")
        }
      })
      }
    }
    render(){
        return(<div>
            
            <div >
            <div className="navigationBar">SPARCS Newbie Project</div>
            <Button className="navigationBar" onClick={this.loginOnClickHanlder}>Login</Button>
            <Button className="navigationBar">Register</Button>
            </div>

            <form className="form" onSubmit={this.onSubmitHandler}>
            <TextField
              type="email"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Email"
              autoComplete="email"
              autoFocus
              onChange={this.emailOnChangeHandler}
              error={this.state.emailHelperText===""?false:true}
              helperText={this.state.emailHelperText}
            />
            <TextField
            type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              autoComplete="current-password"
              onChange={this.passwordOnChangeHandler}
              error={this.state.passwordHelperText===""?false:true}
              helperText={this.state.passwordHelperText}
            />
            <TextField
            type="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password-Confirmed"
              autoComplete="current-password"
             onChange={this.password_confirmedOnChangedHandler}
             error={this.state.password_confirmedHelperText===""?false:true}
             helperText={this.state.password_confirmedHelperText}
            />
            <TextField
            type="text"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Nick name"
              inputProps={{
                maxlength: 20
              }}
              onChange={this.nicknameOnChangeHandler}
              error={this.state.nicknameHelperText===""?false:true}
              helperText={this.state.nicknameHelperText}
            />
             <Button
              type="submit"
              variant="outlined"
              fullWidth
            >Sign In</Button>
</form>

        </div>);
    }

}
export default RegisterPage;