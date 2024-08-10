import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { only_number, session_year } from '../../helper/general.js';
import { useStateContext } from "../../contexts/ContextProvider.jsx"
const AddVacancies = (props) => {
    const [loading, setLoading] = useState(false);
    const [isOther, setIsOther] = useState(0);
    const [title, setTitle] = useState('Add');
    const [isOpen, setisOpen] = useState(false);
    const { state_list, district_list, block_list, subject_list, village_list, qualifications_list } = useStateContext();
    const rowinput = {subject_id: '', no_of_post: '',vacancies_for:'' };
    const [v_post_list, setNewRow] = useState([rowinput]);
    const [values, setValues] = useState({
        'state_code': '22',
        'district_id': '',
        'block_id': '',
        'village_id': '',
        'school_name': '',
        'no_of_post': '',
        'subject_id': '',
        'status': '',
        'session_year': session_year(),
        'other_village': '',
    });
    useEffect(() => {
        if(props.employee!==0){
            get_emp_detail();
            setTitle('Edit');
        }else{
            setisOpen(true);
        }
        if (district_list.filter(item => { return item.state_code == values.state_code && item.id == values.district_id }).length === 0) {
            setValues(oldValues => ({ ...oldValues, district_id: '' }));
        }
    }, [values.state_code])
    const get_emp_detail = () => {
        call_secure_api('vacancies/list_edit', { v_id: props.employee })
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        setValues(resolve.data.vacancies_detail)
                        setNewRow(()=>[...resolve.data.vacancies_subject])
                        setisOpen(true);
                    }
                    else {
                        toast.error(resolve.message, 'error', 5000);
                        props.model_handler(false);
                    }
                },
                (reject) => {
                    toast.error("Server Error", 'error', 5000);
                    props.model_handler(false);
                }
            )
    }
    const submitThis = (e) => {
        e.preventDefault();
        if (values.school_name == '') {
            toast.error("Enter School Name");
        }
        else if (values.description == '') {
            toast.error("Enter description");
        }
        else {
            values['subject_id'] = v_post_list;
            setLoading(true);
            call_secure_api('vacancies/add', values)
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

    const set = name => {
        return ({ target: { value } }) => {
            if (name == 'village_id') {
                setIsOther(value);
            }
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    };

    const update_row_input = (i, event) => {
        setNewRow((old_array) =>
            old_array.map((item, index) => {
                if (i === index) {
                    return { ...item, [event.target.name]: event.target.value }
                }
                else {
                    return item;
                }
            })
        )
    }
  
    const addNewRow = () => {
        setNewRow(oldArray => [...oldArray, rowinput]);
    }
    const remove_options = (index) => {
        v_post_list.splice(index,1);
        setNewRow([...v_post_list]);
    }
    return (
        <Modal size={"lg"} fade={false} isOpen={isOpen} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>{title} Vacancies</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>

                    <div className="form-group row">
                        <div className="col-md-12">
                            <label className="col-form-label form-label">School Name <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm text-uppercase" type="text" value={values.school_name} placeholder="School name" name="school_name" onChange={set('school_name')} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-12">
                            <table className='table table-striped'>
                                <thead className="">
                                    <tr className='text-center '>
                                        <th>#</th>
                                        <th>Subject</th>
                                        <th>Number Of Post</th>
                                        <th>Vacancies for</th>
                                        <th>remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {v_post_list.map((input_row, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <select className="form-control form-control-sm" name="subject_id" value={input_row.subject_id} onChange={(e) => update_row_input(i, e)}>
                                                        <option value="">Select</option>
                                                        {subject_list.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.id}>{item.subject_name}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input className="form-control form-control-sm" type="text" value={input_row.no_of_post} placeholder="Number Of Post" name="no_of_post" onInput={(e) => only_number(e)} maxLength={2}  onChange={(e) => update_row_input(i, e)} />
                                                </td>
                                                <td>
                                                    <input className="form-control form-control-sm" type="text" value={input_row.vacancies_for} placeholder="class 1 to 5" name="vacancies_for" maxLength={100}  onChange={(e) => update_row_input(i, e)} />
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-danger" type="button" onClick={() => remove_options(i)}><i className='fa fa-trash'></i></button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    }
                                    <tr >
                                        <td colSpan="5">
                                            <button className="border-0 btn btn-primary btn-gradient-primary btn-rounded" type="button" onClick={(e) => addNewRow()}>+add row</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h5 className="text-primary mt-2">Address Information</h5>
                    <div className="form-group row">
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">State</label>
                            <select className="form-control form-control-sm" name="state_code" value={values.state_code} onChange={set('state_code')}>
                                <option value="">Select</option>
                                {state_list.map((item, index) => {
                                    return (
                                        <option key={index} value={item.state_code}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">District</label>
                            <select className="form-control form-control-sm" name="district_id" value={values.district_id} onChange={set('district_id')}>
                                <option value="">Select</option>
                                {district_list.map((item, index) => {
                                    if (item.state_code == values.state_code) {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Block</label>
                            <select className="form-control form-control-sm" name="block_id" value={values.block_id} onChange={set('block_id')}>
                                <option value="">Select</option>
                                {block_list.map((item, index) => {
                                    if (item.district_id == values.district_id) {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Village</label>
                            <select className="form-control form-control-sm" name="village_id" value={values.village_id} onChange={set('village_id')}>
                                <option value="">Select</option>
                                {village_list.map((item, index) => {
                                    if (item.block_id == values.block_id) {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                                <option value={0}>Other</option>
                            </select>
                        </div>

                        {(isOther) ?
                            <div className="col-sm-4">
                                <label className="col-form-label form-label">Village Name</label>
                                <input type="text" className="form-control from-control-sm" name="other_village" value={values.other_village || ''} onChange={set('other_village')} placeholder="Village Name"></input>
                            </div>
                            : ''}
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Session Year</label>
                            <input type='text' className="form-control form-control-sm" name="session_year" value={values.session_year || session_year()} onChange={set('session_year')} />
                        </div>
                    </div>
                    <h5 className="text-primary mt-2">Any Description</h5>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <textarea className="form-control" rows="6" name="description" value={values.description || ''} onChange={set('description')} placeholder="Description"></textarea>
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
export default AddVacancies