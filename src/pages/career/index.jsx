import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  call_secure_api,
  BaseUrl,
  call_secure_get_api,
} from "../../connect/api.js";
import { toast } from "react-toastify";
import ViewForm from "./ViewForm";
import upload_image from "../../assets/images/upload-image.webp";
import Swal from "sweetalert2";
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import {  formatMonth } from "../../helper/general.js";
import "./index.css";
import DataTableShow from "../../Components/Common/DataTableShow.js";
const Career = () => {
  const [logosname, setLogos] = useState([]);
  const [display, setDisplay] = useState(null);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexfrom, setIndexfrom] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const page = 1;
  const this_month = formatMonth(
    new Date(new Date().setMonth(new Date().getMonth()))
  );
  const [colName, setColName] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search_key, setSearch_key] = useState('');
  const [search_date, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  useEffect(() => {
    get_emp_list();
    dispatch(changeBCSubTitle("Career"));
  }, []);

  const get_emp_list = (pagenum = page, size = perPage,col=colName,sort=sortBy) => {
    setLoading(true);
    call_secure_get_api(
      `career/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&status=${searchStatus}&month=${search_date}&delay=1`
    ).then(
      (resolve) => {
        if (resolve.status === true) {
          setLogos(resolve.data.logos);
          setData(resolve.data.items.data);
          setIndexfrom(resolve.data.items.from);
          setTotalRows(resolve.data.items.total);
          setLoading(false);
        } else {
          toast.error(resolve.message, "error", 5000);
          setData([]);
        }
      },
      (reject) => {
        console.log(reject);
        toast.error("Server Error", "error", 5000);
      }
    );
  };

  const ViewDetail = (item_data) => {
    // console.log(logosname);
    // console.log(item_data);
    setDisplay(
      <ViewForm
        employee={item_data}
        skill_india_logo ={logosname.skill_india_logo}
        make_in_india={logosname.make_in_india}
        logo ={logosname.logo}
        model_handler={parent_handler}
      />
    );
  }

  const delete_emp =(id) => {
    call_secure_api("career/deleteItem", { emp_id: id }).then(
      (resolve) => {
        if (resolve.status === true) {
          toast.success(resolve.message, "success", 5000);
          get_emp_list();
        } else {
          toast.error(resolve.message, "error", 5000);
        }
      },
      (reject) => {
        console.log(reject);
        toast.error("Server Error", "error", 5000);
      }
    );
  }

  const parent_handler = (reload) => {
    setDisplay(null);
    if (reload) {
      get_emp_list();
    }
  };

  const deleteEmp = (id) => {
    Swal.fire({
      title: "Do you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: `
			NO
		  `,
    }).then((res) => {
      if (res.isConfirmed) {
        delete_emp(id);
      }
    });
  };
  const changeStatus = (dataParam) => {
    Swal.fire({
      title: `Do you want to accept or reject ${dataParam.full_name}'s application? `,
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Accept',
      denyButtonText: 'Reject',
      cancelButtonText: 'No',
    }).then((res) => {
      if (res.isConfirmed) {
        handleChange(dataParam,'Accept');
      } else if (res.isDenied) {
        handleChange(dataParam,'Reject');
      } else if (res.isDismissed) {

      }
    });
  };

  const handlePageChange = (page) => {
    get_emp_list(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    get_emp_list(page, newPerPage);
    setPerPage(newPerPage);
  };

  const handleChange = (dataItem,status) => {
    let dataParam = { 'emp_id': dataItem.id,'status':status };
    call_secure_api('career/changeStatus', dataParam)
      .then(
        (resolve) => {
          if (resolve.status == true) {
            toast.success(resolve.message, 'success', 2000);
            get_emp_list();
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
  // const handleChange = useCallback((state) => {
  //   setSelectedRows(state.selectedRows);
  // }, []);

  const handleSort = (column, sortDirection) => {
    const str = column.selector.toString();
    const arr = str.split('.');
    const colName = arr[1]?arr[1]:'';
    get_emp_list(page,perPage,colName, sortDirection);
    setColName(colName);
    setSortBy(sortDirection);
  };

  const columns = useMemo(
    () => [
      {
        name: "#",
        cell:(d,index)=><div>{indexfrom+index}</div>,
        sortable: false,
        width:'30px',
      },
      {
        name: "Img",
        cell:(d)=>{
          return(
            <div className="img-career-cat">
                <img
                  src={
                    d.photograph
                      ? BaseUrl.resource_url + "/" + d.photograph
                      : upload_image
                  }
                />
            </div>
          )
        },
        width:'50px',
      },
      {
        name: "Name",
        selector: (row) => row.full_name,
        sortable: true,
        // grow: 2,
      },
      {
        name: "Gender",
        selector: (row) => row.gender,
        sortable: false,
      },
      {
        name: "Mobile",
        selector: (row) => row.mobile_number,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },
      {
        name: "Job Title",
        selector: (row) => row.job_title,
        sortable: false,
        wrap: true,
      },

      {
        name: "Post",
        selector: (row) => row.post,
        sortable: false,
        wrap: true,
      },
       {
        name: "Status",
        cell: (d) => {
          return (
            <div>
              <button className={" badge rounded-pill "+
              (d.status === "Accept" ? "text-success bg-light-success" : d.status === "Reject" ? "text-danger bg-light-danger" :"text-dark bg-light-dark")
              } onClick={(e)=>changeStatus(d)}><i className='fa fa-circle me-1'></i>{d.status}</button>
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
      },
  
      {
        name: "Action",
        cell: (d) => {
          return (
            <div className="d-flex justify-content-space-between">
              <button
                className="btn btn-sm btn-success text-nowrap"
                onClick={() => ViewDetail(d)}
              >
                View
              </button>
              <button
                className="btn btn-sm btn-danger text-nowrap ms-1"
                onClick={() => deleteEmp(d.id)}
              >
                Delete
              </button>
            </div>
          );
        },
        wrap: false,
        // ignorerowclick: true,
        // allowoverflow: true,
        // button: false,
      },
    ],
    [indexfrom]
  );
  const searchFun=(e)=>{
    e.preventDefault();
      get_emp_list()
  }
  return (
    <React.Fragment>
      <div className="card radius-10">
        <div className="card-body">
        <div className="d-lg-flex align-items-center mb-4 gap-3">
            <div className="position-relative">
              <label>Name</label>
              <input
                type="text"
                className="form-control form-control-sm radius-30"
                value={search_key}
                onChange={(e)=>setSearch_key(()=>e.target.value)}
                placeholder="Search User"
              />
            </div>
            <div className="position-relative">
            <label>Month</label>
              <input
                type="month"
                max={this_month}
                value={search_date}
                onChange={(e) => setSearchDate(e.target.value)}
                className="form-control form-control-sm radius-30"
              />
            </div>
            <div className="position-relative">
            <label>Status</label>
              <select
                value={searchStatus}
                className="form-control"
                onChange={(e) => setSearchStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Accept">Accept</option>
                <option value="Reject">Reject</option>
              </select>
            </div>
            <div> <button type="button" onClick={(e)=>searchFun(e)} className="btn btn-success mt-2">Search</button></div>
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
  );
};
export default Career;
