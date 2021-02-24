import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
class RegisterPage extends React.Component{

  constructor(props){
    super(props)
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
    render(){
        return(<div>
            
            <div >
            <div className="navigationBar">SPARCS Newbie Project</div>
            <Button className="navigationBar" onClick={this.loginOnClickHanlder}>Login</Button>
            <Button className="navigationBar">Register</Button>
            </div>

            <form className="form">
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
            //  onChange={onEmailHandler}
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
            //  onChange={onPasswordHandler}
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
            //  onChange={onPasswordHandler}
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
            //  onChange={onEmailHandler}
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