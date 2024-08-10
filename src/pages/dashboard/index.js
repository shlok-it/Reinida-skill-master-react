import React, { useState, useEffect } from 'react'
import { call_secure_get_api, call_secure_api } from '../../connect/api.js';
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import OneSignal from 'react-onesignal';

const Dashboard = () => {
	const [dashboard_data, setDashboardData] = useState([]);
	const { currentUser } = useStateContext();
	useEffect(() => {
		get_dashboard_detail();
		// safari_web_id: "web.onesignal.auto.1a94b592-c98a-427e-9490-520bfcd23754",
		OneSignal.init({
			appId: '182d36db-b254-4793-a992-edcfe84336d0', allowLocalhostAsSecureOrigin: true,
			allowLocalhostAsSecureOrigin: true,
			notifyButton: {
				enable: false,
			}
		}).then(() => {
			OneSignal.Slidedown.promptPush();
			let token = OneSignal.User.PushSubscription;
			if (token) {
				//   secureLocalStorage.setItem("one_signal_user", token);
				SaveToken(token);
			}
		})
		get_dashboard_detail();
	}, []);

	const SaveToken = (token) => {
		call_secure_api("dashboard/web_token", {
			_token: token,
		}).then(
			(resolve) => {

			},
			(reject) => {
				// console.log(reject);
				// toast.error("Server Error", "error", 5000);
			}
		);
	};

	const get_dashboard_detail = () => {
		call_secure_get_api('dashboard', {})
			.then(
				(resolve) => {
					if (resolve.status === true) {
						const data = resolve.data;
						if (data) {
							const data_para = [
								{
									"url": 'teachers', 'name': "Teachers",
									'value': (data['total_users'] || 0),
									'class': "text-info"
								},
								{ "url": 'todayattendance', 'name': "Today check in", "value": data['today_check_in'] || 0, "class": "text-danger" },
								{ "url": 'todayattendance', 'name': "Today check out", "value": data['today_check_out'] || 0, "class": "text-success" },
								{ "url": 'leave-list', 'name': "Pending Leave Request", "value": data['pending_leave_request'] || 0, "class": "text-primary" },
								{ "url": 'galleryimage', 'name': "Gallery Image", "value": data['gallery_image'] || 0, "class": "text-danger" },
								{ "url": 'galleycategory', 'name': "Gallery Category", "value": data['gallery_category'] || 0, "class": "text-success" },
								{ "url": 'galleryvideo', 'name': "Video", "value": data['galleryvideo'] || 0, "class": "text-dark" },
								{ "url": 'career', 'name': "Career Forms", "value": data['career'] || 0, "class": "text-warning" },
								{ "url": 'location/district', 'name': "Total States", "value": data['total_States'] || 0, "class": "text-danger" },
								{ "url": 'location/district', 'name': "Total Districts", "value": data['total_districts'] || 0, "class": "text-warning" },
								{ "url": 'location/block', 'name': "Total Blocks", "value": data['total_Blocks'] || 0, "class": "text-success" },
							];
							setDashboardData(data_para);
						}
					}
				},
				(reject) => {
					console.log(reject);
					//toast.error("Server Error", 'error', 5000);
				}
			)
	}

	return (
		<React.Fragment>

			<div className="row row-cols-1 row-cols-md-2 row-cols-xl-5">
				{dashboard_data && dashboard_data.map((item, key) => {
					return <div className="col" key={key}>
						<div className="card radius-10 border-start border-0 border-3 border-info">
							<div className="card-body">
								<div className="d-flex align-items-center">
									<div>
										<p className="mb-0 text-secondary text-capitlize">{item.name}</p>
										<h4 className={"my-1 " + item.class}>{item.value}</h4>
										<Link to={"../" + item.url} className="mb-0 font-13 btn text-primary "><u>View</u></Link>
									</div>
									<div className="widgets-icons-2 ms-auto">
										<i className="mdi mdi-account-multiple-outline"></i>
									</div>
								</div>
							</div>
						</div>
					</div>

				})}

			</div>
			<React.Fragment>
			</React.Fragment>

		</React.Fragment>
	)
}
export default Dashboard