import React, { useState, useEffect, useMemo } from 'react'
import { call_secure_api, BaseUrl, call_secure_get_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import AddUser from './AddUser.js';
import EditUser from './EditUser.js';
import UploadProfilepic from './UploadProfilepic.js';
import PasswordMdl from './PasswordMdl.js';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatDate } from '../../helper/general.js';
import { useStateContext } from "../../contexts/ContextProvider";
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import upload_image from '../../assets/images/upload-image.webp';
import UploadDucument from './UploadDucument.js';
import DataTableShow from '../../Components/Common/DataTableShow.js';
const TerminatedTeacher = () => {
	const [display, setDisplay] = useState(null);
	const { currentUser } = useStateContext();
	const [user_status, SetUserStatus] = useState(null);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [indexfrom, setIndexfrom] = useState(0);
	const [perPage, setPerPage] = useState(10);
	const page = 1;
	const [colName, setColName] = useState("");
	const [sortBy, setSortBy] = useState("");
	const [search_key, setSearch_key] = useState("");
	const dispatch = useDispatch();
	useEffect(() => {
		get_emp_list();
		dispatch(changeBCSubTitle('Teacher List'));
	}, [user_status]);
	const get_emp_list = (
		pagenum = page,
		size = perPage,
		col = colName,
		sort = sortBy
	) => {
		call_secure_get_api(
			`users/trashUser?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&delay=1`
		).then(
			(resolve) => {
				if (resolve.status === true) {
					setData(resolve.data.data);
					setIndexfrom(resolve.data.from);
					setTotalRows(resolve.data.total);
					setLoading(false);
				}
				else {
					toast.error(resolve.message, "error", 5000);
					setData([]);
				}
			},
			(reject) => {
				console.log(reject);
				toast.error("Server Error", 'error', 5000);
			}
		)
	}

	const delete_emp = (id) => {
		call_secure_api('users/trashUserRestore', { 'emp_id': id })
			.then(
				(resolve) => {
					if (resolve.status === true) {
						toast.success(resolve.message, 'success', 5000);
						get_emp_list();
					}
					else {
						toast.error(resolve.message, 'error', 5000);
					}
				},
				(reject) => {
					console.log(reject);
					toast.error("Server Error", 'error', 5000);
				}
			)
	}


	const deleteEmp = (id) => {
		Swal.fire({
			title: "Do you want to Restore  this Teacher?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes",
			cancelButtonText: `
			NO
		  `,
		})
			.then(res => {
				if (res.isConfirmed) {
					delete_emp(id);
				}
			});
	}
	const columns = useMemo(
		() => [
			{
				name: "#",
				cell: (d, index) => <div>{indexfrom + index}</div>,
				sortable: false,
				width: "40px",
			},

			{
				name: "Img",
				cell: (d) => {
					return (
						<div className='img-thumbnail c-pointer'>
							<img src={d.image_link ? BaseUrl.resource_url + '/' + d.image_link : upload_image} />
						</div>
					);
				},
				sortable: false,
				width: "45px"
			},
			{
				name: "Full Name",
				selector: (row) => row.full_name,
				sortable: true,
				wrap: true,
				className: "text-left",
			},
			
			{
				name: "Reg No.",
				selector: (row) => row.reg_code,
				sortable: true,
				wrap: true,
				width: "100px"
			},
			{
				name: "Dob",
				selector: (row) => row.dob,
				sortable: true,
				wrap: true,
				width: "100px"
			},
			{
				name: "Email",
				selector: (row) => row.email,
				sortable: true,
				className: "text-nowrap",
			},
			{
				name: "Contact",
				selector: (row) => row.contact,
				sortable: true,
				wrap: true,
				width: "100px"
			},
			{
				name: "Status",
				cell: (d) => {
					return (
						<div className={"text-danger bg-light-danger "}>{"Terminated"}</div>
					);
				},
				wrap: true,
				width: "80px"
			},

			{
				name: "Terminated",
				cell: (d) =>formatDate(d.deleted_at,'dmy'),
				sortable: true,
				wrap: true,
				width: "100px"
			},
			{
				name: "Action",
				cell: (d) => {
					return (
						<div className='d-flex'> 
							<button className="btn btn-xs btn-info me-1 text-nowrap" onClick={(e) => { deleteEmp(d.id) }} >Restore</button>
							{currentUser.master_role == 'HEADADMIN' && <button className="btn btn-xs btn-danger text-nowrap" onClick={(e) => { deleteEmp(d.id) }} >Delete</button>}
						</div>
					);
				},
				wrap: true,
				// className: "text-nowrap",
				sortable: false,
			},

		],
		[indexfrom]
	);
	const handlePageChange = (page) => {
		get_emp_list(page);
		setCurrentPage(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		get_emp_list(page, newPerPage);
		setPerPage(newPerPage);
	};
	const handleSort = (column, sortDirection) => {
		const str = column.selector.toString();
		const arr = str.split(".");
		const colName = arr[1] ? arr[1] : "";
		get_emp_list(page, perPage, colName, sortDirection);
		setColName(colName);
		setSortBy(sortDirection);
	};
	const searchFun = (e) => {
		e.preventDefault();
		get_emp_list();
	};
	return (
		<React.Fragment>
			<div className="card radius-10">
				<div className="card-body">
					<div className="d-lg-flex align-items-center mb-4 gap-3">
						<div className="position-relative">
							<input
								type="text"
								className="form-control form-control-sm radius-30"
								value={search_key}
								onChange={(e) => setSearch_key(() => e.target.value)}
								placeholder="Search Teacher"
							/>
						</div>
						<div>
							<button
								type="button"
								onClick={(e) => searchFun(e)}
								className="btn btn-success "
							>
								Search
							</button>
						</div>
					</div>

					{display}
					<DataTableShow
						// title="Career Form"
						header={"table-light"}
						highlightOnHover={true}
						responsive={true}
						data={data}
						columns={columns}
						selectableRows={true}
						pagination={true}
						onSort={handleSort}
						progressPending={loading}
						sortServer={true}
						paginationServer={true}
						paginationTotalRows={totalRows}
						paginationDefaultPage={currentPage}
						onChangeRowsPerPage={handlePerRowsChange}
						onSelectedRowsChange={false}
						onChangePage={handlePageChange}
					/>
				</div>
			</div>
		</React.Fragment>
	)
}
export default TerminatedTeacher