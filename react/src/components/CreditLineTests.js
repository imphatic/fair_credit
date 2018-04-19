import React from "react";
import axios from 'axios';
import { Button } from 'react-bootstrap';


export default class CreditLines extends React.Component {
    constructor(props) {
        super(props)

        this.handleCreateTestScenario1 = this.handleCreateTestScenario1.bind(this)
        this.handleCreateTestScenario2 = this.handleCreateTestScenario2.bind(this)

        this.state = {
            isRunningTest1: false,
            isRunningTest2: false
        };
    }

    handleCreateTestScenario1() {
        const today = new Date()

        this.props.createNewLineOfCredit({
            'name':'Scenario 1',
            'credit_limit': 1000
        }, (id) => {

            // 30 days ago 500 withdraw
            const prior = new Date().setDate(today.getDate()-30)
            const date_time = new Date(prior).toISOString().slice(0, 10)
            axios.post('//'+this.props.hostname+':'+this.props.port+'/api/transaction', {
                'data':{
                    'type': 1,
                    'credit_line_id': id,
                    'date_time': date_time,
                    'amount': 500
                }

            }).then(res => {
                this.props.loadCreditLine(id)
            });

        })

    }

    handleCreateTestScenario2() {
        const today = new Date()

        this.props.createNewLineOfCredit({
            'name':'Scenario 2',
            'credit_limit': 1000
        }, (id) => {

            // 30 days ago 500 withdraw
            const prior = new Date().setDate(today.getDate()-30)
            const date_time = new Date(prior).toISOString().slice(0, 10)
            axios.post('//'+this.props.hostname+':'+this.props.port+'/api/transaction', {
                'data':{
                    'type': 1,
                    'credit_line_id': id,
                    'date_time': date_time,
                    'amount': 500
                }

            }).then(res => {
                    // 15 days ago credit 200
                    const prior2 = new Date().setDate(today.getDate()-15)
                    const date_time2 = new Date(prior2).toISOString().slice(0, 10)
                    axios.post('//'+this.props.hostname+':'+this.props.port+'/api/transaction', {
                    'data':{
                        'type': 2,
                        'credit_line_id': id,
                        'date_time': date_time2,
                        'amount': 200
                    }

                    }).then(res => {
                        // 5 days ago withdraw 100
                        const prior3 = new Date().setDate(today.getDate()-5)
                        const date_time3 = new Date(prior3).toISOString().slice(0, 10)
                        axios.post('//'+this.props.hostname+':'+this.props.port+'/api/transaction', {
                        'data':{
                            'type': 1,
                            'credit_line_id': id,
                            'date_time': date_time3,
                            'amount': 100
                        }

                        }).then(res => {
                            this.props.loadCreditLine(id)
                        });
                    });

            });

        })
    }

    render() {
    // this.props.createNewLineOfCredit(data, callBack);
            return(
                <div>
                    <Button bsStyle="primary"
                            onClick={this.handleCreateTestScenario1}
                            disabled={this.state.isRunningTest1}>
                            {this.state.isRunningTest1 ? 'Working...' : 'Run Test Scenario 1'}
                    </Button> &nbsp;

                    <Button bsStyle="primary"
                            onClick={this.handleCreateTestScenario2}
                            disabled={this.state.isRunningTest2}>
                            {this.state.isRunningTest2 ? 'Working...' : 'Run Test Scenario 2'}
                    </Button>
                </div>
            )
        }

}
