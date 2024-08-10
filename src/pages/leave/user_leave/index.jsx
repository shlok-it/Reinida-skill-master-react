import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  call_secure_api,
  BaseUrl,
  call_secure_get_api,
} from "../../../connect/api.js";
import { toast } from "react-toastify";
import AddList from "./AddList";
import ViewForm from "./ViewForm";
import ImageView from "./ImageView";
import upload_image from "../../../assets/images/upload-image.webp";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useStateContext } from "../../../contexts/ContextProvider";
import { changeBCSubTitle } from "../../../slices/thunk";
import { useDispatch } from "react-redux";
import { dateDiffer, formatDate } from "../../../helper/general.js";
import "./index.css";
import DataTableShow from "../../../Components/Common/DataTableShow.js";
const UserLeave = () => {
  const [display, setDisplay] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const dispatch = useDispatch();
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
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");
  useEffect(() => {
    get_emp_list();
    dispatch(changeBCSubTitle("Leave list"));
  }, []);

  const get_emp_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    setLoading(true);
    call_secure_get_api(
      `leave/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&from_date=${from_date}&to_date=${to_date}&delay=1`
    ).then(
      (resolve) => {
        if (resolve.status === true) {
          setData(resolve.data.data);
          setIndexfrom(resolve.data.from);
          setTotalRows(resolve.data.total);
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
  const userLeavedetail = (item_data) => {
    // setLoading(true);
    call_secure_get_api(
      `leave/userLeavedetail?user_id=${item_data["user_id"]}`
    ).then(
      async (resolve) => {
        if (resolve.status === true) {
          // setLoading(false);
          const officeLeave = resolve.data.officeLeave;
          const userLeave = resolve.data.userLeave;
          const sesion_year = resolve.data.sesion_year;

          const leaveStatus = [
            {
              number: userLeave.cl + " / " + officeLeave.cl,
              name: "CL",
              class: "text-primary",
            },
            {
              number: userLeave.pl + " / " + officeLeave.pl,
              name: "PL",
              class: "text-success",
            },
            {
              number:
                parseInt(userLeave.cl) +
                parseInt(userLeave.pl) +
                "/" +
                (parseInt(officeLeave.cl) + parseInt(officeLeave.pl)),
              name: "Total Leave",
              class: "text-secondary",
            },
            
          ];
          const applicationStatus = [
            {
              number: userLeave.pending,
              name: "Pending",
              class: "text-warning",
            },
        
            {
              number: userLeave.reject,
              name: "Rejected",
              class: "text-danger",
            },
            {
              number: userLeave.accept,
              name: "Accept",
              class: "text-success",
            },
            {
              number: userLeave.total,
              name: "Total",
              class: "text-dark",
            },
          ];
          const currentDate = new Date();
          let nextData = new Date(currentDate);
          nextData.setDate(currentDate.getDate()-1)
          let isbutton = false;
          const differ = dateDiffer(nextData, item_data.date_from);
          if ((differ) >= 0 && item_data.updated_type == 'Pending') {
            isbutton = true;
          } else {
            isbutton = false;
          }
          // console.log(item_data);
          setDisplay(
            <ViewForm
              isbutton={isbutton}
              employee={item_data}
              leaveStatus={leaveStatus}
              applicationStatus={applicationStatus}
              session_year={sesion_year}
              url={BaseUrl.resource_url}
              model_handler={parent_handler}
              handleStatus={handle_Status}
              showImage={viewImages}
            />
          );
        } else {
          // setItems([]);
          // setLoading(false);
          toast.error(resolve.message);
        }
      },
      (reject) => {
        setLoading(false);
        toast.error("Server Error");
      }
    );
  };
  const viewImages = (imageLink)=>{

    setDisplayImage(
      <ImageView
        title={BaseUrl.resource_url+"/"+imageLink}
        image={BaseUrl.resource_url+"/"+imageLink}
        model_handler={Image_model_handler}
      />
    );
  }
  const handle_Status = (user_item, status) => {
    Swal.fire({
      title: `Do you want to ${status} this?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: `
			NO
		  `,
    }).then((res) => {
      if (res.isConfirmed) {
        updateStatus(user_item, status);
      }
    });
  };

  const ViewDetail = (item_data) => {
    if (item_data["user_id"]) {
      userLeavedetail(item_data);
    } else {
      toast.error("No can not open something wrong");
    }
  };

  const updateStatus = (user_item, status_) => {
    call_secure_api("leave/updateStatus", { emp_id: user_item.user_id,'id':user_item.id, status: status_ }).then(
      (resolve) => {
        if (resolve.status === true) {
          toast.success(resolve.message, "success", 5000);
          parent_handler(true);
        } else {
          toast.error(resolve.message, "error", 5000);
        }
      },
      (reject) => {
        console.log(reject);
        toast.error("Server Error", "error", 5000);
      }
    );
  };
  const delete_emp = (id) => {
    call_secure_api("leave/deleteItem", { emp_id: id }).then(
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
  };

  const Image_model_handler = (reload) => {
    setDisplayImage(null);
  
  };
  const parent_handler = (reload) => {
    setDisplay(null);
    if (reload) {
      get_emp_list();
    }
  };


  const handlePageChange = (page) => {
    get_emp_list(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    get_emp_list(page, newPerPage);
    setPerPage(newPerPage);
  };

  // const handleChange = useCallback((state) => {
  //   setSelectedRows(state.selectedRows);
  // }, []);

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
        name: "Created",
        selector: (row) => row.created_at,
        sortable: true,
        wrap: true,
      },
      {
        name: "Img",
        cell: (d) => {
          return (
            <div className="img-career-cat">
              <img
                src={
                  d.photograph
                    ? BaseUrl.resource_url + "/" + d.image_link
                    : upload_image
                }
              />
            </div>
          );
        },
        width: "70px",
      },
      {
        name: "Name",
        selector: (row) => row.full_name,
        sortable: true,
        wrap: true,
        // grow: 2,
      },
      {
        name: "Mobile",
        selector: (row) => row.contact,
        sortable: true,
        wrap: false,
      },
      {
        name: "Date From",
        selector: (row) => row.date_from,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },
      {
        name: "Date To",
        selector: (row) => row.date_to,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },
      {
        name: "Type",
        selector: (row) => row.leavetype,
        sortable: true,
        width: "50px",
      },
      {
        name: "Reason",
        cell: (d) => {
          return <div className="p-2 trim-word">{d.detail}</div>;
        },
        sortable: false,
        wrap: true,
      },
      {
        name: "Status",
        cell: (d) => {
          return (
            <div className="d-flex justify-content-space-between">
              <span
                className={
                  d.updated_type == "Accept"
                    ? "text-success"
                    : d.updated_type == "Pending"
                    ? "text-warning"
                    : "text-danger"
                }
              >
                {d.updated_type}
              </span>
            </div>
          );
        },
        sortable: false,
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
            </div>
          );
        },
        wrap: false,
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
                placeholder="Search User"
              />
            </div>
            <div className="position-relative">
              <input
                type="date"
                className="form-control form-control-sm radius-30"
                value={from_date}
              
                onChange={(e) => setFromDate(() => e.target.value)}
                placeholder="From date"
              />
            </div>
            <div className="position-relative">
              <input
                type="date"
                className="form-control form-control-sm radius-30"
                value={to_date}
                min={from_date}
                onChange={(e) => setToDate(() => e.target.value)}
                placeholder="To date"
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
          </div>
          {display}
          {displayImage}
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
export default UserLeave;
