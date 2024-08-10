import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { only_number } from '../../helper/general.js';
import { useStateContext } from '../../contexts/ContextProvider.jsx';

const Add = (props) => {
    const [loading, setLoading] = useState(false);
    const { state_list, district_list } = useStateContext();
    const [error, setError] = useState([]);
    const [values, setValues] = useState({
        name: '',
        email: '',
        mobile: '',
        h_password: '',
        state_code: '1',
        district_id: '',
        status: '1',
        session_in: '',
        session_out: '',
    });
    useEffect(() => {
        setValues(oldValues => ({ ...oldValues, district_id: '' }));
    }, [values.state_code])

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
        else if (values.state_code == '') {
            toast.error("Select state ", 'error', 5000);
        }
        else if (values.district_id == '') {
            toast.error("Select District ", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('district_head/add', values)
                .then(
                    (resolve) => {
                        if (resolve.status === true) {
                            toast.success(resolve.message, 'success', 5000);
                            props.model_handler(true);
                        }
                        else {
                            if (resolve.data) {
                                setError(resolve.data);
                            } else {
                                setError([]);
                            }
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
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>District Head</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="form-group row g-2 mb-3">
                        <div className="col-sm-6">
                            <label className="form-label">Name <span className="text-danger">*</span></label>
                            <input className="form-control" required value={values.name || ""} type="text" name="name" onChange={set('name')} placeholder='Name' />
                            {error["name"] && (
                                <label className="text-danger">{error["name"]}</label>
                            )}
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Email <span className="text-danger">*</span></label>
                            <input type="email" className="form-control" required name="email" value={values.email || ''} onChange={set('email')} placeholder="Email" />
                            {error["email"] && (
                                <label className="text-danger">{error["email"]}</label>
                            )}
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Mobile Number <span className="text-danger">*</span></label>
                            <input type="text" onInput={(e) => only_number(e)} required className="form-control" maxLength={10} name="mobile" value={values.mobile || ''} onChange={set('mobile')} placeholder="Mobile Number" />
                            {error["mobile"] && (
                                <label className="text-danger">{error["mobile"]}</label>
                            )}
                        </div>
                         <div className="col-sm-6">
                            <label className="form-label">Create Password <span className="text-danger">*</span></label>
                            <input type="text"  required className="form-control" minLength={6} maxLength={20} name="h_password" value={values.h_password || ''} onChange={set('h_password')} placeholder="Password" />
                            {error["h_password"] && (
                                <label className="text-danger">{error["h_password"]}</label>
                            )}
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Session in Time <span className="text-danger">*</span></label>
                            <input type="time" required className="form-control" maxLength={12} name="session_in" value={values.session_in || ''} onChange={set('session_in')} placeholder="Session In Time" />
                            {error["session_in"] && (
                                <label className="text-danger">{error["session_in"]}</label>
                            )}
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Session out Time <span className="text-danger">*</span></label>
                            <input type="time" required className="form-control" maxLength={12} name="session_out" value={values.session_out || ''} onChange={set('session_out')} placeholder="Session Out Time" />
                            {error["session_out"] && (
                                <label className="text-danger">{error["session_out"]}</label>
                            )}
                        </div>
                       
                        <div className="col-sm-6">
                            <label className="col-form-label form-label">Select State <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm" required name="state_code" value={values.state_code} onChange={set('state_code')}>
                                <option value="">Select State</option>
                                {state_list.map((item, index) => {
                                    return (
                                        <option key={index} value={item.state_code}>{item.name}</option>
                                    )
                                })}
                            </select>
                            {error["state_code"] && (
                                <label className="text-danger">{error["state_code"]}</label>
                            )}
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label form-label">Select District <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm" required name="district_id" value={values.district_id} onChange={set('district_id')}>
                                <option value="">Select District</option>
                                {district_list.map((item, index) => {
                                    if (values.state_code == item.state_code) {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                            {error["district_id"] && (
                                <label className="text-danger">{error["district_id"]}</label>
                            )}
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