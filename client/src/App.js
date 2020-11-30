import React from 'react'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import RoomPage from './components/RoomPage'
import HomePage from './components/HomePage'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class App extends React.Component{
    render(){
        return (
        <Router>
            <div>
                <Switch>
                <Route exact path="/login" component={LoginPage}/>
                <Route exact path="/register" component={RegisterPage}/>
                <Route exact path="/" component={HomePage}/>
                <Route exact path="/room" component={RoomPage}/>
                </Switch>
            </div>
            </Router>
        );
    }
}
export default App;