import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Response from "./Response";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "./Loader"
import "./App.css";



function ValidationForm() {

  type Email  = string;

  const [state, setState] = useState({
    email: null,
    fixTypos: false,
    info: null,
    isSubmitted: false,
    isLoading: false,
    status: 200,
  });

  useEffect(() => {
    console.log(state);
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
    })
    const params = {
      email: state.email,
      fixTypos: state.fixTypos,
    };
    try {
      const res = await axios.get(
        "https://csqa-email-validator.herokuapp.com/validate",
        { params }
      );
      setState({ ...state, info: res.data, isSubmitted: true,isLoading: false,status: res.status });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App-form">
      <Form onSubmit={handleSubmit}>
        <Container>
          <Row>
            <Col>
            <Form.Group controlId="emailValidation">
              <Form.Label>Email adress: </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                className="input-field"
                onChange={handleEmailChange}
              />
            </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col> <Form.Group>
              <Form.Label>Please tick for validation: </Form.Label>
              <Form.Check
                type="checkbox"
                label="Fix Typos"
                className="field"
                onChange={(event: any) =>
                  setState({ ...state, fixTypos: event.target.checked })
                }
              />
              
            </Form.Group></Col>
          </Row>
          <Row>
            <Col xs={12}>
            {state.isLoading && <Loader />}
              {state.isSubmitted && <Response info={state.info}/>}
            </Col>
         
          </Row>
          <Row>
            <Col>
            <Button variant="primary" type="submit">
              Submit
            </Button>
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
