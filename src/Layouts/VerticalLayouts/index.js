import React, { useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import { Collapse } from 'reactstrap';
import { useStateContext } from "../../contexts/ContextProvider";
// Import Data
import navdata from "../LayoutMenuData";
import { useSelector } from "react-redux";
import { createSelector } from 'reselect';

const VerticalLayout = (props) => {
    const navData = navdata().props.children;
    const { currentUser } = useStateContext();
    /*
 layout settings
 */
    const selectLayoutState = (state) => state.Layout;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout) => ({
            leftsidbarSizeType: layout.leftsidbarSizeType,
            sidebarVisibilitytype: layout.sidebarVisibilitytype,
            layoutType: layout.layoutType
        })
    );
    // Inside your component
    const {
        leftsidbarSizeType, sidebarVisibilitytype, layoutType
    } = useSelector(selectLayoutProperties);

    //vertical and semibox resize events
    const resizeSidebarMenu = useCallback(() => {
        var windowSize = document.documentElement.clientWidth;
        if (windowSize >= 1025) {
            if (document.documentElement.getAttribute("data-layout") === "vertical") {
                document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
            }
            if (document.documentElement.getAttribute("data-layout") === "semibox") {
                document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
            }
            var hamburgerIcon = document.querySelector(".hamburger-icon");
            if ((sidebarVisibilitytype === "show" || layoutType === "vertical" || layoutType === "twocolumn") && document.querySelector(".hamburger-icon")) {
                if (hamburgerIcon !== null) {
                    hamburgerIcon.classList.remove("open");
                }
            } else {
                if (hamburgerIcon !== null) {
                    hamburgerIcon.classList.add("open");
                }
            }

        } else if (windowSize < 1025 && windowSize > 767) {
            document.body.classList.remove("twocolumn-panel");
            if (document.documentElement.getAttribute("data-layout") === "vertical") {
                document.documentElement.setAttribute("data-sidebar-size", "sm");
            }
            if (document.documentElement.getAttribute("data-layout") === "semibox") {
                document.documentElement.setAttribute("data-sidebar-size", "sm");
            }
            if (document.querySelector(".hamburger-icon")) {
                document.querySelector(".hamburger-icon").classList.add("open");
            }
        } else if (windowSize <= 767) {
            document.body.classList.remove("vertical-sidebar-enable");
            if (document.documentElement.getAttribute("data-layout") !== "horizontal") {
                document.documentElement.setAttribute("data-sidebar-size", "lg");
            }
            if (document.querySelector(".hamburger-icon")) {
                document.querySelector(".hamburger-icon") && document.querySelector(".hamburger-icon").classList.add("open");
            }
        }
    }, [leftsidbarSizeType, sidebarVisibilitytype, layoutType]);

    useEffect(() => {
        window.addEventListener("resize", resizeSidebarMenu, true);
    }, [resizeSidebarMenu]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const initMenu = () => {
            const pathName = process.env.PUBLIC_URL + props.router.location.pathname;
            const ul = document.getElementById("navbar-nav");
            const items = ul.getElementsByTagName("a");
            let itemsArray = [...items]; // converts NodeList to Array
            removeActivation(itemsArray);
            let matchingMenuItem = itemsArray.find((x) => {
                return x.pathname === pathName;
            });
            if (matchingMenuItem) {
                activateParentDropdown(matchingMenuItem);
            }
        };
        if (props.layoutType === "vertical") {
            initMenu();
        }
    }, [props.router.location.pathname, props.layoutType]);

    function activateParentDropdown(item) {

        item.classList.add("active");
        let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

        if (parentCollapseDiv) {

            // to set aria expand true remaining
            parentCollapseDiv.classList.add("show");
            parentCollapseDiv.parentElement.children[0].classList.add("active");
            parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").classList.add("show");
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
                }
            }
            return false;
        }
        return false;
    }

    const removeActivation = (items) => {
        let actiItems = items.filter((x) => x.classList.contains("active"));

        actiItems.forEach((item) => {
            if (item.classList.contains("menu-link")) {
                if (!item.classList.contains("active")) {
                    item.setAttribute("aria-expanded", false);
                }
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
            }
            if (item.classList.contains("nav-link")) {
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
                item.setAttribute("aria-expanded", false);
            }
            item.classList.remove("active");
        });
    };

    return (
        <React.Fragment>
            {/* menu Items */}
            {(navData || []).map((item, key) => {
                if (!item.hideFor || (item.hideFor && item.hideFor.includes(currentUser.master_role) === false)) {
                    return (
                        <React.Fragment key={key}>
                            {/* Main Header */}
                            {(item.subItems ? (
                                <li>
                                    <Link
                                        onClick={item.click}
                                        className="has-arrow"
                                        to={item.link ? item.link : "/#"}
                                        data-bs-toggle="collapse"
                                    >
                                        <i className={item.icon}></i>
                                        <span className="nav-text">{item.label}</span>
                                    </Link>
                                    <Collapse
                                        className="menu-dropdown"
                                        isOpen={item.stateVariables}
                                        tag="ul"
                                        id="sidebarApps">
                                        {/* subItms  */}
                                        {item.subItems && ((item.subItems || []).map((subItem, key) => (
                                            <React.Fragment key={key}>
                                                {!subItem.isChildItem ? (
                                                    <li>
                                                        <Link
                                                            to={subItem.link ? subItem.link : "/#"}
                                                        >
                                                            {subItem.label}
                                                            {subItem.badgeName ?
                                                                <span className={"badge badge-pill bg-" + subItem.badgeColor}>{subItem.badgeName}</span>
                                                                : null}
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    <li>
                                                        <Link
                                                            onClick={subItem.click}
                                                            className="has-arrow"
                                                            to="/#"
                                                            data-bs-toggle="collapse"
                                                        > {subItem.label}
                                                            {subItem.badgeName ?
                                                                <span className={"badge badge-pill bg-" + subItem.badgeColor} data-key="t-new">{subItem.badgeName}</span>
                                                                : null}
                                                        </Link>
                                                        <Collapse className="menu-dropdown" tag="ul" isOpen={subItem.stateVariables}>

                                                            {/* child subItms  */}
                                                            {subItem.childItems && (
                                                                (subItem.childItems || []).map((childItem, key) => (
                                                                    <React.Fragment key={key}>
                                                                        {!childItem.childItems ?
                                                                            <li>
                                                                                <Link
                                                                                    to={childItem.link ? childItem.link : "/#"}>
                                                                                    {childItem.label}
                                                                                </Link>
                                                                            </li>
                                                                            : <li>
                                                                                <Link to="/#" className="has-arrow" onClick={childItem.click} data-bs-toggle="collapse">
                                                                                    {childItem.label}

                                                                                </Link>
                                                                                <Collapse tag="ul" className="menu-dropdown" isOpen={childItem.stateVariables} id="sidebaremailTemplates">
                                                                                    {childItem.childItems.map((subChildItem, key) => (
                                                                                        <li key={key}>
                                                                                            <Link to={subChildItem.link}>{subChildItem.label} </Link>
                                                                                        </li>
                                                                                    ))}
                                                                                </Collapse>
                                                                            </li>
                                                                        }
                                                                    </React.Fragment>
                                                                ))
                                                            )}
                                                        </Collapse>
                                                    </li>
                                                )}
                                            </React.Fragment>
                                        ))
                                        )}
                                    </Collapse>
                                </li>
                            ) : (
                                <li>
                                    <Link
                                        to={item.link ? item.link : "/#"} aria-expanded="false">
                                        <i className={item.icon}></i>
                                        <span className='nav-text'>{item.label}</span>
                                    </Link>
                                </li>
                            ))
                            }
                        </React.Fragment>
                    );
                }
            })}
        </React.Fragment>
    );
};

export default withRouter(VerticalLayout);
