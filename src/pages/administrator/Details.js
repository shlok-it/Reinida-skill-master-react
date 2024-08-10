import React, { useState, useEffect } from 'react';
import { call_secure_api, WebUrl } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { formatDate } from "../../helper/general.js"
import Edit from './Edit.js';
import ProfileLogo from './ProfileLogo.js';
const ActivitySection = React.lazy(() => import('./ActivitySection.js'));
const Details = (props) => {
    let { administrator_id } = useParams();
    const [administrator_detail, setSellerDetail] = useState([]);
    const [display, setDisplay] = useState(null);
    const [active_tab, setTab] = useState('overview');
    useEffect(() => {
        fetch_administrator_detail();
    }, []);
    const fetch_administrator_detail = () => {
        call_secure_api('v1/master/administrator/detail', { administrator_id: administrator_id })
            .then(
                async (resolve) => {
                    if (resolve.status == true) {
                        setSellerDetail(resolve.data.administrator);
                    }
                    else {
                        toast.warning(resolve.message, 'error', 2000);
                    }
                },
                (reject) => {
                    console.log(reject);
                }
            )
    }
    const logout_all_device = () => {
        call_secure_api('v1/master/administrator/logout', { administrator_id: administrator_id })
            .then(
                async (resolve) => {
                    if (resolve.status == true) {
                        toast.success(resolve.message, 'success', 2000);
                        setTab('overview');
                        setTab('activities');
                    }
                    else {
                        toast.warning(resolve.message, 'error', 2000);
                    }
                },
                (reject) => {
                    console.log(reject);
                }
            )
    }
    const parent_handler = (reload) => {
        setDisplay(null)
        if (reload) {
            fetch_administrator_detail();
        }
    }
    const editData = () => {
        setDisplay(<Edit administrator={administrator_detail} model_handler={parent_handler} />);
    }
    const upload_administrator_profile_logo = () => {
        setDisplay(<ProfileLogo administrator_id={administrator_id} company_logo={administrator_detail?.company_logo} model_handler={handleCallback} />);
    }
    const handleCallback = (reload, close = true) => {
        if (close === true) {
            setDisplay(null);
        }
        if (reload === true) {
            fetch_administrator_detail();
        }
    }
    return (
        <>
            {display}
            <div className="row">
                <div className="col-lg-12">
                    <div className="card mt-n4 mx-n4">
                        <div className="bg-warning-subtle">
                            <div className="card-body pb-0 px-4">
                                <div className="row mb-3">
                                    <div className="col-md">
                                        <div className="row align-items-center g-3">
                                            <div className="col-sm-1">
                                                <div className="avatar-md">
                                                    <div className="avatar-title bg-white rounded-circle" onClick={() => upload_administrator_profile_logo()}>
                                                        <img src={WebUrl + administrator_detail?.company_logo} alt={administrator_detail?.company_name}
                                                            className="avatar-md" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-8">
                                                <div>
                                                    <h4 className="fw-bold">{administrator_detail?.company_name}</h4>
                                                    <div className="hstack gap-3 flex-wrap">
                                                        <div><i className="bx bx-user align-bottom align-top me-1"></i>
                                                            {administrator_detail?.name}</div>
                                                        <div className="vr"></div>
                                                        <div>Created Date : <span className="fw-medium">{formatDate(administrator_detail?.created_at)}</span></div>
                                                        <div className="vr"></div>
                                                        <div>Reg Id : <span className="fw-medium">{administrator_detail?.reg_Id}</span></div>
                                                        <div className="vr"></div>
                                                        <div className="badge rounded-pill bg-info fs-12"><a onClick={() => editData()}><i className='bx bx-edit'></i> Edit</a></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ul className="nav nav-tabs-custom border-bottom-0" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active fw-semibold" onClick={() => setTab('overview')} data-bs-toggle="tab"
                                            href="#overview" role="tab">
                                            Overview
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#activities" onClick={() => setTab('activities')} role="tab">
                                            Activities
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="tab-content text-muted">
                        <div className="tab-pane fade show active" id="overview" role="tabpanel">
                            <div className="row">
                                <div className="col-xl-12 col-lg-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table mb-0 table-borderless">
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan={2}><h4 className="fw-medium text-primary">User Detail</h4></th>
                                                        </tr>
                                                        <tr>
                                                            <th><span className="fw-medium">Name</span></th>
                                                            <td>{administrator_detail?.name || '---'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th><span className="fw-medium">Email</span></th>
                                                            <td>{administrator_detail?.email || '---'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th><span className="fw-medium">Mobile No.</span></th>
                                                            <td>{administrator_detail?.mobile || '---'}</td>
                                                        </tr>
                                                        <tr>
                                                            <th><span className="fw-medium">Contact No.</span></th>
                                                            <td>{administrator_detail?.contact || '---'}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="activities" role="tabpanel">
                            <div className="card">
                                <div className="card-body">
                                    <div className='d-flex justify-content-between'>
                                        <h5 className="card-title mb-3">Activities</h5>
                                        <a className='text-danger cursor-pointer' onClick={() => logout_all_device()}>All Logout</a>
                                    </div>
                                    <div className="acitivity-timeline">
                                        {active_tab === 'activities' && <ActivitySection administrator_id={administrator_id} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Details;
