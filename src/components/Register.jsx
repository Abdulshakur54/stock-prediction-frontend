import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Formik, Field, Form, ErrorMessage } from "formik";
import val from "../functions";

import * as Yup from "yup";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API;
const Register = () => {
 
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('')

  const handleRegistration = async (formData, resetForm) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}register/`,
        formData
      );
      setSuccess(true);
      setServerError('')
      resetForm()
    } catch (error) {
      setSuccess(false)
      setServerError(JSON.stringify(error.response.data))
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 bg-light-dark p-5 rounded">
            <h3 className="text-light text-center mb-4">Create an Account</h3>
            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={Yup.object({
                username: val('username'),
                email: val('email'),
                password: val('password')
              })}
              onSubmit={async (data, {resetForm}) => await handleRegistration(data, resetForm)}
            >
              <Form>
                <div className="mb-3">
                  <Field name="username" type="text" className="form-control" placeholder="Username"/>
                  <ErrorMessage name="username" component="small"/>
                </div>
                <div className="mb-3">
                  <Field name="email" type="email" className="form-control" placeholder="Email address"/>
                  <ErrorMessage name="email" component="small"/>
                </div>
                <div className="mb-3">
                  <Field name="password" type="password" className="form-control" placeholder="Set Password"/>
                  <ErrorMessage name="password" component="small"/>
                </div>
                {success && (
                  <div className="alert alert-success">
                    Registration Successful
                  </div>
                )}

                {serverError && (<div className="alert alert-danger">
                    {serverError}
                  </div>)}
                {loading ? (
                  <button
                    type="submit"
                    className="btn btn-info d-block mx-auto"
                    disabled
                  >
                    <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-info d-block mx-auto"
                  >
                    Register
                  </button>
                )}
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
