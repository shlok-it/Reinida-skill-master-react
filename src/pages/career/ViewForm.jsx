import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText,
} from "reactstrap";
import { call_secure_api, BaseUrl } from "../../connect/api.js";
import { toast } from "react-toastify";
const ViewForm = (props) => {
  const [loading, setLoading] = useState(false);

  const [apiurl, setApiurl] = useState("career/updateImage");
  const [values, setValues] = useState({
    id: props.employee.id,
    image_link: "",
    status: props.employee.status,
    sequence: props.employee.sequence,
    type: props.employee.type,
    links: props.employee.links,
  });
  useEffect(() => {
    if (props.employee !== undefined && props.employee.id) {
      setApiurl("career/updateImage");
    }
  }, []);
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
        <CardText>Candidate detail</CardText>
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
                margin: "10px 0px",
                border: `1px solid #2d2f8b`,
                padding: `10px`,
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
                    marginBottom: "10px",
                    width: "auto",
                  }}
                />
                <p>
                  <strong>2nd floor RDK Tower, Near by Diwan Hospital,</strong>
                  <br />
                  <strong>
                    Bhatagaon Chowk Raipur Chhattisgarh(CT) India 492001
                  </strong>
                  <br />
                  <strong>
                    Web:- www.reindiaskill.com Email:-info@reindiaskill.com
                  </strong>
                  <br />
                  <strong>Contact: 011-69290-362</strong>
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <h4 style={{ textAlign: "left", color: "red" }}>
                  CIN: U80301CT2022PTC013238
                </h4>
                <img
                  src={props.make_in_india}
                  alt="Logo"
                  style={{
                    height: "auto",
                    width: "80px",
                    marginBottom: "5px",
                  }}
                />
                <img
                  src={props.skill_india_logo}
                  alt="Logo"
                  style={{ height: "auto", width: 80 + "px" }}
                />
              </div>
            </div>
            <div
              style={{
                border: "1px solid #2d2f8b",
                padding: "10px",
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              Application Form Session 2024-2025 (Reindia Skill)
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
                    fontSize: "16px",
                  }}
                >
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        border: "1px solid #2d2f8b",
                        paddingLeft: "10px",
                        fontSize: "18px",
                        padding: "5px",
                      }}
                    >
                      Application Information:-
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      {" "}
                      Registration No :
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        fontSize: "16px",
                        width: "30%",
                      }}
                    >
                      <b>{props.employee.career_reg_code}</b>
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        width: "10%",
                      }}
                      rowSpan="14"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={
                            BaseUrl.resource_url +
                            "/" +
                            props.employee.photograph
                          }
                          style={{
                            marginBottom: "5px",
                            width: "150px",
                            height: "150px",
                          }}
                        />
                        <img
                          src={
                            BaseUrl.resource_url +
                            "/" +
                            props.employee.signature
                          }
                          style={{
                            marginBottom: "5px",
                            width: "150px",
                            height: "150px",
                          }}
                        />
                        <img
                          src={
                            BaseUrl.resource_url +
                            "/" +
                            props.employee.thumb_impression
                          }
                          style={{
                            marginBottom: "5px",
                            width: "150px",
                            height: "150px",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        height: "20px",
                        fontSize: "16px",
                        width: "30%",
                        height: "15px",
                      }}
                    >
                      Form Code :
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        fontSize: "18px",
                        width: "30%",
                        height: "15px",
                      }}
                    >
                      <b>08/VTT/RSTPL</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        height: "10px",
                        fontSize: "16px",
                        width: "30%",
                        height: "15px",
                      }}
                    >
                      Candidate's Name:
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        fontSize: "16px",
                        width: "30%",
                        height: "15px",
                      }}
                    >
                      <b>{props.employee.full_name}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        height: "10px",
                        fontSize: "16px",
                        width: "30%",
                        height: "15px",
                      }}
                    >
                      Father Name / Husband Name:
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.employee.fathers_name}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        height: "10px",
                      }}
                    >
                      Gender :
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.employee.gender}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Date of Birth:
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>{props.employee.dob}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Category (Caste) :
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>{props.employee.category}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Age as On:
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>{props.employee.age_as_on}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      EMail -ID:
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>{props.employee.email}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Mobile No :
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>{props.employee.mobile_number}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        height: "10px",
                      }}
                    >
                      Aadhar Card No. :
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>{props.employee.aadhar_card_no}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Blood Group :
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>{props.employee.blood_group}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      CG Domicile :
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>{props.employee.cg_domicile}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        height: "10px",
                      }}
                    >
                      Health Issues :
                    </td>
                    <td style={{ border: "1px solid #2d2f8b", padding: "8px" }}>
                      <b>
                        {props.employee.health_issues}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              style={{
                margin: "5px 0  px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid #2d2f8b",
                  fontSize: "16px",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        border: "1px solid #2d2f8b",
                        paddingLeft: "10px",
                        fontSize: "18px",
                        padding: "5px",
                      }}
                    >
                      Qualification Details :-
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Qualification
                    </th>
                    <th
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Course / Stream
                    </th>
                    <th
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Board / University Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Max. Marks
                    </th>
                    <th
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Marks Obtained
                    </th>
                  </tr>
                  {props.employee["qual_list"] &&
                    props.employee["qual_list"].map((q_lit, index) => {
                      return (
                        <tr key={index}>
                          <td
                            style={{
                              border: "1px solid #2d2f8b",
                              padding: "8px",
                              fontSize: "16px",
                              textAlign: "center",
                            }}
                          >
                            <b> {q_lit.qualification}</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #2d2f8b",
                              padding: "8px",
                              fontSize: "16px",
                              height: "15px",
                              textAlign: "center",
                            }}
                          >
                            <b>{q_lit.branch} </b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #2d2f8b",
                              padding: "8px",
                              height: "20px",
                              fontSize: "16px",
                              height: "15px",
                              textAlign: "center",
                            }}
                          >
                            <b>{q_lit.university}</b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #2d2f8b",
                              padding: "8px",
                              height: "20px",
                              fontSize: "16px",
                              height: "15px",
                              textAlign: "center",
                            }}
                          >
                            <b>{q_lit.max_marks} </b>
                          </td>
                          <td
                            style={{
                              border: "1px solid #2d2f8b",
                              padding: "8px",
                              fontSize: "16px",
                              height: "15px",
                              textAlign: "center",
                            }}
                          >
                            <b>{q_lit.marks_obtained}</b>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div
              style={{
                margin: "10px 0px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid #2d2f8b",
                  fontSize: "16px",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        border: "1px solid #2d2f8b",
                        paddingLeft: "10px",
                        fontSize: "18px",
                        padding: "5px",
                      }}
                    >
                      Relevant Experience :-
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        width: "30%",
                        fontSize: "18px",
                      }}
                    >
                      Do you have relevant experience :
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",

                        width: "30%",
                      }}
                    >
                      <b>{props.employee.experience}</b>
                    </td>
                  </tr>
                  {props.employee.experience == "Yes" ? (
                    <>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",

                            width: "30%",
                          }}
                        >
                          Job Title :
                        </td>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",

                            width: "30%",
                          }}
                        >
                          <b>{props.employee.job_title}</b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          Start Date :
                        </td>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          <b>{props.employee.start_date}</b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          End Date :
                        </td>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          <b>{props.employee.end_date}</b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          Years of Experience :
                        </td>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          <b>{props.employee.experience_year}</b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          Field of Experience :
                        </td>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          <b>{props.employee.field_of_experience}</b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          Experience Certificate :
                        </td>
                        <td
                          style={{
                            border: "1px solid #2d2f8b",
                            padding: "8px",
                          }}
                        >
                          <b>
                            {props.employee.experience_certificate
                              ? "YES"
                              : "NO"}
                          </b>
                        </td>
                      </tr>
                    </>
                  ) : (
                    ""
                  )}
                </tbody>
              </table>
            </div>
            <div
              style={{
                margin: "10px 0px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid #2d2f8b",
                  fontSize: "16px",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        border: "1px solid #2d2f8b",
                        paddingLeft: "10px",
                        fontSize: "18px",
                        padding: "5px",
                      }}
                    >
                      Contact Information ( Mailing Address ):-
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="1"
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Address :
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.employee.mailing_address}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Pin Code :
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.employee.mailing_pin_code}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              style={{
                margin: "10px 0px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid #2d2f8b",
                  fontSize: "16px",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        border: "1px solid #2d2f8b",
                        paddingLeft: "10px",
                        fontSize: "18px",
                        padding: "5px",
                      }}
                    >
                      Permanent Address :-
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="1"
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Address :
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.employee.permanent_address}</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      Pin Code :
                    </td>
                    <td
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.employee.permanent_pin_code}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              style={{
                margin: "10px 0px ",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid #2d2f8b",
                  fontSize: "16px",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        border: "1px solid #2d2f8b",
                        paddingLeft: "10px",
                        fontSize: "18px",
                        padding: "5px",
                      }}
                    >
                      <b>Decalaration Given By Candidate :-</b>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="2"
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        fontSize: "16px",
                        textAlign: "justify",
                      }}
                    >
                      मैं यह घोषणा करता/करती हूँ कि, मेरे द्वारा ऑनलाइन आवेदन
                      पत्र में स्वयं के नाम, श्रेणी, वर्ग, शैक्षणिक योग्यता,
                      जन्मतिथि, डाक पता एवं अन्य दी गई सूचना मेरी जानकारी एवं
                      विश्वास में सही है, जिसके सत्यतापूर्व और सही होने की मैं
                      घोषणा करता/करती हूँ। मैंने विभाग द्वारा जारी विज्ञापन में
                      दर्शित नियमों को पढ़ा है एवं समझा है। यदि ऊपर दी गई कोई भी
                      जानकारी असत्य पायी जाती है तो चयन प्रक्रिया के किसी भी
                      स्तर पर मुझे पूर्व सूचना दिये बिना मेरी अभ्यर्थिता समाप्त
                      की जा सकती है।
                      <br />I do hereby declare that the information related to
                      my Name, Category, Gender, Qualification, Date of Birth,
                      Address, and all other information given above are
                      correct, and I truthfully declare it to be correct. I have
                      gone through the rules and other information related to
                      the exam as notified. If any information given above is
                      found to be incorrect at any stage, my candidature may
                      summarily be terminated without any prior notice or
                      information to me.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              style={{
                margin: "10px 0px",
              }}
            >
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  border: "1px solid #2d2f8b",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan="2"
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        fontSize: "18px",
                      }}
                    >
                      Date:
                    </td>
                    <td
                      colSpan="2"
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                      }}
                    >
                      <b>{props.employee.current_date}</b>
                    </td>
                    <td
                      colSpan="2"
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        fontSize: "18px",
                        width: "30%",
                      }}
                    >
                      Place:
                    </td>
                    <td
                      colSpan="2"
                      style={{
                        border: "1px solid #2d2f8b",
                        padding: "8px",
                        fontSize: "18px",
                        width: "30%",
                      }}
                    >
                      <b>{props.employee.current_place}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
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
          <div className=" py-3">
            <hr />
            <strong className="text-primary bg-light p-2 rounded">Uploaded files</strong>
            
          </div>
            <div className="d-flex justify-content-between">
                  {props.employee.domicile_certificate && (

                      <button
                        onClick={() =>
                          window.open(
                            BaseUrl.resource_url +
                              "/" +
                              props.employee.domicile_certificate,
                            "target=_blank",
                            "popup=yes"
                          )
                        }
                        className="btn btn-link btn-primary text-white"
                      >
                        View Domecial Certificate
                      </button>

                  )}
                  {props.employee.experience_certificate && (

                      <button
                        onClick={() =>
                          window.open(
                            BaseUrl.resource_url +
                              "/" +
                              props.employee.experience_certificate,
                            "target=_blank",
                            "popup=yes"
                          )
                        }
                        className="btn btn-link btn-primary text-white"
                      >
                        View Experience Certificate
                      </button>
                  )}
                  {props.employee.photograph && (

                      <button
                        onClick={() =>
                          window.open(
                            BaseUrl.resource_url +
                              "/" +
                              props.employee.photograph,
                            "target=_blank",
                            "popup=yes"
                          )
                        }
                        className="btn btn-link btn-primary text-white"
                      >
                        View Photo
                      </button>

                  )}
                  {props.employee.signature && (
                      <button
                        onClick={() =>
                          window.open(
                            BaseUrl.resource_url +
                              "/" +
                              props.employee.signature,
                            "target=_blank",
                            "popup=yes"
                          )
                        }
                        className="btn btn-link btn-primary text-white"
                      >
                        View Signature
                      </button>
                  )}
                  {props.employee.thumb_impression && (
                      <button
                        onClick={() =>
                          window.open(
                            BaseUrl.resource_url +
                              "/" +
                              props.employee.thumb_impression,
                            "target=_blank",
                            "popup=yes"
                          )
                        }
                        className="btn btn-link btn-primary text-white"
                      >
                        View Thumb Tmpression
                      </button>
                  )}
            </div><hr />
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
