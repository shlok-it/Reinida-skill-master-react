import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

//import images
import avatar2 from "../../assets/images/avatar/2.jpg";
import avatar8 from "../../assets/images/avatar/2.jpg";
import avatar3 from "../../assets/images/avatar/3.jpg";
import avatar6 from "../../assets/images/avatar/2.jpg";
import bell from "../../assets/images/svg/bell.svg";

//SimpleBar
import SimpleBar from "simplebar-react";

const NotificationDropdown = () => {

    //Dropdown Toggle
    const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
    const toggleNotificationDropdown = () => {
        setIsNotificationDropdown(!isNotificationDropdown);
    };

    //Tab 
    const [activeTab, setActiveTab] = useState('2');
    return (
        <React.Fragment>
            <li className="nav-item dropdown notification_dropdown">
                <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown}>
                    <DropdownToggle tag="a" className="nav-link" href='/' onClick={(e) => e.preventDefault()}>
                        <i className='fa fa-bell text-white'></i>
                        <span
                            className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">3<span
                                className="visually-hidden">unread messages</span></span>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end">
                        <div className="custom-tab-1">
                            <Nav className="nav nav-tabs">
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { setActiveTab('1'); }}
                                    >
                                        All (3)
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { setActiveTab('2'); }}
                                    >
                                        Messages
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === '3' })}
                                        onClick={() => { setActiveTab('3'); }}
                                    >
                                        Alerts
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1" className="py-2 ps-2">
                                <SimpleBar style={{ maxHeight: "300px" }} id="scrollbar" className="pe-2 widget-media">
                                    <ul className='timeline'>
                                        <li>
                                            <div className="timeline-panel">
                                                <div className='media me-2'>
                                                    <img src={avatar3} width={'50'} alt="user-pic" />
                                                </div>
                                                <div className="media-body">
                                                    <Link to="#" className="stretched-link"><h6>James Lemire</h6></Link>
                                                    <div className="text-black">
                                                        <p className="mb-1">We talked about a project on linkedin.</p>
                                                    </div>
                                                    <span className='d-block'><i className="mdi mdi-clock-outline"></i> 30 min ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="timeline-panel">
                                                <div className='media me-2'>
                                                    <img src={avatar6} width={'50'} alt="user-pic" />
                                                </div>
                                                <div className="media-body">
                                                    <Link to="#" className="stretched-link"><h6>Kenneth Brown</h6></Link>
                                                    <div className="text-black">
                                                        <p className="mb-1">Mentionned you in his comment on 📃 invoice #12501. </p>
                                                    </div>
                                                    <span className='d-block'><i className="mdi mdi-clock-outline"></i> 10 hrs ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="timeline-panel">
                                                <div className='media me-2'>
                                                    <img src={avatar8} width={'50'} alt="user-pic" />
                                                </div>
                                                <div className="media-body">
                                                    <Link to="#" className="stretched-link"><h6>Maureen Gibson</h6></Link>
                                                    <div className="text-black">
                                                        <p className="mb-1">We talked about a project on linkedin.</p>
                                                    </div>
                                                    <span className='d-block'><i className="mdi mdi-clock-outline"></i> 3 days ago</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="my-1 text-center">
                                        <button type="button" className="btn btn-soft-success waves-effect waves-light">View
                                            All Notifications <i className="ri-arrow-right-line align-middle"></i></button>
                                    </div>
                                </SimpleBar>

                            </TabPane>

                            <TabPane tabId="2" className="py-2 ps-2">
                                <SimpleBar style={{ maxHeight: "300px" }} id="scrollbar" className="widget-media p-3">
                                    <ul className='timeline'>
                                        <li>
                                            <div className="timeline-panel">
                                                <div className='media me-2'>
                                                    <img src={avatar3} width={'50'} alt="user-pic" />
                                                </div>
                                                <div className="media-body">
                                                    <Link to="#" className="stretched-link"><h6>James Lemire</h6></Link>
                                                    <div className="text-black">
                                                        <p className="mb-1">We talked about a project on linkedin.</p>
                                                    </div>
                                                    <span className='d-block'><i className="mdi mdi-clock-outline"></i> 30 min ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="timeline-panel">
                                                <div className='media me-2'>
                                                    <img src={avatar6} width={'50'} alt="user-pic" />
                                                </div>
                                                <div className="media-body">
                                                    <Link to="#" className="stretched-link"><h6>Kenneth Brown</h6></Link>
                                                    <div className="text-black">
                                                        <p className="mb-1">Mentionned you in his comment on 📃 invoice #12501. </p>
                                                    </div>
                                                    <span className='d-block'><i className="mdi mdi-clock-outline"></i> 10 hrs ago</span>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="timeline-panel">
                                                <div className='media me-2'>
                                                    <img src={avatar8} width={'50'} alt="user-pic" />
                                                </div>
                                                <div className="media-body">
                                                    <Link to="#" className="stretched-link"><h6>Maureen Gibson</h6></Link>
                                                    <div className="text-black">
                                                        <p className="mb-1">We talked about a project on linkedin.</p>
                                                    </div>
                                                    <span className='d-block'><i className="mdi mdi-clock-outline"></i> 3 days ago</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <div className="my-1 text-center">
                                        <button type="button" className="btn btn-soft-success waves-effect waves-light">View
                                            All Messages <i className="ri-arrow-right-line align-middle"></i></button>
                                    </div>
                                </SimpleBar>
                            </TabPane>
                            <TabPane tabId="3" className="p-4">
                                <div className="w-25 w-sm-50 pt-3 mx-auto">
                                    <img src={bell} className="img-fluid" alt="user-pic" />
                                </div>
                                <div className="text-center pb-5 mt-2">
                                    <h6 className="fs-18 fw-semibold lh-base">Hey! You have no any notifications </h6>
                                </div>
                            </TabPane>
                        </TabContent>
                    </DropdownMenu>
                </Dropdown>
            </li>
        </React.Fragment>
    );
};

export default NotificationDropdown;