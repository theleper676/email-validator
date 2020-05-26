import React, { useState,useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Response from './Response';
import "./App.css";

function ValidationForm() {
  const [state, setState] = useState({
    email: null,
    fixTypos: false,
    info: null,
    isSubmitted: false,
  });

  useEffect(()=> {
    console.log(state);
  })

  const handleEmailChange = async (e: any) => {
    const {value} = e.target;
    await setState({
      ...state,
      email: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const params = {
      email: state.email,
      fixTypos: state.fixTypos,
    };
    try{
      const res = await axios.get(
        "https://csqa-email-validator.herokuapp.com/validate",
        { params }
      );
      setState({...state,info: res.data,isSubmitted: true}); 
    }
    catch(err){
      console.log(err);
    }
    
  };

  return (
    <div className="App-form">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="emailValidation">
          <Form.Label>Email adress: </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            className="input-field"
            onChange={handleEmailChange}
          />
        </Form.Group>
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
          {state.isSubmitted && <Response info={state.info} /> }
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ValidationForm;
