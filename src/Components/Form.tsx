import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown'
import axios from "axios";
import Response from "./Response";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "./Loader";
import dotenv from "dotenv";
import Modalcheck from './Modalcheck';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl'

function ValidationForm() {
  dotenv.config();

  interface queryParams {
    email: string | null;
    fixTypos?: boolean;
    api_key?: string;
  }

  interface DNSrequest {
    target: string | null;
    param: string;
    dnsServer: string;
    location?: string;
    limit: number;
  }
  const [state, setState] = useState({
    email: null,
    fixTypos: false,
    info: null,
    isSubmitted: false,
    isLoading: false,
    hunterInfo: null,
  });
  const DNSrecords = [{
    key: 'A',
    item: 'A',
  },
  {
    key: 'NS',
    item: 'NS',
  },
  {
    key: 'CNAME',
    item: 'CNAME',
  }

  ];

  const [record, setRecord] = useState('A');

  useEffect(() => {
    console.log(record);
  });

  const handleEmailChange = async (e: any) => {
    const { value } = e.target;
    await setState({
      ...state,
      email: value,
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setState({
      ...state,
      isLoading: true,
    });

    GetHunterInfo();
  };

  function GetHunterInfo() {
    const API = "https://csqa-email-validator.herokuapp.com/validate";
    const hunterAPI = "https://hunter.io/v2/email-verifier";

    const params: queryParams = {
      email: state.email,
      api_key: "4c4fdfa41329e980977210df5bddf568d904f8a5",
    };

    const req1 = axios.get(API, { params });
    const req2 = axios.get(hunterAPI, { params });

    axios.all([req1, req2]).then(
      axios.spread((...responses: any[]) => {
        const res1 = responses[0];
        const res2 = responses[1];

        setState({
          ...state,
          info: res1.data,
          isSubmitted: true,
          isLoading: false,
          hunterInfo: res2.data.data,
        });
      })
    );
  }


  return (
    <div className="App-form">
      <Form onSubmit={handleSubmit}>
        <Container>
          <Row>
            <Col>
              {" "}
              <Form.Group>
                <Form.Label>
                  Enter domain
    </Form.Label>
                <InputGroup className="w-50">
                  <FormControl id="inlineFormInputGroup" placeholder="Enter Domain or Email" onChange={handleEmailChange} />
                  <InputGroup.Append>
                    <Dropdown onSelect={(eventKey: any) => setRecord(eventKey)}>
                      <Dropdown.Toggle variant='info' id='record-dropdown'>
                        {record}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {DNSrecords.map(record => (
                          // eslint-disable-next-line react/jsx-key
                          <Dropdown.Item key={record.key} eventKey={record.key}>{record.item}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </InputGroup.Append>
                  <InputGroup.Append>
                    <Modalcheck domain={state.email} connectionMethod={1} record={record} />
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {state.isLoading && <Loader />}
              {state.isSubmitted && (
                <Response info={state.info} hunterInfo={state.hunterInfo} />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Check Email Status
              </Button>
            </Col>
            <Col>
            </Col>
            <Col>
              <Button variant="danger">Clear</Button>
            </Col>
          </Row>
        </Container>
      </Form>
    </div>
  );
}

export default ValidationForm;
