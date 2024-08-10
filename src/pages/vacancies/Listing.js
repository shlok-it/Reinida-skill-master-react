import React, { useState, useEffect, useMemo } from 'react'
import { call_secure_api, call_secure_get_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import AddVacancies from './AddVacancies.js';
import EditVacancies from './EditVacancies.js';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatDate } from '../../helper/general.js';
import { useStateContext } from "../../contexts/ContextProvider";
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from '../../Components/Common/DataTableShow.js';
const Listing = () => {
	const [display, setDisplay] = useState(null);
	const { currentUser } = useStateContext();
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [user_status, SetUserStatus] = useState(null);
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
		dispatch(changeBCSubTitle('Vacancies List', {}));
	}, [user_status]);
	const get_emp_list = (pagenum = page,
		size = perPage,
		col = colName,
		sort = sortBy) => {
		setLoading(true);
		call_secure_get_api(
			`vacancies/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&delay=1`
		)
			.then(
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
	const editEmp = (employee) => {
		setDisplay(<EditVacancies employee={employee} model_handler={parent_handler} />);
	}

	const addNewEmployee = (employee) => {
		setDisplay(<AddVacancies employee={employee} model_handler={parent_handler} />);
	}
	const delete_emp = (id) => {
		call_secure_api('vacancies/delete', { 'v_id': id })
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
	const parent_handler = (reload) => {
		setDisplay(null)
		if (reload) {
			get_emp_list();
		}
	}
	const deleteEmp = (id) => {

		Swal.fire({
			title: "Do you want to delete this?",
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
				name: "Shool Name",
				selector: (row) => row.school_name,
				sortable: true,
				wrap: true,
				// grow: 2,
			},
			{
				name: "Location",
				cell: (d) => {
					return (<div>
						{d.village_name ? d.village_name + ', ' : ''}
						{d.block_name ? d.block_name + ', ' : ''}
						{d.district_name ? d.district_name + ', ' : ''}
						{d.state_name ? d.state_name : ''}
					</div>)
				},
				wrap: false,
			},
			
			{
				name: <div> Vacancies
					<div className='d-flex tbl_mid tbl_f10'>
						<div className='text-left'>Subject</div>
						<div className='text-right v_border'>No of vacancies</div>
					</div>
				</div>,
				cell: (d) => {
					return (
						<div>
							{d['vacancies_subject']&&d['vacancies_subject'].map((val, i) => {
								return (
									<div className='d-flex tbl_mid' key={i} title={val.vacancies_for}>
										<div className='text-left'>{val.subject_name}</div>
										<div className='text-right v_border'>{val.no_of_post}</div>
									</div>
								)
							})}
						</div>
					);
				},
			},{
				name:'Teacher',
				cell: (d) => {
					return (
						<div>
							{d['teachers']&&d['teachers'].map((val, i) => {
								return (
									<div className='' key={i} title={val.teacher_name}>
										<div className='text-center'>{val.teacher_name}</div>
									</div>
								)
							})}
						</div>
					);
				},	wrap: true,
			},
			{
				name: "Created",
				selector: (row) => row.created_at,
				sortable: true,
				width: "100px",
			},
			{
				name: "Status",
				cell: (d) => {
					return (
						<div >
							{d.status === "1" ?
								<span className="badge rounded-pill btn-sm text-success bg-light-success"><i className='fa fa-circle me-1'></i>Active</span>
								:
								d.status === "2" ?
									<span className="badge rounded-pill btn-sm text-success bg-light-success"><i className='fa fa-circle me-1'></i>Expired</span>
									:
									<span className="badge rounded-pill btn-sm text-danger bg-light-danger"><i className='fa fa-circle me-1'></i>Pending</span>
							}
						</div>
					);
				},
				className: "text-nowrap",
				width: "100px",
			},
			{
				name: "Actions",
				cell: (d) => {
					return (
						<div className='d-flex'>
							{/* {currentUser.master_role != 'MANAGER' && <button className="btn btn-xs mx-1 btn-success" onClick={(e) => { editEmp(item) }}>Edit</button>} */}
							<button onClick={() => addNewEmployee(d.id)} className="btn btn-primary radius-30 btn-sm mt-2 mt-lg-0">Edit</button>
							{currentUser.master_role == 'HEADADMIN' && <button className="btn btn-sm btn-xs ms-1 btn-danger" onClick={() => deleteEmp(d.id)} >Delete</button>}
						</div>
					);
				},
				className: "text-nowrap",
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
								placeholder="Search School name"
							/>
						</div>
						<div>
							<button
								type="button"
								onClick={(e) => searchFun(e)}
								className="btn btn-success"
							>
								Search
							</button>
						</div>
						<div className="ms-auto">
							{currentUser.master_role != 'MANAGER' && <div className="ms-auto">
								<button onClick={() => addNewEmployee(0)} className="btn btn-primary radius-30 mt-2 mt-lg-0"><i className="bx bxs-plus-square"></i>Add Vacancies</button>
							</div>}
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
export default Listing