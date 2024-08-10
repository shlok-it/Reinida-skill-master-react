import React, { useState, useEffect, useMemo } from "react";
import {
  call_secure_api,
  BaseUrl,
  call_secure_get_api,
} from "../../../connect/api.js";
import { toast } from "react-toastify";
import { useStateContext } from "../../../contexts/ContextProvider";
import "../index.css";
import { CardText, Modal, ModalBody, ModalHeader } from "reactstrap";
import { formatDateTime, formatTime } from "../../../helper/general.js";
const ViewDetail = (Props) => {
  const { currentUser } = useStateContext();
  const [headerLabel, setHeaderLabel] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // console.log(Props.employee);
    getAttendence();
  }, [currentUser]);
  const getAttendence = () => {
    setLoading(true);
    call_secure_get_api(
      `attendence/viewAttendance?month=${Props.search_date}&user_id=${Props.employee.user_id}`
    ).then(
      (resolve) => {
        if (resolve.status === true) {
          setDetails(resolve.data.details);
          setHeaderLabel(resolve.data.headerLabel);
          setLoading(false);
        } else {
          toast.error(resolve.message, "error", 5000);
          setDetails([]);
        }
      },
      (reject) => {
        toast.error("Server Error", "error", 5000);
      }
    );
  };

  const get_day_detail = (date) => {
    if (date.length > 0) {
      return date.map((item, index) => {
        if (item.created_at)
          return (
            <button
              key={index}
              className="btn btn-success"
              onClick={(e) => {
                Props.EditData(item);
              }}
            >
              {formatDateTime(item.created_at, "time")}
            </button>
          );
        else return "--";
      });
    } else {
      return "--";
    }
  };

  const getUserLeave = (date, type) => {
    if (date.length > 0) {
      return date.map((item, index) => {
        return (
          <span key={index} className="table-success p-1">
            {type == "userLeave" ? item.leavetype : item.leave_resion}
          </span>
        );
      });
    } else {
      return "";
    }
  };
  // const getOfficeLeave = (date) => {
  //   if (date.length > 0) {
  //     return date.map((item, index) => {
  //       return <span key={index}>{item.leave_resion}</span>;
  //     });
  //   } else {
  //     return "";
  //   }
  // };
  const cardtitle = (number, label) => {
    return (
      number &&
      label && (
        <div className="text-container m-2 p-3 text-dark text-center rounded">
          <strong className={" number fs-18"}>{number}</strong> <br />
          <span className="text p-2">{label}</span>
        </div>
      )
    );
  };
  return (
    <Modal
      size={"xl"}
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
              Props.model_handler(false);
            }}
          ></button>
        }
      >
        <CardText>
          <strong className="text-dark">
            {Props.employee.full_name} [{Props.employee.reg_code}] Attendence
            Details
          </strong>
        </CardText>
      </ModalHeader>
      <ModalBody>
        <div className="card radius-10">
          <div className="card-body">
            {"This Month"}  {Props.search_date}
           {headerLabel && <div className=" p-2 my-2  d-flex justify-content-sm-between border">
              {cardtitle(headerLabel.cl, "CL")}
              {cardtitle(headerLabel.pl, "PL")}
              {cardtitle(headerLabel.total_check_in, "Total Check In")}
              {cardtitle(headerLabel.total_check_out, "Total Check Out")}
              {cardtitle(headerLabel.total_sunday, "Sunday")}
              {cardtitle(headerLabel.user_leave, "User Leave")}
              {cardtitle(headerLabel.office_leave, "Office Leave")}
              {cardtitle(headerLabel.working_days, "Working Days")}
            </div>}
            <div className="table-responsive">
              <table
                className="table table-responsive-md table-striped table-bordered"
                style={{ width: "100%" }}
              >
                <thead className="table-light">
                  <tr valign="middle" align="center">
                    {/* <th>Month</th> */}
                    <th>Day</th>
                    <th>Date</th>
                    <th>Check IN</th>
                    <th>Check OUT </th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {details.length >= 0 ? (
                    details.map((item, index) => {
                      return (
                        <tr
                          align="center"
                          key={index}
                          className={item.day == "Sun" ? "table-danger" : ""}
                        >
                          <td>
                            <span>{item.day}</span>
                          </td>
                          <td className="col-width">
                            <span>{item.date}</span>
                          </td>
                          {(item.office_leave.length>0 || item.user_leave.length>0 )?'':<>
                          <td className="col-width">
                            {get_day_detail(item.check_in)}
                          </td>
                          <td className="col-width">
                            {get_day_detail(item.check_out)}
                          </td>
                          </>}
                          
                          <td className="text-wrap " colSpan={(item.user_leave.length>0||item.office_leave.length>0)?'3':''}>
                            {getUserLeave(item.user_leave, "UserLeave")}
                            {getUserLeave(item.office_leave, "officeleave")}
                          </td>
                          {/* <td>{item.remark || "---"}</td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default ViewDetail;
