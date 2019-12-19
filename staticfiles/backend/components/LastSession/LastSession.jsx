import React from 'react';

import BidService from '../BidService/BidService.jsx'
import MultiSelect from "../../../../../static/components/MultiSelect";
<<<<<<< HEAD
import SessionService from "../SessionService/SessionService.jsx";
=======
>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b

/**
 * Gets and renders a list of deliveries, calls selectDelivery to inform a parent of a selected delivery
 */
class LastSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
<<<<<<< HEAD
            time_start: 0,
            bids: [],
            active: true
=======
            time_start: '',
            active: false,
            bid_data: [],
>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b
        };
    }

    updateList(data) {
<<<<<<< HEAD
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

=======
        BidService.getLastSession().then(d => {
            this.setState({
                bid_data: d.bid_set,
                time_start: d.time_start,
                active: d.active,
            });
        })
    }

>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b
    componentDidMount() {
        this.updateList(this.state)
    }


    render() {
<<<<<<< HEAD
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
=======
        if (!this.state.bid_data) return <div style={{display: 'inline-block'}}>N/A</div>;
        let bid = null;

        return (
            <div>
                <div>
                    Session: {this.state.active.toString()}
                </div>
                <div>
                    Time Start: {this.state.time_start}
                </div>

                <MultiSelect object_list={this.state.bid_data.map(obj => {
                                 var rObj = {};
                                 rObj = obj;
                                 rObj["str"] = obj.id + ": " + obj.time + ": " + obj.quantity + ": " + obj.price + ": "+obj.user;
                                 rObj["sort"] = obj.time;
                                 return rObj;
                             })} handleSelect={this.props.handleSelect}/>
>>>>>>> 7a2535c3906c1f88c49d4c7e2c787a492efa856b
            </div>
        )
    }
}

export default LastSession

