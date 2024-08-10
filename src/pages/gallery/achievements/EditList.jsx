import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText,
} from "reactstrap";
import { call_secure_api,call_secure_get_api, BaseUrl } from "../../../connect/api.js";
import { toast } from "react-toastify";
const EditList = (props) => {
  const [loading, setLoading] = useState(false);

  const [apiurl, setApiurl] = useState("achievements/updateImage");
  const [categoryName, setCategoryName] = useState([]);
  const [values, setValues] = useState({
    id: props.employee.id,
    image_link: "",
    title: props.employee.title,
    name: props.employee.name,
    status: props.employee.status,
    sequence: props.employee.sequence,
  });
  useEffect(() => {
    if (props.employee !== undefined && props.employee.id) {
      setApiurl("achievements/updateImage");
    }
  }, []);

  const submitThis = (e) => {
    e.preventDefault();
    if (values.image_link == "") {
      toast.error("Please choose Image");
    } else {
      setLoading(true);
      call_secure_api(apiurl, values).then(
        (resolve) => {
          if (resolve.status === true) {
            toast.success(resolve.message);
            props.model_handler(true);
          } else {
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
        <CardText>Update Image</CardText>
      </ModalHeader>
      <ModalBody>
        <form action="" onSubmit={submitThis}>
          <div className="row">
        
            <div className="col-md-12 form-group">
              <label className="col-form-label form-label">
                 Image <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                name="image_link"
                accept="image/*"
                onChange={(e) =>
                  convertToBase64(e.target.files[0], "image_link")
                }
              /> <br />
              <span className="text-danger">Note</span>: Image size should not exceed 1 MB
            </div>
            {(values.image_link || props.employee.image_link) && (
              <div className="col-md-12 form-group">
                <img
                  alt="Not found"
                  width={"150px"}
                  src={
                    values.image_link ||
                    BaseUrl.resource_url + "/" + props.employee.image_link
                  }
                />
              </div>
            )}
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
export default EditList;
