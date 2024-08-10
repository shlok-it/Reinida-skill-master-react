import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../connect/api.js';
import { toast } from 'react-toastify';
import { only_number } from '../helper/general.js';
const EditProfile = (props) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(props.profile);
    useEffect(() => {

    }, []);
    const submitThis = (e) => {
        e.preventDefault();
        if (values.name == '') {
            toast.error("Enter Name", 'error', 5000);
        }
        else if (values.email == '') {
            toast.error("Enter Email", 'error', 5000);
        }
        else if (values.mobile == '') {
            toast.error("Enter Mobile No.", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('v1/master/update', values)
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
        <Modal size={"lg"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Update Profile</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="form-group row">
                        <div className="col-sm-6">
                            <label className="col-form-label form-label">Name <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" value={values.name || ''} type="text" name="name" onChange={set('name')} placeholder="Name" />
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label form-label">Email <span className="text-danger">*</span></label>
                            <input type="email" className="form-control form-control-sm" name="email" value={values.email || ''} onChange={set('email')} placeholder="Email" />
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label form-label">Mobile No. <span className="text-danger">*</span></label>
                            <input type="text" onInput={(e) => only_number(e)} className="form-control form-control-sm" maxLength={10} name="mobile" value={values.mobile} onChange={set('mobile')} placeholder="Phone" />
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label form-label">City</label>
                            <input type="text" className="form-control form-control-sm" placeholder="City" value={values.city || ''} name="city" onChange={set('city')} />
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label form-label">State</label>
                            <input type="text" className="form-control form-control-sm" placeholder="State" value={values.state || ''} name="state" onChange={set('state')} />
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label form-label">Pin code</label>
                            <input type="text" onInput={(e) => only_number(e)} className="form-control form-control-sm" maxLength={6} placeholder="Pin code" value={values.pin_code || ''} name="pin_code" onChange={set('pin_code')} />
                        </div>
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Address</label>
                            <input className="form-control form-control-sm" type="text" name="address" value={values.address || ''} onChange={set('address')} placeholder="Address" />
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
export default EditProfile