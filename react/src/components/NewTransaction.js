import React from "react";
import { Panel, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import axios from 'axios';

export default class NewTransaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSavingNewTransaction: false,
            newTransaction: {
                'amount': null,
                'type': null,
                'date_time': null
            },
            newTransactionErrors: {
                'amount' : false,
                'type'  : false,
                'date_time'  : false
            },
        };

        this.handleNewTransaction = this.handleNewTransaction.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.clearTransactionForm = this.clearTransactionForm.bind(this);
    }

    clearTransactionForm(e) {
        this.setState({newTransaction: {
            'amount': '',
            'date_time': ''
        }});
    }

    handleInputChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        const change = this.state.newTransaction;
        change[name] = value;
        this.setState(change);

        const errors = this.state.newTransactionErrors;
        errors[name] = false;
        this.setState(errors);
    }

    handleNewTransaction(e) {
        // Validate Data
        const newTransactionErrors = this.state.newTransactionErrors;
        let pass = true;

        if(!this.state.newTransaction.amount) {
            pass = false;
            newTransactionErrors['amount'] = true;
        }

        if(!this.state.newTransaction.type) {
            pass = false;
            newTransactionErrors['type'] = true;
        }

        if(!this.state.newTransaction.date_time) {
            pass = false;
            newTransactionErrors['date_time'] = true;
        }

        this.setState(newTransactionErrors);
        if(!pass) return false;

        this.setState({ isSavingNewTransaction: true });

        axios.post('//localhost:5000/api/transaction', {"data":this.state.newTransaction})
          .then(res => {
            if(typeof(res.data) !== undefined )
            {
                this.props.successCallBack();
                this.clearTransactionForm();
            } else {
                if(typeof(res.error) !== undefined)
                {
                    // here we would do some sort of error handling.
                }
            }

            this.setState({ isSavingNewTransaction: false });
          });
    }

    render() {
        const { isSavingNewTransaction } = this.state
        const { newTransactionErrors } = this.state
        const { newTransaction } = this.state

        return (
            <Panel>
                <Panel.Heading>New Transaction</Panel.Heading>
                <Panel.Body>
                    <form>
                        <Grid>
                            <Row>

                                <Col sm={2}>
                                    <FormGroup validationState={newTransactionErrors.amount ? 'error' : null}>
                                        <ControlLabel>Amount</ControlLabel>
                                        <FormControl
                                            name="amount"
                                            type="number"
                                            placeholder="$"
                                            min="0.00"
                                            max="1000.00"
                                            step="any"
                                            value={newTransaction.amount}
                                            onChange={this.handleInputChange}
                                         />
                                    </FormGroup>
                                </Col>

                                <Col sm={2}>
                                    <FormGroup validationState={newTransactionErrors.type ? 'error' : null}>
                                        <ControlLabel>Type</ControlLabel>
                                        <FormControl
                                            name="type"
                                            componentClass="select"
                                            onChange={this.handleInputChange}>
                                               <option value=''>Please Select</option>
                                               <option value="1">Withdraw</option>
                                               <option value="2">Payment</option>
                                        </FormControl>
                                    </FormGroup>
                                </Col>

                                <Col sm={3}>
                                    <FormGroup validationState={newTransactionErrors.date_time ? 'error' : null}>
                                        <ControlLabel>Date</ControlLabel>
                                        <FormControl
                                            name="date_time"
                                            type="date"
                                            value={newTransaction.date_time}
                                            onChange={this.handleInputChange}
                                         />
                                     </FormGroup>
                                </Col>

                                <Col sm={2}>
                                    <FormGroup>
                                        <ControlLabel>&nbsp;</ControlLabel><br />
                                        <Button bsStyle="primary"
                                                onClick={this.handleNewTransaction}
                                                disabled={isSavingNewTransaction}>
                                                {isSavingNewTransaction ? 'Saving...' : 'Save'}
                                        </Button>
                                    </FormGroup>
                                </Col>

                            </Row>
                        </Grid>
                    </form>
                </Panel.Body>
            </Panel>
        );
    }
}
