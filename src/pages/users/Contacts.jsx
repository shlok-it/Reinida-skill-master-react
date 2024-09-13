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
const Contacts = () => {
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
			`users/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&delay=1`
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

	const changeStatus = (dataParam) => {
		Swal.fire({
			title: `Do you want to ${dataParam.status === '1' ? 'Inactive' : 'Active'} ${dataParam.full_name} ? `,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: 'Yes',
		}).then((res) => {
			if (res.isConfirmed) {
				handleChange(dataParam);
			} 
		});
	};
	const handleChange = (dataItem) => {
		let dataParam = { 'emp_id': dataItem.id };
		call_secure_api('users/updateStatus', dataParam)
			.then(
				(resolve) => {
					if (resolve.status == true) {
						toast.success(resolve.message, 'success', 2000);
						const updatedRows = data.map(item=>{
							if(item.id === dataItem.id){
								return {...item,status:item.status==='1'?0:1}
							}
							return item;
						})
						setData(()=>updatedRows);	
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
	const uploadImage = (employee) => {
		setDisplay(<UploadProfilepic employee={employee} model_handler={parent_handler} />);
	}
	const document = (employee) => {
		setDisplay(<UploadDucument employee={employee} model_handler={parent_handler} />);
	}
	const addNewEmployee = () => {
		setDisplay(<AddUser model_handler={parent_handler} />);
	}
	const delete_emp = (id) => {
		call_secure_api('users/delete', { 'emp_id': id })
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
			title: "Do you want to Terminate this?",
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
						<div className='img-thumbnail c-pointer' onClick={() => uploadImage(d)}>
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
			// {
			// 	name: "Father/Husband Name",
			// 	selector: (row) => row.father_name,
			// 	sortable: true,
			// 	wrap: true,
			// },
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
						<div>
							<button className={" badge rounded-pill " +
								(d.status === "1" ? "text-success bg-light-success" : "text-danger bg-light-danger")
							} onClick={(e) => changeStatus(d)}><i className='fa fa-circle me-1'></i>{d.status === '1' ? 'Active' : "Inactive"}</button>
						</div>
					);
				},
				wrap: true,
				width: "80px"
			},

			{
				name: "Created",
				selector: (row) => row.created_at,
				sortable: true,
				wrap: true,
				width: "100px"
			},
			{
				name: "Action",
				cell: (d) => {
					return (
						<div className='d-flex'> <button className="btn btn-xs btn-info text-nowrap" onClick={(e) => { document(d) }} >Doc</button>
							{/* {currentUser.master_role != 'MANAGER' && <button className="btn btn-xs mx-1 btn-success" onClick={(e) => { editEmp(item) }}>Edit</button>} */}
							<Link className="btn btn-xs mx-1 btn-success text-nowrap" to={'/teachers/' + d.reg_code}>View</Link>
							<button className="btn btn-xs btn-danger text-nowrap" onClick={(e) => { deleteEmp(d.id) }} >Terminate</button>
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
						<div className="ms-auto">
							<div className="ms-auto">
								<button onClick={() => addNewEmployee()} className="btn btn-primary radius-30 mt-2 mt-lg-0"><i className="bx bxs-plus-square"></i>Add New Teacher</button>
							</div>
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
export default Contacts