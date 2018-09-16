import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import DialyStats from "./Components/DialyStats/DialyStats";
import admin from './Firebase';

let db;

class App extends Component {
    componentDidMount() {
        db = admin.firestore()
    }

    render() {
        return (
            <Switch>
                <Route exact path="/stats/:userId/:date" render={(props) => (
                    <DialyStats {...props}/>
                )}/>
            </Switch>
        );
    }
}

export default App;
