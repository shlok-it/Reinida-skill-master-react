import React, { useState, useEffect } from "react";
import {
  call_secure_api,
  BaseUrl,
  call_secure_get_api,
} from "../../../connect/api.js";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import AddList from "./AddList";
import EditList from "./EditList";
import upload_image from "../../../assets/images/upload-image.webp";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useStateContext } from "../../../contexts/ContextProvider";
import { changeBCSubTitle } from "../../../slices/thunk";
import { useDispatch } from "react-redux";
import { formatDate } from "../../../helper/general.js";
import "../gallery.css";
import DataTableShow from "../../../Components/Common/DataTableShow.js";
import { useMemo } from "react";
const GalleryVideo = () => {
  const [display, setDisplay] = useState(null);
  const [isUpdate, setisUpdate] = useState(false);
  const { currentUser } = useStateContext();
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
  useEffect(() => {
    get_emp_list();
    dispatch(changeBCSubTitle("Image List"));
  }, []);

  const get_emp_list = (
    pagenum = page,
    size = perPage,
    col = colName,
    sort = sortBy
  ) => {
    setLoading(true);
    call_secure_get_api(
      `gallery/videolist?page=${pagenum}&per_page=${size}&colName=${col}&sortBy=${sort}&search_key=${search_key}&delay=1`
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

  const addData = () => {
    setDisplay(<AddList model_handler={parent_handler} />);
  };

  const EditData = (cat_data) => {
    setDisplay(<EditList employee={cat_data} model_handler={parent_handler} />);
  };

  const updateSequence = () => {
    call_secure_api("gallery/updateVideoSequence", { userData: "" }).then(
      (resolve) => {
        if (resolve.status === true) {
          toast.success(resolve.message, "success", 5000);
          get_emp_list();
          setisUpdate(false);
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
    call_secure_api("gallery/updateVideoStatus", { id: id }).then(
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

  const delete_emp = (id) => {
    call_secure_api("gallery/deleteVideo", { emp_id: id }).then(
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
  const columns = useMemo(
    () => [
      {
        name: "#",
        cell: (d, index) => <div>{indexfrom + index}</div>,
        sortable: false,
        width: "30px",
      },

      {
        name: "Title",
        selector: (row) => row.v_title,
        sortable: true,
        // grow: 2,
      },
      {
        name: "Video Id",
        selector: (row) => row.v_id,
        sortable: true,
        // grow: 2,
      },
      {
        name: "video Link",
        cell: (d) => {
          return (
            <div className="">
              <a
                href="#"
                className="btn btn-sm"
                onClick={() =>
                  window.open(d.v_link, "target=_blank", "popup=yes")
                }
              >
                {d.v_link}
              </a>
            </div>
          );
        },
        sortable: false,
        wrap: true,
      },
      {
        name: "Created",
        selector: (row) => row.created_at,
        sortable: true,
        wrap: true,
      },
      {
        name: "Status",
        cell: (d) => {
          return (
            <div>
              {d.status == "1" ? (
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
              )}
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
                onClick={() => EditData(d)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger text-nowrap ms-1"
                onClick={() => deleteEmp(d.id)}
              >
                Delete
              </button>
            </div>
          );
        },
        wrap: false,
        // ignorerowclick: true,
        // allowoverflow: true,
        // button: false,
      },
    ],
    [indexfrom]
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
                placeholder="Search User"
              />
            </div>

            <div className="ms-auto">
              {isUpdate ? (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => updateSequence()}
                >
                  Save changes
                </button>
              ) : (
                ""
              )}
            </div>
            {currentUser.master_role != "MANAGER" && (
              <div className="ms-auto">
                <button
                  onClick={() => addData()}
                  className="btn btn-primary radius-30 mt-2 mt-lg-0"
                >
                  <i className="bx bxs-plus-square"></i>Add Video
                </button>
              </div>
            )}
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
export default GalleryVideo;
