import React, { useEffect, useState, useContext, useRef } from "react"
import useSidebar from "../../../../hooks/useSidebar";
import CardUI from "../../../../components/partials/ui/CardUI";
import FormField from "../../../../components/partials/inputs/FormField";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import Button from "../../../../components/partials/buttons/Button";
import useUser from "../../../../hooks/app/useUser";
import useLibrary from "../../../../hooks/app/useLibrary";
import useToast from "../../../../hooks/useToast";
import useGoTo from "../../../../hooks/useGoTo";
import Filter from "../../../../components/partials/drops/Filter";
import User from "../../../../models/User.model";
import NumberInput from "../../../../components/partials/inputs/NumberInput";
import useCredit from "../../../../hooks/app/useCredit";

const GrantCreditPage = ({ }) => {

    const bizRef = useRef<any>(null)

    useSidebar({ type: 'sidebar', init: false })
    const { getUsers, users } = useUser()
    const { toast, setToast } = useToast()
    const { goTo } = useGoTo()
    const { grantCredit, loader } = useCredit()

    const [success, setSuccess] = useState<boolean>(false)
    const [form, setForm] = useState({
        id: '',
        months: 0,
        note: ''
    })

    useEffect(() => {
        getBusinesses()
    }, [])

    const getBusinesses = () => {
        getUsers({ limit: 9999, page: 1, type: 'business', order: 'asc' }, true)
    }

    const handleGrant = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!form.id) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'Select a business',
                error: 'all', position: 'top-right'
            })
        } else if (!form.months || form.months === 0) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'Duration is required',
                error: 'all', position: 'top-right'
            })
        } else {

            const response = await grantCredit({
                id: form.id,
                months: form.months,
                note: form.note
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
                    goTo(`/dashboard/payments/credits`)
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
                <CardUI padding={{ y: 4, x: 2 }} className={`${success ? 'disabled-light' : ''}`}>
                    <form className="min-h-[150px] w-[40%] mx-auto space-y-[1.2rem]" onSubmit={(e) => { e.preventDefault() }}>

                        <FormField
                            label={{
                                title: 'Select business',
                                required: false,
                                fontSize: 13
                            }}
                        >
                            <Filter
                                ref={bizRef}
                                size='sm'
                                className='la-filter'
                                placeholder="Select"
                                position="bottom"
                                defaultValue={''}
                                menu={{
                                    style: {},
                                    search: true,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={
                                    users.data.map((u: User) => ({
                                        label: u?.business?.name || u.businessName,
                                        value: u?.business?._id || u._id
                                    }))
                                }
                                noFilter={false}
                                onChange={async (data) => {
                                    setForm({ ...form, id: data.value })
                                }}
                            />
                        </FormField>

                        <FormField>
                            <NumberInput
                                size="sm"
                                showFocus={true}
                                autoComplete={false}
                                placeholder="Ex. 3"
                                defaultValue={''}
                                min={1}
                                label={{
                                    title: 'How long? (month)',
                                    required: false,
                                    fontSize: 13
                                }}
                                onChange={(e) => setForm({ ...form, months: parseInt(e.target.value) })}
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
                                    title: "Add credit notes",
                                    weight: 'regular'
                                }}
                                onChange={(e) => setForm({ ...form, note: e.target.value })}
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
                                    label: "Grant Credits",
                                    size: 13,
                                }}
                                loading={loader}
                                onClick={async (e) => handleGrant(e)}
                            />
                        </div>

                    </form>
                </CardUI>
            </section>
        </>
    )
};

export default GrantCreditPage;
