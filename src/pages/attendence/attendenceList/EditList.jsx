import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText,
} from "reactstrap";
import { call_secure_api, BaseUrl } from "../../../connect/api.js";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const EditList = (props) => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    id: props.employee.id,
    name: props.employee.name,
    image_link: "",
    status: props.employee.status,
    sequence: props.employee.sequence,
  });
  useEffect(() => {
  }, [values]);


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
        <CardText><strong className="text-success">Check {props.employee.phototype} {props.employee.created_at}</strong></CardText>
      </ModalHeader>
      <ModalBody>
          <div className="row">
            {(values.image_link || props.employee.image_link) && (
              <div className="col-md-12 text-center">
                <img
                  alt="Not found"
                  width={"100%"}
                  className='image-borded'
                  src={
                    values.image_link ||
                    BaseUrl.resource_url + "/" + props.employee.image_link
                  }
                />
                <div className="location_map">
                  {props.employee.location ? (
                        <div className="location_info">
                          <div>
                            
                            {props.employee.location["latitude"]
                              ? props.employee.location["latitude"]
                              : ""}
                            {props.employee.location["longitude"]
                              ? ", " + props.employee.location["longitude"]
                              : ""}
                            {props.employee.location["areasOfInterest"]
                              ? props.employee.location["areasOfInterest"].map((val,i)=>{
                                return(
                                <div key={i}>
                                    {val?", "+val:''}
                                </div>);
                              })
                              : ""}
                            {props.employee.location["subLocality"]
                              ? ", " + props.employee.location["subLocality"]
                              : ""}
                            {props.employee.location["locality"]
                              ? ", " + props.employee.location["locality"]
                              : ""}
                            {props.employee.location["countryName"]
                              ? ", " + props.employee.location["countryName"]
                              : ""}
                            {props.employee.location["postalCode"]
                              ? ", " + props.employee.location["postalCode"]
                              : ""}
                          </div>
                        </div>
                      ) : (
                        ""
                      )} 
                </div>
                <div className="devide_map">
                  {props.location ? (
                        <div className="location_info">
                          <div>
                            {props.location["longitude"]
                              ? props.location["longitude"]
                              : ""}
                            {props.location["longitude"]
                              ? ", " + props.location["longitude"]
                              : ""}
                            {props.location["subLocality"]
                              ? ", " + props.location["subLocality"]
                              : ""}
                            {props.location["locality"]
                              ? ", " + props.location["locality"]
                              : ""}
                            {props.location["countryName"]
                              ? ", " + props.location["countryName"]
                              : ""}
                            {props.location["postalCode"]
                              ? ", " + props.location["postalCode"]
                              : ""}
                          </div>
                        </div>
                      ) : (
                        ""
                      )} 
                </div>
              </div>
            )}
          </div>
          <div className="text-center py-3">
            
            &nbsp;&nbsp;
            <button
              type="button"
              onClick={() => {
                props.model_handler(false);
              }}
              className="btn btn-secondary btn-rounded"
            >
              close
            </button>
          </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
export default EditList;
