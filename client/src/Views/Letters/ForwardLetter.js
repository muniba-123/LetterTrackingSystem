import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Apis } from "../../Configurations/Api_endpoints";
import QrReader from "react-qr-scanner";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import FormDropdown from "../../Components/FormDropdown";
import TextField from "../../Components/TextField";
import Button from "../../Components/Button";
import { toast } from "react-toastify";
import { getFormattedDate } from "../../Configurations/Constants";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const initialFormValues = {
  letterId: null,
  receiver: null,
  receiverOrg: null,
};
function ForwardLetter() {
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  const userId = auth?.userId;
  const userOrg = auth?.userOrg;
  const [organizations, setOrganizations] = useState([]);
  const [values, setValues] = useState(initialFormValues);
  const [trackingMode, setTrackingMode] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (submitted) validate();
  }, [values]);
  const handleInputChange = ({ target }, checkboxValue = null) => {
    const value = target.value;
    const { name } = target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  useEffect(() => {
    getOrganizations();
  }, []);
  const getOrganizations = () => {
    axios.get(`${Apis.getOrganizations}`, {}).then((res) => {
      setOrganizations(res.data);
    });
  };
  const fwdLetter = () => {
    setSubmitted(true);
    if (!validate()) return;
    const data = {
      letterId: Number(values.letterId),
      receiver: values.receiver,
      receiverOrg: Number(values.receiverOrg),
      sentOn: getFormattedDate(new Date()),
      userId,userOrg
    };
    axios.post(`${Apis.forwardLetter}`, data, {}).then(res => {
      if (!res.isAxiosError) {
        toast.info("Letter forwarded successfully", {
          autoClose: 4000,
        });
        downloadLetterDetails()
      } else {
       if(res.status===404)
       toast.error("This letter is already forwarded from this organization", {autoClose:3000,});
        console.log("Error");
      }
    });
  };
  const downloadLetterDetails = () => {
let e1 = document.querySelector(".letter-details");
if(e1) {
e1.style.visibility=false;
e1.innerHTML=`<b>Mail ID:</b> ${values.letterId} <br/><b>From:</b> ${getOrgNameFromId(Number(userOrg))} <br/><b>To:</b> ${getOrgNameFromId(values.receiverOrg)} <br/><b>Date:</b> ${getFormattedDate(new Date(),"mm/dd/yyyy")}`;
html2canvas(e1, {}).then((canvas) => {
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [4, 2]  
  }); 
  pdf.addImage(imgData, "PNG", 0, 0);
  pdf.save(`Mail-${values.letterId}.pdf`);
});
}
    navigate("/home");
  };
  const getOrgNameFromId=(id)=>{
    const index = organizations.map((org) => org.id).indexOf(Number(id));
    if(index!==-1)
   return organizations[index].name;
   return null;
  }
  const handleError = (err) => {
    console.error(err);
  };
  const handleScan = (data) => {
    if (data?.text?.length > 0) setValues({ ...values, letterId: data.text });
  };
  const validate = (fieldValues = values) => {
    let isValid = true;
    const field = {};
    if (!fieldValues.receiverOrg) {
      field.receiverOrg = "Required";
      isValid = false;
    }
    if (fieldValues.receiver?.trim().length === 0) {
      field.receiver = "Required";
      isValid = false;
    }
    if (fieldValues.letterId?.trim().length === 0) {
      field.letterId = "Required";
      isValid = false;
    }
    setErrors({
      ...field,
    });
    return isValid;
  };
  useEffect(() => {
    setValues({ ...values, letterId: null });
  }, [trackingMode]);
  return (
    <div className="container">
      <div className="heading-block">
        <Button
          label={"Back"}
          onClick={() => navigate("/home")}
          className={`small-btn`}
        />
        <h3>Forward mail</h3>
      </div>
      <div className="d-flex justify-content-center">
        <div
          onClick={() => setTrackingMode(1)}
          className={`tab ${trackingMode === 1 ? "active" : ""}`}
        >
          Use Letter ID
        </div>
        <div
          onClick={() => setTrackingMode(2)}
          className={`tab ${trackingMode === 2 ? "active" : ""}`}
        >
          Scan QR Code
        </div>
      </div>

      {trackingMode === 2 && (
        <QrReader
          delay={1000}
          onError={handleError}
          onScan={handleScan}
          className="qr-scan"
        />
      )}
      <div className="form-wrap">
        <Row>
          <Col xl={6}>
            <TextField
              name="letterId"
              placeholder={"LTR ID"}
              type="number"
              error={errors.letterId}
              value={values.letterId}
              className="text-field-2"
              disabled={trackingMode === 2}
              onChange={handleInputChange}
            />
          </Col>
          <Col xl={6}>
            <FormDropdown
              options={organizations}
              label={"Send to"}
              name="receiverOrg"
              value={values.receiverOrg}
              onChange={handleInputChange}
              error={errors.receiverOrg}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
            <TextField
              name="receiver"
              placeholder={"To"}
              onChange={handleInputChange}
              type="text"
              error={errors.receiver}
              value={values.receiver}
              className="text-field-2"
            />
          </Col>
        </Row>
        <Button
          label={"Forward"}
          onClick={fwdLetter}
          className={`small-btn`}
          wrapperClass="ml-auto"
        />
      </div>
      <div className="letter-details m-3 p-3" >
          </div>
    </div>
  );
}

export default ForwardLetter;
