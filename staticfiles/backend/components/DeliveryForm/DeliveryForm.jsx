import React, {forwardRef, useRef, useImperativeHandle} from 'react';
import SupplierList
    from '../../../../../supplier_manager/static/supplier_manager/components/SupplierList/SupplierList.jsx'
import ShipmentSiteList
    from '../../../../../supplier_manager/static/supplier_manager/components/ShipmentSiteList/ShipmentSiteList.jsx'
import DeliveryService from '../DeliveryService/DeliveryService.jsx'
import languages from "./lang.js"
import DeliveryDriverList from "../DeliveryDriverList/BidList.jsx";
import {Form, Row, Descriptor, InputArea} from "../../../../../static/components/Form/Form.jsx";

let lang = languages[document.documentElement.lang];

//props dependencies: onSelect onFailure function
/**
 * Lets parent handle, form submission,
 * provides methods to register,delete,update,restore a delivery,
 * provides methods to check forms
 */
class DeliveryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //model fields
            id: props.delivery ? props.delivery.id : null,
            code: props.delivery ? props.delivery.code : '',
            is_active: props.delivery ? props.delivery.is_active : true,

            //foreign key objects
            delivery_for: props.delivery_for,
            supplier: props.supplier,
            shipment_site: props.shipment_site,
            driver: props.driver,
            //functions
            onSuccess: props.onSuccess,
            onFailure: props.onFailure,
        };
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    changeSupplier(object) {
        this.setState({supplier: object})
    }

    changeShipmentSite(object) {
        this.setState({shipment_site: object});

    }

    changeDeliveryDriver(object) {
        this.setState({
                driver: object
            }
        )
    }

    setCode(code) {
        this.setState({
            code: code
        })
    }

    checkShipmentSite() {
        //just check if id is in valid range
        return this.state.shipment_site && this.state.shipment_site.id > 0
    }

    checkSupplier() {
        //just check if id is in valid range
        return this.state.supplier && this.state.supplier.id > 0
    }

    checkDeliveryFor() {
        //just check if id is in valid range
        return this.state.delivery_for && this.state.delivery_for.id > 0
    }

    checkDriver() {
        return this.state.driver && this.state.driver.id > 0
    }

    checkCode() {
        return this.state.code !== ''
    }

    /**
     * Checks all the must have fields for any form submission
     * to do with deliveries
     * @return {*}
     */
    checkGenericForm() {
        return (this.checkDeliveryFor() &&
            this.checkShipmentSite() &&
            this.checkSupplier() &&
            this.checkCode() &&
            this.checkDriver()
        );
    }

    checkUpdateForm() {
        return (
            this.checkGenericForm() &&
            this.state.id > 0) &&
            this.state.is_active === true;
    }

    checkRegisterForm() {
        return (
            this.checkGenericForm()
        );
    }

    checkDeleteForm() {
        return (
            this.checkGenericForm() &&
            this.state.id > 0 &&
            this.state.is_active === true
        )
    }

    checkRestoreForm() {
        return (
            this.checkGenericForm() &&
            this.state.id > 0 &&
            this.state.is_active === false
        )
    }


    componentWillReceiveProps(props) {
        if (props.delivery && (!this.state.id || this.state.id !== props.delivery.id)) {
            this.setState({
                    supplier: props.delivery.delivery_from.supplier,
                    //  shipment site for said supplier
                    shipment_site: props.delivery.delivery_from,
                    code: props.delivery.code,
                    id: props.delivery.id,
                    driver: props.delivery.driver,
                    is_active: props.delivery.is_active,
                }
            )
        }
    }

    getDeliveryObject() {
        return {
            delivery_for: this.state.delivery_for.id,
            delivery_from: this.state.shipment_site.id,
            code: this.state.code,
            driver: this.state.driver.id,
            id: this.state.id
        }
    }

    restoreDelivery() {
        if (this.checkRestoreForm()) {
            let delivery = this.getDeliveryObject();
            //set active to false and submit
            delivery.is_active = true;
            DeliveryService.updateDelivery(delivery, this.state.delivery_for.id, delivery.id).then(d => {
                //if it is successful, i.e. received an id for said delivery, then register the requested number of products to it
                this.handleResponse(d)
            })
        } else {
            alert(lang.invalid_form)
        }
    }

    registerDelivery() {
        if (this.checkRegisterForm()) {
            let date = new Date();
            date = Math.round(date.getTime() / 1000);
            let delivery = this.getDeliveryObject();
            //set the date of creation to now.
            delivery.delivery_date = date;
            //delete the id if there is one...
            delete delivery.id;
            // set is_active to true, just to avoid anything strange,
            delivery.is_active=true;
            DeliveryService.registerDelivery(delivery, this.state.delivery_for.id).then(d => {
                //if it is successful, i.e. received an id for said delivery, then register the requested number of products to it
                this.handleResponse(d)
            })
        } else {
            alert(lang.invalid_form)
        }
    }

    deleteDelivery() {
        if (this.checkDeleteForm()) {
            let delivery = this.getDeliveryObject();
            //set active to false as we are deleting it...
            delivery.is_active = false;
            DeliveryService.updateDelivery(delivery, this.state.delivery_for.id, delivery.id).then(d => {
                //if it is successful, i.e. received an id for said delivery, then register the requested number of products to it
                this.handleResponse(d)
            })
        } else {
            alert(lang.invalid_form)
        }
    }

    updateDelivery() {
        if (this.checkUpdateForm()) {
            let delivery = this.getDeliveryObject();
            if (this.state.id) {
                delivery.id = this.state.id;
                DeliveryService.updateDelivery(delivery, this.state.delivery_for.id, this.state.id).then(d => {
                    this.handleResponse(d)
                })
            }
        } else {
            alert(lang.invalidForm);
            this.props.onFailure();
        }
    }

    handleResponse(data) {
        if (data.id) {
            this.props.onSuccess(data)
        } else {
            this.props.onFailure(data)
        }
    }

    render() {
        return (
            //    we render all the fields needed to fill the above requirements using the available services and user input.
            <div>
                <Row>
                    <Descriptor>
                        {lang.enter_code}
                    </Descriptor>
                    <InputArea>
                        <input value={this.state.code}
                               onChange={(event) => this.setCode(event.target.value)} placeholder={'code'}/>
                    </InputArea>
                </Row>
                <Row>
                    <Descriptor>
                        {lang.select_driver}
                    </Descriptor>
                    <InputArea>
                        <DeliveryDriverList
                            select_object={this.state.driver}
                            handleSelect={this.changeDeliveryDriver.bind(this)}
                            delivery_driver_for={this.state.delivery_for}/>
                    </InputArea>

                </Row>
                <Row>
                    <Descriptor>
                        {lang.select_supplier}
                    </Descriptor>
                    <InputArea>

                        <SupplierList
                            is_active={true}
                            select_object={this.state.supplier}
                            handleSelect={this.changeSupplier.bind(this)}
                            supplier_for={this.state.delivery_for}/>
                    </InputArea>
                </Row>

                <Row>
                    <Descriptor>
                        {lang.select_shipment_site}
                    </Descriptor>
                    <InputArea>
                        <ShipmentSiteList
                            select_object={this.state.shipment_site}
                            handleSelect={this.changeShipmentSite.bind(this)}
                            supplier_for={this.state.delivery_for}
                            supplier={this.state.supplier}/>
                    </InputArea>
                </Row>
            </div>
        )
    }
}

export default DeliveryForm