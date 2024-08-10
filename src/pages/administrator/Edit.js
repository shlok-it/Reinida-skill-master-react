import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { only_number } from '../../helper/general.js';
const Edit = (props) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        master_name: props.administrator?.master_name,
        master_email: props.administrator?.master_email,
        id: props.administrator?.id,
        master_mobile: props.administrator?.master_mobile
    });
    useEffect(() => {

    }, []);
    const submitThis = (e) => {
        e.preventDefault();
        if (values.master_name == '') {
            toast.error("Enter Contact Name", 'error', 5000);
        }
        else if (values.master_email == '') {
            toast.error("Enter Email", 'error', 5000);
        }
        else if (values.master_mobile == '') {
            toast.error("Enter Mobile Number", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('administrator/update', values)
                .then(
                    (resolve) => {
                        if (resolve.status === true) {
                            toast.success(resolve.message, 'success', 5000);
                            props.model_handler(true, false);
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
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Update Administrator</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="form-group row g-2 mb-3">
                        <div className="col-sm-12">
                            <label className="form-label">Name <span className="text-danger">*</span></label>
                            <input className="form-control" value={values.master_name || ""} type="text" name="master_name" onChange={set('master_name')} placeholder='Name' />
                        </div>
                        <div className="col-sm-12">
                            <label className="form-label">Email <span className="text-danger">*</span></label>
                            <input type="email" className="form-control" name="master_email" value={values.master_email || ''} onChange={set('master_email')} placeholder="Email" />
                        </div>
                        <div className="col-sm-12">
                            <label className="form-label">Mobile Number <span className="text-danger">*</span></label>
                            <input type="text" onInput={(e) => only_number(e)} className="form-control" maxLength={10} name="master_mobile" value={values.master_mobile || ''} onChange={set('master_mobile')} placeholder="Mobile Number" />
                        </div>
                    </div>
                    <div className="text-center py-3">
                        <button type="submit" disabled={loading} className="border-0 btn btn-primary btn-gradient-primary btn-rounded">{loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Update</button>&nbsp;&nbsp;
                        <button type="button" onClick={() => { props.model_handler(false) }} className="btn btn-secondary btn-rounded">Close</button>
                    </div>
                </form>
            </ModalBody >
            <ModalFooter>

            </ModalFooter>
        </Modal >
    )
};
export default Edit