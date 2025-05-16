import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import data from '../../assets/data.json'

const Dashboard = () => {
  const [serverError, setServerError] = useState();
  const [loading, setLoading] = useState(false);
  const [plot, setPlot] = useState();
  const [ma100, setMA100] = useState();
  const [ma200, setMA200] = useState();
  const [prediction, setPrediction] = useState();
  const [mse, setMSE] = useState();
  const [rmse, setRMSE] = useState();
  const [r2, setR2] = useState();


  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axiosInstance.get("/protected/");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProtectedData();
  }, []);

  const predictStock = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/predict/", {
        ticker: data.ticker,
      });
      console.log(response.data);
      const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
      const plotUrl = `${backendRoot}${response.data.plot_img}`;
      const ma100Url = `${backendRoot}${response.data.plot_100_dma}`;
      const ma200Url = `${backendRoot}${response.data.plot_200_dma}`;
      const predictionUrl = `${backendRoot}${response.data.plot_prediction}`;
      setPlot(plotUrl);
      setMA100(ma100Url);
      setMA200(ma200Url);
      setPrediction(predictionUrl);
      setMSE(response.data.mse);
      setRMSE(response.data.rmse);
      setR2(response.data.r2);
      // Set plots
      if (response.data.error) {
        setServerError(response.data.error);
      }
    } catch (error) {
      console.error("There was an error making the API request", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <Formik
            initialValues={{ ticker: "" }}
            onSubmit={async (data) => await predictStock(data)}
            validationSchema={Yup.string().required("required").max(20, 'Maximum of 20 characters')}
          >
            <Form>
              <Field
                name="ticker"
                type="text"
                className="form-select"
                placeholder="Enter Stock Ticker"
                as="select"
              >
               
                <option value="" key={"first"}>::: Select A Company | Ticker :::</option>
                {data.map(tk => <option value={tk.ticker} key={tk.ticker}>{tk.company} | {tk.ticker}</option>)}
              </Field>
             
              <ErrorMessage name="ticker" component="small" />
              {serverError && <div className="text-danger">{serverError}</div>}
              <button type="submit" className="btn btn-info mt-3">
                {loading ? (
                  <span>
                    <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
                  </span>
                ) : (
                  "See Prediction"
                )}
              </button>
            </Form>
          </Formik>
        </div>

        {/* Print prediction plots */}
        {prediction && (
          <div className="prediction mt-5">
            <div className="p-3">
              {plot && <img src={plot} style={{ maxWidth: "100%" }} />}
            </div>

            <div className="p-3">
              {ma100 && <img src={ma100} style={{ maxWidth: "100%" }} />}
            </div>

            <div className="p-3">
              {ma200 && <img src={ma200} style={{ maxWidth: "100%" }} />}
            </div>

            <div className="p-3">
              {prediction && (
                <img src={prediction} style={{ maxWidth: "100%" }} />
              )}
            </div>

            <div className="text-light p-3">
              <h4>Model Evalulation</h4>
              <p>Mean Squared Error (MSE): {mse}</p>
              <p>Root Mean Squared Error (RMSE): {rmse}</p>
              <p>R-Squared: {r2}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
