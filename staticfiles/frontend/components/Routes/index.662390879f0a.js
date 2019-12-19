import React from 'react'
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import './style.scss'
import languages from "../../../../../accounts/static/accounts/components/AccountService/lang";
import Header from "../Header";
import Footer from "../Footer";
import Home from '../Home'
import Trade2 from "../Trade2";
let lang = languages[document.documentElement.lang];

const app_url_prefix = '';

export default class Routes extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <Router>
                <Header/>
                <div style={{height:'50px'}}></div>
                <Switch {...this.props}>
                    <Route path={"/home"} render={(routeProps) => (
                        <Home {...routeProps} />
                    )}/>
                    <Route path={"/trade2"} render={(routeProps) => (
                        <Trade2 {...routeProps} />
                    )}/>
                    <Route path="*" render={() => {
                        window.location='/home'
                    }}/>
                </Switch>
                <Footer/>
            </Router>
        )
    }
}
