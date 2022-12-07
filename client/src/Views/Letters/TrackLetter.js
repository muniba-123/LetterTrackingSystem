import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Apis } from "../../Configurations/Api_endpoints";
import QrReader from 'react-qr-scanner'
import { Table } from "../../Components/Table";
import Button from "../../Components/Button";
import TextField from "../../Components/TextField";
import { getFormattedDate, letterStatus } from "../../Configurations/Constants";
import { useDispatch, useSelector } from 'react-redux';


function TrackLetter() {
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
  const [letterId, setLetterId] = useState(null);
  const [qrResult, setQrResult] = useState("");
  const [letterDetails, setLetterDetails] = useState(null);
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
        trackLetter(data.text)
        }
  };
  const trackLetter = (id) => {
    setLetterDetails(null);
    setMsg(null);
    axios.get(`${Apis.trackLetter}${id}`, {}).then((res) => {
      setLetterId("");
      setQrResult("");
      if (!res.isAxiosError && res?.data?.length>0) {
        const data=res.data;
        // data.status=letterStatus[data.status];
       setLetterDetails(data);
      }
      else
      setMsg("Mail not found")
    });
  };
  useEffect(()=>{
    setLetterId("");
  },[trackingMode])
  return (
    <div className="container track-letter">
      {/* <Button
        label={"Back"}
        onClick={() => navigate("/home")}
        className={`small-btn`}
      /> */}
       <h3 className="my-4">Track your mail by entering letter ID or by scanning QR code.</h3>
      <div className="d-flex justify-content-center">
        <div onClick={()=>setTrackingMode(1)} className={`tab ${trackingMode===1?"active":""}`}>Track by ID</div>
        <div onClick={()=>setTrackingMode(2)} className={`tab ${trackingMode===2?"active":""}`}>Track by QR Code</div>

      </div>
    {trackingMode ===1 &&
      <div className="form-wrap">
       
        <TextField
          name="letterId"
          placeholder={"Enter Ltr ID"}
          type="number"
          onChange={(e)=>{ setLetterId(e.target.value); }}
          value={letterId}
          className="text-field-2"
        />
        <Button
          label={"Track"}
          onClick={()=>trackLetter(letterId)}
          className={`small-btn`}
          disabled={!letterId}
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

     {letterDetails && <Table data={letterDetails} columns={ columns } search={false}/>}
      
    </div>
  );
}

export default TrackLetter;
