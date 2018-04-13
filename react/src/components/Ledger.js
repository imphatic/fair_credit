import React from "react";
import { Panel, Table, Label } from 'react-bootstrap';

export default class Ledger extends React.Component {

    render() {
        const rows = this.props.ledger.map((data, index) => {
            return (
                <Row
                    key={index}
                    data={data}
                />
            );
        });

        return (
            <div>
                <Panel>
                    <Panel.Heading>Ledger</Panel.Heading>
                    <Panel.Body>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Change</th>
                              <th>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows}
                          </tbody>
                        </Table>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

class Row extends React.Component {
    render() {
        const data = this.props.data;
        const style = (data.change > 0) ? 'success' : 'danger';
        const op = (data.change > 0) ? '+' : '-';

        return(
            <tr>
              <td>{data.date}</td>
              <td><Label bsStyle={style}>{op} ${data.change}</Label></td>
              <td>${data.balance}</td>
            </tr>
        );
    }

}
