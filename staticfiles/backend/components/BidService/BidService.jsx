import React from 'react';
import jQuery from 'jquery';
import csrftoken from '../../../../../static/js/csrf.js'

/**
 * This is the product manager
 * It can register a list of products or modify entries of a list of products
 * Registration is generic given a form
 * @param props
 * @return {*}
 * @constructor
 */

/**
 *  Manages the product manager api.
 */
const BID_API_URL = '/backend';

class BidService extends React.Component {
    /*
      * gets one or more products for a given product owner. (permissions)
      * @param filter_param_dict dictionary containing any of {start_date,end_date,delivery_from_id,is_active,id}
      * @param delivery_for_pk id of the owner of the products, needed for authentication.
      * @return {Promise<Response>}
      */
    static getBids(filter_param_dict) {
        return fetch(`${BID_API_URL}/bid?${jQuery.param(filter_param_dict)}`, {
            method: 'GET',
        }).then(d => d.json())
    }

    static getLastSession() {
        return fetch(`${BID_API_URL}/last-session`, {
            method: 'GET',
        }).then(d => d.json())
    }
}

export default BidService
