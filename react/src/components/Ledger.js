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
        const style = (data.type === 2) ? 'success' : 'danger';
        const op = (data.type === 2) ? '+' : '-';

        return(
            <tr>
              <td>{data.date_time}</td>
              <td><Label bsStyle={style}>{op} ${data.amount.toFixed(2)}</Label></td>
              <td>${data.balance.toFixed(2)}</td>
            </tr>
        );
    }

}
