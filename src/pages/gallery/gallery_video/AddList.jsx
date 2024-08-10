import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText,
} from "reactstrap";
import {
  call_secure_api,
} from "../../../connect/api.js";
import { toast } from "react-toastify";
const AddList = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [apiurl, setApiurl] = useState("gallery/addVideo");

  const [values, setValues] = useState({
    id: "",
    title: "",
    v_id: "",
    v_link: "",
    status: "1",
  });
  useEffect(() => {
    if (props.employee !== undefined && props.employee.id) {
      setApiurl("gallery/updateVideo");
      setValues((oldValues) => ({
        ...oldValues,
        ...props.employee,
      }));
    }
  }, []);

  const submitThis = (e) => {
    e.preventDefault();
    if (values.v_id == "") {
      toast.error("Please fill video id");
    } else if (values.v_link == "") {
      toast.error("Please  fill video link");
    } else {
      setLoading(true);
      call_secure_api(apiurl, values).then(
        (resolve) => {
          if (resolve.status === true) {
            toast.success(resolve.message);
            props.model_handler(true);
          } else {
            if(resolve.data){
              setError(resolve.data);
            }else{
              setError([]);
            }
            toast.error(resolve.message);
          }
          setLoading(false);
        },
        (reject) => {
          console.log(reject);
          toast.error("Server Error");
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

  const sameData = (e) => {
    if (e.target.checked) {
      setValues((oldValues) => ({ ...oldValues, status: 1 }));
    } else {
      setValues((oldValues) => ({ ...oldValues, status: 0 }));
    }
    return () => {};
  };
  const convertToBase64 = (files, name) => {
    if (files && files != "remove") {
      const reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = () => {
        setValues((oldValues) => ({ ...oldValues, [name]: reader.result }));
      };
    } else {
      setValues((oldValues) => ({ ...oldValues, [name]: "" }));
    }
  };
  return (
    <Modal
      size={"md"}
      fade={false}
      isOpen={true}
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader
        close={
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              props.model_handler(false);
            }}
          ></button>
        }
      >
        <CardText>Add Video Link</CardText>
      </ModalHeader>
      <ModalBody>
        <form action="" onSubmit={submitThis}>
          <div className="row">
          <div className="col-md-12 form-group">
              <label className="col-form-label form-label">
                Title 
              </label>
              <input
                className="form-control form-control-sm text-capitalize"
                type="text"
                value={values.title}
                placeholder="title"
                name="title"
                onChange={set("title")}
                maxLength={100}
              />
              {error['title']&&<label className="text-danger">{error['title']}</label>}
            </div>
            <div className="col-md-12 form-group">
              <label className="col-form-label form-label">
                Video Id 
              </label>
              <input
                className="form-control form-control-sm"
                type="text"
                value={values.v_id}
                placeholder="Video Id "
                name="v_id"
                onChange={set("v_id")}
                maxLength={100}
              />
                {error['v_id']&&<label className="text-danger">{error['v_id']}</label>}
            </div>
            <div className="col-md-12 form-group">
              <label className="col-form-label form-label">
                Video Link 
              </label>
              <input
                className="form-control form-control-sm "
                type="url"
                value={values.v_link}
                placeholder="Video Link "
                name="v_link"
                onChange={set("v_link")}
                maxLength={100}
              />
              {error['v_link']&&<label className="text-danger">{error['v_link']}</label>}
            </div>    
          
            <div className="col-md-12 form-group">
              <div className="form-check">
                <label className="col-form-label form-label">Status</label>
                <input
                  type="checkbox"
                  name="sameAddress"
                  className="form-check-input"
                  value={values.status}
                  checked={values.status == 1 ? true : false}
                  onChange={(e) => sameData(e)}
                />
              </div>
              {error['status']&&<label className="text-danger">{error['status']}</label>}
            </div>
          </div>
          <div className="text-center py-3">
            <button
              type="submit"
              disabled={loading}
              className="border-0 btn btn-primary btn-gradient-primary btn-rounded"
            >
              {loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Save
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
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
export default AddList;
