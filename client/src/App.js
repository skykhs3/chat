import React from 'react'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import RoomCreatePage from './components/RoomCreatePage'
import HomePage from './components/HomePage'
import GamePlayPage from './components/GamePlayPage'
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
                <Route exact path="/roomcreate" component={RoomCreatePage}/>
                <Route exact path="/gameplay" component={GamePlayPage}/>
                </Switch>
            </div>
            </Router>
        );
    }
}
export default App;