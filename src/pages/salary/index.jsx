import React, { useState, useEffect, useMemo } from "react";
import { call_secure_api, call_secure_get_api } from "../../connect/api.js";
import { toast } from "react-toastify";
import Add from "./Add.jsx";
import { formatMonth } from "../../helper/general.js";
import DetailMdl from "./DetailMdl.jsx";
import { changeBCSubTitle } from "../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from "../../Components/Common/DataTableShow.js";
import ViewForm from "./ViewForm.jsx";
const Salary = () => {
  const [display, setDisplay] = useState(null);
  const [publish, setPublish] = useState(null);
  const this_month = formatMonth(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexfrom, setIndexfrom] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const page = 1;
  const [colName, setColName] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [logosname, setLogos] = useState([]);
  const [totalAmount, setTotalAmount] = useState([]);
  const [search_key, setSearch_key] = useState("");
  const [month, setMonth] = useState(this_month);
  const dispatch = useDispatch();
  useEffect(() => {
    get_attendance_list();
    dispatch(changeBCSubTitle("Salary List"));
  }, []);
  const get_attendance_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    call_secure_get_api(
      `salary/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&month=${month}&search_key=${search_key}&delay=1`
    ).then(
      (resolve) => {
        if (resolve.status === true) {
          setLogos(resolve.data.logos);
          setTotalAmount(resolve.data.total_amount);
          setIsEditable(resolve.data.isEditable);
          setData(resolve.data.items.item.data);
          setIndexfrom(resolve.data.items.item.from);
          setTotalRows(resolve.data.items.item.total);
          setMonth(resolve.data.items.month);
          setPublish(false);
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

  const publish_attendance = () => {
    call_secure_api("attendance/status", {
      attendance_month: month,
    }).then(
      (resolve) => {
        if (resolve.status === true) {
          toast.success(resolve.message, "success", 5000);
          get_attendance_list();
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
  const updateStatus = (user_item) => {
    call_secure_api("salary/updateStatus", {
      emp_id: user_item.user_id,
      id: user_item.id,
    }).then(
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
  const updateStatusAll = (month, type) => {
    call_secure_api("salary/updateStatusAll", {
      month: month,
      type: type,
    }).then(
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
  const generateSlip = () => {
    setDisplay(<Add model_handler={parent_handler} />);
  };
  const AttendanceDetail = (item, type) => {
    setDisplay(
      <DetailMdl model_handler={parent_handler} item={item} type={type} />
    );
  };
  const Viewform = (item, type) => {
    setDisplay(
      <ViewForm
        logo={logosname.logo}
        isita_foundation={logosname.isita_foundation}
        model_handler={parent_handler}
        item={item}
        month={month}
      />
    );
  };
  const parent_handler = (reload) => {
    setDisplay(null);
    if (reload) {
      get_attendance_list();
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
        selector: (row) => row.full_name,
        sortable: true,
        wrap: true,
      },
      {
        name: "Joining Date",
        selector: (row) => row.joinig_date,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },
      {
        name: "Gross Salary",
        selector: (row) => row.gross_salary,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },
      {
        name: "Net Pay",
        selector: (row) => row.net_pay,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },
      {
        name: "Deduction",
        selector: (row) => row.total_deduction,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },

      {
        name: "Created",
        selector: (row) => row.created_at,
        sortable: true,
        wrap: true,
      },
      {
        name: "Status",
        cell: (d, i) => {
          return (
            <div
              className="d-flex justify-content-space-between c-pointer"
              onClick={() => updateStatus(d)}
              key={i}
            >
              <span
                className={d.status == "1" ? "text-success" : "text-danger"}
              >
                {d.status == "1" ? "Published" : "Publish"}
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
             {isEditable&&<button
                className="btn btn-sm btn-info text-nowrap m-1"
                onClick={() => AttendanceDetail(d, "Edit")}
              >
                Edit
              </button>}
              <button
                className="btn btn-sm btn-success text-nowrap m-1"
                onClick={() => Viewform(d)}
              >
                Slip
              </button>
            </div>
          );
        },
        wrap: false,
      },
    ],
    [indexfrom]
  );
  const handlePageChange = (page) => {
    get_attendance_list(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    get_attendance_list(page, newPerPage);
    setPerPage(newPerPage);
  };
  const handleSort = (column, sortDirection) => {
    const str = column.selector.toString();
    const arr = str.split(".");
    const colName = arr[1] ? arr[1] : "";
    get_attendance_list(page, perPage, colName, sortDirection);
    setColName(colName);
    setSortBy(sortDirection);
  };
  const searchFun = (e) => {
    e.preventDefault();
    get_attendance_list();
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
            <div className="position-relative">
              <input
                type="month"
                className="form-control form-control-sm radius-30"
                value={month}
                max={this_month}
                onChange={(e) => setMonth(() => e.target.value)}
                placeholder="Search date"
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
                onClick={() => updateStatusAll(month, "Unpublish")}
                className="btn btn-danger ms-2  btn-sm radius-30 mt-2 mt-lg-0 "
              >
                Unpublish All
              </button>

              <button
                onClick={() => updateStatusAll(month, "Publish")}
                className="btn btn-success ms-2  btn-sm radius-30 mt-2 mt-lg-0 "
              >
                Published All
              </button>

              <button
                onClick={() => generateSlip()}
                className="ms-2 btn btn-primary btn-sm radius-30 mt-2 mt-lg-0"
              >
                Generate Payment
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-center  bg-primary text-light gap-3 border px-3">
            <div className="position-relative  m-1 p-2">
              Total Gross Pay{" "}
              <strong className="fw-800 ms-2  btn-lg radius-30 mt-2 mt-lg-0">
                {" "}
                Rs. {totalAmount["totalGraoss"]}
              </strong>
            </div>
            <div className="position-relative  m-1 p-2">
              Total Deduction{" "}
              <strong className="fw-800 btn-lg radius-30 mt-2 mt-lg-0">
                Rs. {totalAmount["totalDeduction"]}
              </strong>
            </div>
            <div className="position-relative border  radius-30 m-1 p-2">
              Total Net Pay{" "}
              <strong className="fw-800 btn-lg radius-12 mt-2 mt-lg-0">
                Rs. {totalAmount["totalNetPay"]}
              </strong>
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
  );
};
export default Salary;
