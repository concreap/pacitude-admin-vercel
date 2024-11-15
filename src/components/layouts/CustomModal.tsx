import React, { useEffect, useState, useContext } from "react"
import { Modal as BootstrapModal } from 'react-bootstrap'
import { ICustomModal } from "../../utils/interfaces.util";
import RoundButton from "../partials/buttons/RoundButton";
import Icon from "../partials/icons/Icon";

const CustomModal = (props: ICustomModal) => {

    const {
        show,
        slim,
        size = 'sm',
        title,
        flattened,
        stretch,
        className,
        children,
        closeModal
    } = props;

    useEffect(() => {

    }, [])

    const closeX = (e: any) => {
        if(e) { e.preventDefault(); }
        closeModal(e)
    }

    const computeClass = () => {

        let result: string = `custom-modal slim-${slim ? slim : ''} ${size}`;

        result = result + `${stretch ? 'stretched' : ''} ${flattened ? 'flat' : ''}`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    return (
        <>
            <BootstrapModal
                show={show}
                onHide={() => {
                    closeX(null)
                }}
                size="sm"
                fade={false}
                keyboard={false}
                aria-labelledby="medium-modal"
                centered={true}
                backdrop={true}
                className={computeClass()}
            >

                <BootstrapModal.Body className="cm-body">

                    <div className="cm-left-box">
                        {
                            children.child && children.child
                        }
                    </div>

                    <div className="cm-right-box">

                        <div className="cm-header">
                            <h2 className="fs-16 mrgb0 font-plusj-bold pas-950">{title}</h2>
                            <RoundButton
                                icon={<Icon type="polio" name="cancel" clickable={false} size={16} />}
                                className="cm-close-btn"
                                clickable={true}
                                onClick={(e) => closeX(e)}
                            />
                        </div>

                        <div className="cm-right-body">
                            {children.main}
                        </div>

                        <div className="cm-footer"></div>
                    </div>

                </BootstrapModal.Body>

            </BootstrapModal>
        </>
    )

};

export default CustomModal;
