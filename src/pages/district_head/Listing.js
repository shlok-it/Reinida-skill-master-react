import React, { useState, useEffect, useMemo } from 'react'
import { call_secure_api, BaseUrl, call_secure_get_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import Add from './Add.js';
import upload_image from '../../assets/images/upload-image.webp';
import Edit from './Edit.js';
import Swal from 'sweetalert2';
import PasswordMdl from './PasswordMdl.js';
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from '../../Components/Common/DataTableShow.js';
import { useStateContext } from '../../contexts/ContextProvider.jsx';
const Listing = (props) => {
  const { state_list, district_list } = useStateContext();
  const [administrator_list, setAdministratorList] = useState([]);
  const { currentUser } = useStateContext();
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
    dispatch(changeBCSubTitle('District Head List'));
  }, []);
  const get_emp_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    call_secure_get_api(
      `district_head/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&status=${values.status}&search_key=${values.name}&district_id=${values.district_id}&state_code=${values.state_code}`)
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
            <div className='img-thumbnail ' >
              <img src={d.image_link ? BaseUrl.resource_url + '/' + d.image_link : upload_image} />
            </div>
          );
        },
        sortable: false,
        width: "45px"
      },
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        wrap: true,
        className: "text-left",
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },
      {
        name: "Mobile",
        selector: (row) => row.mobile,
        sortable: true,
        wrap: true,
        width: "100px"
      },
      {
        name: "State",
        selector: (row) => row['state']['name'],
        sortable: true,
        wrap: true,
        width: "100px"
      },
      {
        name: "District",
        selector: (row) => row['district']['name'],
        sortable: true,
        wrap: true,
        width: "100px"
      }, 
      {
        name: "Status",
        cell: (d) => {
          return (
            <div>{d.status === "1" ?
              <span className="badge rounded-pill text-success bg-light-success" onClick={(e)=>changeStatus(d.id)}><i className='fa fa-circle me-1'></i>Active</span>
              :
                <span className="badge rounded-pill text-danger bg-light-danger" onClick={(e)=>changeStatus(d.id)}><i className='fa fa-circle me-1'></i>Inactive</span>
            }
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
            <div className='d-flex'>
              <button className="btn btn-xs btn-primary text-nowrap me-1" onClick={(e) => { open_password_mdl(d) }}><i className='fa fa-lock'></i></button>
              <button className="btn btn-xs btn-primary text-nowrap me-1" onClick={(e) => { editAdministrator(d) }}><i className='fa fa-edit'></i></button>
              <button className="btn btn-xs btn-danger text-nowrap" onClick={(e) => { deleteEmp(d.id) }} ><i className='fa fa-trash'></i></button>
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

  const open_password_mdl = (item) => {
    setDisplay(<PasswordMdl item={item} model_handler={parent_handler} />);
  }
  const changeStatus = (administrator_id) => {
    let optopns = { 'id': administrator_id };
    call_secure_api('district_head/status', optopns)
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
  const editAdministrator = (item) => {
    setDisplay(<Edit item={item} model_handler={parent_handler} />);
  }

  const addNewAdministrator = () => {
    setDisplay(<Add model_handler={parent_handler} />);
  }
  const delete_emp = (id) => {
    call_secure_api('district_head/delete', { 'emp_id': id })
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
      text: "You want to delete this user?",
      icon: "warning",
      closeOnClickOutside: false,
      buttons: true,
      btnSize: "sm",
      confirmBtnBsStyle: 'danger',
      dangerMode: false,
    })
      .then(willDelete => {
        if (willDelete)
          delete_emp(id);
      });
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
            <div className="position-relative">
              <label className="col-form-label form-label">State</label>
              <select className="form-control form-control-sm" name="state_code" value={values.state_code} onChange={set('state_code')}>
                <option value="">Select State</option>
                {state_list.map((item, index) => {
                  return (
                    <option key={index} value={item.state_code}>{item.name}</option>
                  )
                })}
              </select>
            </div>
            <div className="position-relative">
              <label className="col-form-label form-label">District</label>
              <select className="form-control form-control-sm" name="district_id" value={values.district_id} onChange={set('district_id')}>
                <option value="">Select District</option>
                {district_list.map((item, index) => {
                  if (values.state_code == item.state_code) {
                    return (
                      <option key={index} value={item.id}>{item.name}</option>
                    )
                  }
                })}
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
            <div className="ms-auto">
              {currentUser.master_role != 'MANAGER' && <div className="ms-auto">
                <button onClick={() => addNewAdministrator()} className="btn btn-primary radius-30 mt-2 mt-lg-0"><i className="bx bxs-plus-square"></i>Add</button>
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