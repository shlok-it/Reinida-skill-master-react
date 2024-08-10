import React, { useState } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';

//import images
import github from "../../assets/images/brands/github.png";
import google from "../../assets/images/brands/google.png";
import youtube from "../../assets/images/brands/youtube.png";
import facebook from "../../assets/images/brands/facebook.png";
import cpanel from "../../assets/images/brands/cpanel.png";
import directAdmin from "../../assets/images/brands/directAdmin.png";
import { Link } from 'react-router-dom';

const WebAppsDropdown = () => {
    const [isWebAppDropdown, setIsWebAppDropdown] = useState(false);
    const toggleWebAppDropdown = () => {
        setIsWebAppDropdown(!isWebAppDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isWebAppDropdown} toggle={toggleWebAppDropdown} className="topbar-head-dropdown ms-1 header-item">
                <DropdownToggle tag="button" type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                    <i className='bx bx-category-alt fs-22'></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-lg p-0 dropdown-menu-end">
                    <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                        <Row className="align-items-center">
                            <Col>
                                <h6 className="m-0 fw-semibold fs-15"> Web Apps </h6>
                            </Col>
                            <div className="col-auto">
                                <Link to="#" className="btn btn-sm btn-soft-info"> View All Apps
                                    <i className="ri-arrow-right-s-line align-middle"></i></Link>
                            </div>
                        </Row>
                    </div>

                    <div className="p-2">
                        <div className="row g-0">
                            <Col>
                                <Link className="dropdown-icon-item" target='_blank' to="https://github.com">
                                    <img src={github} alt="Github" />
                                    <span>GitHub</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" target='_blank' to="https://www.google.com">
                                    <img src={google} alt="Google" />
                                    <span>Google</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" target='_blank' to="https://www.youtube.com">
                                    <img src={youtube} alt="Youtube" />
                                    <span>Youtube</span>
                                </Link>
                            </Col>
                        </div>

                        <div className="row g-0">
                            <Col>
                                <Link className="dropdown-icon-item" target='_blank' to="https://www.facebook.com">
                                    <img src={facebook} alt="Facebook" />
                                    <span>Facebook</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" target='_blank' to="https://fr02.protoninternet.com:2087">
                                    <img src={cpanel} alt="Host Rt" />
                                    <span>HostRT</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" target='_blank' to="https://193.108.130.22:2222">
                                    <img src={directAdmin} alt="Direct Admin" />
                                    <span>DirectAdmin</span>
                                </Link>
                            </Col>
                        </div>
                    </div>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default WebAppsDropdown;