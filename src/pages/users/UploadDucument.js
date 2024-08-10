import React, { useState, useEffect } from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
import { call_secure_api, BaseUrl } from '../../connect/api.js';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const UploadDucument = (props) => {
    const [loading, setLoading] = useState(false);
    const [docsValue, setDocsValue] = useState([]);
    const [values, setValues] = useState(
        {
            'id': 0,
            'users_list_id': props.employee.id,
            'addhar_card': '',
            'pancard': '',
            'tenth': '',
            'twelfth': '',
            'graduation': '',
            'post_graduation': '',
            'experience': '',
            'up_addhar_card': '',
            'up_pancard': '',
            'up_tenth': '',
            'up_twelfth': '',
            'up_graduation': '',
            'up_post_graduation': '',
            'up_experience': '',
        }
    );

    const [inputs, setInputs] = useState([
        {
            'id': 0,
            'name': 'addhar_card',
            'up_name': 'up_addhar_card',
            'label_name': 'Addhar Card',
        },
        {
            'id': 1,
            'name': 'pancard',
            'up_name': 'up_pancard',
            'label_name': 'Pancard',
        },
        {
            'id': 2,
            'name': 'tenth',
            'up_name': 'up_tenth',
            'label_name': '10th',
        },
        {
            'id': 3,
            'name': 'twelfth',
            'up_name': 'up_twelfth',
            'label_name': '12th',
        },
        {
            'id': 4,
            'name': 'graduation',
            'up_name': 'up_graduation',
            'label_name': 'Graduation',
        },
        {
            'id': 5,
            'name': 'post_graduation',
            'up_name': 'up_post_graduation',
            'label_name': 'Post Graduation',
        },
        {
            'id': 6,
            'name': 'experience',
            'up_name': 'up_experience',
            'label_name': 'Experience',
        },
    ])
    useEffect(() => {
        get_emp_list();
    }, []);
    const get_emp_list = () => {
        call_secure_api('users/getDocuments', { user_id: props.employee.id })
            .then(
                (resolve) => {
                    if (resolve.status === true) {
                        // console.log(resolve.data);
                        if (resolve.data) {
                            setDocsValue(resolve.data);
                            setValues(
                                {
                                'users_list_id':resolve.data.users_list_id,
                                'up_addhar_card': resolve.data.addhar_card ? BaseUrl.resource_url + '/' + resolve.data.addhar_card : '',
                                'up_pancard': resolve.data.pancard ? BaseUrl.resource_url + '/' + resolve.data.pancard : '',
                                'up_tenth': resolve.data.tenth ? BaseUrl.resource_url + '/' + resolve.data.tenth : '',
                                'up_twelfth': resolve.data.twelfth ? BaseUrl.resource_url + '/' + resolve.data.twelfth : '',
                                'up_graduation': resolve.data.graduation ? BaseUrl.resource_url + '/' + resolve.data.graduation : '',
                                'up_post_graduation': resolve.data.post_graduation ? BaseUrl.resource_url + '/' + resolve.data.post_graduation : '',
                                'up_experience': resolve.data.experience ? BaseUrl.resource_url + '/' + resolve.data.experience : ''
                            });
                        }
                    }
                    else {
                        toast.error(resolve.message, 'error', 5000);
                        // setValues([]);
                    }
                },
                (reject) => {
                    console.log(reject);
                    toast.error("Server Error", 'error', 5000);
                }
            )
    }
    const deleteEmp = (docType) => {
		Swal.fire({
			title: "Do you want to delete this?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes",
			cancelButtonText: `
			NO
		  `,
		})
			.then(res => {
				if (res.isConfirmed) {
					removeDoc(docType);
				}
			});
	}
	const removeDoc = (docType) => {


		call_secure_api('users/remove_doc', {"docType":docType,'emp_id':props.employee.id,'dc_id':docsValue.id})
			.then(
				(resolve) => {
					if (resolve.status === true) {
						toast.success(resolve.message, 'success', 5000);
						get_emp_list();
					}
					else {
						toast.error(resolve.message, 'error', 5000);
					}
				},
				(reject) => {
					console.log(reject);
					toast.error("Server Error", 'error', 5000);
				}
			)
	}
    const submitThis = (e) => {
        e.preventDefault();
        if (values.users_list_id == '') {
            toast.error("Please upload image");
        } else {
            setLoading(true);
            call_secure_api('users/upload_doc', values)
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
    const convertToBase64 = (files, name) => {

        if (files && files != 'remove') {
            const reader = new FileReader()
            reader.readAsDataURL(files)
            reader.onload = () => {
                setValues(oldValues => ({ ...oldValues, [name]: reader.result }));
            }
        } else {
            setValues(oldValues => ({ ...oldValues, [name]: '' }));
        }
    }

    const set = name => {
        return ({ target: { value } }) => {
            setValues(oldValues => ({ ...oldValues, [name]: value }));
        }
    };
    return (
        <Modal size={"lg"} fade={false} isOpen={true} backdrop="static" keyboard={false}>
            <ModalHeader close={<button type={'button'} className="btn-close" onClick={() => { props.model_handler(false) }}></button>}><CardText>Add doc of <strong className='text-dark'>{props.employee.full_name}</strong></CardText></ModalHeader>
            <ModalBody>
                <form action="" onSubmit={submitThis}>
                    <div className="row">
                        <table  className='table table-borderd table-striped'>
                            <thead>
                                <tr className='text-center'>
                                    <th>Sn.</th>
                                    <th>Name</th>
                                    <th>File</th>
                                    <th>Preview</th>
                                    <th>Upload</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inputs.map((item, key) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>{++key}</td>
                                            <td>{item.label_name} {values[key]}</td>
                                            <td>
                                                <div className="form-group text-center photo-label ">
                                                   {values[item.up_name]?<>
                                                    <a href={values[item.up_name]} target="_blank" className="photo-label"> <img
                                                        alt="Not found"
                                                        src={values[item.up_name]}
                                                    /></a>
                                                    <button type="button" className=" rm-btn" onClick={(e) => deleteEmp(item['name'])}> Remove </button></>
                                               :'---' }
                                                </div>
                                            </td>
                                            <td><div className="form-group text-center photo-label ">
                                                {values[item.name]?<><img
                                                        alt="Not found"
                                                        src={values[item.name]}
                                                    />
                                                    <button type="button" className=" rm-btn" onClick={(e) => convertToBase64('remove', [item.name])}> Remove </button></>
                                                    :'---' }
                                                </div></td>
                                            <td>
                                            <input className='form-control form-control-sm' type="file" name={item.name} onChange={(e) => convertToBase64(e.target.files[0], [item.name])} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
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
export default UploadDucument