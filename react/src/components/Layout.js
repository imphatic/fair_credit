import React from "react";
import NewTransaction from './NewTransaction';
import Ledger from './Ledger';
import Balance from'./Balance';
import axios from 'axios';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.getLedgerAndBalance = this.getLedgerAndBalance.bind(this);
        this.getInterestAccrued = this.getInterestAccrued.bind(this);
        this.getPrincipalBalance = this.getPrincipalBalance.bind(this);

        this.state = {
            interest: 8.59,
            balance: 208.59,
            ledger : []
        }
    }

     componentDidMount() {
        this.getLedgerAndBalance();
     }

    getLedgerAndBalance() {
        axios.get('//localhost:5000/api/ledger/2018-01-01/2018-05-01')
          .then(res => {
            this.setState({ ledger:res.data.data });
          });
    }

    getInterestAccrued() {

    }

    getPrincipalBalance() {

    }

    render() {
        return (
            <div>
                <h1>Fair Credit</h1>
                <NewTransaction successCallBack={() => this.getLedgerAndBalance()} />
                <Ledger ledger={this.state.ledger} />
                <Balance interest={this.state.interest} balance={this.state.balance} />
            </div>
        );
    }
}
