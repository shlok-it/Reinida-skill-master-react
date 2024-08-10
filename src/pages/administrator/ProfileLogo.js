import React, { Component } from 'react';
import { call_secure_api, BaseUrl } from '../../connect/api.js';
import { toast } from 'react-toastify';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
class ProfileLogo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id: props.administrator_id || '',
            company_logo: BaseUrl.resource_url + props?.company_logo || '',
        };
    }
    change_logo(event) {
        let image = event.target.files[0];
        if (image != null) {
            if (image.type == "image/png" || image.type == "image/jpg" || image.type == "image/jpeg" || image.type == "image/webp") {
                var reader = new FileReader();
                var url = reader.readAsDataURL(image);
                reader.onloadend = function (e) {
                    this.setState({
                        company_logo: reader.result, displayUbtn: true
                    })
                }.bind(this);
            }
            else {
                this.setState({
                    company_logo: '', displayUbtn: true
                })
            }
        }
        else {
            this.setState({
                company_logo: '', displayUbtn: true
            })
        }
    }
    save_upload_image() {
        this.setState({ loading: true })
        var company_logo = this.state.company_logo;
        if (company_logo) {
            let optopns = { 'company_logo': company_logo, 'id': this.state.id };
            call_secure_api('administrator/upload-image', optopns)
                .then(
                    (resolve) => {
                        if (resolve.status == true) {
                            toast.success(resolve.message, 'success', 2000);
                            this.props.model_handler(true);
                        }
                        else {
                            toast.warning(resolve.message, 'error', 2000);
                            this.setState({ loading: false })
                        }
                    },
                    (reject) => {
                        console.log(reject);
                    }
                )
        }
        else {
            this.setState({ loading: false })
        }
    }
    render() {
        return (
            <Modal size="md" fade={false} isOpen={true} aria-labelledby="example-modal-sizes-title-sm" role="dialog" backdrop="static" keyboard={false}>
                <ModalHeader close={<button className="btn-close" onClick={() => { this.props.model_handler(false) }}></button>}>
                    <CardText className="modal-title">
                        Upload Administrator Logo
                    </CardText>
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-lg-12 col-xs-12 col-sm-12 col-md-12">
                            <label className="control-label">Select Logo</label>
                            <input type="file" ref="company_logo" accept="image/*" className='form-control' name="company_logo" onChange={(event) => this.change_logo(event)} />
                            <div className="text-center mt-2 dropzone">
                                <img src={this.state.company_logo} style={{ maxHeight: "180px", maxWidth: "100%" }} />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {this.state.displayUbtn == true ? <Button type="button" disabled={this.state.loading} onClick={() => this.save_upload_image()} className="btn btn-danger"> {this.state.loading && <i className="mdi mdi-dots-circle mdi-spin" aria-hidden="true"></i>} Upload</Button> : ''}
                </ModalFooter>
            </Modal>
        );
    }
}
export default ProfileLogo;
