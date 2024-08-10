import React, { useState, } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api,BaseUrl } from '../../connect/api.js';
import { toast } from 'react-toastify';
const UploadProfilepic = (props) => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        // personal detail
        id: props.employee.id,
        image_link:'',
    });
    const submitThis = (e) => {
        e.preventDefault();
        if (values.image_link == '') {
            toast.error("Please upload image");
        }else {
            setLoading(true);
            call_secure_api('users/uploadProfile_photo', values)
                .then(
                    (resolve) => {
                        if (resolve.status === true) {
                            toast.success(resolve.message);
                            props.model_handler(true);
                        }else {
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
    const convertToBase64 = (files) => {
        if (files && files!='remove') {
            const reader = new FileReader()
            reader.readAsDataURL(files)
            reader.onload = () => {
                setValues(oldValues => ({ ...oldValues, "image_link": reader.result }));
            }
        }else{
            setValues(oldValues => ({ ...oldValues, "image_link": '' }));
        }
    }

    const set = name => {
        return ({ target: { value } }) => {
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    };
    return (
        <Modal size={"sm"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Add profile image</CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="row">
                        {(values.image_link || props.employee.image_link) && (
                            <div className="col-md-12 form-group text-center">
                              <img
                                    alt="Not found"
                                    width={"150px"}
                                    src={values.image_link || (BaseUrl.resource_url+'/'+props.employee.image_link)}
                                />
                                <br />
                                <button className="btn btn-sm m-3 btn-danger" onClick={(e) => convertToBase64('remove')}>Remove</button>
                            </div>
                        )}
                        <div className="col-md-12 form-group text-center">
                            <input
                                type="file"
                                name="image_link"
                                accept='image/*'
                                onChange={(e) => convertToBase64(e.target.files[0])}
                            />
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
export default UploadProfilepic