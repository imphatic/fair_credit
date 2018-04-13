import React from "react";
import { Panel, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';

export default class NewTransaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSavingNewTransaction: false,
            newTransaction: {},
            newTransactionErrors: {
                'amount' : false,
                'type'  : false,
                'date'  : false
            },
        };

        this.handleNewTransaction = this.handleNewTransaction.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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

        if(!this.state.newTransaction.date) {
            pass = false;
            newTransactionErrors['date'] = true;
        }

        this.setState(newTransactionErrors);
        if(!pass) return false;

        this.setState({ isSavingNewTransaction: true });

        console.log(this.state.newTransaction);
        setTimeout(() => {
           //todo: replace timeout with XHR
           if(this.props.successCallBack){
                this.props.successCallBack();
           }
          this.setState({ isSavingNewTransaction: false });
        }, 2000);

    }

    render() {
        const { isSavingNewTransaction } = this.state
        const { newTransactionErrors } = this.state

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
                                    <FormGroup validationState={newTransactionErrors.date ? 'error' : null}>
                                        <ControlLabel>Date</ControlLabel>
                                        <FormControl
                                            name="date"
                                            type="date"
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
