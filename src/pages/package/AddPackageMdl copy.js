import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
const AddPackageMdl = (props) => {
    const [loading, setLoading] = useState(false);
    let moduleTemplate = { "module_name": "", "module_detail": "" };
    const [values, setValues] = useState({ package_name: '' });
    const [modules, setModule] = useState([moduleTemplate]);
    const submit_office_package = (e) => {
        e.preventDefault();
        const module_data = modules.filter((item) => item.module_name != '' && item.module_detail != '')
        if (values.package_name == '') {
            toast.error("Enter Package Name", 'error', 5000);
        }
        else if (modules.length == 0) {
            toast.error("Please add atleast one package module", 'error', 5000);
        }
        else if (module_data.length != modules.length) {
            toast.error("Fill empty module", 'error', 5000);
        }
        else {
            setLoading(true);
            call_secure_api('package/add', { 'package_name': values.package_name, 'package_module': module_data })
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
    const add_new_module = () => {
        setModule(oldArray => [...oldArray, moduleTemplate]);
    }
    const remove_module = (index) => {
        setModule([...modules.slice(0, index), ...modules.slice(index + 1)]);
    }
    const update_module = (e, index) => {
        setModule(modules.map((artwork, i) => {
            if (index === i) {
                return { ...artwork, [e.target.name]: e.target.value };
            } else {
                return artwork;
            }
        }));
    }
    return (
        <Modal size={"lg"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Add Package</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submit_office_package}>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Package Name <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="text" value={values.package_name} name="package_name" onChange={set('package_name')} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Package Module <span className="text-danger">*</span></label>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Detail</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map((item, index) => {
                                        return (<tr key={index}>
                                            <td><input className="form-control form-control-sm" type="text" value={item.module_name} name="module_name" onChange={(e) => update_module(e, index)} /></td>
                                            <td><input className="form-control form-control-sm" type="text" value={item.module_detail} name="module_detail" onChange={(e) => update_module(e, index)} /></td>
                                            <td><button type='button' onClick={() => remove_module(index)} className="btn btn-sm btn-danger">Remove</button></td>
                                        </tr>
                                        )
                                    })}
                                    <tr>
                                        <td colSpan={2}></td>
                                        <td><button type='button' className="btn btn-sm btn-success" onClick={() => add_new_module()}>Add</button></td>
                                    </tr>
                                </tbody>
                            </table>
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
export default AddPackageMdl