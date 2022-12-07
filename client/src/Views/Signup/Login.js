import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import TextField from '../../Components/TextField';
import userImg from "../../Assets/icons/user.svg";
import lock from "../../Assets/icons/lock.svg";
import Button from '../../Components/Button';
import { useNavigate } from 'react-router-dom';
import { Constants } from '../../Configurations/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { Apis } from '../../Configurations/Api_endpoints';
import { toast } from "react-toastify";
import axios from 'axios';

const initialFormValues = {
    userName: "",
    password: "",
}
export default function Login(props) {
    const auth = useSelector((state) => {
        return state.auth.user;
      });
      const userName = auth?.userName;
      const dispatch=useDispatch();
    const navigate = useNavigate();
    const [values, setValues] = useState(initialFormValues);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const enableLoginonEnter = (e) => {
        if (e.key === "Enter") {
            handleClick();
        }
    }
    useEffect(() => {
        if (submitted) validate();
    }, [values]);
    useEffect(() => {
        if (userName) {  
                navigate("/home");
        }
    },[])
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
        setErrors({
            ...field
        });
        return isValid;
    };
    const handleClick = () => {
        setSubmitted(true);
        if (validate()) {
            setShowLoader(true);
            axios.post(`${Apis.login}`, {userName:values.userName,password:values.password}).then((res) => {
              setShowLoader(false)
                if (!res.isAxiosError && res.data) {
                    dispatch({ type: 'LOGIN',data: {userName:res.data[0].name,userOrg:res.data[0].orgId,userId:res.data[0].id} })
                    navigate("/home")
                }
                else
       toast.error("Invalid username or password", {autoClose:4000,});
              });
        
        }
    }
   
    return (
        <div className='login-container'>
            <Row>
                <Col lg={6} md={6} sm={12} className="form-wrapper">
                        <div className='logo-block' onClick={() => navigate("/home")}>
                       
                                {Constants.appName}
                          
                        </div>
                        <div className="intro-block">
                            <h1 >
                                {"Login"}
                            </h1>
                        </div>

                        <form className="signup-form" >
                            <TextField name="userName"
                                label={"Username"}
                                type="userName"
                                onChange={handleInputChange}
                                icon={userImg}
                                error={errors.userName}
                                value={values.userName}
                                onKeyUp={enableLoginonEnter}
                                className="mb-3"
                            />

                            <TextField name="password"
                                label={"Password"}
                                type="password"
                                onChange={handleInputChange}
                                icon={lock}
                                error={errors.password}
                                value={values.password}
                                onKeyUp={enableLoginonEnter}
                                className="mb-3"
                            />
                            <Button label={"Login"} onClick={handleClick} showBtnLoader={showLoader} className="w-100" wrapperClass="w-100" />
                        </form>
                </Col >
            </Row>
        </div >
    )
}
