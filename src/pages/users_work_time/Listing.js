import React, { useState, useEffect, useMemo } from 'react'
import { call_secure_get_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import AddWork from './AddWork.js';
import { formatTime } from '../../helper/general.js';
import { useStateContext } from "../../contexts/ContextProvider";
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from '../../Components/Common/DataTableShow.js';
import TimeSchedule from './TimeSchedule.js';
const Listing = () => {
	const [emp_list, setEmpList] = useState([]);
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
		dispatch(changeBCSubTitle('Working Time', {}));
	}, [user_status]);
	const get_emp_list = (
		pagenum = page,
		size = perPage,
		col = colName,
		sort = sortBy
	) => {
		call_secure_get_api(
			`work/working_time?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&delay=1`
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
					toast.error("Server Error", "error", 5000);
				}
			)
	}
	// const addNewEmployee = (employee) => {
	// 	setDisplay(<AddWork employee={employee} model_handler={parent_handler} />);
	// }
	const openStime = (employee) => {
		setDisplay(<TimeSchedule employee={employee}  model_handler={parent_handler} />);
	}

	const parent_handler = (reload) => {
		setDisplay(null)
		if (reload) {
			get_emp_list();
		}
	}
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
	const columns = useMemo(
		() => [
			{
				name: "#",
				cell: (d, index) => <div>{indexfrom + index}</div>,
				sortable: false,
				width: "40px",
			},

			{
				name: "Teacher Name",
				selector: (row) => row.user_name,
				sortable: true,
				wrap: true,
				sortable: true,
			},
			{
				name: "Timing",
				cell: (d) => {
					return (
						<div>
							<strong>{formatTime(d.check_in)} - {formatTime(d.check_out)}</strong>
							<button onClick={() => openStime(d)} className="btn btn-sm btn-link btn-xs ms-1 fs-12">Edit</button>
						</div>
					);
				},
				wrap: false,
			},
			{
				name: "Check In Time",
				cell: (d) => {
					return (
						<div className='fs-12'><strong>{formatTime(d.check_in_start)} - {formatTime(d.check_in_end)}</strong></div>
					);
				},
				className: "text-nowrap",
				sortable: false,
			},
			{
				name: "Check Out Time",
				cell: (d) => {
					return (
						<div className='fs-12'><strong>{formatTime(d.check_out_start)} - {formatTime(d.check_out_end)}</strong></div>
					);
				},

				className: "text-nowrap",
				sortable: false,
			},
			{
				name: "School Name",
				cell: (d) => {
					return (
						<div className='fs-12'><span className='text-uppercase'>{d.school_name}</span>
							{/* <strong> */}
							{d.village_name ? d.village_name + ', ' : ''}
							{d.block_name ? d.block_name + ', ' : ''}
							{d.district_name ? d.district_name + ', ' : ''}
							{d.state_name ? d.state_name : ''}
							{/* </strong> */}
						</div>
					);
				},
				className: "text-nowrap",
				sortable: false,
			},
			{
				name: "Subject",
				selector: (row) => row.subject_name,
				className: "text-nowrap",
				sortable: true,
			},
		],
		[indexfrom]
	);
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
								className="btn btn-success"
							>
								Search
							</button>
						</div>
						<div className="ms-auto">
							{/* {currentUser.master_role != 'MANAGER' && <div className="ms-auto">
								<button onClick={() => openStime()} className="btn btn-primary radius-30 mt-2 mt-lg-0"><i className="bx bxs-plus-square"></i>Time Schedule</button>
							</div>} */}
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