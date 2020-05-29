import React from "react";
import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
function Loader() {
    interface state {
        status: number,
    }
    return (
        <div className="Response">
            <Container />
            <Row>
                <Col xs={12}>
                    Loading...
                </Col>
            </Row>
        </div>
      );
}


export default Loader;
