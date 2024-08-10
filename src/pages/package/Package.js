import React, { useState, useEffect } from 'react'
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import AddPackageMdl from './AddPackageMdl.js';
import EditPackageMdl from './EditPackageMdl.js';
import { formatTime, formatDateTime } from '../../helper/general.js';
import swal from 'sweetalert';
import BreadCrumb from '../../Components/Common/BreadCrumb.js';
const Package = () => {
	const [display, setDisplay] = useState(null);
	const [package_list, setPackageList] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		get_package_list();
	}, []);
	const get_package_list = () => {
		call_secure_api('package/list', {})
			.then(
				(resolve) => {
					if (resolve.status === true) {
						setPackageList(resolve.data);
					}
					else {
						toast.error(resolve.message, 'error', 5000);
						setPackageList([]);
					}
				},
				(reject) => {
					console.log(reject);
					toast.error("Server Error", 'error', 5000);
				}
			)
	}
	const AddPackage = () => {
		setDisplay(<AddPackageMdl model_handler={parent_handler} />);
	}
	const parent_handler = (reload) => {
		setDisplay(null)
		if (reload) {
			get_package_list();
		}
	}
	const deletePackage = (id) => {
		swal({
			title: "Are you sure?",
			text: "You want to delete this package?",
			icon: "warning",
			closeOnClickOutside: false,
			buttons: true,
			btnSize: "sm",
			confirmBtnBsStyle: 'danger',
			dangerMode: false,
		})
			.then(willDelete => {
				if (willDelete)
					delete_office_package(id);
			});
	}
	const delete_office_package = (id) => {
		setLoading(true);
		call_secure_api('package/delete', { 'package_id': id })
			.then(
				(resolve) => {
					if (resolve.status === true) {
						toast.success(resolve.message, 'success', 5000);
						get_package_list();
					}
					else {
						toast.error(resolve.message, 'error', 5000);
					}
					setLoading(false);
				},
				(reject) => {
					console.log(reject);
					setLoading(false);
					toast.error("Server Error", 'error', 5000);
				}
			)
	}
	const editPackage = (packages) => {
		setDisplay(<EditPackageMdl package={packages} model_handler={parent_handler} />);
	}
	return (
		<React.Fragment>
			<BreadCrumb title="Digital Marketing" pageTitle="Package" />
			<div className="card radius-10">
				<div className="card-body">
					<div className="d-lg-flex align-items-center mb-4 gap-3">
						<div className="ms-auto">
							<button onClick={() => AddPackage()} className="btn btn-primary radius-30 mt-2 mt-lg-0"><i className="bx bxs-plus-square"></i>Add Package</button>
						</div>
					</div>
					{display}
					<div className="table-responsive">
						<table className="table table-responsive-md table-striped table-bordered">
							<thead className='table-light'>
								<tr>
									<th>#</th>
									<th>Created</th>
									<th>Name</th>
									<th>Total Module</th>
									<th>Updated</th>
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{package_list.map((item, index) => {
									return (<tr key={index}>
										<td>{index + 1}</td>
										<td><span>{formatDateTime(item.created_at)}</span></td>
										<td><span>{item.package_name}</span></td>
										<td><span>{item.total_module || 0}</span></td>
										<td><span>{formatDateTime(item.updated_at)}</span></td>
										<td>{item.status === "1" ?
											<div className="badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3"><i className='bx bxs-circle me-1'></i>Active</div>
											:
											<div className="badge rounded-pill text-danger bg-light-danger p-2 text-uppercase px-3"><i className='bx bxs-circle me-1'></i>Inactive</div>
										}
										</td>
										<td>
											<button className="btn btn-sm btn-success" onClick={(e) => { editPackage(item) }}><i className='bx bxs-edit'></i> Edit</button>
											<button className="btn btn-sm ms-3 btn-danger" disabled={loading} onClick={(e) => { deletePackage(item.id) }} ><i className='bx bxs-trash'></i> Delete</button>
										</td>
									</tr>)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}
export default Package