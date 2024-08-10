import React, { useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../../connect/api.js';
import { toast } from 'react-toastify';
import { useStateContext } from "../../../contexts/ContextProvider.jsx"
const AddDistrict = (props) => {
    const [loading, setLoading] = useState(false);
    const {state_list} = useStateContext();
    const [values, setValues] = useState({
        name: '', state_code: '', status: 1
    });
    const submitThis = (e) => {
        e.preventDefault();
        if (values.state_code == '') {
            toast.error("Select state");
        }
        else if (values.name == '') {
            toast.error("Enter district name");
        }
        else {
            setLoading(true);
            call_secure_api('location/district/add', values)
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
        <Modal size={"lg"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Add District</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="form-group row">
                        <div className="col-sm-8">
                            <label className="col-form-label form-label">Select State</label>
                            <select className="form-control form-control-sm" name="state_code" value={values.state_code} onChange={set('state_code')}>
                                <option value="">Select State</option>
                                {state_list.map((item, index) => {
                                    return (
                                        <option key={index} value={item.state_code}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Status</label>
                            <select className="form-control form-control-sm" name="status" value={values.status} onChange={set('status')}>
                                <option value="1">Active</option>
                                <option value="2">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">District Name</label>
                            <input className="form-control form-control-sm" type="text" name="name" value={values.name} onChange={set('name')} />
                        </div>
                    </div>
                    <div className="text-center py-3">
                        <button type="submit" disabled={loading} className="border-0 btn btn-primary btn-gradient-primary btn-rounded">{loading && <i className="material-icons spin">autorenew</i>} Save</button>&nbsp;&nbsp;
                        <button type="button" onClick={() => { props.model_handler(false) }} className="btn btn-secondary btn-rounded">Cancel</button>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>

            </ModalFooter>
        </Modal>
    )
};
export default AddDistrict