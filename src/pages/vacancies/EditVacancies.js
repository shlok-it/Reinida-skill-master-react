import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { only_number } from '../../helper/general.js';
import { useStateContext } from "../../contexts/ContextProvider.jsx"
const EditVacancies = (props) => {
    const [loading, setLoading] = useState(false);
    const [isOpen, setisOpen] = useState(false);
    // const [user_detail, setUserDetail] = useState([]);
    const { state_list, district_list, block_list, subject_list, qualifications_list } = useStateContext();
    const [values, setValues] = useState({});
    useEffect(() => {
        get_emp_detail();
        if (district_list.filter(item => { return item.state_code == values.state_code && item.id == values.district_id }).length === 0) {
            setValues(oldValues => ({ ...oldValues, district_id: '' }));
        }
    }, [values.state_code])

    const get_emp_detail = () => {
        call_secure_api('vacancies/list_detail', { v_id: props.employee })
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        setValues(resolve.data);
                        setisOpen(true);
                    }
                    else {
                        toast.error(resolve.message, 'error', 5000);
                        props.model_handler(false);
                    }
                },
                (reject) => {
                    console.log(reject);
                    toast.error("Server Error", 'error', 5000);
                    props.model_handler(false);
                }
            )
    }
    const submitThis = (e) => {
        e.preventDefault();
        if (values.title == '') {
            toast.error("Enter Title");
        }
        else if (values.description == '') {
            toast.error("Enter description");
        }
        else {
            setLoading(true);
            call_secure_api('vacancies/update', values)
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
                        console.log(reject);
                        toast.error("Server Error");
                        setLoading(false);
                    }
                )
        }
    }

    const set = name => {
        return ({ target: { value } }) => {
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    };
    return (
        <Modal size={"lg"} fade={false} isOpen={isOpen} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Update Vacancies</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <h5 className="text-primary">Vacancies Detail</h5>
                    <div className="form-group row">
                        <div className="col-md-12">
                            <label className="col-form-label form-label">Job Title <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="text" value={values?.title||''} placeholder="Job Title" name="title" onChange={set('title')} />
                        </div>

                    </div>
                    <h5 className="text-primary mt-2">Address Information</h5>
                    <div className="form-group row">
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">State</label>
                            <select className="form-control form-control-sm" name="state_code" value={values.state_code} onChange={set('state_code')}>
                                <option value="">Select</option>
                                {state_list.map((item, index) => {
                                    return (
                                        <option key={index} value={item.state_code}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">District</label>
                            <select className="form-control form-control-sm" name="district_id" value={values.district_id} onChange={set('district_id')}>
                                <option value="">Select</option>
                                {district_list.map((item, index) => {
                                    if (item.state_code == values.state_code) {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Block</label>
                            <select className="form-control form-control-sm" name="block_id" value={values.block_id} onChange={set('block_id')}>
                                <option value="">Select</option>
                                {block_list.map((item, index) => {
                                    if (item.district_id == values.district_id) {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Area</label>
                            <textarea className="form-control" rows="1" name="address" value={values.address || ''} onChange={set('address')} placeholder="Area"></textarea>
                        </div>
                    </div>
                    <h5 className="text-primary mt-2">Job Details</h5>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <textarea className="form-control" rows="6" name="description" value={values.description || ''} onChange={set('description')} placeholder="Description"></textarea>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Job type</label>
                            <select className="form-control form-control-sm" name="job_type" value={values.job_type} onChange={set('job_type')}>
                                <option value="">Select</option>
                                <option key={1} value='Full Time' >Full Time</option>
                                <option key={2} value='Part Time'>Part Time</option>
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Job Start Date</label>
                            <input type='date' className="form-control form-control-sm" name="start_date" value={values.start_date} onChange={set('start_date')} />
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Job End Date</label>
                            <input type='date' className="form-control form-control-sm" name="end_date" value={values.end_date} onChange={set('end_date')} />
                        </div>

                    </div>


                    <div className="form-group row">
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Qualifications</label>
                            <select className="form-control form-control-sm" name="qualifications_id" value={values.qualifications_id} onChange={set('qualifications_id')}>
                                <option value="">Select</option>
                                {qualifications_list.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Area of Expertise</label>
                            <select className="form-control form-control-sm" name="subject_id" value={values.subject_id} onChange={set('subject_id')}>
                                <option value="">Select</option>
                                {subject_list.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id}>{item.subject_name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Experience</label>
                            <input type="text" className="form-control form-control-sm" onInput={(e) => only_number(e)} maxLength={2} name="experience_year" value={values.experience_year} onChange={set('experience_year')} placeholder="Experience" />
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
export default EditVacancies