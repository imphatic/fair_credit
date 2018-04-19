import React from "react";
import axios from 'axios';
import { Grid, Row, Col, PanelGroup, Panel, Table, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

import CreditLineTests from './CreditLineTests';

export default class CreditLines extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            creditLines:[],
            isSavingNewLineOfCredit: false,
            newLineOfCredit: {
                'name': '',
                'credit_limit': ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleNewLineOfCredit = this.handleNewLineOfCredit.bind(this)
        this.getLinesOfCredit = this.getLinesOfCredit.bind(this)
        this.createNewLineOfCredit = this.createNewLineOfCredit.bind(this)
    }

    componentDidMount() {
        this.getLinesOfCredit()
    }

    getLinesOfCredit() {
        axios.get('//'+this.props.hostname+':'+this.props.port+'/api/credit_lines')
          .then(res => {
            this.setState({
                creditLines:res.data.data
                });
          });
    }

    handleInputChange(e) {
        const target = e.target
        const name = target.name
        const value = target.value

        const change = this.state.newLineOfCredit
        change[name] = value
        this.setState(change)
    }

    handleNewLineOfCredit(e) {
        this.setState({ isSavingNewLineOfCredit: true })

        this.createNewLineOfCredit(this.state.newLineOfCredit, (id) => {
            this.setState({ isSavingNewLineOfCredit: false })
        })
    }

    createNewLineOfCredit(data, callBack=false) {
        axios.post('//'+this.props.hostname+':'+this.props.port+'/api/credit_line', {"data":data})
          .then(res => {
            if(typeof(res.data) !== undefined )
            {
                if(callBack) callBack(res.data.data.id);
                this.props.loadCreditLine(res.data.data.id)
                this.getLinesOfCredit()
            } else {
                if(typeof(res.error) !== undefined)
                {
                    // here we would do some sort of error handling.
                }
            }
          });
    }

    render() {

        const { isSavingNewLineOfCredit } = this.state

        const tableRows = this.state.creditLines.map((data, index) => {
            return (
                <TableRow
                    key={index}
                    data={data}
                    loadCreditLine={(id) => this.props.loadCreditLine(id)}
                    loadedCreditLineId={this.props.loadedCreditLineId}
                />
            );
        });

        return (
            <div>
                <Panel>
                    <Panel.Heading>Lines of Credit</Panel.Heading>
                    <Panel.Body>

                        <Grid fluid>
                            <Row>
                                <Col md={6}>

                                    <Table responsive>
                                      <thead>
                                        <tr>
                                          <th>Name</th>
                                          <th>Credit Limit</th>
                                          <th>Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {tableRows}
                                      </tbody>
                                    </Table>

                                </Col>
                                <Col md={6}>

                                  <PanelGroup id='new-or-load' accordion>
                                    <Panel eventKey="1">
                                      <Panel.Heading>
                                        <Panel.Title toggle>New Line of Credit</Panel.Title>
                                      </Panel.Heading>
                                      <Panel.Body collapsible>

                                        <form>
                                            <FormGroup>
                                                <ControlLabel>Name</ControlLabel>
                                                <FormControl
                                                    name="name"
                                                    onChange={this.handleInputChange}
                                                 />
                                             </FormGroup>

                                            <FormGroup>
                                                <ControlLabel>Credit Limit</ControlLabel>
                                                <FormControl
                                                    name="credit_limit"
                                                    type="number"
                                                    placeholder="$"
                                                    min="0.00"
                                                    max="10000.00"
                                                    step="any"
                                                    onChange={this.handleInputChange}
                                                 />
                                            </FormGroup>

                                            <FormGroup>
                                                <ControlLabel>&nbsp;</ControlLabel><br />
                                                <Button bsStyle="primary"
                                                        onClick={this.handleNewLineOfCredit}
                                                        disabled={isSavingNewLineOfCredit}>
                                                        {isSavingNewLineOfCredit ? 'Saving...' : 'Save'}
                                                </Button>
                                            </FormGroup>
                                        </form>

                                      </Panel.Body>
                                    </Panel>

                                    <Panel eventKey="2">
                                      <Panel.Heading>
                                        <Panel.Title toggle>Load Test Line of Credit</Panel.Title>
                                      </Panel.Heading>
                                      <Panel.Body collapsible>

                                        <CreditLineTests
                                         createNewLineOfCredit={(data, callBack) => this.createNewLineOfCredit(data, callBack)}
                                         loadCreditLine={(id) => this.props.loadCreditLine(id)}
                                         hostname={this.props.hostname}
                                         port={this.props.port} />

                                      </Panel.Body>
                                    </Panel>
                                  </PanelGroup>

                                </Col>
                            </Row>
                        </Grid>

                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

class TableRow extends React.Component {
    render() {
        const data = this.props.data;
        const state = this.state;

        return(
            <tr>
              <td>{data.name}</td>
              <td>${data.credit_limit.toFixed(2)}</td>
              <td>
                <Button
                    bsStyle={data.id == this.props.loadedCreditLineId ? 'success' : 'primary' }
                    onClick={() => this.props.loadCreditLine(data.id)}>
                        {data.id == this.props.loadedCreditLineId ? 'Loaded' : ' Load '}
                </Button>
              </td>
            </tr>
        );
    }

}

