import React from 'react'
import './LoginPage.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailHelperText: "",
      passwordHelperText: "",
    }
    axios.get('/api/users/auth').then(res => {
      console.log(res.data)
      if (res.data.isAuth !== false) {
        this.props.history.push('/')
      }
      else {

      }
    })
    console.log("TEST");
  }
  onEmailHandler = (event) => {
    this.setState({ email: event.currentTarget.value });
  }
  onPasswordHandler = (event) => {
    this.setState({ password: event.currentTarget.value });
  }
  onSubmitHandler = (event) => {
    event.preventDefault();
    this.setState({
      emailHelperText: "",
      passwordHelperText: "",
    })
    console.log(this.state.email)
    console.log(this.state.password)
    axios.post('/api/users/login', {
      email: this.state.email,
      password: this.state.password
    }).then(res => {
      console.log(res.data)
      if (res.data.loginSuccess === true) {
        this.setState({
          emailHelperText: "로그인 성공. 잠시 기다려주세요",
          passwordHelperText: "",
        })
        this.props.history.push('/')
      }
      else {
        if (res.data.message === "noUser") {
          this.setState({
            emailHelperText: "해당 이메일에 해당하는 유저가 존재하지 않습니다.",
            passwordHelperText: "",
          })
        }
        else if (res.data.message === "wrongPassword") {
          this.setState({
            emailHelperText: "",
            passwordHelperText: "잘못된 비밀번호입니다.",
          })
        }
        else {
          this.setState({
            emailHelperText: "알 수 없는 오류가 발생했습니다",
            passwordHelperText: "",
          })
        }
      }

    })
  }
  registerOnClickHandler=(e)=>{
    this.props.history.push('/register')
  }
  render() {
    return (<div>

      <div >
        <div className="navigationBar">SPARCS Newbie Project</div>
        <Button className="navigationBar">Login</Button>
        <Button className="navigationBar" onClick={this.registerOnClickHandler}>Register</Button>
      </div>

      <form className="form" onSubmit={this.onSubmitHandler}>
        <TextField
          type="email"
          helperText={this.state.emailHelperText}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          label="Email"
          autoComplete="email"
          autoFocus
          onChange={this.onEmailHandler}
        />
        <TextField
          type="password"
          variant="outlined"
          margin="normal"
          helperText={this.state.passwordHelperText}
          required
          fullWidth
          name="password"
          label="Password"
          autoComplete="current-password"
          onChange={this.onPasswordHandler}
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
export default LoginPage;