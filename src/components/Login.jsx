import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import val from "../functions";
import axiosInstance from "../axiosInstance";

const Login = () => {
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async (formData, resetForm) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "token/", 
        formData
      );
      
      localStorage.setItem('csrfToken',response.data.csrfToken)
      localStorage.setItem('loggedIn','true')
      console.log("Login successful");
      setIsLoggedIn(true);
      navigate("/dashboard");
    } catch (error) {
      console.log(error)
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('csrfToken')
      setServerError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Formik properties

  const initialValues = { username: "", password: "" };
  const validationSchema = Yup.object({
    username: val("username"),
    password: val("password"),
  });

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 bg-light-dark p-5 rounded">
            <h3 className="text-light text-center mb-4">Login to our Portal</h3>
            <Formik
              initialValues={initialValues}
              onSubmit={async (data, { resetForm }) =>
                await handleLogin(data, resetForm)
              }
              validationSchema={validationSchema}
            >
              <Form>
                <div className="mb-3">
                  <Field
                    name="username"
                    type="text"
                    className="form-control"
                    placeholder="Username"
                  />
                  <ErrorMessage name="username" component="small" />
                </div>

                <div className="mb-3">
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Set Password"
                  />
                  <ErrorMessage name="password" component="small" />
                </div>

                {serverError && <div className="text-danger">{serverError}</div>}

                {loading ? (
                  <button
                    type="submit"
                    className="btn btn-info d-block mx-auto"
                    disabled
                  >
                    <FontAwesomeIcon icon={faSpinner} spin /> Logging in...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-info d-block mx-auto"
                  >
                    Login
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

export default Login;
