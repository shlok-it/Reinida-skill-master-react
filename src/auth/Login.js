import React, { useState, useEffect } from 'react'
import { call_api, call_secure_get_api } from '../connect/api.js';
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";
import logoLight from "../assets/images/logo-light.jpg";
import login_bg from "../assets/images/login-bg.webp";
const Login = () => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassw] = useState("");
	const [passwordField, setPasswordField] = useState("password");
	const [remember, setRemember] = useState(false);
	const [today, setDate] = useState(new Date());
	useEffect(() => {
		setInterval(() => {
			setDate(new Date());
		}, 1000);
		check_session();
	}, [])
	const check_session = () => {
		const authenticated = secureLocalStorage.getItem("admin_authenticated");
		if (authenticated) {
			const get_profile = secureLocalStorage.getItem("admin_access_token");
			if (get_profile) {
				setLoading(true);
				call_secure_get_api('login/session')
					.then(
						(resolve) => {
							if (resolve.status === true) {
								window.location = "/master/dashboard";
							}
							else {
								setLoading(false);
							}
						},
						(reject) => {
							setLoading(false);
						}
					)
			}
		}
	}
	const submitThis = (e) => {
		e.preventDefault();
		const options = { email: email, password: password };
		setLoading(true);
		call_api('login/authenticate', options)
			.then(
				(resolve) => {
					if (resolve.status === true) {
						toast.success(resolve.message);
						secureLocalStorage.setItem("admin_authenticated", true);
						secureLocalStorage.setItem("admin_access_token", resolve.data['accessToken']);
						window.location = "/master/dashboard";
					}
					else {
						toast.error(resolve.message);
						setLoading(false);
					}
				},
				(reject) => {
					console.log(reject);
					toast.error("Server Error");
					setLoading(false);
				}
			)
	}
	return (
		<div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
			<div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
				<div className="d-flex justify-content-center h-100 align-items-center">
					<div className="authincation-content style-2">
						<div className="no-gutters border rounded">
							<div className="col-xl-12 tab-content">
							<div className="text-center mb-lg-4 mb-2 pt-5 logo">
									<img src={logoLight} alt="reskillindia" />
								</div>
								<div id="sign-up" className="auth-form tab-pane fade show active  form-validation">
									<form action="" onSubmit={submitThis}>
										<div className="text-center mb-4">
											<h3 className="text-center mb-2 text-dark">Log In</h3>
											{/* <span>Your Social Campaigns</span> */}
										</div>
										
										<div className="mb-3">
											<label htmlFor="email" className="form-label required">Email address</label>
											<input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
										</div>
										<div className="mb-3 position-relative">
											<label className="form-label required" htmlFor="password">Password</label>
											<input type={passwordField} className="form-control" id="password" value={password} onChange={(e) => setPassw(e.target.value)} placeholder="Password" />
											<span className="show-pass eye" onClick={() => setPasswordField(passwordField == 'password' ? 'text' : 'password')}>
												{passwordField == 'password' && <i className="fa fa-eye-slash"></i>}
												{passwordField == 'text' && <i className="fa fa-eye"></i>}
											</span>
										</div>
										<div className="form-row d-flex justify-content-between mt-4 mb-2">
											<div className="mb-3">
												<div className="form-check custom-checkbox mb-0">
													<input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="form-check-input" id="customCheckBox1" required="" />
													<label className="form-check-label" htmlFor="customCheckBox1">Remember my preference</label>
												</div>
											</div>
											<div className="mb-4">
												<a href="forgot-password.html" className="btn-link text-primary">Forgot Password?</a>
											</div>
										</div>
										<div className="mt-4">
											<button type="submit" disabled={loading} className="btn btn-block btn-primary"> {loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Login</button>
										</div>
									</form>
								</div>
								<div className="d-flex align-items-center justify-content-center">
									<a href="#" className="text-primary">Terms and Conditions</a>
									<a href="#" className="text-primary mx-5">Privacy Policy</a>
									<a href="#" className="text-primary">Contact Us</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Login