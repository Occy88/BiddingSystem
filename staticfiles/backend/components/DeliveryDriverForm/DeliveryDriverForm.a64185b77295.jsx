import React from 'react';
import {withRouter} from 'react-router-dom';

import './style.css'
import DeliveryService from '../DeliveryService/DeliveryService.jsx'
import languages from "./lang.js"
import {Descriptor, InputArea, Row} from "../../../../../static/components/Form/Form.jsx";

let lang = languages[document.documentElement.lang];

//props dependencies: onSelect onFailure function
/**
 * Registers a delivery, calls onSuccess or onFailure function with json response object.
 */
class DeliveryDriverForm extends React.Component {
     constructor(props) {
        super(props);
        this.state = {
            //model fields:
            delivery_driver_for: props.delivery_driver_for,
            id: props.delivery_driver ? props.delivery_driver.id : null,
            name: props.delivery_driver ? props.delivery_driver.name : '',
            is_active: props.delivery_driver ? props.delivery_driver.is_active : true,

        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    setDeliveryDriverFor(object) {
        this.setState({
            delivery_driver_for: object
        })
    }

    setName(name) {
        this.setState({
            name: name
        })
    }

    getDeliveryDriverObject() {
        return {
            name: this.state.name,
            delivery_driver_for: this.state.delivery_driver_for.id
        }
    }

    checkGenericForm() {
        if (!(this.state.delivery_driver_for && this.state.delivery_driver_for.id)) {
            alert("invalid delivery_driver for contact admin")
        }
        if (this.state.name === '') {
            alert('name is empty')
        }
        return (
            this.state.delivery_driver_for &&
            this.state.delivery_driver_for.id &&
            this.state.name !== "");
    }

    checkId() {
        if (!this.state.id > 0) {
            alert("id is incorrect");
            return false
        }
        return true;
    }

    checkActive() {
        if (!this.state.is_active) {
            alert("not active");
            return false
        }
        return true;
    }

    checkInActive() {
        if (this.state.is_active) {
            alert("active");
            return false
        }
        return true;
    }

    checkDeleteForm() {
        return (
            this.checkGenericForm() &&
            this.checkId() &&
            this.checkActive()
        )
    }

    checkRestoreForm() {
        return (
            this.checkGenericForm() &&
            this.checkId() &&
            this.checkInActive()
        )
    }

    checkUpdateForm() {
        return (
            this.checkGenericForm() &&
            this.checkId() &&
            this.checkActive()
        )
    }

    checkRegisterForm() {
        return (
            this.checkGenericForm()
        )
    }

    handleResponse(data) {
        alert("Success: " + data.id + " : " + data.name);
        const current = location.pathname;
        this.props.history.push("/");
        setTimeout(() => {
            this.props.history.push(current);
        });
    }

    restoreDeliveryDriver() {
        if (this.checkRestoreForm()) {
            let delivery_driver = this.getDeliveryDriverObject();
            delivery_driver.id = this.state.id;
            delivery_driver.is_active = true;
            DeliveryService.updateDeliveryDriver(delivery_driver, this.state.delivery_driver_for.id, delivery_driver.id).then(
                d => {
                    this.handleResponse(d)
                }
            )
        }
    }

    deleteDeliveryDriver() {
        if (this.checkDeleteForm()) {
            let delivery_driver = this.getDeliveryDriverObject();
            delivery_driver.id = this.state.id;
            delivery_driver.is_active = false;
            DeliveryService.updateDeliveryDriver(delivery_driver, this.state.delivery_driver_for.id, delivery_driver.id).then(
                d => {
                    this.handleResponse(d)
                }
            )
        }
    }

    updateDeliveryDriver() {
        if (this.checkUpdateForm()) {
            let delivery_driver = this.getDeliveryDriverObject();
            delivery_driver.id = this.state.id;
            DeliveryService.updateDeliveryDriver(delivery_driver, this.state.delivery_driver_for.id, delivery_driver.id).then(
                d => {
                    this.handleResponse(d)
                }
            )
        }
    }


    registerDeliveryDriver() {
        if (this.checkRegisterForm()) {
            DeliveryService.registerDeliveryDriver(this.getDeliveryDriverObject(), this.state.delivery_driver_for.id).then(
                d => {
                    this.handleResponse(d)
                }
            )
        }
    }

    /**
     * Can receive any of the four
     * @param props
     */
    componentWillReceiveProps(props) {
        if (props.delivery_driver && (!this.state.delivery_driver || this.state.delivery_driver.id !== props.delivery_driver.id)) {
            this.setState({
                id:props.delivery_driver.id,
                name:props.delivery_driver.name,
                is_active:props.delivery_driver.is_active,
            })
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Descriptor>
                        {lang.input_name}
                    </Descriptor>
                    <InputArea>
                        <input className={"form_input ml-auto"} type={"text"}
                               onChange={(event) => this.setName(event.target.value)}
                               value={this.state.name.toString()}
                               placeholder={lang.name}/>
                    </InputArea>
                </Row>
            </div>
        )
    }
}

export default withRouter(DeliveryDriverForm)