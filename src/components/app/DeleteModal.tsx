import React, { useEffect, useState, useContext } from "react"
import { IAlert, IAPIResponse } from "../../utils/interfaces.util";
import Modal from "../partials/modals/Modal";
import FormField from "../partials/inputs/FormField";
import TextInput from "../partials/inputs/TextInput";
import Button from "../partials/buttons/Button";
import LinkButton from "../partials/buttons/LinkButton";
import useAuth from "../../hooks/app/useAuth";
import Alert from "../partials/ui/Alert";
import { IDeleteModal } from "../../utils/interfaces.util";
import storage from "../../utils/storage.util";
import useGoTo from "../../hooks/useGoTo";
import Icon from "../partials/icons/Icon";
import useCareer from "../../hooks/app/useCareer";
import useField from "../../hooks/app/useField";
import useTopic from "../../hooks/app/useTopic";
import { apiresponse } from "../../_data/seed";

const DeleteModal = (props: IDeleteModal) => {

    const {
        show,
        size = 'sm',
        header = true,
        title,
        flattened,
        className,
        resource,
        resourceId,
        closeModal
    } = props;

    const { goTo } = useGoTo()
    const { deleteCareer } = useCareer()
    const { deleteField } = useField()
    const { deleteTopic } = useTopic()

    const [headIn, setHeadIn] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0)
    const [form, setForm] = useState({
        email: '',
        type: 'otp'
    })
    const [alert, setAlert] = useState<IAlert>({
        name: '',
        type: 'success',
        show: false,
        message: ''
    });

    useEffect(() => {
        setHeadIn(header)
    }, [header])

    const handleTrigger = async () => {

        let response: IAPIResponse = apiresponse

        if (resource === 'career') {
            response = await deleteCareer(resourceId);
        } else if (resource === 'field') {
            response = await deleteField(resourceId);
        } else if (resource === 'topic') {
            response = await deleteTopic(resourceId);
        }

        return response

    }

    const handleSubmit = async (e: any) => {

        if (e) { e.preventDefault(); }

        setLoading(true);
        const response = await handleTrigger()

        if (!response.error) {
            setStep(1);
            setLoading(false)
            storage.keepLegacy('email', form.email)
        }

        if (response.error) {

            setLoading(false)

            if (response.errors.length > 0) {
                setAlert({ ...alert, type: 'error', show: true, name: '', message: response.errors.join(',') });
            } else {
                setAlert({ ...alert, type: 'error', show: true, name: '', message: response.message });
            }

        }

        setTimeout(() => {
            setAlert({ ...alert, show: false, name: '' });
        }, 2000)

    }

    return (
        <>
            <Modal
                show={show}
                header={headIn}
                flattened={flattened}
                title={title}
                closeModal={closeModal}
                size={size}
                hideOnClose={false}
                className={className}
            >
                <div className="mt-[1.5rem] space-y-[1.5rem]">

                    <Alert className="" type={alert.type} show={alert.show} message={alert.message} />

                    {
                        step === 0 &&
                        <>

                            <div className="text-center font-mona text-[15px] pag-900 mx-auto my-0 max-w-[80%] mb-[1rem]">
                                Deleting a resource is not a reversible action. Are you sure you want to delete this resource from the platform?
                            </div>

                            <div className="flex items-center justify-center gap-x-[1.5rem] py-[1rem]">
                                <Button
                                    type="ghost"
                                    semantic="default"
                                    size="rg"
                                    loading={loading}
                                    disabled={false}
                                    block={false}
                                    className="form-button relative min-w-[100px] "
                                    text={{
                                        label: "Cancel",
                                        size: 13,
                                        weight: 'medium'
                                    }}
                                    onClick={(e) => closeModal(e)}
                                />
                                <Button
                                    type="primary"
                                    semantic="error"
                                    size="rg"
                                    loading={loading}
                                    disabled={false}
                                    block={false}
                                    className="form-button relative min-w-[100px] "
                                    text={{
                                        label: "Delete",
                                        size: 13,
                                        weight: 'medium'
                                    }}
                                    onClick={(e) => handleSubmit(e)}
                                />
                            </div>
                        </>
                    }

                    {
                        step === 1 &&
                        <>
                            <div className="w-full h-full text-center space-y-[1.5rem] pb-[1.5rem]">
                                <div className="inline-flex min-w-[100px] min-h-[100px] bg-pagr-100 justify-center items-center rounded-full mx-auto my-0">
                                    <Icon name="check" type="polio" className="pagr-800" size={40} />
                                </div>

                                <div className="w-full text-center mt-[1rem]">
                                    <h2 className="font-uncut-bold text-[25px] pas-950">Successful!</h2>

                                    <p className="font-mona-light text-[14px] pas-950 text-center max-w-[70%] mx-auto">
                                        Resource successfully removed from the system
                                    </p>
                                </div>

                                <Button
                                    type="primary"
                                    size="md"
                                    loading={loading}
                                    disabled={false}
                                    block={false}
                                    className="form-button min-w-[150px]"
                                    text={{
                                        label: "Continue",
                                        size: 13,
                                        weight: 'medium'
                                    }}
                                    icon={{
                                        enable: true,
                                        child: <></>
                                    }}
                                    onClick={(e) => {
                                        closeModal(e);

                                        setTimeout(() => {
                                            setStep(0)
                                        }, 500)
                                    }}
                                />

                            </div>
                        </>
                    }


                </div>

            </Modal>
        </>
    )
};

export default DeleteModal;
