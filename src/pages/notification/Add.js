import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { useStateContext } from "../../contexts/ContextProvider.jsx";
const Add = (props) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        title: '', notification_text: '', target_to: []
    });
    useEffect(() => {

    }, []);

    const submitThis = (e) => {
        e.preventDefault();
        if (values.title == '') {
            toast.error("Enter Title", 'error', 5000);
        }
        else if (values.notification_text == '') {
            toast.error("Enter message", 'error', 5000);
        }
        else if (values.target_to.length == 0) {
            toast.error("Select Target", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('notification/add', values)
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
    const set_target_users = (id) => {
        let array = [...values.target_to];
        if (array.includes(id)) {
            var index = array.indexOf(id);
            array.splice(index, 1);
            setValues(oldValues => ({ ...oldValues, target_to: array }));
        }
        else {
            if (id != 0)
                setValues(oldValues => ({ ...oldValues, target_to: array.concat([id]) }));
            else
                setValues(oldValues => ({ ...oldValues, target_to: [id] }));
        }
    }
    return (
        <Modal size={"lg"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Add Notification</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="row g-3">
                        <div className="col-lg-12 col-xs-12 col-sm-12 col-md-6">
                            <div className="form-group">
                                <label htmlFor="title" className="control-label"><span className="text-danger">*</span>Notification Title</label>
                                <input type="text" required name="title" value={values.title || ''} onChange={set("title")} className="form-control" id="title" />
                            </div>
                        </div>
                        <div className="col-lg-12 col-xs-12 col-sm-12 col-md-6">
                            <div className="form-group">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => set_target_users(0)} checked={values.target_to.includes(0)} type="checkbox" id="target_to_0" value="0" />
                                    <label className="form-check-label" htmlFor="target_to_0">All Staff</label>
                                </div>
                                {
                                    props.emp_list.map((item, index) => {
                                        return (
                                            <div className="form-check form-check-inline" key={index}>
                                                <input className="form-check-input" disabled={values.target_to.includes(0)} onChange={(e) => set_target_users(parseInt(item.id))} checked={values.target_to.includes(parseInt(item.id))} type="checkbox" id={"target_to_" + parseInt(item.id)} value={parseInt(item.id)} />
                                                <label className="form-check-label" htmlFor={"target_to_" + parseInt(item.id)}>{item.full_name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12">
                            <div className="form-group">
                                <label htmlFor="notification_text" className="control-label"><span className="text-danger">*</span></label>
                                <textarea name="notification_text" required value={values.notification_text || ''}   onChange={set("notification_text")} className="form-control" id="notification_text"></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12 text-center mt-3">
                        <button className="btn btn-success btn-sm" type='submit' disabled={loading}>{loading && <i className="bx bx-spin bx-spinner" aria-hidden="true"></i>}  Submit</button>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </Modal>
    )
};
export default Add