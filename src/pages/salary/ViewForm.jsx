import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText,
} from "reactstrap";
import { toast } from "react-toastify";
import BaseUrl from "../../connect/Config";
import {
  convertNumberToWords,
  formatDate,
  formatMonth,
} from "../../helper/general";
import { call_secure_get_api } from "../../connect/api";
const ViewForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [userLeave, setUserLeave] = useState([]);
  const [userLeaveYear, setUserLeaveYear] = useState([]);

  useEffect(() => {
    const userLeave = (user_id) => {
      call_secure_get_api(`salary/getUserLeave?user_id=${user_id}`).then(
        (resolve) => {
          if (resolve.status === true) {
            setUserLeaveYear(resolve.data.user_leave_year);
            setUserLeave(resolve.data.userTotalLeave);
          } else {
            toast.error(resolve.message, "error", 5000);
          }
        },
        (reject) => {
          toast.error("Server Error", "error", 5000);
        }
      );
    };
    if (props.item.user_id) {
      userLeave(props.item.user_id);
    }
  }, [props.item.user_id]);
  const print = (e) => {
    e.preventDefault();
    var content = document.getElementById("print_content");
    var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    // var pri = document.getElementById("print_content").contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  };

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
        <CardText>Salary Slip</CardText>
      </ModalHeader>
      <ModalBody>
        <div className="container-phone">
          <iframe
            id="ifmcontentstoprint"
            style={{ height: "0px", width: "0px", position: "absolute" }}
          ></iframe>
          <div
            id="print_content"
            className="container"
            style={{ border: "1px solid #2d2f8b" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: `space-between`,
                margin: "5px 0 0 0px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <img
                  src={props.logo}
                  alt="Logo"
                  style={{
                    height: "44px",
                    width: "auto",
                  }}
                />
              </div>
              <div>
                <img
                  src={props.isita_foundation}
                  alt="isita_foundation"
                  style={{
                    height: "60px",
                    width: "auto",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                padding: "10px",
                textAlign: "center",
                fontSize: "12px",
              }}
            >
              <strong
                style={{
                  fontSize: "24px",
                }}
              >
                {" "}
                Reindia Technology Service Pvt. Ltd.
              </strong>{" "}
              <br />
              <strong
                style={{
                  fontSize: "18px",
                }}
              >
                Reindia skill one step skill for life
              </strong>
              <br />
              <strong> 2nd floor RDK Tower, Nearby Diwan Hospital,</strong>
              <br />
              <strong>
                {" "}
                Bhatagaon Chowk Raipur Chhattisgarh India 492001{" "}
              </strong>
            </div>
            <div
              style={{ textAlign: "center", padding: "10px", margin: " 10px" }}
            >
              <span
                style={{
                  textAlign: "center",
                  padding: "10px",
                  margin: " 10px 0px 20px 0px",
                  fontSize: "28px",
                  fontWeight: "600",
                  border: "1px solid gray",
                  borderRadius: "9px",
                  boxShadow: "0px 4px 0 0",
                }}
              >
                Pay Slip {formatMonth(props.month, "month_name")}
              </span>
            </div>
            <div style={{ margin: "10px 0px" }}>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid #2d2f8b",
                }}
              >
                <tbody
                  style={{
                    fontSize: "14px",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Employee Name
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.full_name}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Total Working Days
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.total_working_days}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Employee ID
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.employee_id}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      LWP Days
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.lwp}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Designation
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.designation}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Paid Days
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.total_paid_days}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Date of Joining
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.joinig_date}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Bank Name
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.bank_name}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Basic Salary
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.basic_salary}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Bank A/c No
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.ac_no}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      UAN
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.uan}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      IFSC Code
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.ifsc}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b> Earning</b>
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>Deductions</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Basic Salary
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.basic_salary}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      EPF(12%)
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.epf}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      House Rent Allowances
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.house_rent_allowances}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Health Insurance/ESIC (0.75%)
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.health_ensurance}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Conveyance Allowances
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.conveyance_allowances}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Professional Tax
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.professional_tax}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Personal Allowances
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.personal_allowances}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      If 80 G (Act)
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.if_80_g_act}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Special Allowances
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.special_allowances}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Gratuity
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.gratuity}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Satutory Bonus
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.satutory_bonus}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      {props.item.half_day_deduction > 0 && (
                        <>
                          Half Days (
                          {props.item.half_day > 1
                            ? props.item.half_day + "Days"
                            : props.item.half_day + "day"}
                          )
                        </>
                      )}
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >{props.item.half_day_deduction > 0 &&
                      <b>{props.item.half_day_deduction}</b>
                      }
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Gross Salary
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.gross_salary}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      {props.item.id_uniform > 0 && "ID & Uniform"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>
                        {props.item.id_uniform > 0 && props.item.id_uniform}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    ></td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Net Salary
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.net_pay}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Total Deductions
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.item.total_deduction}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Amount in Word
                    </td>
                    <td
                      colSpan={3}
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{convertNumberToWords(props.item.net_pay)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      CL
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{userLeave.cl + " / " + userLeaveYear.cl}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      PL
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{userLeave.pl + " / " + userLeaveYear.pl}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                style={{
                  border: "1px solid #2d2f8b",
                  padding: "8px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  fontFamily: "monospace",
                }}
              >
                <p>
                  {" "}
                  Note: - Your {formatMonth(
                    props.month,
                    "only_month_name"
                  )}{" "}
                  month salary is settled
                </p>
              </div>
            </div>
            <div
              style={{
                marginLeft: "10px 0px",
              }}
            >
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{ padding: "8px", fontSize: "18px", width: "30%" }}
                    >
                      <h5 style={{ color: "#2d2f8b" }}>
                        आओ <span style={{ color: "#ffa221" }}>हम</span> सब{" "}
                        <span style={{ color: "#ffa221" }}>पढ़ें-</span>पढ़ाएँ !
                      </h5>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        fontSize: "16px",
                        width: "30%",
                      }}
                    >
                      <h5 style={{ color: "#2d2f8b" }}>
                        हर <span style={{ color: "#ffa221" }}>कदम</span> कौशल{" "}
                        <span style={{ color: "#ffa221" }}>विकास</span> की ओर !
                      </h5>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center">
            <button
              className="btn btn-info fs-18 mt-5"
              onClick={(e) => print(e)}
            >
              Print
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default ViewForm;
