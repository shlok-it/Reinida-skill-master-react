import React, { Component } from 'react';
import { call_secure_api } from '../../connect/api.js';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, CardText } from 'reactstrap';
//import notfoundImg from "../../assets/no_image.jpg";
import { toast } from 'react-toastify';
class PageSettingMdl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: null,
      loading: false,
      data_status: false,
      editId: props?.dataId,
      dataContent: props?.dataContent,
      page_title: props?.page_title,
      error_text: "Please Wait",
      datalist: [],
    };
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(content) {
    this.setState({ dataContent: content });
  }
  componentDidMount() {

  }
  save_page_content = () => {
    let dataContent = this.state.dataContent;
    let dataId = this.state.editId;
    let optopns = {
      'dataContent': dataContent,
      'id': dataId
    }
    this.setState({ loading: true });
    call_secure_api('setting/page/update', optopns)
      .then(
        (resolve) => {
          if (resolve.status == true) {
            toast.success(resolve.message, 'success', 2000);
            this.props?.model_handler(true)
          }
          else {
            toast.warning(resolve.message, 'error', 2000);
          }
          this.setState({ loading: false });
        },
        (reject) => {
          console.log(reject);
          this.setState({ loading: false });
        }
      )
  }
  render() {
    const { loading } = this.state;

    return (
      <>
        <Modal size="xl" fade={false} centered isOpen={true} aria-labelledby="example-modal-sizes-title-sm" role="dialog" backdrop="static" keyboard={false}>
          <ModalHeader close={<button className="btn-close" onClick={() => { this.props?.model_handler(false) }}></button>}>
            <CardText className="modal-title">
              Edit {this.state.page_title}
            </CardText>
          </ModalHeader>
          <ModalBody>
            <SunEditor onChange={(event) => {
              this.setState({ dataContent: event });
            }} onBlur={(event) => {
              this.setState({ dataContent: event.target.innerHTML });
            }} defaultValue={this.state.dataContent}
              setOptions={{
                height: 250,
                buttonList: [['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
                ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
                ['link', 'image', 'fullScreen', 'showBlocks', 'codeView', 'preview'],
                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat']],
                callBackSave: function (contents, isChanged) {
                  console.log(contents, isChanged);
                }
              }} />
          </ModalBody>
          <ModalFooter>
            <div className="mt-15 mr-20">
              <br />
              <Button type="button" disabled={loading} onClick={() => this.save_page_content()} className="btn btn-primary btn-md"> {this.state.loading && <i className="mdi mdi-dots-circle mdi-spin" aria-hidden="true"></i>} Save</Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default PageSettingMdl;
