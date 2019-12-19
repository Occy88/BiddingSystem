import React from 'react'
import languages from "./lang.js";
import jQuery from 'jquery'
import './main.css';

import './popper.min.js'
import BidList from "../../../../../backend/static/backend/components/BidList/BidList.jsx";
import LastSession from "../../../../../backend/static/backend/components/LastSession/LastSession.jsx";
// import './jquery.ui.datepicker-ru.js'

let lang = languages[document.documentElement.lang];
/**
 * This module only takes care of registering a delivery and products for it in one go.
 * Once all fields are filled, first for is submitted to create a delivery, if successful
 * a second form is submitted to register all products. finally user is alerted of success or failure.
 */
export default class Trade2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            example_state: props.example_state,
        }
    }

    componentWillReceiveProps(props) {

    }

    render() {
        return (
            <div>
                Last Session:
                <LastSession/>
            </div>
        )
    }
}

