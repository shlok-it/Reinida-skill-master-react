import React, { useState, useEffect } from 'react'
import { call_secure_api, call_secure_get_api, BaseUrl } from '../connect/api.js';
import { Link } from "react-router-dom";
import { formatDate } from '../helper/general.js';
import ProfileLogo from './administrator/ProfileLogo.js';
import EditProfile from './EditProfile.js';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { changeBCSubTitle } from '../slices/thunk.js';
//import profileBg from '../assets/images/profile-bg.jpg';
const ActivitySection = React.lazy(() => import('./ActivitySection.js'));
const Profile = (props) => {
	const [display, setDisplay] = useState(null);
	const [current_tab, setTab] = useState("overview");
	const [profile, SetProfile] = useState([]);
	const dispatch = useDispatch();
	useEffect(() => {
		get_profile();
		dispatch(changeBCSubTitle('Profile', {}));
	}, []);

	const handleCallback = (reload) => {
		setDisplay(null);
		if (reload) {
			get_profile();
		}
	}
	const get_profile = () => {
		call_secure_get_api('profile')
			.then(
				(resolve) => {
					if (resolve.status === true) {
						SetProfile(resolve.data);
					}
					else {
						SetProfile([]);
					}
				},
				(reject) => {
					console.log(reject);
				}
			)
	}
	const logout_all_device = () => {
		call_secure_api('logout', { logout: 'all' })
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
	const upload_profile_logo = () => {
		setDisplay(<ProfileLogo seller_id={profile.id} company_logo={profile?.company_logo} model_handler={handleCallback} />);
	}
	const update_profile = () => {
		setDisplay(<EditProfile profile={profile} model_handler={handleCallback} />)
	}
	return (
		<React.Fragment>
			{display}			
			<div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
				<div className="row g-4">
					<div className="col-auto">
						<div className="avatar-lg" onClick={() => upload_profile_logo()}>
							<img src={BaseUrl.resource_url+'/' + profile?.profile_img} alt={profile?.master_name}/>
						</div>
					</div>
					<div className="col">
						<div className="p-2">
							<h3 className="text-white mb-1">{profile?.master_name}</h3>
							<p className="text-white text-opacity-75">{profile?.master_email}</p>
							<p className="text-white">{formatDate(profile?.created_at, 'string')}</p>
							<p className="fs-14 mb-0">Reg Date</p>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-12">
					<div>
						<div className="d-flex profile-wrapper">
							<ul className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
								<li className="nav-item">
									<a className="nav-link fs-14 active" data-bs-toggle="tab" onClick={() => setTab('overview')} href="#overview-tab" role="tab">
										<i className="ri-airplay-fill d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Overview</span>
									</a>
								</li>
								<li className="nav-item">
									<a className="nav-link fs-14" data-bs-toggle="tab" onClick={() => setTab('activities')} href="#activities" role="tab">
										<i className="ri-list-unordered d-inline-block d-md-none"></i> <span className="d-none d-md-inline-block">Activities</span>
									</a>
								</li>
							</ul>
							<div className="flex-shrink-0">
								<Link to={'/password'} className="btn btn-warning me-2"><i className="bx bx-lock align-bottom"></i> Change Password</Link>
								<a onClick={() => update_profile()} className="btn btn-success"><i className="bx bx-edit align-bottom"></i> Edit Profile</a>
							</div>
						</div>
						<div className="tab-content pt-4 text-muted">
							<div className="tab-pane active" id="overview-tab" role="tabpanel">
								<div className="row">
									<div className="col-xxl-3">
										<div className="card">
											<div className="card-body">
												<h5 className="card-title mb-3">Info</h5>
												<div className="table-responsive">
													<table className="table table-borderless mb-0">
														<tbody>
															<tr>
																<th className="ps-0" scope="row">Full Name :</th>
																<td className="text-muted">{profile?.master_name}</td>
															</tr>
															<tr>
																<th className="ps-0" scope="row">Mobile :</th>
																<td className="text-muted">{profile?.master_mobile}</td>
															</tr>
															<tr>
																<th className="ps-0" scope="row">E-mail :</th>
																<td className="text-muted">{profile?.master_email}</td>
															</tr>
															<tr>
																<th className="ps-0" scope="row">Role :</th>
																<td className="text-muted">{profile?.master_role}</td>
															</tr>
															<tr>
																<th className="ps-0" scope="row">Reg Date</th>
																<td className="text-muted">{formatDate(profile?.created_at, 'string')}</td>
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
											{current_tab == 'activities' && <ActivitySection />}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</React.Fragment>
	)
}
export default Profile