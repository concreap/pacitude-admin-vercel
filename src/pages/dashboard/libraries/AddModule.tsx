import React, { useEffect, useState, useContext, Fragment } from "react"
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
import AccordionUI from "../../../components/partials/ui/AccordionUI";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import helper from "../../../utils/helper.util";
import LinkButton from "../../../components/partials/buttons/LinkButton";
import IconButton from "../../../components/partials/buttons/IconButton";
import Icon from "../../../components/partials/icons/Icon";
import { validate } from "uuid";
import useGoTo from "../../../hooks/useGoTo";

const AddModulePage = ({ }) => {

    const { id } = useParams()

    useSidebar({ type: 'sidebar', init: false })
    const { goTo } = useGoTo()
    const { toast, setToast } = useToast()
    const {
        LibraryStatus, library, loading, loader,
        createModule, getLibrary
    } = useLibrary()

    const [modules, setModules] = useState<Array<{
        title: string,
        description: string,
        status: string,
        order: number,
        banner?: string,
        bannerUrl?: string,
        code: string,
    }>>([])

    useEffect(() => {

        if (id) {
            getLibrary(id)
        }

    }, [id])

    useEffect(() => {
        setModules(prev => {
            if (prev.length > 0) { return prev }
            return [{
                title: 'New Module',
                description: '',
                status: LibraryStatus.PUBLISHED,
                order: 0,
                banner: '',
                code: helper.random(6, true)
            }]
        })
    }, [library])

    const addNewModule = () => {

        setModules(prev => {
            const lastOrder = prev.length > 0 ? prev[prev.length - 1].order : -1
            const nextOrder = lastOrder + 1
            return [
                ...prev,
                {
                    title: 'New Module ' + (nextOrder + 1),
                    description: '',
                    status: LibraryStatus.PUBLISHED,
                    order: nextOrder,
                    banner: '',
                    code: helper.random(6, true)
                }
            ]
        })

    }

    const removeModule = (code: string) => {
        if (modules.length === 1) {

            setToast({
                ...toast,
                show: true,
                type: 'error',
                title: 'Error',
                message: 'You cannot remove the last module',
                error: 'all',
                position: 'top-right'
            })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 1800)

        } else {
            setModules(prev => {
                if (prev.length === 0) { return prev }
                const next =
                    typeof code === 'string' && code.length > 0
                        ? prev.filter(mod => mod.code !== code)
                        : prev.slice(0, -1)

                return next.map((mod, i) => ({ ...mod, order: i }))
            })
        }
    }

    const updateFields = (
        code: string,
        field: string,
        value: any
    ) => {
        setModules(prev =>
            prev.map(mod => {
                if (mod.code !== code) { return mod }
                const nextValue = field === 'order' ? Number(value) : value
                return { ...mod, [field]: nextValue }
            })
        )
    }

    const validate = (data: Array<typeof modules[0]>) => {

        let result = {
            error: false,
            message: ''
        }

        if (!data || data.length === 0) {
            result.error = true;
            result.message = 'modules must be added'
        } else {
            for (let i = 0; i < data.length; i++) {
                if (!data[i].title) {
                    result.error = true;
                    result.message = `module ${i + 1} title is required`
                    break;
                } else if (!data[i].description) {
                    result.error = true;
                    result.message = `${data[i].title} description is required`
                    break;
                } else {
                    result.error = false;
                    result.message = ``
                    continue;
                }
            }
        }

        return result;

    }

    const handleAddModule = async (e: any) => {

        if (e) { e.preventDefault() }

        const check = validate(modules)

        if (check.error) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: check.message,
                error: 'all', position: 'top-right'
            })
        } else {

            const response = await createModule({
                id: library._id,
                modules: modules
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
                goTo('/dashboard/libraries')
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
            }

        }

        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 1800)

    }

    return (
        <>
            <section className="space-y-[2.5rem]">

                {
                    loading &&
                    <EmptyState className="min-h-[50vh]" noBound={true}>
                        <span className="loader lg primary"></span>
                        <span className="font-mona text-[16px] pas-950">Fetching library data</span>
                    </EmptyState>
                }

                {
                    !loading && helper.isEmpty(library, 'object') &&
                    <EmptyState className="min-h-[50vh]" noBound={true} >
                        <span className="font-mona text-[14px] pas-950">Library details not found!</span>
                    </EmptyState>

                }

                {
                    !loading && !helper.isEmpty(library, 'object') &&
                    <>

                        <CardUI padding={{ y: 4, x: 2 }}>
                            <form className="min-h-[150px] w-[45%] mx-auto " onSubmit={(e) => { e.preventDefault() }}>

                                {
                                    modules.length > 0 &&
                                    modules.map((mod, index) =>
                                        <Fragment key={mod.code}>
                                            <div className={`w-full flex items-start mb-[1.2rem]`}>
                                                <AccordionUI
                                                    opened={index === 0}
                                                    className="w-[93%]"
                                                    control={<h3 className="font-mona-medium text-[14px] pag-800"> {mod.title} </h3>}
                                                >
                                                    <div className="space-y-[0.6rem]">

                                                        <FormField
                                                            className=""
                                                        >
                                                            <ImageUI
                                                                title={'Module Banner'}
                                                                titleFontSize={13}
                                                                url={mod.bannerUrl || ''}
                                                                onChange={(upload) => {
                                                                    if (!upload.error) {
                                                                        updateFields(mod.code, 'banner', upload.data.name)
                                                                        updateFields(mod.code, 'bannerUrl', upload.data.url)
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
                                                                    title: 'Module Title',
                                                                    required: false,
                                                                    fontSize: 13
                                                                }}
                                                                onChange={(e) => {
                                                                    updateFields(mod.code, 'title', e.target.value)
                                                                }}
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
                                                                    title: "Describe This Module",
                                                                    weight: 'regular'
                                                                }}
                                                                onChange={(e) => {
                                                                    updateFields(mod.code, 'description', e.target.value)
                                                                }}
                                                            />
                                                        </FormField>

                                                    </div>
                                                </AccordionUI>
                                                {
                                                    index > 0 &&
                                                    <Link to="" onClick={(e) => { e.preventDefault(); removeModule(mod.code) }} className="ml-auto">
                                                        <Icon type="feather" name="trash-2" size={16} className="par-600" />
                                                    </Link>
                                                }
                                            </div>
                                        </Fragment>
                                    )
                                }

                                <div className="flex items-center mt-[0.7rem]">
                                    <IconButton
                                        size="min-w-[1.4rem] min-h-[1.4rem]"
                                        className="bg-pacb-200 pacb-600"
                                        label={{
                                            text: 'Add Module',
                                            className: 'pacb-600'
                                        }}
                                        icon={{
                                            type: 'feather',
                                            name: 'plus',
                                            size: 14,
                                        }}
                                        onClick={(e) => addNewModule()}
                                    />
                                </div>

                                <div className="mt-[1.5rem]">
                                    <Button
                                        type="primary"
                                        semantic="normal"
                                        size="rg"
                                        className="form-button ml-auto max-w-[93%]"
                                        block={true}
                                        text={{
                                            label: `Add ${modules.length > 1 ? 'Modules' : 'Module'}`,
                                            size: 13,
                                        }}
                                        loading={loader}
                                        onClick={async (e) => handleAddModule(e)}
                                    />
                                </div>

                            </form>
                        </CardUI>

                    </>

                }


            </section>
        </>
    )
};

export default AddModulePage;
