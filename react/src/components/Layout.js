import React from "react";
import NewTransaction from './NewTransaction';
import Ledger from './Ledger';
import Balance from'./Balance';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.getLedgerAndBalance = this.getLedgerAndBalance.bind(this);

        this.state = {
            interest: 8.59,
            balance: 208.59,
            ledger : [
                {
                    date : '2018-04-04',
                    change : -500.00,
                    balance: 500.00
                },
                {
                    date : '2018-04-08',
                    change : 100.00,
                    balance: 400.00
                }
            ]
        }
    }

    getLedgerAndBalance() {

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
