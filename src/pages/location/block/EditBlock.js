import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../../connect/api.js';
import { toast } from 'react-toastify';
import { useStateContext } from "../../../contexts/ContextProvider.jsx"
const EditBlock = (props) => {
    const [loading, setLoading] = useState(false);
    const { state_list, district_list } = useStateContext();
    const [values, setValues] = useState(props.item);
    const submitThis = (e) => {
        e.preventDefault();
        if (values.state_code == '') {
            toast.error("Select state");
        }
        else if (values.name == '') {
            toast.error("Enter block name");
        }
        else {
            setLoading(true);
            call_secure_api('location/block/update', values)
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
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Update Block</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="form-group row">
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Select State</label>
                            <select className="form-control form-control-sm" disabled name="state_code" value={values.state_code} onChange={set('state_code')}>
                                <option value="">Select State</option>
                                {state_list.map((item, index) => {
                                    return (
                                        <option key={index} value={item.state_code}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Select District</label>
                            <select className="form-control form-control-sm" name="district_id" value={values.district_id} onChange={set('district_id')}>
                                <option value="">Select District</option>
                                {district_list.map((item, index) => {
                                    if (values.state_code == item.state_code) {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        )
                                    }
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
                            <label className="col-form-label form-label">Block Name</label>
                            <input className="form-control form-control-sm" type="text" name="name" value={values.name} onChange={set('name')} />
                        </div>
                    </div>
                    <div className="text-center py-1">
                        <button type="submit" disabled={loading} className="border-0 btn btn-primary btn-gradient-primary btn-rounded">{loading && <i className="material-icons spin">autorenew</i>} Save</button>&nbsp;&nbsp;
                        <button type="button" onClick={() => { props.model_handler(false) }} className="btn btn-secondary btn-rounded">Cancel</button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
};
export default EditBlock