import React from 'react';

import BidService from '../BidService/BidService.jsx'
import MultiSelect from "../../../../../static/components/MultiSelect";

/**
 * Gets and renders a list of deliveries, calls selectDelivery to inform a parent of a selected delivery
 */
class BidList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bid_data: [],
            active: true
        };
    }

    updateList(data) {
        BidService.getBids({
            active: this.state.active ? 'True' : 'False'
        }).then(d => {
            this.setState({
                bid_data: d.reverse()
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
            <MultiSelect select_object={bid}
                         object_list={this.state.bid_data.map(obj => {
                             var rObj = {};
                             rObj = obj;
                             rObj["str"] = obj.id + ": " + obj.time + ": " + obj.quantity + ": " + obj.price;
                             rObj["sort"] = obj.time;
                             return rObj;
                         })} handleSelect={this.props.handleSelect}/>
        )
    }
}

export default BidList

