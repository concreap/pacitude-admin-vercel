import React, { useEffect, useState, useContext, Fragment } from "react"
import useSidebar from "../../../hooks/useSidebar";
import CardUI from "../../../components/partials/ui/CardUI";
import FormField from "../../../components/partials/inputs/FormField";
import ImageUI from "../../../components/app/ImageUI";
import TextInput from "../../../components/partials/inputs/TextInput";
import TextAreaInput from "../../../components/partials/inputs/TextAreaInput";
import Button from "../../../components/partials/buttons/Button";
import useLibrary from "../../../hooks/app/useLibrary";
import useToast from "../../../hooks/useToast";
import { Link, useParams, useSearchParams } from "react-router-dom";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import helper from "../../../utils/helper.util";
import useGoTo from "../../../hooks/useGoTo";
import { UIEnum } from "../../../utils/enums.util";
import useTopbar from "../../../hooks/useTopbar";
import { IAPIResponse } from "../../../utils/interfaces.util";
import { apiresponse } from "../../../_data/seed";

const EditLibraryPage = ({ }) => {

    let view: string = UIEnum.VIEW_LIBRARY;

    const { id } = useParams()
    const [searchParams] = useSearchParams();
    const qv = searchParams.get("view")

    if (qv && qv === 'module') {
        view = UIEnum.VIEW_MODULE
    } else if (qv && qv === 'lesson') {
        view = UIEnum.VIEW_LESSON
    }

    useSidebar({ type: 'sidebar', init: false })
    const { topbar, setTopbar } = useTopbar()
    const { goTo } = useGoTo()
    const { toast, setToast } = useToast()
    const {
        LibraryStatus, module, loading, loader, library, lesson,
        getModule, getLibrary, getLesson,
        updateLibrary, updateModule, updateLesson
    } = useLibrary()

    const [resource, setResource] = useState<string>('library')
    const [file, setFile] = useState({
        id: '',
        name: '',
        url: ''
    })

    const [payload, setPayload] = useState({
        title: '',
        description: '',
        status: '',
        url: '',
        order: undefined as number | undefined
    })

    useEffect(() => {

        if (id && view === UIEnum.VIEW_LIBRARY) {
            setTopbar({ pageTitle: 'Edit Library', showBack: true, sticky: true })
            setResource('library')
            getLibrary(id)
        } else if (id && view === UIEnum.VIEW_MODULE) {
            setTopbar({ pageTitle: 'Edit Module', showBack: true, sticky: true })
            setResource('module')
            getModule(id)
        } else if (id && view === UIEnum.VIEW_LESSON) {
            setTopbar({ pageTitle: 'Edit Lesson', showBack: true, sticky: true })
            setResource('lesson')
            getLesson(id)
        }

    }, [id])

    useEffect(() => {

    }, [])

    const handleSubmit = async (e: any) => {

        if (e) { e.preventDefault() }

        let response: IAPIResponse = apiresponse;

        if (view === UIEnum.VIEW_LIBRARY) {

            response = await updateLibrary({
                id: library._id,
                title: payload.title || undefined,
                description: payload.description || undefined,
                banner: file.name || undefined,
                status: payload.status || undefined
            })

        } else if (view === UIEnum.VIEW_MODULE) {

            response = await updateModule({
                id: module._id,
                title: payload.title || undefined,
                description: payload.description || undefined,
                banner: file.name || undefined,
                status: payload.status || undefined,
                order: payload.order || undefined
            })

        } else if (view === UIEnum.VIEW_LESSON) {

            response = await updateLesson({
                id: lesson._id,
                title: payload.title || undefined,
                description: payload.description || undefined,
                banner: file.name || undefined,
                status: payload.status || undefined,
                order: payload.order || undefined,
                url: payload.url || undefined,
            })

        }

        if (!response.error) {

            setToast({
                ...toast,
                show: true,
                type: 'success',
                title: 'Successful',
                message: `${helper.capitalize(resource)} updated successfully`,
                error: 'all',
                position: 'top-right'
            })

            if (library && library._id) {
                goTo(`/dashboard/libraries/${library._id}`)
            } else if (module && module.library && module.library._id) {
                goTo(`/dashboard/libraries/${module.library._id}`)
            } else if (lesson && lesson.library && lesson.library._id) {
                goTo(`/dashboard/libraries/${lesson.library._id}`)
            }

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
                        <span className="font-mona text-[16px] pas-950">Fetching {resource} data</span>
                    </EmptyState>
                }

                {
                    !loading && (!library && !module && !lesson) &&
                    <EmptyState className="min-h-[50vh]" noBound={true} >
                        <span className="font-mona text-[14px] pas-950">{helper.capitalize(resource)} details not found!</span>
                    </EmptyState>

                }

                {
                    !loading &&
                    <>

                        {/* <div className="w-full gap-x-[2rem] mb-[1.5rem] flex items-center">
                            <h2 className="font-mona-medium text-[15px] pag-800">Library: {module?.library?.title || '---'}</h2>
                            <h2 className="font-mona text-[15px] pag-800">Module: {module?.title || '---'}</h2>
                        </div> */}

                        <CardUI padding={{ y: 4, x: 2 }}>
                            <form className="min-h-[150px] w-[45%] mx-auto " onSubmit={(e) => { e.preventDefault() }}>

                                {
                                    view === UIEnum.VIEW_LIBRARY && !helper.isEmpty(library, 'object') &&
                                    <>
                                        <div className="space-y-[0.6rem]">

                                            <FormField
                                                className=""
                                            >
                                                <ImageUI
                                                    title={'Change Library Banner'}
                                                    url={library.banner || ''}
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
                                                    defaultValue={library.title || ''}
                                                    label={{
                                                        title: 'Library Title',
                                                        required: false,
                                                        fontSize: 13
                                                    }}
                                                    onChange={(e) => setPayload({ ...payload, title: e.target.value })}
                                                />
                                            </FormField>

                                            <FormField>
                                                <TextAreaInput
                                                    size="sm"
                                                    showFocus={true}
                                                    autoComplete={false}
                                                    placeholder="Type here"
                                                    defaultValue={library.description || ''}
                                                    isError={false}
                                                    label={{
                                                        required: false,
                                                        fontSize: 13,
                                                        title: "Describe This Library",
                                                        weight: 'regular'
                                                    }}
                                                    onChange={(e) => setPayload({ ...payload, description: e.target.value })}
                                                />
                                            </FormField>

                                        </div>
                                    </>
                                }

                                {
                                    view === UIEnum.VIEW_MODULE && !helper.isEmpty(module, 'object') &&
                                    <>
                                        <div className="space-y-[0.6rem]">

                                            <FormField
                                                className=""
                                            >
                                                <ImageUI
                                                    title={'Change Module Banner'}
                                                    titleFontSize={13}
                                                    url={module.banner || ''}
                                                    onChange={(upload) => {
                                                        if (!upload.error) {
                                                            setFile(upload.data)
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
                                                    defaultValue={module.title}
                                                    label={{
                                                        title: 'Module Title',
                                                        required: false,
                                                        fontSize: 13
                                                    }}
                                                    onChange={(e) => setPayload({ ...payload, title: e.target.value })}
                                                />
                                            </FormField>

                                            <FormField>
                                                <TextAreaInput
                                                    size="sm"
                                                    showFocus={true}
                                                    autoComplete={false}
                                                    placeholder="Type here"
                                                    defaultValue={module.description}
                                                    isError={false}
                                                    label={{
                                                        required: false,
                                                        fontSize: 13,
                                                        title: "Describe This Module",
                                                        weight: 'regular'
                                                    }}
                                                    onChange={(e) => setPayload({ ...payload, description: e.target.value })}
                                                />
                                            </FormField>

                                        </div>
                                    </>
                                }

                                {
                                    view === UIEnum.VIEW_LESSON && !helper.isEmpty(lesson, 'object') &&
                                    <>
                                        <div className="space-y-[0.8rem]">

                                            <FormField
                                                className=""
                                            >
                                                <ImageUI
                                                    title={'Change Lesson Banner'}
                                                    titleFontSize={13}
                                                    url={lesson?.banner || ''}
                                                    onChange={(upload) => {
                                                        if (!upload.error) {
                                                            setFile(upload.data)
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
                                                    placeholder="Type here"
                                                    defaultValue={lesson?.title || ''}
                                                    label={{
                                                        title: 'Lesson Title',
                                                        required: false,
                                                        fontSize: 13
                                                    }}
                                                    onChange={(e) => setPayload({ ...payload, title: e.target.value })}
                                                />
                                            </FormField>

                                            <FormField>
                                                <TextInput
                                                    type="text"
                                                    size="sm"
                                                    showFocus={true}
                                                    autoComplete={false}
                                                    placeholder="https://loom.com/watch"
                                                    defaultValue={lesson?.url || ''}
                                                    label={{
                                                        title: 'Lesson URL ( Loom or Google )',
                                                        required: false,
                                                        fontSize: 13
                                                    }}
                                                    onChange={(e) => setPayload({ ...payload, url: e.target.value })}
                                                />
                                            </FormField>

                                            <FormField>
                                                <TextAreaInput
                                                    size="sm"
                                                    showFocus={true}
                                                    autoComplete={false}
                                                    placeholder="Type here"
                                                    defaultValue={lesson?.description || ''}
                                                    isError={false}
                                                    label={{
                                                        required: false,
                                                        fontSize: 13,
                                                        title: "Description",
                                                        weight: 'regular'
                                                    }}
                                                    onChange={(e) => setPayload({ ...payload, description: e.target.value })}
                                                />
                                            </FormField>

                                        </div>
                                    </>
                                }


                                <div className="mt-[1.5rem]">
                                    <Button
                                        type="primary"
                                        semantic="normal"
                                        size="rg"
                                        className="form-button ml-auto"
                                        block={true}
                                        text={{
                                            label: `Save Changes`,
                                            size: 13,
                                        }}
                                        loading={loader}
                                        onClick={async (e) => handleSubmit(e)}
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

export default EditLibraryPage;
