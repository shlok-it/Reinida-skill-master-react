import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
const AddWork = (props) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('update working time');
    const [isOpen, setisOpen] = useState(false);
    const [values, setValues] = useState({
            'id':props.employee.id,
            'check_in':props.employee.check_in,
            'check_out':props.employee.check_out,
            'check_in_start':props.employee.check_in_start,
            'check_out_start':props.employee.check_out_start,
            'check_in_end':props.employee.check_in_end,
            'check_out_end':props.employee.check_out_end,
    });
    useEffect(() => {
      
        setisOpen(true);
       
    }, [])
 
    const submitThis = (e) => {
        e.preventDefault();
        if (values.check_in == '') {
            toast.error("Please Select Check in time");
        }
        else if (values.check_out == '') {
            toast.error("Please Select Check Out Name");
        }
        else {
            setLoading(true);
            call_secure_api('work/work_time_assign', values)
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
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    };

    return (
        <Modal size={"lg"} fade={false} isOpen={isOpen} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>{title} Job</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>

                    <div className="form-group row">
                        <div className="col-md-12">
                            <label className="col-form-label form-label"><strong>{props.employee.user_name}</strong> 
                            <br />
                            {props.employee.school_name}
                            </label>
                           
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