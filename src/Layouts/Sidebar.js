import React, { useEffect } from 'react'
import SimpleBar from "simplebar-react";
import VerticalLayout from "./VerticalLayouts";
const Sidebar = ({ layoutType }) => {
    useEffect(() => {
        
    });
    const addEventListenerOnSmHoverMenu = () => {
        // add listener Sidebar Hover icon on change layout from setting
        if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
            document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
        } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
            document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
        } else {
            document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
        }
    };
    return (
        <React.Fragment>
            <div className="dlabnav follow-info">
                <span className="main-menu">Main Menu</span>
                <React.Fragment>
                    <SimpleBar id="scrollbar" className="menu-scroll h-100">
                        <div className='dlabnav-scroll'>
                            <ul className="metismenu" id="menu">
                                <VerticalLayout layoutType={layoutType} />
                            </ul>
                        </div>
                    </SimpleBar>
                    <div className="sidebar-background"></div>
                </React.Fragment>
            </div >
            <div className="vertical-overlay"></div>
        </React.Fragment>
    )
};
export default Sidebar