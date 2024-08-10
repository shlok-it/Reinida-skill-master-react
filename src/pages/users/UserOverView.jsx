import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb.js";
import UploadProfilepic from "./UploadProfilepic.js";
import {
  Col,
  Row,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardTitle,
  Button,
  CardText,
} from "reactstrap";
import { useParams, Link } from "react-router-dom";
import { call_secure_api, BaseUrl } from "../../connect/api.js";
import { toast } from "react-toastify";
import { formatDate, formatDateTime } from "../../helper/general.js";
import EditUser from "./EditUser.js";
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import PasswordMdl from "./PasswordMdl.js";
import upload_image from "../../assets/images/upload-image.webp";
const UserOverView = () => {
  const { reg_code } = useParams();
  const [user_detail, setUserDetail] = useState([]);
  const [tabactive_num, setTabactive_num] = useState("ADDRESS_DETAILS");
  const [tasks_list, setTaskList] = useState([]);
  const [display, setDisplay] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    get_emp_detail();
    dispatch(changeBCSubTitle("Teacher Details"));
  }, []);
  const get_emp_detail = () => {
    call_secure_api("users/detail", { reg_code: reg_code }).then(
      (resolve) => {
        if (resolve.status === true) {
          setUserDetail(resolve.data.user);
        } else {
          toast.error(resolve.message, "error", 5000);
          setUserDetail([]);
        }
      },
      (reject) => {
        console.log(reject);
        toast.error("Server Error", "error", 5000);
      }
    );
  };
  const parent_handler = (reload) => {
    setDisplay(null);
    if (reload) {
      get_emp_detail();
    }
  };
  const editEmp = () => {
    setDisplay(
      <EditUser employee={user_detail} model_handler={parent_handler} />
    );
  };

  const open_password_mdl = (employee) => {
    setDisplay(
      <PasswordMdl employee={employee} model_handler={parent_handler} />
    );
  };
  const uploadImage = (employee) => {
    setDisplay(
      <UploadProfilepic employee={employee} model_handler={parent_handler} />
    );
  };
  return (
    <React.Fragment>
      {/* <BreadCrumb title="Overview" pageTitle="Staff" /> */}
      {display}
      <Row>
        <Col xxl={3} xl={3}>
          <Card className="mb-3">
            <CardBody>
              <div className="table-card">
                <Row>
                  <Col lg="12">
                    <div
                      className="img-thumbnail mb-2 c-pointer"
                      onClick={() => uploadImage(user_detail)}
                    >
                      <img
                        src={
                          user_detail.image_link
                            ? BaseUrl.resource_url +
                              "/" +
                              user_detail.image_link
                            : upload_image
                        }
                      />
                    </div>
                    <h6>Teacher Details</h6>
                  </Col>
                  <Col lg="12">
                    <button
                      onClick={() => editEmp()}
                      className="btn btn-xs btn-sm btn-info"
                    >
                      <i className="fa fa-pencil"></i> Edit
                    </button>
                    <button
                      onClick={() => open_password_mdl(user_detail)}
                      className="btn btn-xs ms-1 btn-sm btn-info"
                    >
                      <i className="fa fa-pencil"></i> Password
                    </button>
                  </Col>
                </Row>
                <table className="table mb-0">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Reg Id</td>
                      <td align="right">{user_detail.reg_code}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Full Name</td>
                      <td align="right">
                        {user_detail.full_name} / {user_detail.father_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Gender</td>
                      <td align="right">{user_detail.gender}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Created</td>
                      <td align="right">
                        {formatDate(user_detail.created_at)}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Verified Date</td>
                      <td align="right">
                        {formatDate(user_detail.verified_at)}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Mobile</td>
                      <td align="right">{user_detail.contact}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Alt Mobile</td>
                      <td align="right">{user_detail.mobile2 || "---"}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Dob</td>
                      <td align="right">{user_detail.dob}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xxl={9} xl={9}>
          <Card>
            <CardBody>
              <div>
                <Nav tabs justified>
                  <NavItem>
                    <NavLink
                      href="#"
                      className={
                        tabactive_num == "ADDRESS_DETAILS" ? "active" : ""
                      }
                      onClick={() => setTabactive_num(() => "ADDRESS_DETAILS")}
                    >
                      Address Details
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="#"
                      className={
                        tabactive_num == "BANK_DETAILS" ? "active" : ""
                      }
                      onClick={() => setTabactive_num(() => "BANK_DETAILS")}
                    >
                      Account Details
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={tabactive_num}>
                  <TabPane tabId="ADDRESS_DETAILS">
                    <Row>
                      <Col sm="12">
                        <Card body className="bg-light p-2 mt-3 bold">
                          <CardTitle>
                            <h4>Current Address</h4>
                          </CardTitle>
                          <CardText>
                            {user_detail.address
                              ? user_detail.address + ", "
                              : ""}
                            {user_detail.block_name
                              ? user_detail.p_block_name + ", "
                              : ""}
                            {user_detail.district_name
                              ? user_detail.p_district_name + ", "
                              : ""}
                            {user_detail.state_name
                              ? user_detail.p_state_name + ", "
                              : ""}
                            {user_detail.pincode ? user_detail.pincode : ""}
                          </CardText>
                        </Card>
                      </Col>
                      <Col sm="12">
                        <Card body className="bg-light p-2 mt-3 bold">
                          <CardTitle>
                            <h4>Permanent Address</h4>
                          </CardTitle>
                          <CardText>
                            {user_detail.p_address
                              ? user_detail.p_address + ", "
                              : ""}
                            {user_detail.p_block_name
                              ? user_detail.p_block_name + ", "
                              : ""}
                            {user_detail.p_district_name
                              ? user_detail.p_district_name + ", "
                              : ""}
                            {user_detail.p_state_name
                              ? user_detail.p_state_name + ", "
                              : ""}
                            {user_detail.p_pincode ? user_detail.p_pincode : ""}
                          </CardText>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="BANK_DETAILS">
                    <Row>
                      <Col sm="12">
                        <Card body className="bg-light p-2 mt-3 bold">
                          <CardTitle>Account Detail</CardTitle>
                          <CardText>
                            <br />
                            Account holder name :
                            {user_detail.ac_h_name
                              ? user_detail.ac_h_name
                              : "___"}
                            <br />
                            Bank name  :
                            {user_detail.bank_name
                              ? user_detail.bank_name
                              : "___"}
                            <br />
                            Account holder :
                            {user_detail.ac_no ? user_detail.ac_no : "___"}
                            <br />
                            Branch :
                            {user_detail.branch ? user_detail.branch : "___"}
                            <br />
                            IFSC : {user_detail.ifsc ? user_detail.ifsc : "___"}
                          </CardText>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default UserOverView;
