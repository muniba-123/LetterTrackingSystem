import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Apis } from "../../Configurations/Api_endpoints";
import QrReader from "react-qr-scanner";
import {  useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import FormDropdown from "../../Components/FormDropdown";
import TextField from "../../Components/TextField";
import Button from "../../Components/Button";
import { toast } from "react-toastify";
import { getFormattedDate } from "../../Configurations/Constants";

const initialFormValues = {
  batchId: null,
  receivedBy: null,
  fromOrg: null,
};
function ReceiveBatch() {
  const auth = useSelector((state) => {
    return state.auth.user;
  });

  const [organizations, setOrganizations] = useState([]);
  const [values, setValues] = useState(initialFormValues);
  const [receivingMode, setReceivingMode] = useState(1);
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
  const markReceived = () => {
    setSubmitted(true);
    if (!validate()) return;
    const data = {
      receivedBy: values.receivedBy,
      batchId: Number(values.batchId),
      fromOrg: Number(values.fromOrg),
      receivedOn: getFormattedDate(new Date()),
    };
    axios.put(`${Apis.markBatchReceived}`, data, {}).then(res => {
      if (!res.isAxiosError) {
        toast.info("Batch marked as received", {
          onClose: () => navigate("/trackBatch"),
          autoClose: 3000,
        });
      } else {
       if(res.status===404)
       toast.error("Batch not found", {autoClose:3000,});
        console.log("Error");
      }
    });
  };
  const handleError = (err) => {
    console.error(err);
  };
  const handleScan = (data) => {
    if (data?.text?.length > 0) setValues({ ...values, batchId: data.text });
  };
  const validate = (fieldValues = values) => {
    let isValid = true;
    const field = {};
    if (!fieldValues.fromOrg) {
      field.fromOrg = "Required";
      isValid = false;
    }

    if (fieldValues.batchId?.trim().length === 0) {
      field.batchId = "Required";
      isValid = false;
    }
    if (fieldValues.receivedBy?.trim().length === 0) {
      field.receivedBy = "Required";
      isValid = false;
    }
    setErrors({
      ...field,
    });
    return isValid;
  };
  useEffect(() => {
    setValues({ ...values, batchId: null });
  }, [receivingMode]);
  return (
    <div className="container">
      <div className="heading-block">
        <Button
          label={"Back"}
          onClick={() => navigate("/home")}
          className={`small-btn`}
        />
        <h3>Receive batch</h3>
      </div>
      <div className="d-flex justify-content-center">
        <div
          onClick={() => setReceivingMode(1)}
          className={`tab ${receivingMode === 1 ? "active" : ""}`}
        >
          Receive by ID
        </div>
        <div
          onClick={() => setReceivingMode(2)}
          className={`tab ${receivingMode === 2 ? "active" : ""}`}
        >
          Receive by QR Code
        </div>
      </div>

      {receivingMode === 2 && (
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
              name="batchId"
              placeholder={"Batch ID"}
              type="number"
              error={errors.batchId}
              value={values.batchId}
              className="text-field-2"
              disabled={receivingMode === 2}
              onChange={handleInputChange}
            />
          </Col>
          <Col xl={6}>
            <FormDropdown
              options={organizations}
              label={"Received from"}
              name="fromOrg"
              value={values.fromOrg}
              onChange={handleInputChange}
              error={errors.fromOrg}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={6}>
            <TextField
              name="receivedBy"
              placeholder={"Received By"}
              onChange={handleInputChange}
              type="text"
              error={errors.receivedBy}
              value={values.receivedBy}
              className="text-field-2"
            />
          </Col>
        </Row>
        <Button
          label={"Mark Received"}
          onClick={markReceived}
          className={`small-btn`}
          wrapperClass="ml-auto"
        />
      </div>
    </div>
  );
}

export default ReceiveBatch;
