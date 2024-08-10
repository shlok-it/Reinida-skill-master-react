import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api } from '../../../connect/api.js';
import { toast } from 'react-toastify';
import { formatMonth } from '../../../helper/general.js';
const Add = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState([]);
    const [title, setTitle] = useState('add');
    const this_month = formatMonth(
        new Date(new Date().setMonth(new Date().getMonth()))
    );
    const [values, setValues] = useState(
        {
            id: props.item.id||'',
            title: props.item.title||'',
            slug: props.item.slug||'',
            date: props.item.date||'',
            image_file: '',
            status: props.item.status||'1'
        }
    );
    useEffect(()=>{
        if(props.item.id){
            setTitle('update');
        }else{
            setTitle('add');
        }
    },1000)
    const submitThis = (e) => {
        let endurl = 'store';
        if(values.id){
            endurl = 'update';
        }else{
            endurl = 'store' ;
        }
        e.preventDefault();
        if (values.title == '') {
            toast.error("Please select Title");
        }
        else if (values.date == '') {
            toast.error("Please select date");
        }
        else if (values.image_file == '' && props.item.id=='') {
            toast.error("Plese upload File");
        }
        else {
            setLoading(true);
            call_secure_api('website/notice_board/'+endurl, values)
                .then(
                    (resolve) => {
                        if (resolve.status === true) {
                            toast.success(resolve.message);
                            props.model_handler(true);
                        }
                        else {
                            if (resolve.data) {
                                setError(resolve.data);
                            } else {
                                setError([]);
                            }
                            toast.error(resolve.message, "error", 5000);
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
    const convertToBase64 = (files) => {
        if (files && files != 'remove') {
            const reader = new FileReader()
            reader.readAsDataURL(files)
            reader.onload = () => {
                setValues(oldValues => ({ ...oldValues, "image_file": reader.result }));
            }
        } else {
            setValues(oldValues => ({ ...oldValues, "image_file": '' }));
        }
    }
    const set = name => {
        return ({ target: { value } }) => {
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    };
    return (
        <Modal size={"sm"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>{title}</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <label htmlFor="title" className="col-form-label form-label">Title <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="text" required name="title" value={values.title || ''} onChange={set('title')} />
                            {error["title"] && (
                                <label className="text-danger">{error["title"]}</label>
                            )}
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor="slug" className="col-form-label form-label">Title in english <span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="text" name="slug" value={values.slug || ''} onChange={set('slug')} required={true} />
                            {error["slug"] && (
                                <label className="text-danger">{error["slug"]}</label>
                            )}
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor="date" className="col-form-label form-label">Date<span className="text-danger">*</span></label>
                            <input className="form-control form-control-sm" type="date" name="date" value={values.date || ''} min={this_month} onChange={set('date')} required={true} />
                            {error["date"] && (
                                <label className="text-danger">{error["date"]}</label>
                            )}
                        </div>
                        <div className="col-sm-12">
                            <label htmlFor="Status" className="col-form-label form-label">Status <span className="text-danger">*</span></label>
                            <select className="form-control form-control-sm" name="status" value={values.status || ''} onChange={set('status')} required={true} >
                                <option value="1">Active</option>
                                <option value="2">Inactive</option>
                            </select>
                            {error["status"] && (
                                <label className="text-danger">{error["status"]}</label>
                            )}
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-12">
                                <label htmlFor="upload" className="col-form-label form-label">Upload File {!values.id&&<span className="text-danger">*</span>} <span className="f12">[ Notification Text upload only pdf file max 5 mb ]</span></label>
                                <input className="form-control form-control-sm" type="file" name="image_file" accept="application/pdf" onChange={(e) => convertToBase64(e.target.files[0])}  required={values.id?false:true} />
                                {error["image_file"] && (
                                    <label className="text-danger">{error["image_file"]}</label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-center py-3">
                        <button type="submit" disabled={loading} className="border-0 btn btn-primary btn-gradient-primary btn-rounded">{loading ? <i className="material-icons spin">Loading</i> : 'Save'}</button>&nbsp;&nbsp;
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