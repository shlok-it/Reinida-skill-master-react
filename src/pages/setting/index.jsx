import React, { useState, useEffect } from 'react'
import { call_secure_api, call_secure_get_api, BaseUrl } from '../../connect/api.js';
import { Link } from "react-router-dom";
import { formatDate } from '../../helper/general.js';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { toast } from 'react-toastify';
import PageSettingMdl from "./PageSettingMdl"
import classnames from "classnames";
const Settings = (props) => {
    const [display, setDisplay] = useState(null);
    const [current_tab, setTab] = useState("page");
    const [setting, setSetting] = useState([]);
    const [page_list, setPageList] = useState([]);
    useEffect(() => {
        if (current_tab == 'c_profile')
            get_setting();
        if (current_tab == 'page')
            get_page_list();
    }, [current_tab]);

    const handleCallback = (reload) => {
        setDisplay(null);
        if (reload) {
            if (current_tab == 'c_profile')
                get_setting();
            if (current_tab == 'page')
                get_page_list();
        }
    }
    const get_setting = () => {
        call_secure_get_api('setting')
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        setSetting(resolve.data);
                    }
                    else {
                        setSetting([]);
                    }
                },
                (reject) => {
                    console.log(reject);
                }
            )
    }
    const get_page_list = () => {
        call_secure_get_api('setting/page/list')
            .then(
                (resolve) => {
                    if (resolve.status == true) {
                        setPageList(resolve.data.list)
                    }
                    else {
                        setPageList([])
                    }
                },
                (reject) => {
                    console.log(reject);
                }
            )
    }
    const page_setting_edit = (dataContent, dataId, page_title) => {
        setDisplay(<PageSettingMdl dataContent={dataContent} page_title={page_title} dataId={dataId} model_handler={handleCallback} />);
    }
    return (
        <React.Fragment>
            {display}
            <Card>
                <CardBody>
                    <Row>
                        <Col lg={3}>
                            <Nav pills className="nav nav-pills flex-column nav-pills-tab custom-verti-nav-pills text-center">
                                {/* <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            "mb-2": true,
                                            active: current_tab === "c_profile",
                                        })}
                                        onClick={() => {
                                            setTab("c_profile");
                                        }}
                                        id="custom-v-pills-home-tab"
                                    >
                                        <i className="ri-home-4-line d-block fs-20 mb-1"></i>
                                        Company Profile
                                    </NavLink>
                                </NavItem> */}
                                <NavItem>
                                    <NavLink
                                        style={{ cursor: "pointer" }}
                                        className={classnames({
                                            "mb-2": true,
                                            active: current_tab === "page",
                                        })}
                                        onClick={() => {
                                            setTab("page");
                                        }}
                                        id="custom-v-pills-profile-tab"
                                    >
                                        <i className="ri-user-2-line d-block fs-20 mb-1"></i>
                                        Page Setting
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                        <Col lg={9}>
                            <TabContent
                                activeTab={current_tab}
                                className="text-muted mt-3 mt-lg-0"
                            >
                                <TabPane tabId="c_profile" id="custom-v-pills-home">
                                    <div className="d-flex mb-4">
                                        <div className="flex-grow-1 ms-3">
                                            <p className="mb-0">Experiment and play around with the fonts that you already have in the software you’re working with reputable font websites. commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="flex-grow-1 me-3">
                                            <p className="mb-0">Always want to make sure that your fonts work well together and try to limit the number of fonts you use to three or less. Experiment and play around with the fonts that you already have in the software you’re working with reputable font websites.</p>
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tabId="page" id="custom-v-pills-profile">
                                    <div className="table-responsive">
                                        <table className="table mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th>Page Name</th>
                                                    <th>Updated At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    page_list.map((list, index) => {
                                                        return (
                                                            <tr key={"row" + index}>
                                                                <td>{index + 1}</td>
                                                                <td>{list.page_title}</td>
                                                                <td>{formatDate(list.updated_at)}</td>
                                                                <td>
                                                                    <button className="btn btn-xs btn-info" onClick={() => page_setting_edit(list.page_content, list.id, list.page_title)}><i className="bx bxs-edit"></i> Edit</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    )
}
export default Settings