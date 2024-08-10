import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardText,
} from "reactstrap";
const ImageView = (props) => {
 
  return (
    <Modal
      size={"lg"}
      fade={false}
      isOpen={true}
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader
        close={
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              props.model_handler(false);
            }}
          ></button>
        }
      >
        <CardText>{props.title}</CardText>
      </ModalHeader>
      <ModalBody>
          <div className="row">
            {(props.image) ? (
              <div className="col-md-12 text-center">
                <img
                  alt="Not found"
                  className='image-borded'
                  src={props.image}
                  style={{ maxHeight:"100%",maxWidth:'100%' }}
                />
              </div>
            ):'NO Image found'}
          </div>
          <div className="text-center py-3">
            <button
              type="button"
              onClick={() => {
                props.model_handler(false);
              }}
              className="btn btn-secondary btn-rounded"
            >
              Close
            </button>
          </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};
export default ImageView;
