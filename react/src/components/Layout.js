import React from "react";
import NewTransaction from './NewTransaction';
import Ledger from './Ledger';
import Balance from'./Balance';
import axios from 'axios';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.getLedgerAndBalance = this.getLedgerAndBalance.bind(this);

        this.state = {
            port:5000,
            hostname:window.location.hostname,
            interest: 0,
            balance: 0,
            ledger : []
        }
    }

     componentDidMount() {
        if (typeof window !== 'undefined') {
            if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'development') {
                this.setState({port:window.location.port})
            }
        }

        this.getLedgerAndBalance();
     }

    getLedgerAndBalance() {
        axios.get('//'+this.state.hostname+':'+this.state.port+'/api/ledger/2018-01-01/2018-06-01')
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
                <NewTransaction
                    successCallBack={() => this.getLedgerAndBalance()}
                    port={this.state.port}
                    hostname={this.state.hostname} />
                <Ledger ledger={this.state.ledger} />
                <Balance interest={this.state.interest} balance={this.state.balance} />
            </div>
        );
    }
}
