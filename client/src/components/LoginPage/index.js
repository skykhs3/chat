import React from 'react'
import './LoginPage.css'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
class LoginPage extends React.Component{
    render(){
        return(<div>
            
            <div >
            <div className="navigationBar">SPARCS Newbie Project</div>
            <div className="navigationBar">Login</div>
            <div className="navigationBar">Register</div>
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