import React, { useState, useEffect, useMemo } from "react";
import {
  BaseUrl,
  call_secure_get_api,
} from "../../../connect/api.js";
import { toast } from "react-toastify";
import { useStateContext } from "../../../contexts/ContextProvider";
import { changeBCSubTitle } from "../../../slices/thunk";
import { useDispatch } from "react-redux";
import { formatMonth } from "../../../helper/general.js";
import "../index.css";
import upload_image from "../../../assets/images/upload-image.webp";
import View from "./ViewDetail.jsx";
import EditList from "./EditList.jsx";
import DataTableShow from "../../../Components/Common/DataTableShow.js";
const AttendenceList = () => {
  const [display, setDisplay] = useState(null);
  const [viewDisplay, setViewDisplay] = useState(null);
  const { currentUser } = useStateContext();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [headerLabel, setHeaderLabel] = useState([]);
  const [loading, setLoading] = useState(false);
  const this_month = formatMonth(
    new Date(new Date().setMonth(new Date().getMonth()))
  );
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexfrom, setIndexfrom] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const page = 1;
  const [colName, setColName] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search_date, setSearchDate] = useState("");
  const [search_key, setSearch_key] = useState("");
  useEffect(() => {
    get_emp_list();
    dispatch(changeBCSubTitle("Attendance List"));
  }, [currentUser]);
  const get_emp_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    setLoading(true);
    call_secure_get_api(
    `attendence/monthlyList?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&month=${search_date}&delay=1`
    ).then(
      (resolve) => {
        if (resolve.status === true) {
          setData(resolve.data.user_list.data);
          setIndexfrom(resolve.data.user_list.from);
          setTotalRows(resolve.data.user_list.total);
          setSearchDate(resolve.data.month);
          setHeaderLabel(resolve.data.headerLabel);
          setLoading(false);
        } else {
          toast.error(resolve.message, "error", 5000);
          setData([]);
        }
      },
      (reject) => {
        toast.error("Server Error", "error", 5000);
      }
    );
  };
  const Viewfun = (cat_data) => {
    setDisplay(
      <View
        employee={cat_data}
        search_date={search_date}
        model_handler={parent_handler}
        EditData={EditData}
        headerLabel={headerLabel}
      />
    );
  };
  const parent_handler = (reload) => {
    setDisplay(null);
    if (reload) {
      get_emp_list();
    }
  };
  const EditData = (cat_data) => {
    setViewDisplay(<EditList employee={cat_data} model_handler={parent_handlerView}/>);
  };
  const parent_handlerView = () => {
    setViewDisplay(null);
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
  const absentDays=(d,workinDays)=>{
    const half = d.half_day?d.half_day.length:0;
    const full_day = d.full_day?d.full_day.length:0;
    const cl = d.cl?d.cl:0;
    const pl = d.pl?d.pl:0;
    const todal = (parseInt(half)+parseInt(full_day)+parseInt(cl)+parseInt(pl))
   return workinDays?(parseInt(workinDays)-parseInt(todal)):0
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
            <div
              className="img-thumbnail-cat"
            >
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
        // grow: 2,
      },
      {
        name: "code",
        cell: (d) => { return( <button
          className="btn btn-sm btn-primary"
          onClick={() =>
            Viewfun(d)
          }
        >
          {d.reg_code}
        </button>)},
       width: "120px",
      },
      {
        name: "Working/Days",
        cell: (d) => {
          return (
            <span>{headerLabel.working_days}/{headerLabel.total_days}</span>
          );
        },
      },
      {
        name: "Sunday",
        cell: (d) => {
          return (
            <span>{headerLabel.total_sunday}</span>
          );
        },
      },
      {
        name: "Office Leave",
        cell: (d) => {
          return (
            <span>{headerLabel.office_leave}</span>
          );
        },
      },
      {
        name: "Check IN",
        selector: (row) => row.total_check_in,
        sortable: true,
      },
      {
        name: "Check Out",
        selector: (row) => row.total_check_out,
        sortable: true,
      },
      {
        name: "Absent",
        cell: (d) => {
          return (
            <span>{absentDays(d,headerLabel.working_days)}</span>
          );
        },
      },
      {
        name: "CL",
        selector: (row) => row.cl,
        with:"40px"
      },
      {
        name: "PL",
        selector: (row) => row.pl,
        with:"40px"
      },
    ],
    [indexfrom,search_date]
  );

  return (
    <React.Fragment>
      <div className="card radius-10">
        <div className="card-body">
          <div className="d-lg-flex align-items-center mb-4 gap-3">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm radius-30"
                placeholder="Search name"
                value={search_key}
                onChange={(e) => setSearch_key(e.target.value)}
              />
            </div>
            <div className="position-relative">
              <input
                type="month"
                max={this_month}
                value={search_date}
                onChange={(e) => setSearchDate(e.target.value)}
                className="form-control form-control-sm radius-30"
              />
            </div>
            <div className="position-relative">
							<button onClick={() => get_emp_list()} className="btn btn-secondary btn-sm radius-30 mt-2 mt-lg-0">Search</button>
						</div>
          </div>
          {viewDisplay}
          {display}
          <div className="bold fs-16"><span  className="text-white rounded bg-success px-2 py-1 mb-2 "> Data of this Month {search_date} </span></div>
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
export default AttendenceList;
