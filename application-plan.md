# References
   * https://github.com/wearefair/interview/tree/master/engineering
   * https://react-bootstrap.github.io
   * http://flask.pocoo.org/docs/0.12/quickstart/#routing
   * http://jsonapi.org/format/


# Database Schema

| lines_of_credit     | |
------------------ | --- |
| id               | |
| name             | display name |
| credit_limit     | maximum credit for this account |


| transactions       | |
------------------   | --- |
| id                 | |
| credit_line_id     | id relating to the lines_of_credit table |
| type               | 1 = debit, 2 = credit, 3 = interest payment |
| amount             | The amount credited or debited from the balance |
| balance            | YTD balance of the line of credit, without interest |
| date_time          | Date of the transaction |


```
CREATE TABLE transactions (
    id                  serial CONSTRAINT primkey PRIMARY KEY,
    credit_line_id      INTEGER NOT NULL,
    type                INTEGER NOT NULL,
    amount              DECIMAL NOT NULL,
    balance             DECIMAL NOT NULL,
    date_time           TIMESTAMP NOT NULL
);

CREATE TABLE credit_lines (
    id                serial CONSTRAINT firstkey PRIMARY KEY,
    name              VARCHAR NOT NULL,
    credit_limit      DECIMAL NOT NULL
);
```


# API
#### Overview
The API will make use of a REST implementation with a straightforward URI
design.

The API request and response will conform to the JSON API spec version 1.0.
All requests that have a body and  all responses will have the following basic JSON structure:
```
{
    "data": {
        // pertinent data for the request
    }
}
```

For simplicity, all examples below in the endpoints table are assumed to be
inside the data object.

#### Endpoints

###### /api/transaction/(< id >)
New/edit/delete/get a single transaction

Example Request:
```
// Get transaction (GET)
/api/transaction/2

// New transaction (POST)
"amount":"-31.54",
"type":1,
"date_time":"2018-04-14"

// Edit transaction example (PUT)
"amount":"-31.54"

// Delete transaction (DELETE)
/api/transaction/2
```


Example Response:
```
// an empty data object if successful or an errors object if errors
```

###### /api/ledger/< starting period >/< ending period >
Summary of account activity including intrest accrued and principal balance.

Example Request
```
/api/ledger/2018-04-01/2018-04-14
```

Example Response:
```
{
   "interest":8.56,
   "balance":-145.23,
   "transactions":[
      {
         "id":1,
         "type":1,
         "date_time":"2018-04-04 05:15:13",
         "change":20.00,
         "balance":-185.23
      },
      {
         "id":1,
         "type":1,
         "date_time":"2018-04-06 04:25:22",
         "change":40.00,
         "balance":-145.23
      }
   ]
}
```

