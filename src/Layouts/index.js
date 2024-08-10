import React, { useState, useEffect } from 'react'
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useStateContext } from "../contexts/ContextProvider";
import { call_secure_get_api } from '../connect/api.js';
import secureLocalStorage from "react-secure-storage";
import { Container } from 'reactstrap';
import bg_image from '../assets/images/bg-1.png';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from "react-redux";
import { changeLayoutMode } from "../slices/thunk";
const Layout = (props) => {
    const [pageLoaded, setPageLoaded] = useState(false);
    const { setCurrentUser, setStateList, setDistrictList, setBlockList, setSubjectList, setQualifications,setVillageList,setBloodgroup,setCategories} = useStateContext();
    const selectLayoutState = (state) => state.Layout;
    const dispatch = useDispatch();
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (header) => ({
            breadCrumbSubTitle: header.breadCrumbSubTitle,
            layoutModeType: header.layoutModeType,
        })
    );
    const {
        breadCrumbSubTitle,
        layoutModeType
    } = useSelector(selectLayoutProperties);
    useEffect(() => {
        const authenticated = secureLocalStorage.getItem("admin_authenticated");
        if (authenticated) {
            const access_token = secureLocalStorage.getItem("admin_access_token");
            if (access_token) {
                call_secure_get_api('profile')
                    .then(
                        (resolve) => {
                            if (resolve.status === true) {
                                setPageLoaded(true)
                                setCurrentUser(resolve.data);
                                load_options_data();
                            }
                            else {
                                window.location = "/master/login";
                            }
                        },
                        (reject) => {
                            window.location = "/master/login";
                        }
                    )
            }
            else {
                //return <Navigate replace to="/login" />;
                window.location = "/master/login";
            }
        }
        else {
            //return <Navigate replace to="/login" />;
            window.location = "/master/login";
        }
    }, []);
    const load_options_data = () => {
        call_secure_get_api('get-options-data')
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        setStateList(resolve.data.state_list || [])
                        setDistrictList(resolve.data.district_list || [])
                        setBlockList(resolve.data.block_list || [])
                        setSubjectList(resolve.data.subject_list || [])
                        setQualifications(resolve.data.qualifications || [])
                        setVillageList(resolve.data.village_list || [])
                        setCategories(resolve.data.categories || [])
                        setBloodgroup(resolve.data.bloodgroup || [])
                    }
                },
                (reject) => {

                }
            )
    }
    const onChangeLayoutMode = (value) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    };
    return (
        <React.Fragment>
            <div className="loader-container">
                <span className="loader"></span>
            </div>
            {pageLoaded === true ?
                <div id="main-wrapper" className="wallet-open show">
                    <div className="header-banner" style={{ backgroundImage: `url(${bg_image})` }}>

                    </div>
                    <Header layoutModeType={layoutModeType}
                        onChangeLayoutMode={onChangeLayoutMode} breadCrumbSubTitle={breadCrumbSubTitle} />
                    <Sidebar />
                    <div className="content-body">
                        <Container fluid>
                            {props.children}
                        </Container>
                    </div>
                    <Footer />
                </div>
                : <div id="preloader">
                    <div className="lds-ripple">
                        <div></div>
                        <div></div>
                    </div>
                </div>}
        </React.Fragment>
    )
};
export default Layout
    