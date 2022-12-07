import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Apis } from "../../Configurations/Api_endpoints";
import QrReader from 'react-qr-scanner'
import { Table } from "../../Components/Table";
import Button from "../../Components/Button";
import TextField from "../../Components/TextField";
import { getFormattedDate } from "../../Configurations/Constants";
import {  useSelector } from 'react-redux';
function TrackBatch() {
  const columns = [
    {
      dataField: "fromOrg",
      text: "From",
      formatter: (cell, row, e) => getOrgNameFromId(row.fromOrg)
       },
    {
      dataField: "toOrg",
      text: "To",
      formatter: (cell, row, e) => getOrgNameFromId(row.toOrg)
    }, 
    {
      dataField: "status",
      text: "Status",
      sort: true
    },
    {
      dataField: "sentOn",
      text: "Sent On",
      formatter: (cell, row, e) =>  getFormattedDate(row.sentOn,"mm/dd/yyyy")
    },
    {
      dataField: "receivedBy",
      text: "Received By",
    },
    
    {
      dataField: "receivedOn",
      text: "Received On",
      formatter: (cell, row, e) => {
        if(row.receivedOn)
       return getFormattedDate(row.receivedOn,"mm/dd/yyyy")
        else return ""
      }
    }, 
  ];
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  const [batchId, setBatchId] = useState(null);
  const [qrResult, setQrResult] = useState("");
  const [batchDetails, setBatchDetails] = useState(null);
  const [msg, setMsg] = useState("");
  const [trackingMode, setTrackingMode] = useState(1);
  const [organizations, setOrganizations] = useState([]);

  const navigate = useNavigate();
  const getOrgNameFromId=(id)=>{
    const index = organizations.map((org) => org.id).indexOf(Number(id));
    if(index!==-1)
   return organizations[index].name;
   return null;
  }
  useEffect(() => {
    getOrganizations();
  }, []);
  const getOrganizations = () => {
    axios.get(`${Apis.getOrganizations}`, {}).then((res) => {
      setOrganizations(res.data);
    });
  };
  const handleError = (err) => {
    console.error(err);
  };
  const handleScan = (data) => {
    debugger;
    if(data?.text?.length>0)
        {setQrResult(data.text);
        trackBatch(data.text)
        }
  };
  const trackBatch = (id) => {
    setBatchDetails(null);
    setMsg(null);
    axios.get(`${Apis.trackBatch}${id}`, {}).then((res) => {
      setBatchId(null);
      setQrResult("");
      if (!res.isAxiosError && res?.data?.length>0) {
        const data=res.data;
       setBatchDetails(data);
      }
      else
      setMsg("Batch not found")
    });
  };
  useEffect(()=>{
    setBatchId(null);
  },[trackingMode])
  return (
    <div className="container track-letter">
      {/* <Button
        label={"Back"}
        onClick={() => navigate("/home")}
        className={`small-btn`}
      /> */}
       <h3 className="my-4">Track your batch by entering Batch ID or by scanning QR code.</h3>
      <div className="d-flex justify-content-center">
        <div onClick={()=>setTrackingMode(1)} className={`tab ${trackingMode===1?"active":""}`}>Track by ID</div>
        <div onClick={()=>setTrackingMode(2)} className={`tab ${trackingMode===2?"active":""}`}>Track by QR Code</div>

      </div>
    {trackingMode ===1 &&
      <div className="form-wrap">
       
        <TextField
          name="batchId"
          placeholder={"Enter Batch ID"}
          type="number"
          onChange={(e)=>{setBatchId(e.target.value);}}
          value={batchId}
          className="text-field-2"
        />
        <Button
          label={"Track"}
          onClick={()=>trackBatch(batchId)}
          className={`small-btn`}
          disabled={!batchId}
        />
      </div>}
      {(trackingMode===2 && !qrResult) &&
          <QrReader
          delay={1000}
          onError={handleError}
          onScan={handleScan}
          className="qr-scan"
        />
        }



     {msg&&
     <div> {msg}</div>
    }

     {batchDetails && <Table data={batchDetails} columns={ columns } search={false}/>}
      
    </div>
  );
}

export default TrackBatch;
