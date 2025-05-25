import React, {Component, useState, useEffect} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';

import Header from './Header'
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';


class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            darkMode: localStorage.getItem('darkMode') === 'true'
        };
    }

    componentDidMount(){
        this.props.fetchUser();
        this.applyDarkMode();
    }

    toggleDarkMode = () => {
        this.setState(
            prevState => ({ darkMode: !prevState.darkMode }),
            () => {
                localStorage.setItem('darkMode', this.state.darkMode);
                this.applyDarkMode();
            }
        );
    };

    applyDarkMode = () => {
        if (this.state.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    render(){
        return (
            <BrowserRouter>
                <div className='container'>
                    <Header toggleDarkMode={this.toggleDarkMode} />
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/surveys" component={Dashboard} />
                    <Route path="/surveys/new" component={SurveyNew} />
                </div>
            </BrowserRouter>
        );
    }
    
};

export default connect(null, actions)(App);