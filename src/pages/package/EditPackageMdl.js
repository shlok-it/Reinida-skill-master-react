import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
const EditPackageMdl = (props) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({ package_name: props.package.package_name, id: props.package.id, status: props.package.status });
    useEffect(() => {

    }, []);

    const submit_office_package = (e) => {
        e.preventDefault();
        if (values.package_name == '') {
            toast.error("Enter Package Name", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('package/update', { id: values.id, 'package_name': values.package_name, status: values.status })
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
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Edit Package</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submit_office_package}>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Package Name <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="text" value={values.package_name} name="package_name" onChange={set('package_name')} />
                        </div>
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Status</label>
                            <select className="form-control form-control-sm" name="status" value={values.status} onChange={set('status')}>
                                <option value="1">Active</option>
                                <option value="2">Inactive</option>
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
export default EditPackageMdl