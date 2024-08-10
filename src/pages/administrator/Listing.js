import React, { useState, useEffect } from 'react'
import { call_secure_api, BaseUrl } from '../../connect/api.js';
import { toast } from 'react-toastify';
import Add from './Add.js';
import { Link } from "react-router-dom";
import Edit from './Edit.js';
import Swal from 'sweetalert2';
import { formatDateTime } from '../../helper/general.js';
import PasswordMdl from './PasswordMdl.js';
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
const Listing = (props) => {
  const [administrator_list, setAdministratorList] = useState([]);
  const [display, setDisplay] = useState(null);
  const [search_text, setSearchText] = useState("");
  const [master_status, setOwnerStatus] = useState("all");
  const dispatch = useDispatch();
  useEffect(() => {
    get_administrator_list();
    dispatch(changeBCSubTitle('Administrator List'));
  }, []);
  const get_administrator_list = () => {
    call_secure_api('administrator/list', { master_status: master_status, search_text: search_text })
      .then(
        (resolve) => {
          if (resolve.status === true) {
            //toast.success(resolve.message, 'success', 5000);
            setAdministratorList(resolve.data.administrator);
          }
          else {
            toast.error(resolve.message, 'error', 5000);
            setAdministratorList([]);
          }
        },
        (reject) => {
          console.log(reject);
          toast.error("Server Error", 'error', 5000);
        }
      )
  }
  const editAdministrator = (administrator) => {
    setDisplay(<Edit administrator={administrator} model_handler={parent_handler} />);
  }

  const addNewAdministrator = () => {
    setDisplay(<Add model_handler={parent_handler} />);
  }
  const delete_emp = (id) => {
    call_secure_api('administrator/delete', { 'administrator_id': id })
      .then(
        (resolve) => {
          if (resolve.status === true) {
            toast.success(resolve.message, 'success', 5000);
            get_administrator_list();
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
      get_administrator_list();
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
  const open_password_mdl = (administrator) => {
    setDisplay(<PasswordMdl administrator={administrator} model_handler={parent_handler} />);
  }
  const changeStatus = (administrator_id) => {
    let optopns = { 'id': administrator_id };
    call_secure_api('administrator/status', optopns)
      .then(
        (resolve) => {
          if (resolve.status == true) {
            toast.success(resolve.message, 'success', 2000);
            setAdministratorList(administrator_list.map((artwork) => {
              if (artwork.id == administrator_id) {
                return { ...artwork, master_status: resolve.data.master_status };
              } else {
                return artwork;
              }
            }))
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
  return (
    <>
      <div className="card radius-10">
        <div className="card-body border-bottom-dashed border-bottom">
          <div className="row g-3">
            <div className="col-xl-5">
              <div className="search-box">
                <input type="text" className="form-control search" value={search_text} onChange={(e) => setSearchText(e.target.value)} placeholder="Search for name, email, phone, reg no" />
                <i className="bx bx-search search-icon"></i>
              </div>
            </div>
            <div className="col-xl-7">
              <div className="row g-3">
                <div className="col-sm-4">
                  <div>
                    <select className="form-control" value={master_status} onChange={(e) => setOwnerStatus(e.target.value)}>
                      <option value="">Status</option>
                      <option value="all">All</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div>
                    <button type="button" className="btn btn-primary w-100" onClick={() => get_administrator_list()}> <i className="bx bx-search-alt-2 me-2 align-bottom"></i>Filters</button>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div>
                    <button onClick={() => addNewAdministrator()} className="btn btn-secondary radius-30 mt-2 mt-lg-0"><i className="bx bxs-plus-square"></i> New Administrator</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {display}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Active At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {administrator_list.map((item, index) => {
                  return (<tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="header-profile2 p-1">
                          <img src={BaseUrl.resource_url + item.profile_img}
                            alt={item.master_name} className="img-fluid d-block ms-0" />
                        </div>
                        <div>
                          <h5 className="fs-14 my-1">{item.master_name}
                            {/* <Link to={"/administrator/detail/" + item.id || 0}
                            className="text-reset">{item.master_name}</Link> */}
                          </h5>
                          <span className="text-muted">{item.master_mobile}</span>
                        </div>
                      </div>
                    </td>
                    <td>{item.master_email}</td>
                    <td>
                      <button className="btn btn-xs btn-secondary" onClick={() => open_password_mdl(item)}>******</button>
                    </td>
                    <td>{item.master_role}</td>
                    <td>{item.master_status == "1" ?
                      <div className="badge rounded-pill text-success bg-light-success fs-12 cursor-pointer" onClick={() => changeStatus(item.id)}><i className='bx bxs-circle'></i>Active</div>
                      :
                      <div className="badge rounded-pill text-danger bg-light-danger fs-12 cursor-pointer" onClick={() => changeStatus(item.id)}><i className='bx bxs-circle'></i>Inactive</div>
                    }
                    </td>
                    <td>{item.created_at ? formatDateTime(item.created_at) : '---'}</td>
                    <td>{item.last_visit_at ? formatDateTime(item.last_visit_at) : '---'}</td>
                    <td>
                      <button className="btn btn-xs btn-primary" onClick={(e) => { editAdministrator(item) }}><i className='fa fa-edit'></i></button>
                      <button className="btn btn-xs ms-3 btn-danger" onClick={(e) => { deleteEmp(item.id) }} ><i className='fa fa-trash'></i></button>
                    </td>
                  </tr>)
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
export default Listing