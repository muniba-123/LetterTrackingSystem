import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Apis } from "../../Configurations/Api_endpoints";
import { getFormattedDate } from "../../Configurations/Constants";
import { QRCodeCanvas } from "qrcode.react";
import TextField from "../../Components/TextField";
import Button from "../../Components/Button";
import FormDropdown from "../../Components/FormDropdown";
import { Row, Col } from "reactstrap";
import { Modal, ModalFooter, ModalBody } from "reactstrap";
import {  useSelector } from 'react-redux';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const initialFormValues = {
  letterNo: null,
  date: new Date(),
  receiver: null,
  receiverOrg: null,
  precedence: null,
  classification: null,
  envelopSize: null,
};
function SendLetter() {
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  const userId = auth?.userId;
  const userOrg = auth?.userOrg;
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState(initialFormValues);
  const [organizations, setOrganizations] = useState([]);
  const [classification, setClassification] = useState([]);
  const [precedence, setPrecedence] = useState([]);
  const [envelopSize, setEnvelopSize] = useState([]);
  const [letterId, setLetterId] = useState(null);
  useEffect(() => {
    if (submitted) validate();
}, [values]);
  const navigate = useNavigate();

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
    getClassifications();
    getEnvelopSizes();
    getPrecendence();
  }, []);
  const getOrgNameFromId=(id)=>{
    const index = organizations.map((org) => org.id).indexOf(Number(id));
    if(index!==-1)
   return organizations[index].name;
   return null;
  }
  const getOrganizations = () => {
    axios.get(`${Apis.getOrganizations}`, {}).then((res) => {
      setOrganizations(res.data);
    });
  };
  const getClassifications = () => {
    axios.get(`${Apis.getClassification}`, {}).then((res) => {
      setClassification(res.data);
    });
  };
  const getPrecendence = () => {
    axios.get(`${Apis.getPrecedence}`, {}).then((res) => {
      setPrecedence(res.data);
    });
  };
  const getEnvelopSizes = () => {
    axios.get(`${Apis.getEnvelopSize}`, {}).then((res) => {
      setEnvelopSize(res.data);
    });
  };
  const validate = (fieldValues = values) => {
    let isValid = true;
    const field = {};
    if (!fieldValues.receiverOrg) {
        field.receiverOrg = "Required";
        isValid = false;
    }
    if (fieldValues.receiver?.trim().length===0) {
        field.letterId = "Required";
        isValid = false;
    }
    setErrors({
        ...field
    });
    return isValid;
};
  const sendLetter = () => {
    setSubmitted(true);
    if(!validate()) return;
    const data = {
      userId,userOrg,
      letterNo:Number(values.letterNo),
      date:getFormattedDate(values.date),
      receiver:values.receiver,
      receiverOrg:Number(values.receiverOrg),
      precedence:Number(values.precedence),
      classification:Number(values.classification),
      envelopSize:Number(values.envelopSize),
    };
    axios.post(`${Apis.sendLetter}`, data, {}).then((res) => {
      if (!res.isAxiosError) {
        setLetterId(res.data.letterId);
        setShowModal(true);
      } else console.log("Error");
    });
  };
  const downloadQRCode = () => {
    const qrCodeURL = document
      .getElementById("qrCodeEl")
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
      let aEl = document.querySelector("img.qrImg");
      aEl.src = qrCodeURL;
          const e1 = document.querySelector(".letter-details");
if(e1) {
e1.style.visibility=false;
e1.innerHTML=`<b>Mail ID:</b> ${letterId} <br/><b>From:</b> ${getOrgNameFromId(userOrg)} <br/><b>To:</b> ${getOrgNameFromId(values.receiverOrg)} <br/><b>Date:</b> ${getFormattedDate(new Date(),"mm/dd/yyyy")}`;
e1.append(aEl);
html2canvas(e1, {}).then((canvas) => {
   e1.append(aEl);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [6,3]
  });
  pdf.addImage(imgData, "PNG", 0, 0);
  pdf.save(`Mail-${letterId}.pdf`);
});
}
    setShowModal(false);
   navigate("/home");
  };
  return (
    <div className="container">
      <div className="heading-block">
        <Button
          label={"Back"}
          onClick={() => navigate("/home")}
          className={`small-btn`}
        />
        <h3>Send new mail</h3>
      </div>
      <div className="form-wrap">
        <Row>
          <Col xl={6}>
            <TextField
              name="letterNo"
              placeholder={"LTR #"}
              type="number"
              onChange={handleInputChange}
              error={errors.letterNo}
              value={values.letterNo}
              className="text-field-2"
            />
          </Col>
          <Col xl={6}>
            <TextField
              name="date"
              placeholder={"Date"}
              onChange={handleInputChange}
              type="date"
              error={errors.date}
              value={values.date}
              className="text-field-2"
            />
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
            <FormDropdown
              options={organizations}
              label={"Select Signal Center"}
              name="receiverOrg"
              value={values.receiverOrg}
              onChange={handleInputChange}
              error={errors.receiverOrg}
            />
          </Col>
          <Col xl={6}>
         
            <TextField
              name="receiver"
              placeholder={"To"}
              onChange={handleInputChange}
              type="receiver"
              error={errors.receiver}
              value={values.receiver}
              className="text-field-2"
            />
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
            <FormDropdown
              options={classification}
              label={"Select Classification"}
              name="classification"
              value={values.classification}
              onChange={handleInputChange}
            />
          </Col>
          <Col xl={6}>
            <FormDropdown
              options={precedence}
              label={"Select Precedence"}
              name="precedence"
              value={values.precedence}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
            <FormDropdown
              options={envelopSize}
              label={"Select Envelope size"}
              name="envelopSize"
              value={values.envelopSize}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Button
          label={"Send"}
          onClick={sendLetter}
          className={`small-btn`}
          wrapperClass="ml-auto"
        />
      </div>

      {
        <>
          <Modal
            isOpen={showModal}
            onClosed={() => setShowModal(false)}
            backdrop="static"
            keyboard={false}
            className="info-modal"
            centered
          >
            <ModalBody>
              Your mail with id {letterId} has been sent successfully.  Please download the QR code
              <div className="qr-code">
                <QRCodeCanvas
                  value={letterId}
                  size={128}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={false}
                  className=""
                  id="qrCodeEl"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                label="Download Slip"
                onClick={downloadQRCode}
                className={`small-btn `}
                wrapperClass="mx-auto"
              />
            </ModalFooter>
          </Modal>
          <div className="letter-details m-5 p-5" >
          </div>
         <img className="qrImg" style={{marginTop: '-90px',marginLeft: '80px'}}/>
        </>
      }
    </div>
  );
}

export default SendLetter;
