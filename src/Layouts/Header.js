import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle, Form } from 'reactstrap';

//import images
import logoSm from "../assets/images/logo-light.jpg";

//import Components
//import SearchOption from '../Components/Common/SearchOption';
//import LanguageDropdown from '../Components/Common/LanguageDropdown';
import WebAppsDropdown from '../Components/Common/WebAppsDropdown';
import FullScreenDropdown from '../Components/Common/FullScreenDropdown';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';
import LightDark from '../Components/Common/LightDark';
import { useStateContext } from "../contexts/ContextProvider.jsx";
const Header = ({ onChangeLayoutMode, layoutModeType, breadCrumbSubTitle }) => {
    const { currentUser } = useStateContext();
    const [headerClass, setHeaderClass] = useState("");
    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });
    const [search, setSearch] = useState(false);
    const toogleSearch = () => {
        setSearch(!search);
    };
    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setHeaderClass("is-fixed");
        } else {
            setHeaderClass("");
        }
    }
    const toogleMenuBtn = () => {
        document.querySelector("#main-wrapper").classList.toggle('menu-toggle');
        document.querySelector(".hamburger").classList.toggle('is-active');
    };
    return (
        <React.Fragment>
            <div className="nav-header">
                <a href="" className="brand-logo">
                    <span className="logo-abbr">
                    </span>
                    <div className="brand-title">
                        <img src={logoSm} alt="" />
                    </div>
                </a>
                <div className="nav-control" onClick={toogleMenuBtn}>
                    <div className="hamburger" >
                        <span className="line"></span><span className="line"></span><span className="line"></span>
                    </div>
                </div>
            </div>
            <div id="page-topbar" className={"header home " + headerClass}>
                <div className="header-content">
                    <nav className="navbar navbar-expand">
                        <div className="collapse navbar-collapse justify-content-between">
                            <div className="header-left">
                                {/* <div className="input-group search-area">
                                    <input type="text" className="form-control" placeholder="Search Dashboard" />
                                    <span className="input-group-text">
                                        <a href="/" onClick={(e) => { e.preventDefault(); }}>

                                        </a>
                                    </span>
                                </div> */}
                            </div>
                            <ul className="navbar-nav header-right">
                                {/* <Dropdown isOpen={search} toggle={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                                    <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                        <i className="bx bx-search fs-22"></i>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                        <Form className="p-3">
                                            <div className="form-group m-0">
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Search ..."
                                                        aria-label="Recipient's username" />
                                                    <button className="btn btn-primary" type="submit"><i
                                                        className="mdi mdi-magnify"></i></button>
                                                </div>
                                            </div>
                                        </Form>
                                    </DropdownMenu>
                                </Dropdown> */}

                                {/* LanguageDropdown */}
                                {/* <LanguageDropdown /> */}

                                {/* WebAppsDropdown */}
                                {/* <WebAppsDropdown /> */}

                                {/* Dark/Light Mode set */}
                                <LightDark
                                    layoutMode={layoutModeType}
                                    onChangeLayoutMode={onChangeLayoutMode}
                                />

                                {/* FullScreenDropdown */}
                                <FullScreenDropdown />

                                {/* NotificationDropdown */}
                                {/* <NotificationDropdown /> */}

                                {/* ProfileDropdown */}
                                <ProfileDropdown />
                            </ul>
                        </div>
                    </nav>
                </div>
                <div className="page-titles">
                    <div className="sub-dz-head">
                        <div className="d-flex align-items-center dz-head-title">
                            {/* <h2 className="text-white m-0">{currentUser.master_name}!</h2> */}
                        </div>
                        {breadCrumbSubTitle && <ol className="breadcrumb">
                            <li className="breadcrumb-item active ms-auto">
                                <a className="d-flex align-self-center" href="/" onClick={(e) => { e.preventDefault(); }}>
                                    <i className="me-2 svg-main-icon mdi mdi-home-outline text-white fs-20"> </i>
                                    Dashboard
                                </a>
                            </li>
                            <li className="breadcrumb-item"><a href="/" onClick={(e) => { e.preventDefault(); }}>{breadCrumbSubTitle}</a></li>
                        </ol>}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Header;