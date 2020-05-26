import React,{ useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ListGroup from "react-bootstrap/ListGroup";

function Response(props: any) {
    const {email}
    const [state, setState] = useState({
      });

  return (

    <div className="App">
      <ListGroup>
  <ListGroup.Item variant = {state.isValid ? 'warning': 'info'} >{props.email}</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default Response;
