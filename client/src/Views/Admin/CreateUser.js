import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import TextField from "../../Components/TextField";
import userImg from "../../Assets/icons/user.svg";
import lock from "../../Assets/icons/lock.svg";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import { Constants } from "../../Configurations/Constants";
import { useDispatch, useSelector } from "react-redux";
import { Apis } from "../../Configurations/Api_endpoints";
import { toast } from "react-toastify";
import axios from "axios";
import FormDropdown from "../../Components/FormDropdown";
const initialFormValues = {
  userName: "",
  password: "",
  orgId: null,
  status: 1,
};
export default function CreateUser(props) {
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  useEffect(() => {
    if (submitted) validate();
  }, [values]);
  useEffect(() => {
    getOrganizations();
  },[]);
  const getOrganizations = () => {
    axios.get(`${Apis.getOrganizations}`, {}).then((res) => {
      setOrganizations(res.data);
    });
  };
  const handleInputChange = ({ target }) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const validate = (fieldValues = values) => {
    let isValid = true;
    const field = {};
    if (fieldValues.userName?.trim().length === 0) {
      field.userName = "Required";
      isValid = false;
    }
    if (fieldValues.password?.trim().length === 0) {
      field.password = "Required";
      isValid = false;
    }
    debugger
    if (!fieldValues.orgId) {
      field.orgId = "Required";
      isValid = false;
    }
    setErrors({
      ...field,
    });
    return isValid;
  };
  const handleClick = () => {
    setSubmitted(true);
    if (validate()) {
      setShowLoader(true);
      axios.post(`${Apis.createUser}`, { ...values,userOrg:Number(values.orgId) }).then((res) => {
        setShowLoader(false);
        if (!res.isAxiosError) {
          toast.info("User created successfully", { autoClose: 4000 });
          navigate("/home");
        } else toast.error("Error in creating user", { autoClose: 4000 });
      });
    }
  };
  return (
    <div className="create-user">
      <Row>
        <Col lg={6} md={6} sm={12} className="form-wrapper">
          <div className="intro-block mb-5">
            <h1>{"Create new user"}</h1>
          </div>
          <form className="signup-form">
            <TextField
              name="userName"
              placeholder={"Username"}
              type="userName"
              onChange={handleInputChange}
              icon={userImg}
              error={errors.userName}
              value={values.userName}
              className="text-field-2"
            />
            <TextField
              name="password"
              placeholder={"Password"}
              type="text"
              onChange={handleInputChange}
              icon={lock}
              error={errors.password}
              value={values.password}
              className="text-field-2"
            />
             <FormDropdown
              options={organizations}
              label={"Select organization"}
              name="orgId"
              value={values.orgId}
              onChange={handleInputChange}
              error={errors.orgId}
            />
            <Button
              label={"Create user"}
              onClick={handleClick}
              showBtnLoader={showLoader}
              className="w-100"
              wrapperClass="w-100"
            />
          </form>
        </Col>
      </Row>
    </div>
  );
}
