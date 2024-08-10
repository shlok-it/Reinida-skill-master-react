import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
const PasswordMdl = (props) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(props.item);
    const submit_emp_password_update = (e) => {
        e.preventDefault();
        if (values.master_password == '') {
            toast.error("Enter password", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('district_head/password', { 'id': values.id, h_password: values.h_password })
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
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Update Password</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submit_emp_password_update}>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Name <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="text" value={values.name} disabled />
                        </div>
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Contact</label>
                            <input className="form-control form-control-sm" type="text" value={values.mobile} disabled />
                        </div>
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Email</label>
                            <input className="form-control form-control-sm" type="text" value={values.email} disabled />
                        </div>
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Enter New Password</label>
                            <input className="form-control form-control-sm" type="text" minLength={6} maxLength={20} name="h_password" value={values.h_password} onChange={set('h_password')} />
                        </div>
                    </div>
                    <div className="text-center py-3">
                        <button type="submit" disabled={loading} className="border-0 btn btn-primary btn-gradient-primary btn-rounded">{loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Update Password</button>&nbsp;&nbsp;
                        <button type="button" onClick={() => { props.model_handler(false) }} className="btn btn-secondary btn-rounded">Cancel</button>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>

            </ModalFooter>
        </Modal>
    )
};
export default PasswordMdl