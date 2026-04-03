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

const AddLessonPage = ({ }) => {

    const { id } = useParams()

    useSidebar({ type: 'sidebar', init: false })
    const { goTo } = useGoTo()
    const { toast, setToast } = useToast()
    const {
        LibraryStatus, module, loading, loader,
        createLesson, getModule
    } = useLibrary()

    const [file, setFile] = useState({
        id: '',
        name: '',
        url: ''
    })
    const [lessons, setLessons] = useState<Array<{
        title: string,
        banner: string,
        bannerUrl?: string,
        description: string,
        status: string,
        order: number,
        url: string,
        code: string,
    }>>([])

    useEffect(() => {

        if (id) {
            getModule(id)
        }

    }, [id])

    useEffect(() => {
        setLessons(prev => {
            if (prev.length > 0) { return prev }
            return [{
                title: 'New Lesson',
                description: '',
                status: LibraryStatus.PUBLISHED,
                order: 0,
                banner: '',
                url: '',
                code: helper.random(6, true)
            }]
        })
    }, [module])

    const addNewLesson = () => {

        setLessons(prev => {
            const lastOrder = prev.length > 0 ? prev[prev.length - 1].order : -1
            const nextOrder = lastOrder + 1
            return [
                ...prev,
                {
                    title: 'New Lesson ' + (nextOrder + 1),
                    description: '',
                    status: LibraryStatus.PUBLISHED,
                    order: nextOrder,
                    banner: '',
                    url: '',
                    code: helper.random(6, true)
                }
            ]
        })

    }

    const removeLesson = (code: string) => {
        if (lessons.length === 1) {

            setToast({
                ...toast,
                show: true,
                type: 'error',
                title: 'Error',
                message: 'You cannot remove the last lesson',
                error: 'all',
                position: 'top-right'
            })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 1800)

        } else {
            setLessons(prev => {
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
        setLessons(prev =>
            prev.map(mod => {
                if (mod.code !== code) { return mod }
                const nextValue = field === 'order' ? Number(value) : value
                return { ...mod, [field]: nextValue }
            })
        )
    }

    const validate = (data: Array<typeof lessons[0]>) => {

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
                } else if (!data[i].url) {
                    result.error = true;
                    result.message = `${data[i].title} url is required`
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

    const handleAddLesson = async (e: any) => {

        if (e) { e.preventDefault() }

        const check = validate(lessons)

        if (check.error) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: check.message,
                error: 'all', position: 'top-right'
            })
        } else {

            const response = await createLesson({
                id: module._id,
                lessons: lessons
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
                if(module.library && module.library._id){
                    goTo(`/dashboard/libraries/${module.library._id}`)
                } else {
                    goTo(`/dashboard/libraries`)
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
                    !loading && helper.isEmpty(module, 'object') &&
                    <EmptyState className="min-h-[50vh]" noBound={true} >
                        <span className="font-mona text-[14px] pas-950">Library details not found!</span>
                    </EmptyState>

                }

                {
                    !loading && !helper.isEmpty(module, 'object') &&
                    <>

                        <div className="w-full gap-x-[2rem] mb-[1.5rem] flex items-center">
                            <h2 className="font-mona-medium text-[15px] pag-800">Library: {module?.library?.title || '---'}</h2>
                            <h2 className="font-mona text-[15px] pag-800">Module: {module?.title || '---'}</h2>
                        </div>

                        <CardUI padding={{ y: 4, x: 2 }}>
                            <form className="min-h-[150px] w-[45%] mx-auto " onSubmit={(e) => { e.preventDefault() }}>

                                {
                                    lessons.length > 0 &&
                                    lessons.map((lesson, index) =>
                                        <Fragment key={lesson.code}>
                                            <div className={`w-full flex items-start mb-[1.2rem]`}>
                                                <AccordionUI
                                                    opened={index === 0}
                                                    className="w-[93%]"
                                                    control={<h3 className="font-mona-medium text-[14px] pag-800"> {lesson.title} </h3>}
                                                >
                                                    <div className="space-y-[0.8rem]">

                                                        <FormField
                                                            className=""
                                                        >
                                                            <ImageUI
                                                                title={'Lesson Banner'}
                                                                titleFontSize={13}
                                                                url={lesson.bannerUrl || ''}
                                                                onChange={(upload) => {
                                                                    if (!upload.error) {
                                                                        updateFields(lesson.code, 'banner', upload.data.name)
                                                                        updateFields(lesson.code, 'bannerUrl', upload.data.url)
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
                                                                defaultValue={''}
                                                                label={{
                                                                    title: 'Lesson Title',
                                                                    required: false,
                                                                    fontSize: 13
                                                                }}
                                                                onChange={(e) => {
                                                                    updateFields(lesson.code, 'title', e.target.value)
                                                                }}
                                                            />
                                                        </FormField>

                                                        <FormField>
                                                            <TextInput
                                                                type="text"
                                                                size="sm"
                                                                showFocus={true}
                                                                autoComplete={false}
                                                                placeholder="https://loom.com/watch"
                                                                defaultValue={''}
                                                                label={{
                                                                    title: 'Lesson URL ( Loom or Google )',
                                                                    required: false,
                                                                    fontSize: 13
                                                                }}
                                                                onChange={(e) => {
                                                                    updateFields(lesson.code, 'url', e.target.value)
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
                                                                    title: "Description",
                                                                    weight: 'regular'
                                                                }}
                                                                onChange={(e) => {
                                                                    updateFields(lesson.code, 'description', e.target.value)
                                                                }}
                                                            />
                                                        </FormField>

                                                    </div>
                                                </AccordionUI>
                                                {
                                                    index > 0 &&
                                                    <Link to="" onClick={(e) => { e.preventDefault(); removeLesson(lesson.code) }} className="ml-auto">
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
                                            text: 'Add Lesson',
                                            className: 'pacb-600'
                                        }}
                                        icon={{
                                            type: 'feather',
                                            name: 'plus',
                                            size: 14,
                                        }}
                                        onClick={(e) => addNewLesson()}
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
                                            label: `Add ${lessons.length > 1 ? 'Lessons' : 'Lesson'}`,
                                            size: 13,
                                        }}
                                        loading={loader}
                                        onClick={async (e) => handleAddLesson(e)}
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

export default AddLessonPage;
