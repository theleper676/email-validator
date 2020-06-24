/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "../App.css";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar'

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
    const [message, setMessage] = useState('This is a message');
    const [statusMessage, setStatusMessage] = useState('SSL Check started');
    const [progress, setPorgress] = useState(0);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    //useEffect for dubigging. 
    useEffect(() => {
        console.log(data);
    })

    const CheckSSLStatus = async () => {
        //start the ssl check
        const {data} = await axios.get(`https://dns-ssl-checker.herokuapp.com/sslcheck/${props.domain}`);
        console.log('SSL check started');
        setStatusMessage(data.statusMessage);
        //initate the first handshake
        setTimeout(async ()=> {
            const {data :{ endpoints }} = await axios.get(`https://dns-ssl-checker.herokuapp.com/sslcheck/${props.domain}`);
            //if the progress of the fist handshake is already 100, stop
            if (endpoints[0].progress === 100){
                setPorgress(endpoints[0].progress);
                //set the grade and the status message.
                const {grade,statusMessage} = endpoints[0];
                setStatusMessage(endpoints[0].statusMessage);
                setCheck(!Checked);
            }
            //else, continue to check until progress of the check is 100
            else{
               const interval = setInterval(async ()=> {
                    const {data :{ endpoints }} = await axios.get(`https://dns-ssl-checker.herokuapp.com/sslcheck/${props.domain}`);
                    setPorgress(endpoints[0].progress);
                    setStatusMessage(endpoints[0].statusDetailsMessage);
                    
                    if(endpoints[0].progress === 100){
                        setCheck(!Checked);
                        clearInterval(interval);
                    }
                },6000);
            }
        },8000);
    }

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
            CheckSSLStatus();
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
                    {Checked && <p>{message}</p>}
                    <p>{statusMessage}</p>
                    <ProgressBar animated={!Checked} now={progress} label={`${progress}%`} />
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
