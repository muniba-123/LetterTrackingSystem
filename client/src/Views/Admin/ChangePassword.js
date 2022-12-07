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
  userId: "",
  newPassword: "",
};
export default function ChangePassword(props) {
  const auth = useSelector((state) => {
    return state.auth.user;
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (submitted) validate();
  }, [values]);
  useEffect(() => {
    getUsers();
  },[]);
  const getUsers = () => {
    axios.get(`${Apis.getAllUsers}`, {}).then((res) => {
      setUsers(res.data);
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
    if (fieldValues.userId?.trim().length === 0) {
      field.userId = "Required";
      isValid = false;
    }

    if (fieldValues.newPassword?.trim().length === 0) {
      field.newPassword = "Required";
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
      axios.put(`${Apis.changePassword}`, { userId: Number(values.userId),newPassword:values.newPassword}).then((res) => {
        setShowLoader(false);
        if (!res.isAxiosError) {
          toast.info("User password changed successfully", { autoClose: 4000 });
          navigate("/home");
        } else toast.error("Error in changing password", { autoClose: 4000 });
      });
    }
  };
  return (
    <div className="create-user">
      <Row>
        <Col lg={6} md={6} sm={12} className="form-wrapper">
          <div className="intro-block mb-5">
            <h1>{"Change "}</h1>
          </div>

          <form className="signup-form">
            
             <FormDropdown
              options={users}
              label={"Select user"}
              name="userId"
              value={values.userId}
              onChange={handleInputChange}
              error={errors.userId}
            />
             <TextField
              name="newPassword"
              placeholder={"New Password"}
              type="text"
              onChange={handleInputChange}
              icon={lock}
              error={errors.newPassword}
              value={values.newPassword}
              className="text-field-2"
            />
            <Button
              label={"Change Password"}
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
