import React, { useState, useEffect, useMemo } from "react";
import { call_secure_api, call_secure_get_api } from "../../../connect/api.js";
import { toast } from "react-toastify";
import Add from "./Add.jsx";
import { changeBCSubTitle } from "../../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from "../../../Components/Common/DataTableShow.js";
const SalaryManage = () => {
  const [display, setDisplay] = useState(null);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [userNameList, setUserNameList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexfrom, setIndexfrom] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const page = 1;
  const [colName, setColName] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search_key, setSearch_key] = useState("");
  useEffect(() => {
    get_emp_list();
    getUsernameForSalary();
    dispatch(changeBCSubTitle("Manage Salary"));
  }, []);
  const getUsernameForSalary = () => {
    call_secure_get_api("users/getUsernameForSalary").then(
      (resolve) => {
        if (resolve.status == true) {
          setUserNameList(resolve.data);
        } else {
          toast.error(resolve.message, "error", 5000);
          setUserNameList([]);
        }
      },
      (reject) => {
        console.log(reject);
        // toast.error("Server Error", 'error', 5000);
      }
    );
  };
  const get_emp_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    call_secure_get_api(
      `salary_setting/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&delay=1`
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
  const updateStatus = (user_item) => {
    call_secure_api("salary_setting/updateStatus", {
      emp_id: user_item.u_id,
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
        // grow: 2,
      },
      {
        name: "Reg Code",
        selector: (row) => row.reg_code,
        sortable: true,
        wrap: false,
      },
      {
        name: "Joining Date",
        selector: (row) => row.joinig_date,
        sortable: true,
        wrap: true,
        className: "text-nowrap",
      },
      {
        name: "Salary",
        selector: (row) => row.gross_salary,
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
                {d.status == "1" ? "Active" : "Inactive"}
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
                className="btn btn-sm btn-info text-nowrap m-1"
                onClick={() => addDetail(d,'Copy')}
              >
                Copy
              </button>
              <button
                className="btn btn-sm btn-success text-nowrap m-1"
                onClick={() => addDetail(d,'Edit')}
              >
                Edit
              </button>
            </div>
          );
        },
        wrap: false,
      },
    ],
    [indexfrom,userNameList]
  );

  const addDetail = (item,type) => {
    setDisplay(
      <Add
        model_handler={parent_handler}
        item={item}
        type={type}
        userNames={userNameList}
      />
    );
  };


  const parent_handler = (reload) => {
    setDisplay(null);
    if (reload) {
      get_emp_list();
    }
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
                onClick={() => addDetail("",'Add')}
                className="btn btn-primary btn-sm radius-30 mt-2 mt-lg-0"
              >
                Add
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
  );
};
export default SalaryManage;
