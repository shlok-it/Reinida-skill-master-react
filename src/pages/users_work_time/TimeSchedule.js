import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText, Table, Input, Form } from 'reactstrap';
import { call_secure_api, call_secure_get_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
const TimeSchedule = (props) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('Working Time schedule for all teachers');
    const [isOpen, setisOpen] = useState(false);

    const [values, setValues] = useState([]);
    useEffect(() => {
        console.log(props.employee);
        setisOpen(true);
        getItmeSchedule(props.employee.users_list_id)
    }, [])


    const getItmeSchedule = (id = 0) => {
        call_secure_api('update-check-in-out-time/list', { user_id: id })
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        const responseData = resolve.data;
                        const newData = responseData.map((item) => {
                            return { ...item, 'user_id': props.employee.users_list_id }
                        })
                        setValues(newData);
                        // setValues(resolve.data);
                    }
                    else {
                    }
                    setLoading(false);
                },
                (reject) => {
                    toast.error("Server Error");
                    setLoading(false);
                }
            )
    }
    const submitThis = (e) => {
        e.preventDefault();
        if (values.length > 0) {
            setLoading(true);
            call_secure_api('update-check-in-out-time/update', { data: values })
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
    const handleCheckBox = (checked, name) => {
        if (name == 'open_close' && checked) {
            return 'Open';
        } else if (name == 'open_close' && !checked) {
            return 'Close';
        } else if (name == 'status' && !checked) {
            return '0';
        } else if (name == 'status' && checked) {
            return '1';
        }
    }
    const hanldeChnage = (index, event) => {
        const { name, value, type, checked } = event.target;
        const updatedStudents = values.map((item, i) =>
            i === index ? { ...item, [name]: type === 'checkbox' ? handleCheckBox(checked, name) : value } : item
        );
        setValues(updatedStudents);
    };
    return (
        <Modal size={"xl"} fade={false} isOpen={isOpen} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Manage Working Time of  <strong className="text-primary p-1">{props.employee.user_name}</strong></CardText></ModalHeader>
            <Form action="" onSubmit={submitThis}>
                <ModalBody>
                    <div className='border p-1 m-1 text-dark'><div className="form-group row">
                        <div className="col-md-12">
                            <label className="col-form-label form-label"><strong>{props.employee.user_name}</strong>
                                <br />
                                {props.employee.school_name}
                            </label>

                        </div>
                    </div>
                    </div>
                    {/* <div className='border p-1 m-1 text-dark'><strong className="text-danger p-1">Note:</strong>If the auto update is ON, it will refresh all users attendance times at midnight every day. </div> */}
                    <div className='d-flex justify-content-between my-2'>
                        <button type="button" className='btn btn-primary' onClick={() => getItmeSchedule(props.employee.users_list_id)}>Teacher Time</button>
                        <button type="button" className='btn  btn-outer btn-danger' onClick={() => getItmeSchedule(0)}>Get Default Time</button>
                    </div>
                    {values &&
                        <Table hover bordered responsive size="sm" className='fs-12'>
                            <thead>
                                <tr>
                                    <th>Day Name</th>
                                    <th>Open/Closed</th>
                                    <th className='bg-success text-white'>Check In</th>
                                    <th className='bg-success text-white'>Check in start</th>
                                    <th className='bg-success text-white'>Check in end</th>
                                    <th className='bg-danger text-white'>Check out</th>
                                    <th className='bg-danger text-white'>Check out start</th>
                                    <th className='bg-danger text-white'>Check out end</th>
                                    {/* <th>Auto update</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {values.map((val, key) => {
                                    return (<tr key={key}>
                                        <th>{val.day_name}</th>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" name="open_close" checked={val.open_close == 'Open' ? true : false} id={"flexSwitchCheckDefault" + key} onChange={(e) => hanldeChnage(key, e)} />
                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{val.open_close}</label>
                                            </div>
                                        </td>
                                        <td className='bg-success'>
                                            <input type="time" name="check_in" className="form-control" value={val.check_in} onChange={(e) => hanldeChnage(key, e)}></input>
                                        </td>
                                        <td className='bg-success'>
                                            <input type="time" name="check_in_start" className="form-control" value={val.check_in_start} onChange={(e) => hanldeChnage(key, e)}></input>
                                        </td>
                                        <td className='bg-success'>
                                            <input type="time" name="check_in_end" className="form-control" value={val.check_in_end} onChange={(e) => hanldeChnage(key, e)}></input>
                                        </td>
                                        <td className='bg-danger'>
                                            <input type="time" name="check_out" className="form-control" value={val.check_out} onChange={(e) => hanldeChnage(key, e)}></input>
                                        </td>
                                        <td className='bg-danger'>
                                            <input type="time" name="check_out_start" className="form-control" value={val.check_out_start} onChange={(e) => hanldeChnage(key, e)}></input>
                                        </td>
                                        <td className='bg-danger'>
                                            <input type="time" name="check_out_end" className="form-control" value={val.check_out_end} onChange={(e) => hanldeChnage(key, e)}></input>
                                        </td>
                                        {/* <td>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" name="status" checked={val.status == '1' ? true : false} id={"flexSwitchCheckDefault" + key} onChange={(e) => hanldeChnage(key, e)} />
                                                <label className="form-check-label" htmlFor="flexSwitchCheckDefaults">{val.status == 1 ? 'ON' : "OFF"}</label>
                                            </div>
                                        </td> */}
                                    </tr>);
                                })}
                            </tbody>
                        </Table>}
                </ModalBody>
                <ModalFooter>
                    <div className="text-center py-3">
                        <button type="submit" disabled={loading} className="border-0 btn btn-primary btn-gradient-primary btn-rounded">{loading && <i className="mdi mdi-dots-circle mdi-spin"></i>} Save</button>&nbsp;&nbsp;
                        <button type="button" onClick={() => { props.model_handler(false) }} className="btn btn-secondary btn-rounded">Cancel</button>
                    </div>
                </ModalFooter>
            </Form>
        </Modal>
    )
};
export default TimeSchedule