import React,{useState} from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
function Loader() {
    interface state {
        status: number,
    }
    return (
        <div className="Response">
            <h1>Loading...</h1>
        </div>
      );
}


export default Loader;
