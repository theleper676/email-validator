/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "../App.css";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

interface ModalcheckProps {
    domain: string | null,
    connectionMethod: number,
    record?: string
}

interface params {
    host: string | null,
    all?: string,
}

const Modalcheck: React.FC<ModalcheckProps> = (props) => {

    // eslint-disable-next-line no-unused-vars
    const [Checked, setCheck] = useState(false);
    const [data, setData] = useState();
    const [show, setShow] = useState(false);
    const [connectionMode, setConnectionMode] = useState(props.connectionMethod);
    const [record , setRecord] = useState(props.record);
    const [message, setMessage] = useState('');

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    //useEffect for dubigging. 
    useEffect(() => {
        console.log(data);
    })

    //Check DNS info
    const CheckDNSStatus = async () => {
        //Check if the records are fine, if not return error
        try {
            const { data: { id }} = await axios
                .post("https://api.perfops.net/run/dns-resolve", {
                    target: props.domain,
                    param: record,
                    dnsServer: "8.8.8.8,208.67.222.222,199.85.126.10,64.6.64.6,8.26.56.26,209.244.0.3",
                    location: "world",
                    limit: 1,
                });
            const DNSres = await axios
                .get(`https://api.perfops.net/run/dns-resolve/${id}`);
            setData(DNSres.data.items);
            setCheck(true);
        } catch (err) {
            if(err.response.data.status === 404){
                setMessage(`${err.response.data.status} - That can't be good, please contact support`)
            }
            setCheck(!Checked);
        }
    };

    async function CheckConnection() {
        handleShow();
        if (connectionMode === 1) {
            CheckDNSStatus();
        }
        else if (connectionMode === 2) {
            console.log('SSL connection mode started');
        }
    }
    return (
        <div>
            <Button variant='outline-primary' onClick={() => {
                handleShow();
                CheckConnection();
            }}>Check connection</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{(connectionMode === 1 ? 'Domain Connection test' : 'SSL connection test')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!Checked && <Spinner animation="border" />}
                    {Checked && message}
                    </Modal.Body>
                <Modal.Footer>
                    {Checked && <Button variant="primary" onClick={() => {
                        handleClose();
                        setCheck(!Checked);
                    }}>
                        Close
          </Button>}
                </Modal.Footer>
            </Modal>
        </div>
    );
}


export default Modalcheck;
