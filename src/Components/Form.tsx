import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Response from "./Response";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "./Loader";
import dotenv from "dotenv";
import SSLcheck from './SSLcheck';

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

  const [DNSstate, setDNSstate] = useState(null);
  const [record, setRecord] = useState('A');

  useEffect(() => {
    console.log(DNSstate);
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

  const getDNSinfo = () => {
    axios
      .post("https://api.perfops.net/run/dns-resolve", {
        target: state.email,
        param: record,
        dnsServer: "8.8.8.8,208.67.222.222,199.85.126.10,64.6.64.6,8.26.56.26,209.244.0.3",
        location: "world",
        limit: 1,
      })
      .then((res: { data: { id: any } }) => {
        axios
          .get(`https://api.perfops.net/run/dns-resolve/${res.data.id}`)
          .then((DNSres: { data: { items: React.SetStateAction<null> } }) =>
            setDNSstate(DNSres.data.items)
          );
      });
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
              <Form.Group controlId="emailValidation">
                <Form.Label>Enter Email or domain: </Form.Label>
                <Form.Control
                  type="text"
                  className="input-field"
                  onChange={handleEmailChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Select record to check</Form.Label>
              <Form.Control onChange={(event: any) => setRecord(event.target.value) }  as="select" custom >
                <option>A</option>
                <option>CNAME</option>
                <option>NS</option>
                <option>SOA</option>
              </Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              {" "}
              <Form.Group>
                <Form.Label>Please tick for validation: </Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Fix Typos"
                  className="field"
                  onChange={(event: any) =>
                    setState({ ...state, fixTypos: event.target.checked })
                  }
                />
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
              <Button
                onClick={getDNSinfo}
                variant={DNSstate ? 'info' : "primary"}
              >
                Get DNS status
              </Button>
            </Col>
            <Col>
            <SSLcheck domain={state.email}/>
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
