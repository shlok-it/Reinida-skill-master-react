import React, { useState, useEffect, useMemo } from 'react'
import { call_secure_api, call_secure_get_api } from '../../../connect/api.js';
import { toast } from 'react-toastify';
import { formatTime, formatDateTime } from '../../../helper/general.js';
import AddDistrict from './AddDistrict';
import EditDistrict from './EditDistrict';
import { changeBCSubTitle } from "../../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from '../../../Components/Common/DataTableShow.js';
const Index = () => {
    const [display, setDisplay] = useState(null);
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
        dispatch(changeBCSubTitle('District List'));
    }, []);
    const get_emp_list = (
        pagenum = page,
		size = perPage,
		col = colName,
		sort = sortBy
    ) => {
        call_secure_get_api(
        `location/district?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&delay=1`)
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        setData(resolve.data.data);
						setIndexfrom(resolve.data.from);
						setTotalRows(resolve.data.total);
						setLoading(false);
                    }
                    else {
                        toast.error(resolve.message);
                        setData([]);
                    }
                },
                (reject) => {
                    console.log(reject);
                    toast.error("Server Error");
                }
            )
    }
 
    const parent_handler = (reload) => {
        setDisplay(null)
        if (reload) {
            get_emp_list();
        }
    }
    const addDistrict = () => {
        setDisplay(<AddDistrict model_handler={parent_handler} />);
    }
    const editDistrict = (item) => {
        setDisplay(<EditDistrict item={item} model_handler={parent_handler} />);
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
                name: "State",
                selector: (row) => row.state?.name||'---',
                sortable: false,
                wrap: true,
            },
            
            {
                name: "District",
                selector: (row) => row.name,
                sortable: true,
                wrap: true,
                sortable: true,
                width: "100px"
            },
          
            {
                name: "Created",
                selector: (row) => row.created_at,
                sortable: true,
                wrap: true,
                width: "100px"
            },
            {
                name: "Updated",
                selector: (row) => row.updated_at,
                sortable: true,
                wrap: true,
                width: "100px"
            },
            {
                name: "Status",
                cell: (d) => {
                    return (
                        <div>{d.status == "1" ?
                        <div className="badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3"><i className='bx bxs-circle me-1'></i>Active</div>
                        :
                        <div className="badge rounded-pill text-danger bg-light-danger p-2 text-uppercase px-3"><i className='bx bxs-circle me-1'></i>Inactive</div>
                    }
                    </div>
                    );
                },
                wrap: true,
                width: "80px"
            },
            {
                name: "Action",
                cell: (d) => {
                    return (
                        <div className='d-flex'>
                            <button className="btn btn-xs btn-success text-nowrap" onClick={(e) => { editDistrict(d) }}><i className='bx bxs-edit'></i> Edit</button>                                                       
                        </div>
                    );
                },
                wrap: true,
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
            <div className="card radius-10">
                <div className="card-body">
                <div className="d-lg-flex align-items-center mb-4 gap-3">
						<div className="position-relative">
							<input
								type="text"
								className="form-control form-control-sm radius-30"
								value={search_key}
								onChange={(e) => setSearch_key(() => e.target.value)}
								placeholder="Search District"
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
                            <button onClick={() => addDistrict()} className="btn btn-primary radius-30 mt-2 mt-lg-0"><i className="bx bxs-plus-square"></i>Add District</button>
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
    )
   
}
export default Index