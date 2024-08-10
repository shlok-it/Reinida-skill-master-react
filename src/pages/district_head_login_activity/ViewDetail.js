import React, { useState, useEffect, useMemo } from "react";
import {
  call_secure_api,
  call_secure_get_api,
} from "../../connect/api.js";
import { toast } from "react-toastify";
import "../attendence/index.css";
import { CardText, Modal, ModalBody, ModalHeader } from "reactstrap";
import { formatDateTime, formatMonth } from "../../helper/general.js";
import Swal from 'sweetalert2';
const ViewDetail = (Props) => {
  const [details, setDetails] = useState([]);
  const [month, setMonth] = useState([]);
  const [loading, setLoading] = useState(false);
  const this_month = formatMonth(
    new Date(new Date().setMonth(new Date().getMonth()))
  )
  useEffect(() => {
    getdata();
  }, [month]);

  const getdata = () => {
    setLoading(true);
    call_secure_get_api(
      `district_head/get_activity?month=${month}&user_id=${Props.item.id}`
    ).then(
      (resolve) => {
        if (resolve.status === true) {
          setDetails(resolve.data.data);
          setMonth(resolve.data.month);
        } else {
          toast.error(resolve.message, "error", 5000);
          setDetails([]);
        }
        setLoading(false);
      },
      (reject) => {
        toast.error("Server Error", "error", 5000);
      }
    );
  }
  const deleteEmp = async (id) => {
    await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to sessions of this user ? `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((res) => {
      if (res.isConfirmed) {
          delete_emp(id);
      }  else if (res.isDismissed) {

      }
    });
  };

  const delete_emp = (id) => {
    call_secure_api('district_head/logoutOut', { 'user_id': id })
      .then(
        (resolve) => {
          if (resolve.status === true) {
            toast.success(resolve.message, 'success', 5000);
            getdata();
          }
          else {
            toast.error(resolve.message, 'error', 5000);
          }
        },
        (reject) => {
          console.log(reject);
          toast.error("Server Error", 'error', 5000);
        }
      )
  }
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
            {Props.item?.name} [{Props.item?.district?.name}] Login Details
          </strong>
        </CardText>
      </ModalHeader>
      <ModalBody>
        <div className="card radius-10">
          <div className="position-relative">
            <input
              type="month"
              max={this_month}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="form-control form-control-sm radius-30"
            />
          </div>
          <div className="card-body">
            {"This Month"}  {month}

            <div className="table-responsive">
              <table
                className="table table-responsive-md table-striped table-bordered"
                style={{ width: "100%" }}
              >
                <thead className="table-light">
                  <tr valign="middle" align="center">
                    <th>Date</th>
                    <th>Login IN</th>
                    <th>BrowserName</th>
                    <th>PlatformName</th>
                    <th>status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(details.length > 0) ? (
                    details.map((item, index) => {
                      return (
                        <tr
                          align="center"
                          key={index}
                        >

                          <td className="col-width">
                            <span>{formatDateTime(item.created_at)}</span>
                          </td>
                          <td className="col-width">
                            <span>{item.login_id}</span>
                          </td>
                          <td className="col-width">
                            <span>{item.browserName}</span>
                          </td>
                          <td className="col-width">
                            {item.platformName}
                          </td>
                          <td className="col-width">
                            <div>{item.session_status === "1" ?
                              <span className="badge rounded-pill text-success bg-light-success" ><i className='fa fa-circle me-1'></i>Active</span>
                              :
                              <span className="badge rounded-pill text-danger bg-light-danger" ><i className='fa fa-circle me-1'></i>Inactive</span>
                            }
                            </div>
                          </td>

                          <td className="text-wrap " >
                            {item.session_status === "1" ?
                              <button className="badge rounded-pill text-danger bg-light-danger" onClick={(e) => { deleteEmp(item.id) }} title="Cilck to logout"><i className='mdi mdi-logout me-1'></i>Logout</button>
                              : '--'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6}>No data found</td>
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
