import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { only_number } from '../../helper/general.js';
import { useStateContext } from "../../contexts/ContextProvider.jsx"
const AddUser = (props) => {
    const [loading, setLoading] = useState(false);
    const { state_list, district_list, block_list, subject_list, qualifications_list, categories, bloodgroup } = useStateContext();
    const [ apiurl, setApiurl ] = useState('users/add');
    const [values, setValues] = useState({
        //personal detail
        id: '',
        full_name: '',
        father_name: '',
        dob: '',
        gender: '',
        mobile: '',
        mobile2: '',
        email: '',
        category: '',
        addhar_card: '',
        pan_card: '',
        health_issues: '',
        blood_group: '',
        //current_address
        block_id: '',
        district_id: '',
        state_code: '',
        address: '',
        pincode: '',
        //permanent_address
        p_block_id: '',
        p_district_id: '',
        p_state_code: '',
        p_address: '',
        p_pincode: '',
        //account detail
        bank_name: '',
        ac_h_name: '',
        ac_no: '',
        branch: '',
        ifsc: '',
        checked_same: ''
        //extra
        // qualifications: '',
        // exp_year: '',
        // exp_month: '',
        // area_of_expertise: '',
        // description: '',
    });
    useEffect(() => { 
        if (props.employee !== undefined && props.employee.id) {
            setApiurl('users/update');
            setValues((oldValues) => ({ ...oldValues, ...props.employee, mobile: props.employee.contact }));
        }
        if (district_list.filter(item => { return item.state_code == values.state_code && item.id == values.district_id }).length === 0) {
            setValues(oldValues => ({ ...oldValues, district_id: '' }));
        }
    }, [values.state_code])
    const submitThis = (e) => {
        e.preventDefault();
        if (values.gender == '') {
            toast.error("Select gender");
        }
        else if (values.full_name == '') {
            toast.error("Enter Full name");
        }
        else if (values.father_name == '') {
            toast.error("Enter Father/Husband name");
        }
        else if (values.state_code == '') {
            toast.error("Select state");
        }
        else if (values.district_id == '') {
            toast.error("Select district");
        }
        else if (values.dob == '') {
            toast.error("Enter date of birth");
        }
        else if (values.mobile == '') {
            toast.error("Enter mobile number");
        } else if (values.mobile.length != 10) {
            toast.error("Enter 10 digit mobile number");
        }
        else {
            setLoading(true);
            call_secure_api(apiurl, values)
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

    const sameData = e => {
        if (e.target.checked) {
            setValues(oldValues => ({
                ...oldValues, ...{
                    p_block_id: values.block_id,
                    p_district_id: values.district_id,
                    p_state_code: values.state_code,
                    p_address: values.address,
                    p_pincode: values.pincode
                }
            }));
            setValues(oldValues => ({ ...oldValues, 'checked_same': 1 }));
        } else {
            setValues(oldValues => ({
                ...oldValues, ...{
                    p_block_id: "",
                    p_district_id: "",
                    p_state_code: "",
                    p_address: "",
                    p_pincode: ""
                }
            }));
            setValues(oldValues => ({ ...oldValues, 'checked_same': 0 }));
        }
        return () => {

        }
    }
    return (
        <Modal size={"lg"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type='button' className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Add Teacher</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <h5 className="text-primary">Pesonal Details</h5>
                    <div className="row">
                        <div className="col-md-4 form-group">
                            <label className="col-form-label form-label">Full Name <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm text-capitalize" type="text" value={values.full_name} placeholder="Full Name" name="full_name" onChange={set('full_name')} maxLength={100} />
                        </div>
                        <div className="col-md-4 form-group">
                            <label className="col-form-label form-label">Father/Husband Name <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm text-capitalize" type="text" value={values.father_name} placeholder="Father Name" name="father_name" onChange={set('father_name')} maxLength={100} />
                        </div>
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Date of Birth <span className="text-danger">*</span></label>
                            <div className="cal-icon"><input className="form-control form-control-sm" value={values.dob} type="date" name="dob" onChange={set('dob')} maxLength={20} /></div>
                        </div>
                        <div className="col-md-4 form-group">
                            <label className="col-form-label form-label">Gender <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm" value={values.gender} name='gender' onChange={set('gender')}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-4 form-group">
                            <label className="col-form-label form-label">Category <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm" value={values.category} name='category' onChange={set('category')}>
                                <option value="">Select Category</option>
                                {categories.map((item, ex) => {
                                    return (
                                        <option key={ex} value={item.name}>{item.name}</option>

                                    );
                                })}
                            </select>
                        </div>
                        <div className="col-md-4 form-group">
                            <label className="col-form-label form-label">Blood Group <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm" value={values.blood_group} name='blood_group' onChange={set('blood_group')}>
                                <option value="">Select blood group</option>
                                {bloodgroup.map((item, ex) => {
                                    return (
                                        <option key={ex} value={item.name}>{item.name}</option>

                                    );
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Mobile Number <span className="text-danger">*</span></label>
                            <input type="text" className="form-control form-control-sm" onInput={(e) => only_number(e)} maxLength={10} name="mobile" value={values.mobile} onChange={set('mobile')} placeholder="Mobile Number" required />
                        </div>
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Other Mobile Number</label>
                            <input type="text" className="form-control form-control-sm" onInput={(e) => only_number(e)} maxLength={10} name="mobile2" value={values.mobile2 || ''} onChange={set('mobile2')} placeholder="Other Mobile Number" />
                        </div>
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Email</label>
                            <input type="text" className="form-control form-control-sm" name="email" value={values.email} onChange={set('email')} maxLength={100} placeholder="Email" />
                        </div>

                    </div>
                    <div className=" row">
                        <div className="col-sm-6 form-group">
                            <label className="col-form-label form-label">Addhar Card Number </label>
                            <input type="text" className="form-control form-control-sm" onInput={(e) => only_number(e)} maxLength={12} name="addhar_card" value={values.addhar_card || ''} onChange={set('addhar_card')} placeholder="Addhar Card Number" />
                        </div>
                        <div className="col-sm-6 form-group">
                            <label className="col-form-label form-label">Pan Card Number</label>
                            <input type="text" className="form-control form-control-sm text-uppercase" name="pan_card" value={values.pan_card} maxLength={10} onChange={set('pan_card')} placeholder="PAN Card Number" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label className="col-form-label form-label">Health Issues </label>
                            <textarea className="form-control" rows="2" name="health_issues" value={values.health_issues} onChange={set('health_issues')} placeholder="Health Issues" maxLength={150}></textarea>
                        </div>
                    </div>

                    <h5 className="text-primary mt-2">Bank Details</h5>
                    <div className=" row">
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Account Holder Name </label>
                            <input type="text" className="form-control text-capitalize form-control-sm" name="ac_h_name" value={values.ac_h_name} onChange={set('ac_h_name')} maxLength={100} placeholder="Account Holder Name " />
                        </div>
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Bank Name </label>
                            <input type="text" className="form-control text-capitalize form-control-sm" name="bank_name" value={values.bank_name} onChange={set('bank_name')} maxLength={100} placeholder="Bank Name" />
                        </div>
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Account Number </label>
                            <input type="text" className="form-control form-control-sm" name="ac_no" value={values.ac_no} onInput={(e) => only_number(e)} onChange={set('ac_no')} maxLength={20} placeholder="Account Number" />
                        </div>
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Branch</label>
                            <input type="text" className="form-control text-capitalize form-control-sm" name="branch" value={values.branch} onChange={set('branch')} placeholder="Branch" maxLength={100} />
                        </div>
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">IFSC Code</label>
                            <input type="text" className="form-control text-uppercase form-control-sm" name="ifsc" value={values.ifsc} onChange={set('ifsc')} placeholder="IFSC" maxLength={20} />
                        </div>

                    </div>
                    {/* <div class="row">
                        <div className="col-sm-4 form-group">
                            <label className="col-form-label form-label">Teaching Experience</label>
                            <div className="row">
                                <div className="col-sm-6">
                                    <small>Year</small>
                                    <input type="text" className="form-control form-control-sm" onInput={(e) => only_number(e)} maxLength={2} name="exp_year" value={values.exp_year} onChange={set('exp_year')} placeholder="Year" />
                                </div>
                                <div className="col-sm-6">
                                    <small>Month</small>
                                    <input type="text" className="form-control form-control-sm" onInput={(e) => only_number(e)} maxLength={2} name="exp_month" value={values.exp_month} onChange={set('exp_month')} placeholder="Month" />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <h5 className="text-primary mt-2">Current Address  </h5>
                    <div className="form-group row">
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">State <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm" name="state_code" value={values.state_code} onChange={set('state_code')} required>
                                <option value="">Select</option>
                                {state_list.map((item, ex) => {
                                    return (
                                        <option key={ex} value={item.state_code}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">District <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm" name="district_id" value={values.district_id} onChange={set('district_id')} required>
                                <option value="">Select</option>
                                {district_list.map((item, ex) => {
                                    if (item.state_code == values.state_code) {
                                        return (
                                            <option key={ex} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Block</label>
                            <select className="form-control form-control-sm" name="block_id" value={values.block_id} onChange={set('block_id')}>
                                <option value="">Select</option>
                                {block_list.map((item, ex) => {
                                    if (item.district_id == values.district_id) {
                                        return (
                                            <option key={ex} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row mt-2">
                        <div className="col-sm-8">
                            <label className="col-form-label form-label">Street/Village/House No</label>
                            <input className="form-control form-control-sm" type="text" name="address" value={values.address} onChange={set('address')} placeholder="Street/Village/House No" />
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Pincode</label>
                            <input type="text" className="form-control form-control-sm" onInput={(e) => only_number(e)} maxLength={6} placeholder="Pincode" value={values.pincode} name="pincode" onChange={set('pincode')} />
                        </div>
                    </div>
                    <h5 className="text-primary mt-2">Permanent Address</h5>
                    <div className="form-check">
                        <label className="col-form-label form-label">Same as Above Address</label>
                        <input type="checkbox" name="sameAddress" className="form-check-input" value={values.checked_same} checked={values.checked_same == 1 ? true : false} onChange={(e) => sameData(e)} />
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">State</label>
                            <select className="form-control form-control-sm" name="p_state_code" value={values.p_state_code} onChange={set('p_state_code')}>
                                <option value="">Select</option>
                                {state_list.map((item, ex) => {
                                    return (
                                        <option key={ex} value={item.state_code}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">District</label>
                            <select className="form-control form-control-sm" name="p_district_id" value={values.p_district_id} onChange={set('p_district_id')}>
                                <option value="">Select</option>
                                {district_list.map((item, ex) => {
                                    if (item.state_code == values.p_state_code) {
                                        return (
                                            <option key={ex} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Block</label>
                            <select className="form-control form-control-sm" name="p_block_id" value={values.p_block_id} onChange={set('p_block_id')}>
                                <option value="">Select</option>
                                {block_list.map((item, ex) => {
                                    if (item.district_id == values.p_district_id) {
                                        return (
                                            <option key={ex} value={item.id}>{item.name}</option>
                                        )
                                    }
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row mt-2">
                        <div className="col-sm-8">
                            <label className="col-form-label form-label">Street/Village/House No</label>
                            <input className="form-control form-control-sm" type="text" name="p_address" value={values.p_address} onChange={set('p_address')} placeholder="Street/Village/House No" />
                        </div>
                        <div className="col-sm-4">
                            <label className="col-form-label form-label">Pincode</label>
                            <input type="text" className="form-control form-control-sm" onInput={(e) => only_number(e)} maxLength={6} placeholder="Pincode" value={values.p_pincode} name="p_pincode" onChange={set('p_pincode')} />
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
export default AddUser