import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../../connect/api.js';
import { toast } from 'react-toastify';
import { formatDateTime } from '../../../helper/general.js';
const AddLeaveMdl = (props) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({ from_date: '', to_date: '', leave_resion: '', leave_type: 1, leave_session: '',from_time:'',to_time:'' });
    const today_date = formatDateTime(new Date(),'date');
    const submit_office_leave = (e) => {
        e.preventDefault();
        if (values.leave_resion == '') {
            toast.error("Enter Leave Resion", 'error', 5000);
        }
        else if (values.leave_type == '') {
            toast.error("Select Leave Type", 'error', 5000);
        }
        else if (values.from_date == '') {
            toast.error("Enter From Date", 'error', 5000);
        }
        else if (values.leave_type == 2 && values.leave_session == '') {
            toast.error("Enter Leave Session", 'error', 5000);
        }
        else if (values.leave_type == 3 && values.from_time == '' && values.to_time == '') {
            toast.error("Enter Leave Time", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('leave/office/add', values)
                .then(
                    (resolve) => {
                        if (resolve.status === true) {
                            toast.success(resolve.message, 'success', 5000);
                            props.model_handler(true);
                        }
                        else {
                            toast.error(resolve.message, 'error', 5000);
                        }
                        setLoading(false);
                    },
                    (reject) => {
                        console.log(reject);
                        toast.error("Server Error", 'error', 5000);
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
        <Modal size={"md"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Add Leave</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submit_office_leave}>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Leave Resion <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="text" value={values.leave_resion} maxlength={150} name="leave_resion" onChange={set('leave_resion')} />
                        </div>
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Leave Type</label>
                            <select className="form-control form-control-sm" name="leave_type" value={values.leave_type} onChange={set('leave_type')}>
                                <option value="1">Full Day</option>
                                {/* <option value="2">Half Day</option>
                                <option value="3">Other</option> */}
                            </select>
                        </div>
                        {values.leave_type == 2 && <div className="col-sm-12">
                            <label className="col-form-label form-label">Leave Session</label>
                            <select className="form-control form-control-sm" name="leave_session" value={values.leave_session} onChange={set('leave_session')}>
                                <option value="">Select Option</option>
                                <option value="Evening">Evening</option>
                                <option value="Morning">Morning</option>
                            </select>
                        </div>}
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">From Date <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="date" value={values.from_date} min={today_date} name="from_date" onChange={set('from_date')} />
                        </div>
                        {values.leave_type == 1 && <div className="col-sm-12">
                            <label className="col-form-label form-label">To Date</label>
                            <input className="form-control form-control-sm" type="date" value={values.to_date} min={values.from_date} name="to_date" onChange={set('to_date')} />
                        </div>}
                        {values.leave_type == 3 && <div className="col-sm-12">
                            <label className="col-form-label form-label">From Time</label>
                            <input className="form-control form-control-sm" type="time" value={values.from_time} name="from_time" onChange={set('from_time')} />
                        </div>}
                        {values.leave_type == 3 && <div className="col-sm-12">
                            <label className="col-form-label form-label">To Time</label>
                            <input className="form-control form-control-sm" type="time" value={values.to_time} name="to_time" onChange={set('to_time')} />
                        </div>}
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
export default AddLeaveMdl