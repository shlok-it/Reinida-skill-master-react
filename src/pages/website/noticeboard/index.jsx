import React, { useState, useEffect, useMemo } from "react";
import { BaseUrl, call_secure_api, call_secure_get_api } from "../../../connect/api.js";
import { toast } from "react-toastify";
import Add from "./Add";
// import Edit from './Edit';
import { changeBCSubTitle } from "../../../slices/thunk";
import { useDispatch } from "react-redux";
import DataTableShow from "../../../Components/Common/DataTableShow.js";
import Swal from "sweetalert2";
const Noticeboard = () => {
  const [display, setDisplay] = useState(null);
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
  const dispatch = useDispatch();
  useEffect(() => {
    get_emp_list();
    dispatch(changeBCSubTitle("Notice bord"));
  }, []);
  const get_emp_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    call_secure_get_api(
      `website/notice_board/list?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&delay=1`
    ).then(
      (resolve) => {
        if (resolve.status === true) {
          setData(resolve.data.data);
          setIndexfrom(resolve.data.from);
          setTotalRows(resolve.data.total);
          setLoading(false);
        } else {
          toast.error(resolve.message);
          setData([]);
        }
      },
      (reject) => {
        console.log(reject);
        toast.error("Server Error");
      }
    );
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
  const delete_emp = (id) => {
    call_secure_api("website/notice_board/remove", { emp_id: id }).then(
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

  const updateStatus = (id) => {
    call_secure_api("website/notice_board/updateStatus", { id: id }).then(
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
  const updateSequence = (value,id) => {
    call_secure_api("website/notice_board/update_sequence", { 'id': id,'value':value }).then(
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
  const parent_handler = (reload) => {
    setDisplay(null);
    if (reload) {
      get_emp_list();
    }
  };
  const addNotice = (item) => {
    setDisplay(<Add item={item} model_handler={parent_handler} />);
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
        name: "Title",
        selector: (row) => row.title,
        sortable: false,
        wrap: true,
      },

      {
        name: "Date",
        selector: (row) => row.date,
        sortable: true,
        wrap: true,
        width: "100px",
      },

      {
        name: "Created",
        selector: (row) => row.created_at,
        sortable: true,
        wrap: true,
        width: "100px",
      },
      {
        name: "Updated",
        selector: (row) => row.updated_at,
        sortable: true,
        wrap: true,
        width: "100px",
      },
      {
        name: "File",
        cell: (d) => {
          return(d.image_file? 
            <button
              onClick={() =>
                window.open(
                  BaseUrl.resource_url +
                    "/" +
                    d.image_file,
                  "target=_blank",
                  "popup=yes"
                )
              }
              className="btn btn-link btn-primary text-white"
            >
              View 
            </button>:''
            )
        },
        wrap: true,
        width: "80px",
      },
      {
        name: "Sequence",
        cell: (d) => {
          return (<input className="form-control form-control-sm" type="number" name="seqeunce" value={d.sequence} onChange={(e)=>updateSequence(e.target.value,d.id)} />);
        },
        wrap: true,
        width: "80px",
      },
      {
        name: "Status",
        cell: (d) => {
          return d.status === "1" ? (
            <span
              onClick={(e) => updateStatus(d.id)}
              className=" c-pointer badge rounded-pill text-success bg-light-success"
            >
              <i className="fa fa-circle me-1"></i>Active
            </span>
          ) : (
            <span
              onClick={(e) => updateStatus(d.id)}
              className="c-pointer badge rounded-pill text-danger bg-light-danger"
            >
              <i className="fa fa-circle me-1"></i>Inactive
            </span>
          );
        },
        wrap: true,
        width: "80px",
      },
      {
        name: "Action",
        cell: (d) => {
          return (
            <div className="d-flex">
              <button
                className="btn btn-xs btn-success text-nowrap mx-1"
                onClick={(e) => {
                    addNotice(d);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-danger text-nowrap"
                onClick={(e) => {
                  deleteEmp(d.id);
                }}
              >
                Delete
              </button>
            </div>
          );
        },
        wrap: true,
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
  return (
    <div className="card radius-10">
      <div className="card-body">
        <div className="d-lg-flex align-items-center mb-4 gap-3">
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-sm radius-30"
              value={search_key}
              onChange={(e) => setSearch_key(() => e.target.value)}
              placeholder="Search Notice"
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
              onClick={() => addNotice('')}
              className="btn btn-primary radius-30 mt-2 mt-lg-0"
            >
              <i className="bx bxs-plus-square"></i>Add Notice
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
  );
};
export default Noticeboard;
