import React from 'react'
import languages from "./lang.js";
import {withRouter} from 'react-router-dom';
import ListSelect from "../../../../../static/components/ListSelect/ListSelect.jsx";
import {Form, Row, Descriptor, InputArea} from "../../../../../static/components/Form/Form.jsx";
import DeliveryDriverList from "../DeliveryDriverList/BidList.jsx";
import DeliveryDriverForm from "../DeliveryDriverForm/DeliveryDriverForm.jsx";

let lang = languages[document.documentElement.lang];

/**
 * This module combines delivery_driver registration and product registration specific to the client,
 * In severe need of refactoring as of now doe to signals being send accross modules, this should be handled in a diferent way.
 */
class ManageDeliveryDriver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delivery_driver: null,
            delivery_driver_for: props.delivery_driver_for,
            mod_states: [
                {id: 1, val: 'CREATE', str: lang.create, sort: 1},
                {id: 2, val: 'MODIFY', str: lang.modify, sort: 2},
                {id: 3, val: 'RESTORE', str: lang.restore, sort: 3},
                {id: 4, val: 'DELETE', str: lang.delete, sort: 4},
            ],
            selected_mod_state: {id: 1, val: 'CREATE', str: lang.create, sort: 1}

        }

    }

    submitForm() {
        switch (this.state.selected_mod_state.val) {
            case 'CREATE':
                this.delivery_driver_form.registerDeliveryDriver();
                break;
            case 'MODIFY':
                this.delivery_driver_form.updateDeliveryDriver();
                break;
            case 'DELETE':
                this.delivery_driver_form.deleteDeliveryDriver();
                break;
            case 'RESTORE':
                this.delivery_driver_form.restoreDeliveryDriver();
                break;
        }
    }

    deliveryDriverRegistered(d) {
        alert(lang.success);
        const current = location.pathname;
        this.props.history.push("/");
        setTimeout(() => {
            this.props.history.push(current);
        });
    }

    deliveryDriverNotRegistered(d) {
        alert(lang.error + ": " + JSON.stringify(d));
    }


    setDeliveryDriver(object) {
        this.setState({
            delivery_driver: object
        })
    }

    setModificationState(state) {
        //    four possible states: CREATE MODIFY DELETE RESTORE
        this.setState({
            selected_mod_state: state,
        });
    }

    setProductsWithRelations(object) {
        this.setState({
            products_with_relations: object
        })
    }


    render() {
        let mod_state = this.state.selected_mod_state;
        let submit_button_class = '';
        let title = '';
        //this looks dumb but what can i do..., will look into it for refactoring.
        switch (this.state.selected_mod_state.val) {
            case 'CREATE':
                submit_button_class = 'button_submit';
                break;
            case 'MODIFY':
                submit_button_class = 'button_modify';
                break;
            case 'DELETE':
                submit_button_class = 'button_delete';
                break;
            case 'RESTORE':
                submit_button_class = 'button_restore';
                break;

        }
        return (
            <Form>
                {/*<h3>{lang.register_delivery_driver}</h3>*/}
                <Row>
                    <Descriptor>
                        <h3>{lang.title}</h3>
                    </Descriptor>
                    <InputArea>
                        <ListSelect filter={false} object_list={this.state.mod_states}
                                    default={this.state.selected_mod_state}
                                    handleSelect={this.setModificationState.bind(this)}/>
                    </InputArea>

                </Row>
                {/*if we are not creating a delivery_driver show list of deliveries to modify/delete/restore*/}
                {mod_state.val !== 'CREATE' ?
                    <Row>
                        <Descriptor>
                            {lang.select_delivery_driver+" "+mod_state.str}
                        </Descriptor>
                        <InputArea>
                            {/*get active deliveries if deleting, and inactive if restoring*/}

                            <DeliveryDriverList
                                is_active={mod_state.val !== 'RESTORE'}
                                filter={false}
                                handleSelect={this.setDeliveryDriver.bind(this)}
                                delivery_driver_for={this.state.delivery_driver_for}/>
                        </InputArea>
                    </Row>
                    : null}
                {/*hide the form if the user is deleting or restoringing a delivery_driver (cleaner visual)*/}
                <div style={{display: mod_state.val === 'RESTORE' || mod_state.val === 'DELETE' ? 'none' : 'block'}}>
                    <DeliveryDriverForm
                        delivery_driver_for={this.state.delivery_driver_for}
                        delivery_driver={this.state.delivery_driver}
                        onRef={ref => (this.delivery_driver_form = ref)}
                        onFailure={this.deliveryDriverNotRegistered.bind(this)}
                        onSuccess={this.deliveryDriverRegistered.bind(this)}
                    />

                </div>

                <Row>
                    <button className={submit_button_class + " ml-auto"} onClick={() => this.submitForm()}>
                        {mod_state.str}
                    </button>

                </Row>

            </Form>
        )
    }
}

export default withRouter(ManageDeliveryDriver)