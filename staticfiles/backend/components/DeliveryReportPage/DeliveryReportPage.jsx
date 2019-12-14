import React from 'react';
import DeliveryService from '../DeliveryService/DeliveryService.jsx'
import './style.scss'
import languages from "./lang.js"
import ListSelect from "../../../../../static/components/ListSelect/ListSelect.jsx";
import {CSVLink, CSVDownload} from "react-csv";
import {Bar} from 'react-chartjs-2';
import ChartFunctions from "../../../../../static/js/ChartFunctions.js";
import InfiniteCalendar, {
    Calendar,
    withRange,
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import {Descriptor, Row,InputArea,Form} from "../../../../../static/components/Form/Form.jsx";

let lang = languages[document.documentElement.lang];

//props dependencies: onSelect onFailure function
/**
 * Registers a delivery, calls onSuccess or onFailure function with json response object.
 */
class DeliveryReportPage extends React.Component {
    constructor(props) {
        super(props);
        //set a time to next day midnight
        let date_today = new Date();
        date_today.setHours(0, 0, 0, 0);
        date_today.setDate(date_today.getDate() + 1);
        let start_date = new Date(date_today.getTime());
        start_date.setMonth(start_date.getMonth() - 1);
        this.state = {
            //    need the current selected delivery_for to which to register delivery
            delivery_for: props.delivery_for,
            delivery_objects: [],
            end_date: date_today,
            start_date: start_date,
            chart_period_choices: [{id: 0, val: 'hours'}, {id: 1, val: 'day'}, {id: 2, val: 'month'}, {
                id: 3,
                val: 'year'
            }],
            chart_period_choice: {id: 1, val: 'day'},
            //list of the following:
            // ['period value (date)','total-deliveries','total-delivery-weight'],
            chart_period_data: [['period-step (date)', 'number of deliveries', 'total-weight(kg)']],
            csv_data: [],
        };
    }

    componentDidMount() {
        //    Test the service:
        if (this.state.delivery_for) {
            this.getDeliveryData(this.state.start_date, this.state.end_date, this.state.delivery_for.id)
        }

    }

    generateCSVData(delivery_data) {
        let csv_data = [['id', 'date', 'time', 'supplier', 'supplier site', 'weight', 'quality', 'number of bales']];
        for (let d of delivery_data) {
            csv_data.push([d.id, d.delivery_date.toLocaleDateString(), d.delivery_date.toTimeString().split('(')[0], d.delivery_from.supplier.name, d.delivery_from.name, d.weight, d.items[0] ? d.items[0].quality : 'n/a', d.items.length.toString()])
        }
        this.setState({
            csv_data: csv_data
        })

    }

    /**
     * Calculates the weight for each delivery from products adds it the dictionary and returns it.
     */
    static formatDeliveryData(delivery_data) {
        for (let i = 0; i < delivery_data.length; i++) {
            let sum = 0;
            for (let item of delivery_data[i].items) {
                sum += item.weight;
            }
            sum = Math.round(sum);
            delivery_data[i]["delivery_date"] = new Date(delivery_data[i]["delivery_date"]);
            delivery_data[i]["weight"] = sum;
        }
        return delivery_data
    }

    /**
     * Function gets all deliveries (between date a and b including all products associated with said deliveries)
     */
    getDeliveryData(start_date, end_date, delivery_for_id) {

        start_date = Math.round(start_date.getTime() / 1000);
        end_date = Math.round(end_date.getTime() / 1000);
        DeliveryService.getDeliveriesWithItems({
            start_date: start_date,
            end_date: end_date,
            is_active: "True",
            delivery_for: delivery_for_id
        }, delivery_for_id).then((d) => {
            if (d) {
                d.sort(DeliveryReportPage.dynamicSort("delivery_date"));
                d = DeliveryReportPage.formatDeliveryData(d);
                this.setState({
                    delivery_data: d
                });
                this.generateChartData(d, this.state.chart_period_choice.val);
                this.generateCSVData(d)
            }
        })
    }

    componentWillReceiveProps(props) {
        if ("delivery_for" in props && props.delivery_for !== null) {
            if (this.state.delivery_for === null || this.state.delivery_for.id !== props.delivery_for.id) {
                this.setState({
                    delivery_for: props.delivery_for
                });
                this.getDeliveryData(this.state.start_date, this.state.end_date, props.delivery_for.id)
            }
        }
    }

    changeChartPeriodChoice(obj) {
        if (obj.id !== this.state.chart_period_choice.id) {
            this.setState({
                chart_period_choice: obj,
            });
            this.generateChartData(this.state.delivery_data, obj.val)
        }

    }

    /**
     *
     * @param period day/month/year as a string
     * @param date the date to be offset from
     * @param multiple the multiple to be offset by (int)
     * @return {number}
     */
    static offsetDate(period, date, multiple) {
        let new_date = new Date(date.getTime());
        switch (period) {
            case 'hours':
                new_date.setHours(new_date.getHours() + multiple);
                return new_date;
            case 'day':
                new_date.setDate(new_date.getDate() + multiple);
                return new_date;
            case 'month':
                new_date.setMonth(new_date.getMonth() + multiple);
                return new_date;
            case 'year':
                new_date.setFullYear(new_date.getFullYear() + multiple);
                return new_date;
            default:
                new_date.setDate(new_date.getDate() + multiple);
                return new_date;
        }

    }

    /**
     * Function to sort alphabetically an array of objects by some specific key.
     *
     * @param {String} property Key of the object to sort.
     */
    static dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function (a, b) {
            let c = +a[property];
            let d = +b[property];
            if (c && d) {
                return sortOrder === -1 ? c < d ? 1 : -1 : d < c ? 1 : -1;
            }
            return sortOrder === -1 ? b[property] > a[property] ? 1 : -1 : a[property] > b[property] ? 1 : -1;

        }
    }

    static googleChartsToChartJs(data) {
        let labels = data.map((value, index) => {
            if (index > 0) return value[0].toDateString()
        });
        labels.shift();
        let datasets = [];
        let i = 0;
        for (let d of data[0].slice(1)) {
            let dataset = {};
            dataset['label'] = d;
            ++i;
            dataset['data'] = data.map((value, index) => {
                if (index > 0) return value[i];
            });
            dataset['data'].shift();
            dataset['borderColor'] = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + '1' + ')';
            dataset['backgroundColor'] = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + '0.6' + ')';
            dataset['fill'] = true;
            datasets.push(dataset)
        }
        return {'labels': labels, 'datasets': datasets}
    }

    generateChartData(delivery_data, time_period) {
        // generate all the labels:
        let labels = [];
        let date = new Date(this.state.end_date.getTime());
        //get the list of time steps
        while (date > this.state.start_date) {
            labels.push(date);
            date = DeliveryReportPage.offsetDate(time_period, date, -1)
        }
        //            ['period value', 'total-deliveries', 'total-delivery-weight'],
        // data comes in a sorted list it is sorted upon reception and formatting
        labels.reverse();
        // stacks should be:
        // total number of deliveries by supplier (stacked)
        // total weight of deliveries (tonnes) by supplier (stacked)

        //labels should be:
        // supplier name number of balls,
        // supplier name total weight balls
        let dataset_dict = {};
        for (let delivery of delivery_data) {
            let sup_name = delivery.delivery_from.supplier.name;
            // let label_sup_balls = sup_name + " " + "num balls";
            let label_sup_weight = sup_name + " " + "weight tonnes";
            if (!dataset_dict[label_sup_weight]) {
                let color_base = 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',';
                let color1_in = color_base + '255, 0.5' + ')';
                let color1_out = color_base + '255, 1' + ')';
                let color2_in = color_base + '0, 0.5' + ')';
                let color2_out = color_base + '0, 1' + ')';
                // dataset_dict[label_sup_balls] = {
                //     'label': label_sup_balls,
                //     'stack': 'num balls',
                //     'backgroundColor': color1_in,
                //     'borderColor': color1_out,
                //     'data': []
                // };
                dataset_dict[label_sup_weight] = {
                    'label': label_sup_weight,
                    'stack': 'weight',
                    'backgroundColor': color2_in,
                    'borderColor': color2_out,
                    'data': []
                }
            }
            let d_len = dataset_dict[label_sup_weight].data.length;
            let dates = labels;
            if (dataset_dict[label_sup_weight].data.length > 0) {
                dates = labels.slice(d_len - 1)
            }
            let broken = false;
            for (let date of dates) {
                if (delivery.delivery_date < date) {

                    if (broken) {
                        dataset_dict[label_sup_weight].data.push(delivery.weight / 1000);
                        // dataset_dict[label_sup_balls].data.push(delivery.items.length);
                    } else {
                        let index = dataset_dict[label_sup_weight].data.length - 1;
                        dataset_dict[label_sup_weight].data[index] += delivery.weight / 1000;
                        // dataset_dict[label_sup_balls].data[index] += delivery.items.length;
                    }

                    break;
                } else {
                    if (!broken) {
                        if (dataset_dict[label_sup_weight].data.length === 0) {
                            dataset_dict[label_sup_weight].data.push(0);
                        }
                        broken = true;
                    } else {
                        dataset_dict[label_sup_weight].data.push(0);
                        // dataset_dict[label_sup_balls].data.push(0);
                    }

                }

            }
        }

        labels.unshift(this.state.start_date);
        let datasets = Object.values(dataset_dict);
        //clean the dataset values in case of any huge decimals
        let include_time = false;
        if (time_period === 'hours') {
            include_time = true;
        }
        for (let i = 0; i < labels.length; i++) {
            if (include_time) {
                labels[i] = labels[i].getFullYear() + '-' + labels[i].getMonth() + '-' + labels[i].getDate() + '  ' + labels[i].getHours() + ":00:00"

            } else {
                labels[i] = labels[i].getFullYear() + '-' + labels[i].getMonth() + '-' + labels[i].getDate()

            }
        }
        //finish padding all the data with 0'es
        for (var i = 0; i < datasets.length; i++) {
            let padding = labels.length - datasets[i].data.length;
            for (var j = 0; j < padding; j++) {
                datasets[i].data.push(0);
            }
        }
        this.setState({
            chart_period_data: {labels: labels, datasets: datasets,}
        })

    }

    setDates(e) {
        if (e.eventType === 3) {
            if (this.state.delivery_for && e.start < e.end && (e.end.getTime() !== this.state.end_date.getTime() || e.start.getTime() !== this.state.start_date.getTime())) {
                this.setState({
                    start_date: e.start,
                    end_date: e.end,
                });
                this.getDeliveryData(e.start, e.end, this.state.delivery_for.id)
            }


        }
    }

    setStartDate(start_date) {
        if (start_date < this.state.end_date && this.state.delivery_for && start_date.getTime() !== this.state.start_date.getTime()) {
            this.setState({
                start_date: start_date
            });
            this.getDeliveryData(start_date, this.state.end_date, this.state.delivery_for.id)
        } else {
            alert("start date should be before end date")
        }
    }

    setEndDate(end_date) {
        if (end_date > this.state.start_date && this.state.delivery_for && end_date.getTime() !== this.state.end_date.getTime()) {
            this.setState({
                end_date: end_date
            });
            this.getDeliveryData(this.state.start_date, end_date, this.state.delivery_for.id)
        } else {
            alert("end date should be after start dates")
        }

    }


    /**
     * list of dates are available + all items under each delivery so:
     * [{id:id,date:date,weight:weight},...]
     *
     * For the range of dates:
     * Deliveries come with a given date and time (high precision)
     * Graph should be frequency of deliveries over time
     * data held should be total
     * date_from => date_to?
     * @return {*}
     */

    render() {
        //
        const data = this.state.chart_period_data;
        const options = {
            // Elements options apply to all of the options unless overridden in a dataset
            // In this case, we are setting the border of each bar to be 2px wide and green
            elements: {
                rectangle: {
                    borderWidth: 2,
                    borderColor: 'rgb(0, 255, 0)',
                    // borderSkipped: 'bottom'
                }
            },
            cumulative: true,
            responsive: true,
            tooltips: {
                display: true,
                callbacks: {
                    label: function (tooltipItem, data) {
                        let name = data.datasets[tooltipItem.datasetIndex].label;
                        let stack = data.datasets[tooltipItem.datasetIndex].stack;
                        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        // Loop through all datasets to get the actual total of the index
                        var total = parseFloat(value);
                        let i = 0;
                        for (let d of data.datasets) {
                            if (d.label !== name && d.stack === stack && i !== tooltipItem.datasetIndex) {
                                total += parseFloat(d.data[tooltipItem.index])
                            }
                            i += 1;
                        }
                        return [name + " : " + value, "Total : " + Math.round(total)];
                    }
                }
            },
            legend: {
                position: 'right'
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart'
            }
        };
        let date = new Date();
        if (data) {
            return (
                //    we render all the fields needed to fill the above requirements using the available services and user input.

                <div className={'product_report_page'}>
                    <Form>
                        <h3>{lang.title}</h3>

                        <InfiniteCalendar
                            Component={withRange(Calendar)}
                            // height={350}
                            min={new Date(2018, 8, 1)}
                            selected={{start: this.state.start_date, end: this.state.end_date}}
                            layout={'portrait'}
                            width={'100%'}
                            onSelect={this.setDates.bind(this)}

                        />,
                        {/*<div className={"form_row"}>*/}
                        {/*<div className={"row_descriptor"}>*/}
                        {/*{lang.date_from}*/}
                        {/*</div>*/}
                        {/*<div className={"form_input ml-auto"}>*/}
                        {/*<SingleDatePicker date={this.state.start_date}*/}
                        {/*onDateChange={this.setStartDate.bind(this)}*/}
                        {/*focused={this.state.focused} // PropTypes.bool*/}
                        {/*onFocusChange={({focused}) => this.setState({focused})}/>*/}
                        {/*</div>*/}

                        {/*</div>*/}
                        {/*<div className={"form_row"}>*/}
                        {/*<div className={"row_descriptor"}>*/}
                        {/*{lang.date_to}*/}
                        {/*</div>*/}
                        {/*<div className={"form_input ml-auto"}>*/}
                        {/*<SingleDatePicker date={this.state.end_date} onDateChange={this.setEndDate.bind(this)}*/}
                        {/*focused={this.state.focused} // PropTypes.bool*/}
                        {/*onFocusChange={({focused}) => this.setState({focused})}/>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        <Row>
                            <Descriptor>
                                {lang.select_period}
                            </Descriptor>
                            <InputArea>
                                <ListSelect default={this.state.chart_period_choices[1]} filter={false}
                                            object_list={this.state.chart_period_choices.map(obj => {
                                                var rObj = {};
                                                rObj = obj;
                                                rObj["str"] = obj.val;
                                                rObj["sort"] = obj.id;
                                                return rObj;
                                            })} handleSelect={this.changeChartPeriodChoice.bind(this)}/>
                            </InputArea>

                        </Row>
                    </Form>

                    <div style={{maxWidth: '100%', 'overflowX': 'scroll'}}>
                        <div style={{width: '1000px'}}>
                            <Bar width={'100%'} height={'55'} data={data} options={options}/>
                        </div>
                    </div>
                    <div className={'form'}>

                        <CSVLink data={this.state.csv_data}>{lang.download_data}</CSVLink>
                    </div>
                </div>

            )
        } else {
            return (<div>N/A</div>)
        }

    }
}

export default DeliveryReportPage