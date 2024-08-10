import React, { useState } from 'react'
import { call_secure_api } from '../connect/api.js';
import { toast } from 'react-toastify';
import BreadCrumb from '../Components/Common/BreadCrumb';
const ChangePassword = (props) => {
	const [loading, setLoading] = useState(false);
	const [values, setValues] = useState({ current_passowrd: '', new_password: '', confirm_password: '' });
	const submitThis = (e) => {
		e.preventDefault();
		if (values.current_passowrd == '') {
			toast.warning("Enter current password", 'warning', 5000);
		}
		else if (values.new_password == '') {
			toast.warning("Enter new password", 'warning', 5000);
		}
		else if (values.confirm_password == '') {
			toast.warning("Enter confirm password", 'warning', 5000);
		}
		else if (values.new_password != values.confirm_password) {
			toast.warning("Password not match", 'warning', 5000);
		}
		else {
			setLoading(true);
			call_secure_api('login/password', values)
				.then(
					(resolve) => {
						if (resolve.status === true) {
							toast.success(resolve.message, 'success', 5000);
						}
						else {
							toast.error(resolve.message, 'error', 5000);
						}
						setLoading(false);
					},
					(reject) => {
						console.log(reject);
						toast.error("Server Error", 'error', 5000);
						setLoading(false);
					}
				)
		}
	}
	const set = name => {
		return ({ target: { value } }) => {
			setValues(oldValues => ({ ...oldValues, [name]: value }));
		}
	};
	return (
		<React.Fragment>
			<div className="card radius-10">
				<div className="card-body">
					<div className='row'>
						<div className='col-sm-6 offset-3'>
							<form action="" onSubmit={submitThis}>
								<div className="form-group row">
									<div className="col-sm-12">
										<label className="col-form-label form-label">Current Password <span className="text-danger">*</span></label>
										<input className="form-control form-control-sm" type="password" value={values.current_passowrd} placeholder="Current Password" name="current_passowrd" onChange={set('current_passowrd')} />
									</div>
									<div className="col-sm-12">
										<label className="col-form-label form-label">New Password <span className="text-danger">*</span></label>
										<input className="form-control form-control-sm" type="password" value={values.new_password} placeholder="New Password" name="new_password" onChange={set('new_password')} />
									</div>
									<div className="col-sm-12">
										<label className="col-form-label form-label">Confirm Password <span className="text-danger">*</span></label>
										<input className="form-control form-control-sm" type="password" value={values.confirm_password} placeholder="Confirm Password" name="confirm_password" onChange={set('confirm_password')} />
									</div>
								</div>
								<div className="text-center py-3">
									<button type="submit" disabled={loading} className="border-0 btn btn-primary btn-gradient-primary btn-rounded">{loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Save</button>&nbsp;&nbsp;
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}
export default ChangePassword