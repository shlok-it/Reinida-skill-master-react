import React, { useState, useEffect } from "react";
import {
  call_secure_api,
  BaseUrl,
  call_secure_get_api,
} from "../../../connect/api.js";
import { toast } from "react-toastify";
import EditList from "./EditList";
import upload_image from "../../../assets/images/upload-image.webp";
import Swal from "sweetalert2";
import { useStateContext } from "../../../contexts/ContextProvider";
import { changeBCSubTitle } from "../../../slices/thunk";
import { useDispatch } from "react-redux";
import { formatDate, formatDateTime } from "../../../helper/general.js";
import "../index.css";
import { useMemo } from "react";
import DataTableShow from "../../../Components/Common/DataTableShow.js";
import { cross_img } from "../../../connect/Images.js";
const TodayAttendence = () => {
  const [display, setDisplay] = useState(null);
  const [isrefresh, setisrefresh] = useState(1);
  const { currentUser } = useStateContext();
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
  const [today, setToday] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    get_emp_list();
    dispatch(changeBCSubTitle("Today Attendance"));
  }, [currentUser, isrefresh]);
  const get_emp_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    setLoading(true);
    call_secure_get_api(
      `attendence/bydate?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&from_date=${from_date}&to_date=${to_date}&delay=1`
    ).then(
      (resolve) => {
        if (resolve.status === true) {
          setData(resolve.data.attendance.data);
          setIndexfrom(resolve.data.attendance.from);
          setTotalRows(resolve.data.attendance.total);
          setToday(resolve.data.date);
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

  const EditData = (cat_data) => {
    setDisplay(
      <EditList
        employee={cat_data}
        model_handler={parent_handler}
        deleteEmp={deleteEmp}
      />
    );
  };

  const delete_emp = (id) => {
    call_secure_api("attendence/deleteItem", { emp_id: id }).then(
      (resolve) => {
        if (resolve.status === true) {
          toast.success(resolve.message, "success", 5000);
          get_emp_list();
          parent_handler(false);
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

  const returnlocation = (items, type) => {
    if (items && items.length > 0) {
      let item = items[0];
      return (
        <div className="location_info_container">
          <div className={"location-img"}>
            <div
              className="img-thumbnail-atendence c-pointer"
              onClick={(e) => {
                EditData(item);
              }}
            >
              <img
                src={
                  item.image_link
                    ? BaseUrl.resource_url + "/" + item.image_link
                    : upload_image
                }
                alt={" check " + item.phototype}
              />
            </div>
          </div>
          <div className="right-container">
            <div className={"check_header check_bg_" + item.phototype}>
              Check {item.phototype}
              <span>{formatDateTime(item.created_at, "time")}</span>
            </div>
            {item.location ? (
              <div className="p-2">
                {item.location["latitude"]
                  ? item.location["latitude"] + ", "
                  : ""}
                {item.location["longitude"]
                  ? item.location["longitude"] + ", "
                  : ""}
                {item.location["areasOfInterest"]
                  ? item.location["areasOfInterest"].map((val, i) => {
                      return <div key={i}>{val ? val + ", " : ""}</div>;
                    })
                  : ""}
                {item.location["subLocality"]
                  ? item.location["subLocality"] + ", "
                  : ""}
                {item.location["locality"]
                  ? item.location["locality"] + ", "
                  : ""}
                {item.location["countryName"]
                  ? item.location["countryName"] + ", "
                  : ""}
                {item.location["postalCode"] ? item.location["postalCode"] : ""}
              </div>
            ) : (
              "Location not Available"
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="location_info_container">
          <div className={"location-img"}>
            <div className="img-thumbnail-atendence">
              <img src={cross_img} />
            </div>
          </div>
          <div className="right-container">
            <div className={"check_header check_bg_" + type}>
              Check {type}
              <span>--:--</span>
            </div>
            <div className="p-2">Location not Available</div>
          </div>
        </div>
      );
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
        name: "Img",
        cell: (d) => {
          return (
            <div className="img-thumbnail-cat">
              <img
                src={
                  d.image_link
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
        width: "100px",
        // grow: 2,
      },
      {
        name: "Mobile",
        selector: (row) => row.contact,
        sortable: true,
        wrap: false,
        width: "100px",
      },
      {
        name: "Check IN",
        cell: (d) => {
          return (
            <div className="locaiton_container">
              {returnlocation(d.check_in, "IN")}
            </div>
          );
        },
        className: "text-nowrap",
      },
      {
        name: "Check out",
        cell: (d) => {
          return (
            <div className="locaiton_container">
              {returnlocation(d.check_out, "OUT")}
            </div>
          );
        },
        className: "text-nowrap",
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
              <button
                onClick={() => setisrefresh((olddata) => olddata + 1)}
                className="btn btn-primary radius-30 mt-2 mt-lg-0"
              >
                <i className="bx bxs-plus-square"></i>Refresh
              </button>
            </div>
          </div>
          <div>
            <span className="text-white rounded bg-success px-2 py-1 mb-2">
              {" "}
              Date: {formatDateTime(today, "date")}{" "}
            </span>
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
export default TodayAttendence;
