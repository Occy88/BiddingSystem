import React from 'react';

import BidService from '../BidService/BidService.jsx'
import MultiSelect from "../../../../../static/components/MultiSelect";

/**
 * Gets and renders a list of deliveries, calls selectDelivery to inform a parent of a selected delivery
 */
class LastSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time_start: '',
            active: false,
            bid_data: [],
        };
    }

    updateList(data) {
        BidService.getLastSession().then(d => {
            this.setState({
                bid_data: d.bid_set,
                time_start: d.time_start,
                active: d.active,
            });
        })
    }

    componentDidMount() {
        this.updateList(this.state)
    }


    render() {
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
            </div>
        )
    }
}

export default LastSession

