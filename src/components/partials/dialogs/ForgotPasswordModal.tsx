import React, { useEffect, useState, useContext } from "react"
import { IForgotPasswordModal } from "../../../utils/interfaces.util";
import CustomModal from "../../layouts/CustomModal";

const ForgotPasswordModal = (props: IForgotPasswordModal) => {

    const {
        show,
        slim,
        size = 'sm',
        title,
        flattened,
        stretch,
        className,
        closeModal
    } = props;

    useEffect(() => {

    }, [])

    const Child = () => {

        return (
            <>
            
            </>
        )

    }

    return (
        <>
            <CustomModal
                show={show}
                flattened={flattened}
                title={title}
                closeModal={closeModal}
                slim={slim}
                size={size}
                stretch={stretch}
                className={className}
                children={{
                    main: <Child />
                }}
            />
        </>
    )
};

export default ForgotPasswordModal;
