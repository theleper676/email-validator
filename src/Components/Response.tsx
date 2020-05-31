import React from "react";
import '../App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";




function Response(props: any ) {
  const { domain, domain_error, email, mx_records_found, valid } = props.info;
  const {result, score, block} = props.hunterInfo;
  return (
    <div className="Response">
      <Container>
          <Row>
            <Col xs={6} style={{margin: '20px'}}>
            <ListGroup style={{ width: "22rem" }}>
            <ListGroup.Item><b>Email:</b> {email}</ListGroup.Item>
            <ListGroup.Item><b>Domain:</b> {domain}</ListGroup.Item>
            <ListGroup.Item variant={valid ? "success" : "danger"}>
              <b>Is Email Valid?</b> {valid.toString()}
            </ListGroup.Item>
            <ListGroup.Item variant={mx_records_found ? "success" : "danger"}>
              <b>MX Records found?</b> {mx_records_found.toString()}
            </ListGroup.Item>
            <ListGroup.Item variant={domain_error ? "danger" : "success"}>
             <b>Domain Error?</b>  {domain_error.toString()}
            </ListGroup.Item>
          </ListGroup>
            </Col>

            <Col xs={6} style={{margin: '20px'}}>
            <ListGroup style={{ width: "22rem" }}>
            <ListGroup.Item><b>Is Email Risky? </b> {result}</ListGroup.Item>
            <ListGroup.Item><b>Email score: </b> {score}</ListGroup.Item>
            <ListGroup.Item>
              <b>Is Email Blocked? </b> {block.toString()}
            </ListGroup.Item>
          </ListGroup>
            </Col>
          </Row>
      </Container>
    </div>
  );
}

export default Response;
