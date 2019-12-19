import React from 'react';

import ListSelect from '../../../../../static/components/ListSelect/ListSelect.jsx'
import DeliveryService from '../DeliveryService/DeliveryService.jsx'

/**
 * Gets and renders a list of deliveries, calls selectDelivery to inform a parent of a selected delivery
 */
class DeliveryList extends React.Component {

    constructor(props) {
        super(props);
        let is_active = props.is_active === false ? false : true;

        this.state = {
            with_relations: props.with_relations,
            request_failed: false,
            delivery_for: props.delivery_for,
            //bellow is just in case null is passed
            is_active: is_active,
        };
    }

    updateList(data) {
        if (data.delivery_for) {
            let date = new Date();
            if (data.with_relations) {
                DeliveryService.getDeliveriesWithItems({
                    end_date: Math.round(date.getTime() / 1000),
                    start_date: Math.round(date.getTime() / 1000) - 24 * 60 * 60 * 2,
                    is_active: data.is_active === false ? 'False' : 'True'
                }, data.delivery_for.id).then(d => {
                    this.setState({
                        delivery_data: DeliveryList.formatDeliveryData(d.reverse())
                    });
                })
            } else {
                DeliveryService.getDeliveries({
                    end_date: Math.round(date.getTime() / 1000),
                    start_date: Math.round(date.getTime() / 1000) - 24 * 60 * 60 * 2,
                    is_active: data.is_active === false ? 'False' : 'True'

                }, data.delivery_for.id).then(d => {
                    this.setState({
                        delivery_data: DeliveryList.formatDeliveryData(d.reverse())
                    });
                })
            }

        }
    }

    componentDidMount() {
        this.updateList(this.state)
    }

    /**
     * Calculates the weight for each delivery from products adds it the dictionary and returns it.
     */
    static formatDeliveryData(delivery_data) {
        for (let i = 0; i < delivery_data.length; i++) {
            delivery_data[i]["delivery_date"] = new Date(delivery_data[i]["delivery_date"]);
        }
        return delivery_data
    }

    componentWillReceiveProps(props) {
        //    check the props, fetch data if needed
        if ('is_active' in props && props.is_active !== this.state.is_active) {
            this.setState(
                {
                    is_active: props.is_active
                }
            );
            this.updateList(props)

        }
        if ('delivery_for' in props) {
            if (props.delivery_for && (!this.state.delivery_for || props.delivery_for.id !== this.state.delivery_for.id)) {
                this.setState(
                    {
                        delivery_for: props.delivery_for
                    }
                );
                this.updateList(props)
            } else if (!props.delivery_for) {
                this.setState({
                    delivery_data: null,
                });
            }
        }

    }

    render() {
        if (!this.state.delivery_data) return <div style={{display: 'inline-block'}}>N/A</div>;
        return (
            <ListSelect filter={this.props.filter} reverse={true} object_list={this.state.delivery_data.map(obj => {
                var rObj = {};
                rObj = obj;
                rObj["str"] = obj.id + " : " + obj.delivery_date.toLocaleDateString() + " " + obj.delivery_date.toTimeString().split('(')[0];
                rObj["sort"] = obj.id.toString();

                return rObj;
            })} handleSelect={this.props.handleSelect}/>
        )
    }
}

export default DeliveryList

