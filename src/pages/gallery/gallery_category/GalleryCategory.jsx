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
const GalleryCategory = () => {
  const [emp_list, setEmpList] = useState([]);
  const [display, setDisplay] = useState(null);
  const [isUpdate, setisUpdate] = useState(false);
  const newIndex = {index:'',id:''};
  const [tbNewsIndex, setTbNewsIndex] = useState(newIndex);
  const { currentUser } = useStateContext();
  const dispatch = useDispatch();
  useEffect(() => {
    get_emp_list();
    dispatch(changeBCSubTitle("Category List"));
  }, []);
  const get_emp_list = () => {
    call_secure_get_api("gallery/getCategory").then(
      (resolve) => {
        if (resolve.status === true) {
          setEmpList(resolve.data);
        } else {
          toast.error(resolve.message, "error", 5000);
          setEmpList([]);
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
    call_secure_api("gallery/updateSequence", { userData: tbNewsIndex }).then(
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
    call_secure_api("gallery/updateGalleryCatStatus", { id:id }).then(
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
    call_secure_api("gallery/deleteGalleryCategory", { emp_id: id }).then(
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

  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let tempData = Array.from(emp_list);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setEmpList(tempData);
	const result = [];
	tempData.forEach((obj, index) => {
	  result.push({ index: index, id: obj.id });
	});
	setisUpdate(true);
	setTbNewsIndex((oldval)=>[{...result}])
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
                placeholder="Search User"
              />
            </div>
		
              <div className="ms-auto">
				{isUpdate?
				<button className="btn btn-sm btn-success" onClick={() => updateSequence()}>Save changes</button>	
				:''}
			  </div>
            {currentUser.master_role != "MANAGER" && (
              <div className="ms-auto">
				
                <button
                  onClick={() => addData()}
                  className="btn btn-primary radius-30 mt-2 mt-lg-0"
                >
                  <i className="bx bxs-plus-square"></i>Add Category
                </button>
              </div>
            )}
          </div>
          {display}
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="table table-responsive table-responsive-md">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Id</th>
                  <th>Img</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <Droppable droppableId="droppable-1">
                {(provider) => (
                  <tbody ref={provider.innerRef} {...provider.droppableProps}>
                    {emp_list.map((item, index) => {
                      return(<Draggable
                        key={index}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provider) => (
                          <tr
                            {...provider.draggableProps}
                            ref={provider.innerRef}
                          >
                            <td {...provider.dragHandleProps}>
								<span className="mdi mdi-drag"></span>
                            </td>
                            <td>{index + 1}</td>
                            <td>
                              <div className="img-thumbnail-cat ">
                                <img
                                  src={
                                    item.image_link
                                      ? BaseUrl.resource_url +
                                        "/" +
                                        item.image_link
                                      : upload_image
                                  }
                                />
                              </div>
                            </td>
                            <td>{item.name}</td>
                            <td>
                              <Link to={"/gallery-list/" + item.id}>
                                {item.slug}
                              </Link>
                            </td>
                            <td >
                              {item.status === "1" ? (
                                <span onClick={(e)=>updateStatus(item.id)} className=" c-pointer badge rounded-pill text-success bg-light-success">
                                  <i className="fa fa-circle me-1"></i>Active
                                </span>
                              ) : (
                                <span onClick={(e)=>updateStatus(item.id)} className="c-pointer badge rounded-pill text-danger bg-light-danger">
                                  <i className="fa fa-circle me-1"></i>Inactive
                                </span>
                              )}
                            </td>
                            <td>{formatDate(item.created_at)}</td>
                            <td>{formatDate(item.updated_at)}</td>
                            <td>
                              <div className="d-flex">
                                <button
                                  className="btn btn-xs mx-1 btn-success"
                                  onClick={(e) => {
                                    EditData(item);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-xs btn-danger"
                                  onClick={(e) => {
                                    deleteEmp(item.id);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>);
                    })}
					{provider.placeholder}
                  </tbody>
                )}
              </Droppable>
            </table>
          </DragDropContext>
        </div>
      </div>
    </React.Fragment>
  );
};
export default GalleryCategory;
