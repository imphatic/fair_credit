import React from "react";
import { Well, Grid, Row, Col } from 'react-bootstrap';

export default class Balance extends React.Component {

    render() {
        return (
            <div>
               <Well bsSize="large">
                   <Grid>
                        <Row>
                            <Col sm={4}><strong>Interest Accrued:</strong> ${this.props.interest.toFixed(2)} </Col>
                            <Col sm={4}><strong>Principal Balance:</strong> ${this.props.balance.toFixed(2)}</Col>
                        </Row>
                   </Grid>
               </Well>
            </div>
        );
    }
}


