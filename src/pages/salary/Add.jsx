import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText,
} from "reactstrap";
import { call_secure_api } from "../../connect/api.js";
import { toast } from "react-toastify";
import { formatMonth } from "../../helper/general.js";
const Add = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const this_month = formatMonth(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [values , setValues] = useState({'month':this_month});
  const submitForm = (e) => {
    e.preventDefault();
    if (values.month=='') {
      toast.error("Please select month Name");
    }  else {
      setLoading(true);
      call_secure_api("salary/generate", values).then(
        (resolve) => {
          if (resolve.status === true) {
            toast.success(resolve.message, "success", 5000);
            props.model_handler(true);
          } else {
            // setError(resolve.data)
            toast.error(resolve.message, "error", 5000);
          }
          setLoading(false);
        },
        (reject) => {
          console.log(reject);
          toast.error("Server Error", "error", 5000);
          setLoading(false);
        }
      );
    }
  };

  const set = (name) => {
    return ({ target: { value } }) => {
      setValues((oldValues) => ({ ...oldValues, [name]: value }));
    };
  };

  return (
    <Modal
      size={"sm"}
      fade={false}
      isOpen={true}
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader
        close={
          <button
            type={"button"}
            className="btn-close"
            onClick={() => {
              props.model_handler(false);
            }}
          ></button>
        }
      >
        <CardText>Generate Payment</CardText>
      </ModalHeader>
      <ModalBody>
        <form action="" onSubmit={submitForm}>
          <div className="row">
            <div className="col-sm-12">
              <label className="col-form-label form-label">
                Select Month <span className="text-danger">*</span>
              </label>
              <input type="month" max={this_month} value={values.month} name="month" onChange={(e) => set('month')} className="form-control form-control-sm radius-30" />
              {error['month']&&<label className="text-danger">Select Month  are required</label>}
            </div>
          </div>
          <div className="text-center pt-3 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
            >
              {loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Generage
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              onClick={() => {
                props.model_handler(false);
              }}
              className="btn btn-secondary btn-rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </ModalBody>
      {/* <ModalFooter></ModalFooter> */}
    </Modal>
  );
};
export default Add;
