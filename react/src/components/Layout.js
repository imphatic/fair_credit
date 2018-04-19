import React from "react";
import CreditLines from './CreditLines';
import NewTransaction from './NewTransaction';
import Ledger from './Ledger';
import Balance from'./Balance';
import axios from 'axios';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.getLedgerAndBalance = this.getLedgerAndBalance.bind(this);
        this.loadCreditLine = this.loadCreditLine.bind(this);

        this.state = {
            credit_line_id:0,
            port:5000,
            hostname:window.location.hostname,
            interest: 0,
            balance: 0,
            ledger : [],
            credit_lines: []
        }
    }

     componentDidMount() {
        if (typeof window !== 'undefined') {
            if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
                this.setState({port:window.location.port})
            }
        }
     }

    loadCreditLine(id) {
        this.setState({
            credit_line_id:id
        });

        this.getLedgerAndBalance(id);
    }

    getLedgerAndBalance(credit_line_id) {
        axios.get('//'+this.state.hostname+':'+this.state.port+'/api/ledger/'+credit_line_id+'/2018-01-01/2018-06-01')
          .then(res => {
            this.setState({
                ledger:res.data.data.transactions,
                interest:res.data.data.interest,
                balance:res.data.data.balance
                });
          });
    }

    render() {
        return (
            <div>
                <h1>Fair Credit</h1>

                <CreditLines
                    creditLines={this.state.credit_lines}
                    port={this.state.port}
                    hostname={this.state.hostname}
                    loadCreditLine={(id) => this.loadCreditLine(id)}
                    loadedCreditLineId={this.state.credit_line_id} />

                <div className={this.state.credit_line_id > 0 ? '' : 'hide'}>
                    <NewTransaction
                        successCallBack={() => this.getLedgerAndBalance(this.state.credit_line_id)}
                        port={this.state.port}
                        hostname={this.state.hostname}
                        loadedCreditLineId={this.state.credit_line_id} />

                    <Ledger ledger={this.state.ledger} />

                    <Balance interest={this.state.interest} balance={this.state.balance} />
                </div>
            </div>
        );
    }
}
