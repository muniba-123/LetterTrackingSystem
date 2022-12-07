import React from 'react';
import { Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";
import Button from './Button';

export default function Popup(props) {
    let { text, title, showModal, handleClose, btn1Text, btn1Click, btn2Text, showBtnLoader } = props;
    return (
        <Modal isOpen={showModal} onClosed={handleClose} backdrop="static" keyboard={false} className="info-modal" centered>
            {title && <ModalHeader closeButton>
                {title}
            </ModalHeader>}
            <ModalBody>{text}</ModalBody>
            <ModalFooter>
                {btn2Text &&
                    <Button label={btn2Text} onClick={handleClose} className={`small-btn btn-white`} />
                }
                <Button label={btn1Text} onClick={btn1Click} className={`small-btn `} showBtnLoader={showBtnLoader} />

            </ModalFooter>
        </Modal>
    );
}
