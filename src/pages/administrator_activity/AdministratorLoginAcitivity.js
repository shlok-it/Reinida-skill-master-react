import React, { useState, useEffect, useMemo } from 'react'
import { call_secure_api, BaseUrl, call_secure_get_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from '../../Components/Common/DataTableShow.js';
import { useStateContext } from '../../contexts/ContextProvider.jsx';
import { formatDateTime } from '../../helper/general.js';
import ViewDetail from './ViewDetail';
const AdministratorLoginAcitivity = () => {
  const { state_list, district_list } = useStateContext();
  const [display, setDisplay] = useState(null);
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [indexfrom, setIndexfrom] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const page = 1;
  const [colName, setColName] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [values, setValues] = useState({
    name: '',
    status: '',
    state_code: '22',
    district_id: '',
  });
  const dispatch = useDispatch();
  useEffect(() => {
    get_emp_list();
    dispatch(changeBCSubTitle('Administrator Activity'));
  }, []);
  const get_emp_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    call_secure_get_api(
      `administrator/login_acitivity?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${values.name}&status=${values.status}&district_id=${values.district_id}&state_code=${values.state_code}`)
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

 
  const delete_emp = (id) => {
    call_secure_api('administrator/logoutOutAllSession', { 'user_id': id })
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
  const handleView = (dataView) => {
    setDisplay(<ViewDetail item={dataView} model_handler={parent_handler}  />);
  }

  const parent_handler = (reload, close = true) => {
    if (close) {
      setDisplay(null)
    }
    if (reload) {
      get_emp_list();
    }
  }
  const deleteEmp = async (id) => {
    await Swal.fire({
      title: "Are you sure?",
      text: "End all sessions of this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((res) => {
      if (res.isConfirmed) {
          delete_emp(id);
      }  else if (res.isDismissed) {

      }
    });
  };
 
  const set = name => {
    return ({ target: { value } }) => {
      setValues(oldValues => ({ ...oldValues, [name]: value }));
    }
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
        name: "Name",
        selector: (row) => row.master_name,
        sortable: true,
        wrap: true,
        className: "text-left",
      },
      {
        name: "Login Id",
        cell: (d) => <div> <button onClick={(e) => handleView(d)} title='View details' className=' badge rounded-pill text-info bg-light-info text-wrap'> {d.login_history?.login_id}</button></div>,
        sortable: false,
        wrap: true,
      },
      {
        name: "browserName",
        selector: (row) => row.login_history.browserName,
        sortable: false,
        wrap: true,
      },
      {
        name: "Platform Name",
        selector: (row) => row.login_history.platformName,
        sortable: false,
        wrap: true,
      },


      {
        name: "Status",
        cell: (d) => {
          return (
            <div>{d.login_history.session_status === "1" ?
              <span className="badge rounded-pill text-success bg-light-success" ><i className='fa fa-circle me-1'></i>Active</span>
              :
              <span className="badge rounded-pill text-danger bg-light-danger" ><i className='fa fa-circle me-1'></i>Inactive</span>
            }
            </div>
          );
        },
        wrap: true,
        width: "80px"
      },
      {
        name: "Created",
        cell: (d) => {
          return (
            <span>{formatDateTime(d.login_history.created_at)}</span>
          );
        },
        sortable: true,
        wrap: true,
        width: "100px"
      },
      {
        name: "Action",
        cell: (d) => {
          return (
            <div className='d-flex'>
              {d.login_history.session_status === "1" ?
                <button className="badge rounded-pill text-danger bg-light-danger" onClick={(e) => { deleteEmp(d.id) }} title="Cilck to logout"><i className='mdi mdi-logout me-1'></i>Logout</button>
                : '--'}
            </div>
          );
        },
        wrap: true,
        // className: "text-nowrap",
        sortable: false,
      },

    ],
    [indexfrom, data]
  );
  return (
    <React.Fragment>
      <div className="card radius-10">
        <div className="card-body">
          <div className="d-lg-flex align-items-center mb-4 gap-3">
            <div className="position-relative">
              <label className="col-form-label form-label">Name</label>
              <input type="text" className="form-control search" value={values.name} onChange={set('name')} placeholder="Search for name" />
            </div>
            <div className="position-relative">
              <label className="col-form-label form-label">Status</label>
              <select className="form-control" value={values.status} onChange={set('status')}>
                <option value="">Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
         
            <div>
              <button
                type="button"
                onClick={(e) => searchFun(e)}
                className="btn btn-success mt-5 btn-sm"
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
export default AdministratorLoginAcitivity