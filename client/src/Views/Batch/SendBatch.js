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
import { useSelector } from "react-redux";
import QrReader from "react-qr-scanner";
import img1 from '../../Assets/images/s-img2.jpg';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { Table } from "../../Components/Table";
const initialFormValues = {
  title: "",
  createdOn: new Date(),
  receiverOrg: null,
};
let stopScanning = false;
function SendBatch() {
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  const userId = auth?.userId;
  const userOrg = auth?.userOrg;
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAddLetterView, setShowAddLetterView] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState(initialFormValues);
  const [organizations, setOrganizations] = useState([]);
  const [letterIds, setLetterIds] = useState([]);
  const [currLetterId, setCurrLetterId] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [letterDetails, setLetterDetails] = useState({});
  const [mode, setMode] = useState(1);

  useEffect(() => {
    if (submitted) validate();
  }, [values]);
  const navigate = useNavigate();
  const handleInputChange = ({ target }) => {
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
  const handleError = (err) => {
    console.error(err);
  };
  const handleScan = async (data) => {
    debugger;
    if (stopScanning) return;
    if (data?.text?.length > 0) {
      await getLetterDetails(data.text);
      debugger;
    }
  };
  const getOrgNameFromId = (id) => {
    const index = organizations.map((org) => org.id).indexOf(Number(id));
    if (index !== -1) return organizations[index].name;
    return null;
  };
  const getOrganizations = () => {
    axios.get(`${Apis.getOrganizations}`, {}).then((res) => {
      setOrganizations(res.data);
    });
  };
  const getLetterDetails = (id) => {
    const index = letterIds.indexOf(Number(id));
    if (index !== -1) {
      alert("This letter is already in the list");
      return;
    }
    stopScanning = true;
    axios.get(`${Apis.trackLetter}${id}`, {}).then((res) => {
      stopScanning = false;
      setCurrLetterId("");
      if (!res.isAxiosError && res?.data?.length>0) {
        const letters = [...letterIds];
        letters.push(Number(id));
        setLetterIds(letters);
        setLetterDetails({ ...letterDetails, [id]: res.data[0] });
      } else
        toast.error(`Letter with id ${id} not found in database`, {
          autoClose: 3000,
        });
    });
  };
  const validate = (fieldValues = values) => {
    let isValid = true;
    const field = {};
    if (fieldValues.title?.trim().length === 0) {
      field.title = "Required";
      isValid = false;
    }
    if (!fieldValues.receiverOrg) {
      field.receiverOrg = "Required";
      isValid = false;
    }
    setErrors({
      ...field,
    });
    return isValid;
  };
  const sendBatch = () => {
    setSubmitted(true);
    if (!validate()) return;
    const data = {
      userId,userOrg,
      title: values.title,
      createdOn: getFormattedDate(values.createdOn),
      receiverOrg: Number(values.receiverOrg),
      letters: letterIds,
    };
    axios.post(`${Apis.sendBatch}`, data, {}).then((res) => {
      if (!res.isAxiosError) {
        setBatchId(res.data.batchId);
        setShowModal(true);
      } else console.log("Error");
    });
  };
  const downloadTSlip = () => {
    const qrCodeURL = document.getElementById("qrCodeEl").toDataURL("image/png").replace("image/png", "image/octet-stream");
    let aEl = document.querySelector("img.qrImg");
aEl.src = qrCodeURL;
    const e1 = document.querySelector(".letter-details");
    if (e1) {
      e1.style.visibility = false;
      e1.innerHTML = `<b>Batch ID:</b> ${batchId} <br/><b>From:</b> ${getOrgNameFromId(userOrg)} <br/><b>To:</b> ${getOrgNameFromId(values.receiverOrg
      )} <br/><b>Date:</b> ${getFormattedDate(new Date(), "mm/dd/yyyy")}<br/><b>Number of letters:</b> ${letterIds.length}`;
      e1.append(aEl);
      html2canvas(e1, {}).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "in",
          format: [6, 3],
        }); 
        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save(`Batch-${batchId}.pdf`);
      });
    }
    setShowModal(false);
   navigate("/home");
  };
  const columns = [
    {
      dataField: "letterId",
      text: "Id",
      isKey: true,
    },
    {
      dataField: "fromOrg",
      text: "From",
      formatter: (cell, row, e) => getOrgNameFromId(row.fromOrg),
    },
  ];
  const convertObjToArray = (obj) => {
    const arr = [];
    Object.keys(obj).map((key) => arr.push(obj[key]));
    return arr;
  };
  return (
    <div className="container send-batch">
      <div className="heading-block">
        <Button
          label={"Back"}
          onClick={() => navigate("/trackBatch")}
          className={`small-btn`}
        />
        <h3>Send new batch</h3>
      </div>

      <div className="form-wrap">
        <Row>
          <Col xl={3}>
            <TextField
              name="title"
              placeholder={"Title"}
              onChange={handleInputChange}
              type="title"
              error={errors.title}
              value={values.title}
              className="text-field-2"
            />
          </Col>
          <Col xl={3}>
            <TextField
              name="createdOn"
              placeholder={"Date"}
              onChange={handleInputChange}
              type="date"
              error={errors.createdOn}
              value={values.createdOn}
              className="text-field-2"
              disabled
            />
          </Col>
          <Col xl={3}>
            <FormDropdown
              options={organizations}
              label={"Select Receiver Organization"}
              name="receiverOrg"
              value={values.receiverOrg}
              onChange={handleInputChange}
              error={errors.receiverOrg}
            />
          </Col>
            <Col xl={3}>
            <Button
              label={"Add Letters to batch"}
              onClick={() => setShowAddLetterView(true)}
              className={`small-btn`}
              wrapperClass=""
            />
          </Col>
        </Row>
      </div>
      {showAddLetterView && (
        <>
          <Row>
            <Col xl={6}>
              {/* <h3>Add letters to batch</h3> */}
              <div className="d-flex">
                <div
                  onClick={() => setMode(1)}
                  className={`tab ${mode === 1 ? "active" : ""}`}
                >
                  Use LTR ID
                </div>
                <div
                  onClick={() => setMode(2)}
                  className={`tab ${mode === 2 ? "active" : ""}`}
                >
                  Scan QR Code
                </div>
              </div>

              {mode === 2 ? (
                <>
                  {!stopScanning ? (
                    <QrReader
                      delay={1000}
                      onError={handleError}
                      onScan={handleScan}
                      className="qr-scan"
                    />
                  ) : (
                    <>
                      <div className="qr-scan">
                        Please wait while details for current letter are being
                        fetched
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="d-flex my-5">
                  <TextField
                    name="currLetterId"
                    placeholder={"Enter Ltr ID"}
                    type="number"
                    onChange={(e) => setCurrLetterId(e.target.value)}
                    value={currLetterId}
                    className="text-field-2"
                  />
                  <Button
                    label={"Go"}
                    onClick={() => getLetterDetails(currLetterId)}
                    className={`small-btn `}
                    wrapperClass="ml-3"
                    disabled={
                      !currLetterId || currLetterId === "" || stopScanning
                    }
                  />
                </div>
              )}
            </Col>
            <Col xl={6}>
              <Table
                data={convertObjToArray(letterDetails)}
                columns={columns}
                search={false}
              />
            </Col>
          </Row>
        </>
      )}
      {letterIds.length > 0 && (
        <Button
          label={"Send Batch"}
          onClick={sendBatch}
          className={`small-btn`}
          wrapperClass="ml-auto"
        />
      )}
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
              Your batch with id {batchId} has been sent successfully.  Please download the TSlip
              <div className="qr-code">
                <QRCodeCanvas
                  value={batchId}
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
                label="Download TSlip"
                onClick={downloadTSlip}
                className={`small-btn `}
                wrapperClass="mx-auto"
              />
            </ModalFooter>
          </Modal>
          <div className="letter-details m-5 p-5" >
          </div>
          <div className="d-none">
 <img className="qrImg" style={{marginTop: '-90px',marginLeft: '80px'}}/>
          </div>
        
       
        </>
      }
    </div>
  );
}

export default SendBatch;
