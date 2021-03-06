import React from "react";
import { Well, Grid, Row, Col } from 'react-bootstrap';

export default class Balance extends React.Component {

    render() {
        const interest = this.props.interest * -1
        const payoff = Math.abs(interest + this.props.balance)
        return (

            <div>
               <Well bsSize="large">
                   <Grid>
                        <Row>
                            <Col sm={3}><strong>Interest Accrued:</strong> ${interest.toFixed(2)} </Col>
                            <Col sm={3}><strong>Principal Balance:</strong> ${this.props.balance.toFixed(2)}</Col>
                            <Col sm={3}><strong>Pay Off:</strong> ${payoff.toFixed(2)}</Col>
                        </Row>
                   </Grid>
               </Well>
            </div>
        );
    }
}


