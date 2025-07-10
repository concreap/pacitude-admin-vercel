import React, { useEffect, useState, useContext, useRef } from "react"
import CardUI from "../../../../components/partials/ui/CardUI";
import FormField from "../../../../components/partials/inputs/FormField";
import TextInput from "../../../../components/partials/inputs/TextInput";
import TinyMCE from "../../../../components/app/editor/TinyMCE";
import IconButton from "../../../../components/partials/buttons/IconButton";
import useGoBack from "../../../../hooks/useGoBack";
import Button from "../../../../components/partials/buttons/Button";
import useUser from "../../../../hooks/app/useUser";
import Icon from "../../../../components/partials/icons/Icon";
import useToast from "../../../../hooks/useToast";

const InviteTalent = ({ }) => {

    const editorRef = useRef<any>(null);

    const { goBack } = useGoBack()
    const { loader: loading, inviteTalent } = useUser()
    const { toast, setToast } = useToast()

    const [form, setForm] = useState({
        title: '',
        email: '',
        name: ''
    })

    useEffect(() => {

    }, [])

    const handleSubmit = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!form.title) {
            setToast({ ...toast, show: true, type: 'error', message: 'title is required' })
        } else if (!editorRef.current.content) {
            setToast({ ...toast, show: true, type: 'error', message: 'message content is required' })
        } else if (!form.email) {
            setToast({ ...toast, show: true, type: 'error', message: 'talent email is required' })
        }  else if (!form.name) {
            setToast({ ...toast, show: true, type: 'error', message: 'talent email is required' })
        } else {

            const split = form.name.split(' ')

            const response = await inviteTalent({
                content: editorRef.current.content,
                title: form.title,
                email: form.email,
                firstName: split[0],
                lastName: split[1] ? split[1] : 'Talent',
                callbackUrl: `${import.meta.env.VITE_TALENT_APP_URL || ''}/invite/accept`
            });

            if (!response.error) {

                setToast({
                    ...toast,
                    show: true,
                    type: 'success',
                    message: 'Talent invited successfully'
                })

                setForm({ title: '', email: '', name: '' })
                editorRef.current.clear();
            }

            if (response.error) {

                setToast({
                    ...toast,
                    show: true,
                    type: 'error',
                    message: response.errors.join(',')
                })
            }

        }

        setTimeout(() => {
            setToast({
                ...toast,
                show: false,
            })
        }, 1800)

    }

    return (
        <>
            <CardUI>
                <form onClick={(e) => { }} className="w-[50%] mx-auto space-y-[1.3rem]">

                    <FormField className="">
                        <TextInput
                            type="text"
                            size="sm"
                            showFocus={true}
                            autoComplete={false}
                            placeholder="Ex. Partner with Pacitude"
                            defaultValue={''}
                            isError={false}
                            clear={loading ? false : true}
                            label={{
                                required: true,
                                fontSize: 13,
                                title: "Enter Invite Title"
                            }}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </FormField>

                    <FormField className="flex items-center gap-x-[1rem]">
                        <div className="w-1/2">
                            <TextInput
                                type="text"
                                size="sm"
                                showFocus={true}
                                autoComplete={false}
                                placeholder="Ex. Abidemi Jones"
                                defaultValue={''}
                                isError={false}
                                clear={loading ? false : true}
                                label={{
                                    required: true,
                                    fontSize: 13,
                                    title: "Enter Full Name"
                                }}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                        <div className="w-1/2">
                            <TextInput
                                type="email"
                                size="sm"
                                showFocus={true}
                                autoComplete={false}
                                placeholder="Ex. talent@example.com"
                                defaultValue={''}
                                isError={false}
                                clear={loading ? false : true}
                                label={{
                                    required: true,
                                    fontSize: 13,
                                    title: "Enter Email Address"
                                }}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </FormField>

                    <FormField className="pt-[1rem]">
                        <TinyMCE ref={editorRef} height={400} />
                    </FormField>

                    <FormField className="flex items-center py-[1rem]">
                        <IconButton
                            size="min-w-[1.8rem] min-h-[1.8rem]"
                            className="bg-pab-50 bgh-pab-100"
                            icon={{
                                type: 'polio',
                                name: 'arrow-left',
                                size: 16,
                                className: 'pab-800'
                            }}
                            label={{
                                text: 'Cancel',
                                weight: 'medium'
                            }}
                            onClick={(e) => {
                                goBack()
                            }}
                        />
                        <Button
                            type="primary"
                            semantic="normal"
                            size="rg"
                            loading={loading}
                            disabled={false}
                            block={false}
                            className="form-button min-w-[150px] ml-auto"
                            icon={{
                                enable: true,
                                child: <Icon name="arrow-right" type="polio" size={16} />
                            }}
                            text={{
                                label: "Send Invite",
                                size: 13,
                                weight: 'medium'
                            }}
                            onClick={(e) => handleSubmit(e)}
                        />
                    </FormField>

                </form>
            </CardUI>
        </>
    )
};

export default InviteTalent;
