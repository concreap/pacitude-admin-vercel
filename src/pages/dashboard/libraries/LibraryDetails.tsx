import React, { useEffect, useState, useContext, Fragment } from "react"
import useSidebar from "../../../hooks/useSidebar";
import CardUI from "../../../components/partials/ui/CardUI";
import Button from "../../../components/partials/buttons/Button";
import useLibrary from "../../../hooks/app/useLibrary";
import useToast from "../../../hooks/useToast";
import AccordionUI from "../../../components/partials/ui/AccordionUI";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import helper from "../../../utils/helper.util";
import LinkButton from "../../../components/partials/buttons/LinkButton";
import IconButton from "../../../components/partials/buttons/IconButton";
import useGoTo from "../../../hooks/useGoTo";
import Divider from "../../../components/partials/Divider";
import Badge from "../../../components/partials/badges/Badge";
import { Module } from "../../../models/Module.model";
import { Lesson } from "../../../models/Lesson.model";
import { UIEnum } from "../../../utils/enums.util";
import Talent from "../../../models/Talent.model";
import UserAvatar from "../../../components/partials/ui/UserAvatar";
import useUser from "../../../hooks/app/useUser";

const LibraryDetailsPage = ({ }) => {

    const { id } = useParams()

    useSidebar({ type: 'sidebar', init: false })
    const { getFullname } = useUser()
    const { goTo } = useGoTo()
    const { toast, setToast } = useToast()
    const {
        LibraryStatus, library, loading, lessons, lesson,
        getLibrary, getStatusType, getLessons, selectLesson
    } = useLibrary()

    const [modules, setModules] = useState<Array<Module>>([])
    const [moudle, setMoudle] = useState<Module | null>(null)
    const [UI, setUI] = useState({
        view: UIEnum.VIEW_MODULE as string,
        id: '' as string
    })

    useEffect(() => {

        if (id) {
            getLibrary(id)
        }

    }, [id])

    useEffect(() => {

        if (!helper.isEmpty(library, 'object') && library.modules.length > 0) {
            const moudle: Module = library.modules[0];
            setModules(library.modules)
            setMoudle(moudle)
            if (moudle.lessons.length > 0) {
                getLessons({ limit: 15, page: 1, order: 'desc', id: moudle._id })
            }
        }

    }, [library])

    const viewLesson = (e: any, id: string) => {
        if (e) { e.preventDefault() }
        setUI({ ...UI, view: UIEnum.VIEW_LESSON, id: id })
        selectLesson(id)
    }

    const handleGetLessons = (e: any, code: string) => {
        if (e) { e.preventDefault() }
        const moud = modules.find((m) => m.code === code);

        if (moud) {
            setMoudle(moud);
            getLessons({ limit: 15, page: 1, order: 'desc', id: moud._id })
        } else {

            setToast({
                ...toast,
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Select a module!',
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

                        <CardUI>
                            <div className="grid grid-cols-[35%_60%] gap-x-[5%]">

                                <div>
                                    <div className="min-h-[200px] rounded-[14px] full-bg" style={{ backgroundImage: `url("${library.banner ? library.banner : '../../../images/assets/bg@banner01.png'}")` }}></div>
                                </div>
                                <div>

                                    <div className="flex items-center">

                                        <div className="space-y-[0.5rem]">
                                            <h3 className="font-mona-medium pas-950 text-[18px]">{library.title}</h3>
                                            <div className="flex items-center gap-x-[1rem]">
                                                <h3 className="font-mona-light pag-600 text-[13px]">Code: {library.code}</h3>
                                            </div>
                                        </div>

                                        {/* <div className="flex items-center ml-auto">
                                            <IconButton
                                                size="min-w-[2.3rem] min-h-[2.3rem]"
                                                className="bg-pacb-100 bgh-pacb-200 pacb-600"
                                                container={{ className: 'ml-auto' }}
                                                icon={{
                                                    type: 'feather',
                                                    name: 'edit-2',
                                                    size: 14,
                                                }}
                                                onClick={(e) => {
                                                    goTo(`/dashboard/libraries/edit/${library._id}?view=library`)
                                                }}
                                            />
                                        </div> */}

                                    </div>

                                    <Divider />

                                    <div className="flex items-center gap-x-[1rem]">
                                        <h4 className="">
                                            <span className="font-mona-light pag-500 text-[15px]">Modules - </span>
                                            <span className="font-mona pag-800 text-[15px]">{library.modules.length || '0'}</span>
                                        </h4>
                                        <span>&nbsp; | &nbsp;</span>
                                        <h4 className="">
                                            <span className="font-mona-light pag-500 text-[15px]">Lessons - </span>
                                            <span className="font-mona pag-800 text-[15px]">{library.lessons.length || '0'}</span>
                                        </h4>
                                    </div>

                                    <Divider />

                                    <div className="flex items-center gap-x-[0.5rem]">
                                        <span className="font-mona-light pag-500 text-[15px]">Status - </span>
                                        <Badge
                                            type={getStatusType(library.status)}
                                            size="sm"
                                            display="badge"
                                            label={helper.capitalize(library.status)}
                                            padding={{ y: 2, x: 12 }}
                                            font={{
                                                weight: 'regular',
                                                size: 12
                                            }}
                                            upper={false}
                                            close={false}
                                        />
                                        {/* <IconButton
                                            size="min-w-[1.4rem] min-h-[1.4rem]"
                                            className="bg-pacb-200 pacb-600"
                                            container={{ className: 'ml-auto' }}
                                            label={{
                                                text: 'Add Module',
                                                className: 'pacb-600'
                                            }}
                                            icon={{
                                                type: 'feather',
                                                name: 'plus',
                                                size: 14,
                                            }}
                                            onClick={(e) => { goTo(`/dashboard/libraries/add-module/${library._id}`) }}
                                        /> */}
                                        <IconButton
                                            size="min-w-[2.3rem] min-h-[2.3rem]"
                                            className="bg-pacb-100 bgh-pacb-200 pacb-600"
                                            container={{ className: 'ml-auto' }}
                                            icon={{
                                                type: 'feather',
                                                name: 'edit-2',
                                                size: 14,
                                            }}
                                            onClick={(e) => {
                                                goTo(`/dashboard/libraries/edit/${library._id}?view=library`)
                                            }}
                                        />
                                    </div>

                                </div>

                            </div>
                        </CardUI>

                        {
                            UI.view === UIEnum.VIEW_MODULE &&
                            <CardUI>
                                <div className="grid grid-cols-[40%_55%] gap-x-[5%]">

                                    {/* MODULE LIST */}
                                    <div>
                                        {
                                            modules.length === 0 &&
                                            <EmptyState className="min-h-[50vh] space-y-[1rem]" noBound={true} >
                                                <span className="font-mona text-[14px] pas-950">Modules will appear here!</span>
                                                <Button
                                                    type={"secondary"}
                                                    size="xsm"
                                                    className="form-button"
                                                    loading={false}
                                                    text={{
                                                        label: "Add Module",
                                                        size: 13,
                                                    }}
                                                    onClick={(e) => { goTo(`/dashboard/libraries/add-module/${library._id}`) }}
                                                />
                                            </EmptyState>
                                        }
                                        {
                                            modules.length > 0 &&
                                            <>
                                                <div className="flex items-center mb-[1rem] w-[89%]">
                                                    <h2 className="font-mona-medium text-[14px] pag-800">Library Modules ({modules.length})</h2>
                                                    <IconButton
                                                        size="min-w-[1.4rem] min-h-[1.4rem]"
                                                        className="bg-pacb-200 pacb-600"
                                                        container={{ className: 'ml-auto' }}

                                                        icon={{
                                                            type: 'feather',
                                                            name: 'plus',
                                                            size: 14,
                                                        }}
                                                        onClick={(e) => { goTo(`/dashboard/libraries/add-module/${library._id}`) }}
                                                    />
                                                </div>

                                                {
                                                    modules.map((mod, index) =>
                                                        <Fragment key={mod.code}>

                                                            <AccordionUI
                                                                opened={false}
                                                                className="w-[93%] mb-[0.5rem] relative group"
                                                                control={
                                                                    <Link to="" onClick={(e) => handleGetLessons(e, mod.code)} className="font-mona text-[14px] pag-800">{index + 1}. {mod.title} </Link>
                                                                }
                                                                actions={
                                                                    <div className={`flex items-center gap-x-[0.5rem] ml-auto`}>
                                                                        <IconButton
                                                                            size="min-w-[1.5rem] min-h-[1.5rem]"
                                                                            className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                                                                            container={{ className: 'opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-[-2rem]' }}
                                                                            icon={{
                                                                                type: 'feather',
                                                                                name: 'edit-2',
                                                                                size: 12,
                                                                            }}
                                                                            onClick={(e) => {
                                                                                goTo(`/dashboard/libraries/edit/${mod._id}?view=module`)
                                                                            }}
                                                                        />

                                                                        <IconButton
                                                                            size="min-w-[1.5rem] min-h-[1.5rem]"
                                                                            className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                                                                            icon={{
                                                                                type: 'feather',
                                                                                name: 'chevron-right',
                                                                                size: 14,
                                                                            }}
                                                                            onClick={(e) => handleGetLessons(e, mod.code)}
                                                                        />

                                                                        {/* <IconButton
                                                                            size="min-w-[1.5rem] min-h-[1.5rem]"
                                                                            className="bg-transparent bgh-par-50 par-700 parh-700 absolute right-[-2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                                            icon={{
                                                                                type: 'feather',
                                                                                name: 'trash-2',
                                                                                size: 12,
                                                                            }}
                                                                            onClick={(e) => { }}
                                                                        /> */}

                                                                    </div>
                                                                }
                                                            >
                                                                <p className="font-mona pag-600 text-[14px]">{mod.description}</p>
                                                                <Divider />
                                                                <div className="flex items-center gap-x-[0.5rem] pb-[0.67rem]">
                                                                    <Badge
                                                                        type={getStatusType(mod.status)}
                                                                        size="sm"
                                                                        display="badge"
                                                                        label={helper.capitalize(mod.status)}
                                                                        padding={{ y: 2, x: 12 }}
                                                                        font={{
                                                                            weight: 'regular',
                                                                            size: 12
                                                                        }}
                                                                        upper={false}
                                                                        close={false}
                                                                    />

                                                                    <LinkButton
                                                                        className="ml-auto"
                                                                        text={{
                                                                            label: `View Lessons: ${mod.lessons.length || '0'}`,
                                                                            className: 'text-[14px] pacb-600 underline',
                                                                            weight: 'regular'
                                                                        }}
                                                                        disabled={false}
                                                                        loading={false}
                                                                        icon={{ enable: false }}
                                                                        url=""
                                                                        onClick={(e) => handleGetLessons(e, mod.code)}
                                                                    />
                                                                </div>
                                                            </AccordionUI>

                                                        </Fragment>
                                                    )
                                                }
                                            </>
                                        }
                                    </div>

                                    {/* LESSON LIST - BASED ON MODULE */}
                                    <div>

                                        <div className="bg-pacb-25 border-[1px] bdr-pacb-50 min-h-[100px] rounded-[10px] px-[1.2rem] py-[1.2rem]">

                                            {
                                                moudle &&
                                                <div className="space-y-[1rem]">
                                                    <div className="flex items-center">

                                                        <div className="space-y-[0.3rem]">
                                                            <h2 className="font-mona-medium pacb-700 text-[16px]">{moudle.title} - Lessons</h2>
                                                            <p className="font-mona pag-600 text-[14px]">{moudle.description}</p>
                                                        </div>

                                                        <IconButton
                                                            size="min-w-[1.8rem] min-h-[1.8rem]"
                                                            className="bg-pacb-200 pacb-600"
                                                            container={{ className: 'ml-auto' }}

                                                            icon={{
                                                                type: 'feather',
                                                                name: 'plus',
                                                                size: 14,
                                                            }}
                                                            onClick={(e) => { goTo(`/dashboard/libraries/add-lesson/${moudle._id}`) }}
                                                        />

                                                    </div>

                                                    <Divider padding={{ enable: true, top: 'pt-[0.25rem]', bottom: 'pb-[0.25rem]' }} />

                                                    {
                                                        lessons.loading &&
                                                        <EmptyState className="h-[30vh] space-y-[1rem]" bgColor="bg-pacb-25" noBound={true} >
                                                            <span className="loader lg primary"></span>
                                                            <span className="font-mona text-[14px] pacb-800">Getting lessons...</span>
                                                        </EmptyState>
                                                    }
                                                    {
                                                        !lessons.loading && moudle.lessons.length === 0 &&
                                                        <>
                                                            <EmptyState className="h-[30vh] space-y-[1rem]" bgColor="bg-pacb-25" noBound={true} >
                                                                <span className="font-mona text-[14px] pas-950">Lessons will appear here!</span>
                                                                <Button
                                                                    type={"secondary"}
                                                                    size="xsm"
                                                                    className="form-button"
                                                                    loading={false}
                                                                    text={{
                                                                        label: "Add Lesson",
                                                                        size: 13,
                                                                    }}
                                                                    onClick={(e) => { goTo(`/dashboard/libraries/add-lesson/${moudle._id}`) }}
                                                                />
                                                            </EmptyState>
                                                        </>
                                                    }
                                                    {
                                                        !lessons.loading && moudle.lessons.length > 0 &&
                                                        <>
                                                            {
                                                                lessons.data.map((lesson: Lesson, index) =>
                                                                    <Fragment key={lesson.code}>
                                                                        <div className="w-full flex items-center">

                                                                            <div className="flex items-center grow gap-x-[1rem]">
                                                                                <div className="min-h-[45px] min-w-[14%] rounded-[8px] full-bg bg-center" style={{ backgroundImage: `url("${lesson.banner ? lesson.banner : '../../../images/assets/bg@banner01.png'}")` }}></div>
                                                                                <div>
                                                                                    <h2 className={`font-mona pag-900 text-[14px]`}>{lesson.title}</h2>
                                                                                    <Link to="" className="font-mona-light block text-[14px] pab-500 truncate w-[80%]">{lesson.url}</Link>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-center gap-x-[0.5rem] ml-auto">

                                                                                <IconButton
                                                                                    size="min-w-[1.4rem] min-h-[1.4rem]"
                                                                                    className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                                                                                    icon={{
                                                                                        type: 'feather',
                                                                                        name: 'eye',
                                                                                        size: 12,
                                                                                    }}
                                                                                    onClick={(e) => viewLesson(e, lesson._id)}
                                                                                />

                                                                                {/* <IconButton
                                                                                    size="min-w-[1.4rem] min-h-[1.4rem]"
                                                                                    className="bg-par-50 bgh-par-100 par-700 parh-700"
                                                                                    icon={{
                                                                                        type: 'feather',
                                                                                        name: 'trash-2',
                                                                                        size: 12,
                                                                                    }}
                                                                                    onClick={(e) => { }}
                                                                                /> */}
                                                                            </div>

                                                                        </div>
                                                                        <Divider padding={{ enable: true, top: 'pt-[0.25rem]', bottom: 'pb-[0.25rem]' }} />
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </>
                                                    }
                                                </div>
                                            }

                                        </div>

                                    </div>
                                </div>
                            </CardUI>
                        }

                        {
                            UI.view === UIEnum.VIEW_LESSON &&
                            <CardUI>
                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-x-[0.8rem]">

                                        <div className="flex items-center gap-[0.4rem]">

                                            {
                                                lesson.talents.length > 0 &&
                                                <div className="flex items-center -space-x-[0.75rem] rtl:space-x-reverse">
                                                    {
                                                        lesson.talents.slice(0, 4).map((talent: Talent) =>
                                                            <Fragment key={talent._id}>
                                                                <UserAvatar
                                                                    avatar={talent?.avatar || ''}
                                                                    name={getFullname(talent || '')}
                                                                    width='min-w-[30px]'
                                                                    height='min-h-[30px]'
                                                                />
                                                            </Fragment>
                                                        )
                                                    }
                                                </div>
                                            }

                                        </div>

                                        <span className="font-mona-light pag-500 text-[14px]">
                                            {lesson.talents.length > 0 ? lesson.talents.length + ' Talents' : '0 Talents Added'}
                                        </span>
                                    </div>

                                    <h2 className="font-mona text-[15px] pas-950">{lesson?.module?.title || ''} - {lesson.title}</h2>

                                    <div className="flex items-center gap-x-[1rem]">
                                        <IconButton
                                            size="min-w-[1.8rem] min-h-[1.8rem]"
                                            className="bg-pacb-100 pacb-600"
                                            container={{ className: 'ml-auto' }}
                                            icon={{
                                                type: 'feather',
                                                name: 'edit-2',
                                                size: 14,
                                            }}
                                            onClick={(e) => {
                                                goTo(`/dashboard/libraries/edit/${lesson._id}?view=lesson`)
                                            }}
                                        />
                                        <IconButton
                                            size="min-w-[1.8rem] min-h-[1.8rem]"
                                            className="bg-par-50 par-600 parh-700"
                                            container={{ className: 'ml-auto' }}
                                            icon={{
                                                type: 'feather',
                                                name: 'x',
                                                size: 14,
                                            }}
                                            onClick={(e) => {
                                                selectLesson(lesson._id)
                                                setUI({ ...UI, view: UIEnum.VIEW_MODULE, id: '' });
                                            }}
                                        />
                                    </div>

                                </div>
                                <Divider />
                                <div className="w-full py-[1rem]">

                                    <div className="w-full max-w-3xl mx-auto">
                                        <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden">
                                            <iframe
                                                src={lesson.embedUrl}
                                                title="Video Player"
                                                className="absolute top-0 left-0 w-full h-full"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>

                                </div>
                            </CardUI>
                        }


                    </>

                }


            </section>
        </>
    )
};

export default LibraryDetailsPage;
