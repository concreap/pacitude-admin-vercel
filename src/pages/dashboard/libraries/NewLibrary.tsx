import React, { useEffect, useState, useContext } from "react"
import useSidebar from "../../../hooks/useSidebar";
import CardUI from "../../../components/partials/ui/CardUI";
import FormField from "../../../components/partials/inputs/FormField";
import ImageUI from "../../../components/app/ImageUI";
import TextInput from "../../../components/partials/inputs/TextInput";
import TextAreaInput from "../../../components/partials/inputs/TextAreaInput";
import Button from "../../../components/partials/buttons/Button";
import useUser from "../../../hooks/app/useUser";
import useLibrary from "../../../hooks/app/useLibrary";
import useToast from "../../../hooks/useToast";
import useGoTo from "../../../hooks/useGoTo";

const NewLibraryPage = ({ }) => {

    useSidebar({ type: 'sidebar', init: false })
    const { user } = useUser()
    const { toast, setToast } = useToast()
    const { goTo } = useGoTo()
    const { LibraryStatus, createLibrary } = useLibrary()

    const [success, setSuccess] = useState<boolean>(false)
    const [file, setFile] = useState({
        id: '',
        name: '',
        url: ''
    })
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: LibraryStatus.PUBLISHED as string
    })

    useEffect(() => {

    }, [])

    const handleCreate = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!file.name) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'Upload library banner',
                error: 'all', position: 'top-right'
            })
        } else if (!form.title) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'provide library title',
                error: 'all', position: 'top-right'
            })
        } else if (!form.description) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'library description is required',
                error: 'all', position: 'top-right'
            })
        } else {

            const response = await createLibrary({
                id: user._id,
                title: form.title,
                description: form.description,
                status: form.status,
                banner: file.name ? file.name : undefined
            })

            if (!response.error) {
                setToast({
                    ...toast,
                    show: true,
                    type: 'success',
                    title: 'Successful',
                    message: response.message,
                    error: 'all',
                    position: 'top-right'
                })
                setSuccess(true)
                setTimeout(() => {
                    setToast({ ...toast, show: false });
                    goTo(`/dashboard/libraries/add-module/${response.data._id}`)
                }, 1800)
            }

            else {
                let message = response.message;
                if (response.errors.length > 0) {
                    message = response.errors.join(',')
                }

                setToast({
                    ...toast,
                    show: true,
                    type: 'error',
                    title: 'Error',
                    message: message,
                    error: 'all',
                    position: 'top-right'
                })
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 1800)
            }

        }

    }

    return (
        <>
            <section className="space-y-[2.5rem]">
                <CardUI padding={{ y: 4, x: 2 }} className={`${success ? 'disabled-light': ''}`}>
                    <form className="min-h-[150px] w-[40%] mx-auto space-y-[1.2rem]" onSubmit={(e) => { e.preventDefault() }}>

                        <FormField
                            className=""
                        >
                            <ImageUI
                                title={'Select Library Banner'}
                                url={file.url}
                                onChange={(upload) => {
                                    if (!upload.error) {
                                        setFile(upload.data);
                                    }
                                }}
                            />
                        </FormField>

                        <FormField>
                            <TextInput
                                type="text"
                                size="sm"
                                showFocus={true}
                                autoComplete={false}
                                placeholder="Ex. The Models of Business"
                                defaultValue={''}
                                label={{
                                    title: 'Library Title',
                                    required: false,
                                    fontSize: 13
                                }}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </FormField>

                        <FormField>
                            <TextAreaInput
                                size="sm"
                                showFocus={true}
                                autoComplete={false}
                                placeholder="Type here"
                                defaultValue={''}
                                isError={false}
                                label={{
                                    required: false,
                                    fontSize: 13,
                                    title: "Describe This Library",
                                    weight: 'regular'
                                }}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </FormField>

                        <div>
                            <Button
                                type="primary"
                                semantic="normal"
                                size="rg"
                                className="form-button ml-auto"
                                block={true}
                                text={{
                                    label: "Create Library",
                                    size: 13,
                                }}
                                loading={false}
                                onClick={async (e) => handleCreate(e)}
                            />
                        </div>

                    </form>
                </CardUI>
            </section>
        </>
    )
};

export default NewLibraryPage;
