import React, { useEffect, useMemo, useState } from 'react';
import { toast } from "react-toastify";
import { call_secure_api, call_secure_get_api } from "../../connect/api";
import Swal from 'sweetalert2';
import Add from './Add.js';
import Edit from './Edit.js';
import { formatDate, formatDateTime, formatMonth } from '../../helper/general.js';
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from '../../Components/Common/DataTableShow.js';
const Listing = () => {
  const [display, setDisplay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emp_list, setEmp_list] = useState([]);
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexfrom, setIndexfrom] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const this_month = formatDate(
    new Date(new Date().setMonth(new Date().getMonth()))
  );
  const page = 1;
  const [colName, setColName] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search_date, setSearchDate] = useState("");
  const [search_key, setSearch_key] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    fetch_push_notification();
    getalluser();
    dispatch(changeBCSubTitle('Notification List'));
  }, []);

  const getalluser = () => {
    let optopns = {}
    call_secure_get_api('users/getUsersName', optopns)
      .then(
        (resolve) => {
          if (resolve.status == true) {
            setEmp_list(resolve.data)
          }
          else {
            setEmp_list([]);
          }
        },
        (reject) => {
          console.log(reject);
        }
      )
  }
  const fetch_push_notification = (pagenum = page, size = perPage, col = colName, sort = sortBy) => {
    call_secure_get_api(
      `notification/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_date=${search_date}&search_key=${search_key}&delay=1`
    ).then(
      (resolve) => {
        if (resolve.status == true) {
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
      }
    )
  }
  const columns = useMemo(
    () => [
      {
        name: "#",
        cell: (d, index) => <div>{indexfrom + index}</div>,
        sortable: false,
        width: '30px',
      },
      {
        name: "Created",
        selector: (row) => row.created_at,
        sortable: true,
        wrap: true,
      },
      {
        name: "Send Date",
        selector: (row) => row.send_at,
        sortable: true,
        wrap: true,
      },
      {
        name: "Title",
        selector: (row) => row.title,
        sortable: true,
        wrap: true,
      },
      {
        name: "Notification Text",
        selector: (row) => row.notification_text,
        wrap: true,
        sortable: false,
      },
      {
        name: "Target To",
        cell: (d) => {
          return ((d.target_to&& d.target_to.length>0)? d.target_to.length: 'All Staff')
        },
        sortable: false,
      },
      {
        name: "Status",
        cell: (d) => {
          return(d.status == "1" ?
            <div className="badge rounded-pill text-success bg-light-success fs-12 cursor-pointer" onClick={() => changeStatus(d.id)}>Active</div>
            :
            <div className="badge rounded-pill text-danger bg-light-danger fs-12 cursor-pointer" onClick={() => changeStatus(d.id)}>Inactive</div>
  )},
  sortable: false,
      },
      {
        name: "Action",
        cell: (d) => {
          return (
            <div className="d-flex justify-content-space-between">
              <button className="btn btn-primary btn-sm" onClick={() => edit_unit(d)}><i className="fa fa-edit"></i></button>
              <button className="btn btn-danger btn-sm mx-2" onClick={() => notification_delete(d.id)}><i className="fa fa-trash"></i></button>
              <button className="btn btn-info btn-sm" disabled={loading} onClick={() => notification_resend(d.id)}><i className="mdi mdi-send"></i></button>
            </div>
          );
        },
        sortable: false,
        wrap: false,
        // ignorerowclick: true,
        // allowoverflow: true,
        // button: false,
      },
    ],
    [indexfrom,emp_list,data]
  );
  const edit_unit = (data) => {
    setDisplay(<Edit data={data} model_handler={parent_handler} emp_list={emp_list} />);
  }
  const add_notification = () => {
    setDisplay(<Add model_handler={parent_handler} emp_list={emp_list} />);
  }
  const parent_handler = (reload, close = true) => {
    if (close) {
      setDisplay(null)
    }
    if (reload) {
      fetch_push_notification();
    }
  }
  const notification_delete = (notificationId) => {
    Swal.fire({
      title: "You want to delete this it",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: `
			NO
		  `,
    }).then((res) => {
      if (res.isConfirmed) {
        conformDeleteNotification(notificationId);
      }
    });
  };
  
  const conformDeleteNotification = (notificationId) => {
    let optopns = {
      'notificationId': notificationId
    }
    call_secure_api('notification/delete', optopns)
      .then(
        (resolve) => {
          if (resolve.status == true) {
            toast.success(resolve.message, 'success', 2000);
            fetch_push_notification();
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
  const conformedSendeNotification = (notificationId) => {
    let optopns = {
      'id': notificationId
    }
    call_secure_api('notification/send', optopns)
      .then(
        (resolve) => {
          if (resolve.status == true) {
            toast.success(resolve.message, 'success', 2000);
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
  const changeStatus = (notificationId) => {
    let optopns = { 'id': notificationId };
    call_secure_api('notification/status', optopns)
      .then(
        (resolve) => {
          if (resolve.status == true) {
            toast.success(resolve.message, 'success', 2000);
            if (data) {
              setData(data.map((artwork) => {
                if (artwork.id == notificationId) {
                  return { ...artwork, status: resolve.data.status };
                } else {
                  return artwork;
                }
              }))
            }
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
  const notification_resend = (notificationId) => {
    Swal.fire({
      title: "Are you sure? You want to send this it?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: `
			NO
		  `,
    }).then((res) => {
      if (res.isConfirmed) {
        conformedSendeNotification(notificationId);
      }
    });
  };
 


  const handlePageChange = (page) => {
    fetch_push_notification(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetch_push_notification(page, newPerPage);
    setPerPage(newPerPage);
  };

  // const handleChange = useCallback((state) => {
  //   setSelectedRows(state.selectedRows);
  // }, []);

  const handleSort = (column, sortDirection) => {
    const str = column.selector.toString();
    const arr = str.split('.');
    const colName = arr[1] ? arr[1] : '';
    fetch_push_notification(page, perPage, colName, sortDirection);
    setColName(colName);
    setSortBy(sortDirection);
  };
  return (
    <>
      <div className="card radius-10">
        <div className="card-body">
          <div className="d-lg-flex align-items-center mb-4 gap-3">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm radius-30"
                placeholder="Search Title"
                value={search_key||''}
                onChange={(e) => setSearch_key(e.target.value)}
              />
            </div>
            <div className="position-relative">
              <input
                type="date"
                max={this_month}
                value={search_date||''}
                onChange={(e) => setSearchDate(()=>e.target.value)}
                className="form-control form-control-sm radius-30"
              />
            </div>
            <div className="position-relative">
              <button onClick={() => fetch_push_notification()} className="btn btn-secondary btn-sm radius-30 mt-2 mt-lg-0">Search</button>
            </div>
            <div className="position-relative ms-auto">
              <button className="btn btn-info btn-sm" onClick={() => add_notification()}><i className="fa fa-plus"></i>Add Notification</button>
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
    </>
  );
}
export default Listing;