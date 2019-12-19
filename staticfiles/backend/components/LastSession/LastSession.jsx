import React from 'react';

import BidService from '../BidService/BidService.jsx'
import MultiSelect from "../../../../../static/components/MultiSelect";
import SessionService from "../SessionService/SessionService.jsx";

/**
 * Gets and renders a list of deliveries, calls selectDelivery to inform a parent of a selected delivery
 */
class LastSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time_start: 0,
            bids: [],
            active: true
        };
    }

    updateList(data) {
        SessionService.getLatestSession().then(d => {
            console.log("-==========================");
            console.log(d.active);
            this.setState({
                time_start: d.time_start,
                active: d.active,
                bids: d.bid_set,
            });


            console.log(d)
        })
    }

    empty_func(something) {

    }

    componentDidMount() {
        this.updateList(this.state)
    }


    render() {
        if (!this.state.time_start) return <div style={{display: 'inline-block'}}>N/A</div>;
        let bid = null;
        return (
            <div>
                <div>Session start: {this.state.time_start}</div>
                <div>Session active: {this.state.active.toString()}</div>
                <div>Session bids:</div>
                <MultiSelect handle_select={this.empty_func} object_list={this.state.bids.map(obj => {
                    var rObj = {};
                    rObj = obj;
                    rObj["str"] = obj.id + ": " + obj.time + ": " + obj.quantity + ": " + obj.price;
                    rObj["sort"] = obj.time;
                    return rObj;
                })}/>
            </div>
        )
    }
}

export default LastSession

