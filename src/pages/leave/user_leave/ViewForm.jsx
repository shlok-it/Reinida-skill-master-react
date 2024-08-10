import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText,
} from "reactstrap";
import { dateDiffer } from "../../../helper/general.js";
const ViewForm = (props) => {
  return (
    <Modal
      size={"lg"}
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
        <CardText className="card-title">
            {props.employee.full_name} - {props.employee.reg_code} 
            <span
                className={
                  (props.employee.updated_type == "Accept"
                    ? "bg-success "
                    : props.employee.updated_type == "Pending"
                    ? "bg-warning "
                    : "bg-danger ") +" text-white p-3 rounded ms-3 fs-13"
                }
              >
               Status: {props.employee.updated_type}
              </span>
        </CardText>
      </ModalHeader>
      <ModalBody>
        <div className="card border px-3 pb-3">
          <div className="row ">
            <div className="col-12 bg-white">
              <div className="p-2 rounded d-flex">
                <div className="text-container bg-success m-2 p-3 text-light text-center rounded">
                  <span className={" number"}>{props.employee.created_at}</span>{" "}
                  <br />
                  <span className="text p-2"> Submited date</span>
                </div>
                <div className="text-container bg-danger m-2 p-3 text-light text-center rounded">
                  <span className={" number"}>
                    <strong className="my-2 p-2 ">
                      {props.employee.date_from} - {props.employee.date_to}
                    </strong>
                  </span>
                  <br />
                  <span className="text p-2"> Leave Applyed </span>
                </div>
                <div className="text-container bg-primary m-2 p-3 text-light text-center rounded">
                  <span className={" number"}>
                    <strong className="my-2 p-2 ">
                      {dateDiffer(
                        props.employee.date_from,
                        props.employee.date_to
                      )}
                    </strong>
                  </span>
                  <br />
                  <span className="text p-2"> Total Leave Day </span>
                </div>
                <div className="text-container bg-dark m-2 p-3 text-light text-center rounded">
                  <span className={" number"}>
                    <strong className="my-2 p-2 ">
                      {props.employee.leavetype}
                    </strong>
                  </span>
                  <br />
                  <span className="text p-2">Leave Type </span>
                </div>
              </div>
              <div className="detail-section rounded">
                <h5>Details</h5>
                <div className="card-text">{props.employee.detail}</div>
              </div>
              {props.employee.application_photo && (
                <div className="p-2 m-2" >
                    <img onClick={()=>props.showImage(props.employee.application_photo)}
                      src={props.url + "/" + props.employee.application_photo}
                      className="prevImage c-pointer"
                    ></img>
                </div>
              )}
            </div>
            <div className="col-12 mt-5 bg-light">
              <div className=" rounded text-primary ">
                <div className="ps-4 pt-3">
                  Leave Status &nbsp;
                  <strong>
                    {props.session_year[0] + "-" + props.session_year[1]}
                  </strong>
                </div>
                <div className=" bg-white p-2 m-2 rounded d-flex justify-content-sm-between ">
                  {props.leaveStatus.map((leave, index) => {
                    return (
                      <div
                        className="text-container  m-2 p-3 text-dark text-center rounded"
                        key={index}
                      >
                        <strong className={leave.class + " number fs-18 "}>
                          {leave.number}
                        </strong>{" "}
                        <br />
                        <span className="text p-2">{leave.name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="ps-4 ">
                  Application Status &nbsp;
                </div>
                <div className=" p-2 m-2 rounded d-flex justify-content-sm-between  bg-white">
                  {props.applicationStatus.map((leave, index) => {
                    return (
                      <div
                        className="text-container m-2 p-3 text-dark text-center rounded"
                        key={index}
                      >
                        <strong className={leave.class + " number fs-18"}>
                          {leave.number}
                        </strong>{" "}
                        <br />
                        <span className="text p-2">{leave.name}</span>
                      </div>
                    );
                  })}
                </div>
                {props.employee.updated_by && props.employee.updated_date && (
                  <div className="d-flex justify-content-sm-end">
                    <div></div>
                  <div className="text-right pe-3">
                    <strong>Updated by</strong> &nbsp;&nbsp;
                    {props.employee.updated_by} &nbsp;
                    {props.employee.updated_date}
                  </div>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        {props.isbutton && (
          <div className="card-footer">
            <button
              className="btn btn-primary"
              onClick={() => props.handleStatus(props.employee, "Accept")}
            >
              Accept
            </button>
            <button
              className="btn btn-danger ms-3"
              onClick={() => props.handleStatus(props.employee, "Reject")}
            >
              Reject
            </button>
          </div>
        )}
      </ModalFooter>
    </Modal>
  );
};
export default ViewForm;
