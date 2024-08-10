import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useStateContext } from "../../contexts/ContextProvider";
//import images
import avatar1 from "../../assets/images/avatar/1.jpg";
import { Link } from 'react-router-dom';

const ProfileDropdown = () => {

    const { currentUser } = useStateContext();
    useEffect(() => {

    }, []);

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <li>
                <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="dropdown header-profile2">
                    <DropdownToggle tag="button" type="button" className="nav-link">
                        <div className="header-info2 d-flex align-items-center">
                            <div className="d-flex align-items-center sidebar-info">
                                <div>
                                    <h5 className="mb-0 text-white">{currentUser.master_name}</h5>
                                    <span className="d-block text-end">{currentUser?.master_role}</span>
                                </div>
                                <img src={avatar1}
                                    alt="Header Avatar" />
                            </div>
                        </div>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu dropdown-menu-end">
                        {/* <h6 className="dropdown-header">Welcome {currentUser.master_name}!</h6> */}
                        <DropdownItem className='dropdown-item ai-icon' tag={'a'} href={"profile"}>
                            <i className="mdi mdi-account-circle svg-main-icon"></i>
                            <span className="ms-2"> Profile</span>
                        </DropdownItem>
                        <DropdownItem className='dropdown-item ai-icon' tag={'a'} href={"apps-chat"}>
                            <i className="mdi mdi-message-text-outline svg-main-icon"></i>
                            <span className="ms-2">Messages</span>
                        </DropdownItem>
                        <DropdownItem className='dropdown-item ai-icon' tag={'a'} href={"pages-faqs"}>
                            <i className="mdi mdi-lifebuoy svg-main-icon"></i>
                            <span className="ms-2">Help</span>
                        </DropdownItem>
                        <DropdownItem className='dropdown-item ai-icon' tag={'a'} href={"settings"}>
                            <i className="fa-regular fa-gear fw-bold svg-main-icon"></i>
                            <span className="ms-2">Settings</span>
                        </DropdownItem>
                        <DropdownItem className='dropdown-item ai-icon' tag={'a'} href={"password"}>
                            <i className="mdi mdi-lock svg-main-icon"></i>
                            <span className="ms-2">Change Password</span>
                        </DropdownItem>
                        <DropdownItem className='dropdown-item ai-icon' tag={'a'} href={"logout"}>
                            <i className="mdi mdi-logout svg-main-icon"></i>
                            <span className="ms-2" >Logout</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </li>
        </React.Fragment>
    );
};

export default ProfileDropdown;