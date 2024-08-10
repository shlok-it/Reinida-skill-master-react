import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { session_year } from '../../helper/general.js';
const AddWork = (props) => {
    const [loading, setLoading] = useState(false);

    const [schoolName, setSchoolName] = useState([]);
    const [userNames, setUsersName] = useState([]);
    const [postDetails, setPostDetails] = useState([]);
    const [title, setTitle] = useState('Assign');
    const [isOpen, setisOpen] = useState(false);
    const [values, setValues] = useState({
            'vacancies_id': '',
            'teachers_id': '',
            'vacancies_subject_id': '',
            'session_year': session_year(),
            'check_in':'10:00:00',
            'check_out':'16:00:00',
            'check_in_start':'10:15:00',
            'check_in_end':'16:15:00',
            'check_out_start':'10:15:00',
            'check_out_end':'16:15:00',
    });
    useEffect(() => {
        getSchoolName();
        getUsersName();
        setisOpen(true);
       
    }, [])
 
    const getSchoolName = () => {
        call_secure_api('work/getShoolNameforWorkAssign', {})
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        setSchoolName(resolve.data)
                    }
                    else {
                        toast.error(resolve.message, 'error', 5000);
                    }
                },
                (reject) => {
                    toast.error("Server Error", 'error', 5000);
                }
            )
    }
    const getPostDetail = (value) => {
        call_secure_api('work/getVacancyForWorkAssign', { 'v_id': value })
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        setPostDetails(() => [...resolve.data])
                    }
                    else {
                        toast.error(resolve.message, 'error', 5000);
                    }
                },
                (reject) => {
                    toast.error("Server Error", 'error', 5000);
                }
            )
    }
    const getUsersName = () => {
        call_secure_api('work/getUsersNameforWorkAssign', {})
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        setUsersName(resolve.data);
                    }
                    else {
                        toast.error(resolve.message, 'error', 5000);
                    }
                },
                (reject) => {
                    toast.error("Server Error", 'error', 5000);
                }
            )
    }
    const submitThis = (e) => {
        e.preventDefault();
        if (values.teachers_id == '') {
            toast.error("Please Select Teachers Name");
        }
        else if (values.vacancies_id == '') {
            toast.error("Please Select School Name");
        }
        else if (values.vacancies_subject_id == '') {
            toast.error("Please Select Post Name");
        }
        else {
            setLoading(true);
            call_secure_api('work/work_assign', values)
                .then(
                    (resolve) => {
                        if (resolve.status === true) {
                            toast.success(resolve.message);
                            props.model_handler(true);
                        }
                        else {
                            toast.error(resolve.message);
                        }
                        setLoading(false);
                    },
                    (reject) => {
                        toast.error("Server Error");
                        setLoading(false);
                    }
                )
        }
    }
    const set = name => {
        return ({ target: { value } }) => {
            if(name=='vacancies_id') getPostDetail(value);
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    };

    return (
        <Modal size={"lg"} fade={false} isOpen={isOpen} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>{title} Job</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>

                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Session Year</label>
                            <input type='text' className="form-control form-control-sm" name="session_year" maxLength={20} value={values.session_year || session_year()} onChange={set('session_year')} />
                        </div>
                        <div className="col-md-12">
                            <label className="col-form-label form-label">Teacher Name <span className="text-danger">*</span></label>
                            <select className="form-control" name="teachers_id" value={values.teachers_id} onChange={set('teachers_id')}>
                                <option vlaue="">Select Teacher</option>
                                {
                                    userNames.map((uname, ind) => {
                                        return (
                                            <option key={ind} value={uname.id}>{uname.full_name}-{uname.reg_code}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-12">
                            <label className="col-form-label form-label">School Name <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm text-uppercase" value={values.vacancies_id} placeholder="School name" name="vacancies_id"  onChange={set('vacancies_id')}>
                                <option value="" >Select School Name</option>
                                {schoolName.map((item, i) => {
                                    return (<option key={i} value={item.id}>{item.school_name}, post-{item.no_of_post}</option>)
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-12">
                            <label className="col-form-label form-label">Select post <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm text-uppercase" value={values.vacancies_subject_id} placeholder="Select post name" name="vacancies_subject_id" onChange={set('vacancies_subject_id')}>
                                <option value="" >Select Post</option>
                                {postDetails.map((post, i) => {
                                    return (<option key={i} value={post.vacancies_subject_id}> Subject:{post.subject_name} | Post: {post.no_of_post} | Class: {post.vacancies_for || 'not define'}</option>)
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-12">
                            <strong>Working Time</strong>
                        <hr />
                        </div>
                        <div className="col-md-6">
                            <label className="col-form-label form-label">Check In <span className="text-danger">*</span></label>
                            <input type="time" className='form-control' name="check_in" value={values.check_in} onChange={set('check_in')}></input>
                        </div>
                        <div className="col-md-3">
                            <label className="col-form-label form-label">Check In Start <span className="text-danger">*</span></label>
                            <input type="time" className='form-control' name="check_in_start"  value={values.check_in_start} onChange={set('check_in_start')}></input>
                        </div>
                        <div className="col-md-3">
                            <label className="col-form-label form-label">Check In End <span className="text-danger">*</span></label>
                            <input type="time" className='form-control' name="check_in_end"  value={values.check_in_end} onChange={set('check_in_end')}></input>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-6">
                            <label className="col-form-label form-label">Check Out <span className="text-danger">*</span></label>
                            <input type="time" className='form-control' name="check_out"  value={values.check_out} onChange={set('check_out')}></input>
                        </div>
                        <div className="col-md-3">
                            <label className="col-form-label form-label">Check Out Start<span className="text-danger">*</span></label>
                            <input type="time" className='form-control' name="check_out_start" value={values.check_out_start} onChange={set('check_out_start')}></input>
                        </div>
                        <div className="col-md-3">
                            <label className="col-form-label form-label">Check Out End <span className="text-danger">*</span></label>
                            <input type="time" className='form-control' name="check_out_end" value={values.check_out_end} onChange={set('check_out_end')}></input>
                        </div>
                    </div>
                    
                    <div className="text-center py-3">
                        <button type="submit" disabled={loading} className="border-0 btn btn-primary btn-gradient-primary btn-rounded">{loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Save</button>&nbsp;&nbsp;
                        <button type="button" onClick={() => { props.model_handler(false) }} className="btn btn-secondary btn-rounded">Cancel</button>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>

            </ModalFooter>
        </Modal>
    )
};
export default AddWork