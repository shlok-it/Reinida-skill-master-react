import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { only_number } from '../../helper/general.js';
const Add = (props) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        name: '', status: '0', master_role: 'ADMIN',
        email: '', mobile: ''
    });
    useEffect(() => {

    }, []);
    const submitThis = (e) => {
        e.preventDefault();
        if (values.name == '') {
            toast.error("Enter Contact Name", 'error', 5000);
        }
        else if (values.email == '') {
            toast.error("Enter Email", 'error', 5000);
        }
        else if (values.mobile == '') {
            toast.error("Enter Mobile Number", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('administrator/add', values)
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
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Administrator List</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="form-group row g-2 mb-3">
                        <div className="col-sm-12">
                            <label className="form-label">Name <span className="text-danger">*</span></label>
                            <input className="form-control" required value={values.name || ""} type="text" name="name" onChange={set('name')} placeholder='Name' />
                        </div>
                        <div className="col-sm-12">
                            <label className="form-label">Email <span className="text-danger">*</span></label>
                            <input type="email" className="form-control" required name="email" value={values.email || ''} onChange={set('email')} placeholder="Email" />
                        </div>
                        <div className="col-sm-12">
                            <label className="form-label">Mobile Number <span className="text-danger">*</span></label>
                            <input type="text" onInput={(e) => only_number(e)} required className="form-control" maxLength={10} name="mobile" value={values.mobile || ''} onChange={set('mobile')} placeholder="Mobile Number" />
                        </div>
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">User Role</label>
                            <select className="form-control form-control-sm" name="master_role" value={values.master_role} onChange={set('master_role')}>
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGER">MANAGER</option>
                            </select>
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
export default Add