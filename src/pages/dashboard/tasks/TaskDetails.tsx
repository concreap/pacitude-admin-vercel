import { MouseEvent, useEffect, useRef, useState } from "react"
import useSidebar from "../../../hooks/useSidebar";
import EmojiPicker from 'emoji-picker-react';
import Button from "../../../components/partials/buttons/Button";
import Icon from "../../../components/partials/icons/Icon";
import CardUI from "../../../components/partials/ui/CardUI";
import Divider from "../../../components/partials/Divider";
import Badge from "../../../components/partials/badges/Badge";
import helper from "../../../utils/helper.util";
import { Link, useParams } from "react-router-dom";
import CardLoading from "../../../components/app/loaders/CardLoading";
import QuestionRubric from "../../../components/app/question/RubricBadge";
import Filter from "../../../components/partials/drops/Filter";
import useGoTo from "../../../hooks/useGoTo";
import { IAssessmentSummary } from "../../../models/Assessment.model";
import QuestionList from "../core/questions/QuestionList";
import { StatusEnum } from "../../../utils/enums.util";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import storage from "../../../utils/storage.util";
import ListBox from "../../../components/partials/ui/ListBox";
import { dribbles, pinterests, templates } from "../../../_data/seed";
import { IFileUpload } from "../../../utils/interfaces.util";
import Feedback from "./Feedback";
import TaskMCE from "../../../components/app/editor/TaskMCE";
import EmptyState from "../../../components/partials/dialogs/EmptyState";

const TaskDetailsPage = ({ }) => {

    const { id } = useParams()
    const editorRef = useRef<any>(null)


    useSidebar({ type: 'page', init: true })
    const { toDetailRoute } = useGoTo()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [canTake, setCanTake] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [file, setFile] = useState<IFileUpload | null>(null)
    const [task, setTask] = useState<string>(StatusEnum.DRAFT)
    const [showPicker, setShowPicker] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [inputText, setInputText] = useState('');


    const onEmojiClick = (emojiData: any) => {
        setInputText(prevInput => prevInput + emojiData.emoji);
        setShowPicker(false);
    };

    const onReplyClick = (e: MouseEvent<HTMLElement>) => {
        if (e) e.preventDefault()
        setShowReply(!showReply);
    };

    const configTab = (e: any, val: any) => {
        if (e) { e.preventDefault(); }
        storage.keep('task-tab', val.toString())
    }

    const toggleShowModal = (e: MouseEvent<HTMLAnchorElement>) => {
        if (e) { e.preventDefault(); }
        setShowModal(!showModal)
    }

    const formatStatus = (status: string) => {
        let result = { label: '', type: 'default' }
        switch (status) {
            case StatusEnum.COMPLETED:
                result = { label: 'completed', type: 'green' }
                break;
            case StatusEnum.ABANDONED:
                result = { label: 'abandoned', type: 'error' }
                break;
            case StatusEnum.PENDING:
                result = { label: 'pending', type: 'warning' }
                break;
            case StatusEnum.REVIEWED:
                result = { label: 'reviewed', type: 'pink' }
                break;
            case StatusEnum.SUBMITTED:
                result = { label: 'submitted', type: 'ongoing' }
                break;
            case StatusEnum.INPROGRESS:
                result = { label: 'in-progress', type: 'info' }
                break;
            case StatusEnum.DEFAULTED:
                result = { label: 'defaulted', type: 'blue' }
                break;
            case StatusEnum.DRAFT:
                result = { label: 'draft', type: 'lightblue' }
                break;
            default:
                result = { label: 'pending', type: 'warning' }
                break;
        }

        return result
    }

    const viewSubmitted = [StatusEnum.DRAFT, StatusEnum.COMPLETED, StatusEnum.SUBMITTED]

    return (
        <>

            <section>

                {
                    loading &&
                    <CardLoading type="task" size={1} />
                }

                {
                    !loading &&
                    <>

                        <CardUI padding={{ x: 1.5, y: 1.3 }}>
                            <div className="details-header">
                                <div className="flex items-center gap-x-[1rem] grow">
                                    <div className="avatar rg ui-full-bg" style={{ backgroundImage: `url("../../../../images/assets/bg@core_01.webp")` }}>
                                        {!file &&
                                            <span className="font-mona-semibold text-[#224C68] text-xl ui-upcase">{helper.getInitials(`Michael Immanuel`)}</span>
                                        }</div>
                                    <div className="space-y-[0.3rem]">
                                        <h3 className="font-mona-bold pas-950 text-xl">Beginner Figma Animation</h3>
                                        <p className="font-mona-light pag-500 text-[13px]">Your assignment is to design and animate a to-do list task item in Figma. </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        type="ghost"
                                        semantic="normal"
                                        size="xsm"
                                        loading={loading}
                                        disabled={false}
                                        block={false}
                                        className="form-button min-w-[88px] ml-auto"
                                        icon={{
                                            enable: true,
                                            child: <Icon name="edit" type="polio" size={16} />
                                        }}
                                        text={{
                                            label: "Edit",
                                            size: 13,
                                            weight: 'medium'
                                        }}
                                        onClick={(e: any) => {
                                            toggleShowModal(e)
                                        }}
                                    />
                                    <Button
                                        type="ghost"
                                        semantic="error"
                                        size="xsm"
                                        loading={loading}
                                        disabled={false}
                                        block={false}
                                        className="form-button min-w-[88px] ml-auto"
                                        icon={{
                                            enable: true,
                                            child: <Icon name="bin" type="polio" size={16} />
                                        }}
                                        text={{
                                            label: "Delete",
                                            size: 13,
                                            weight: 'medium'
                                        }}
                                        onClick={(e: any) => {
                                            toggleShowModal(e)
                                        }}
                                    />
                                    <Button
                                        type="primary"
                                        semantic="normal"
                                        size="xsm"
                                        loading={loading}
                                        disabled={false}
                                        block={false}
                                        className="form-button min-w-[109px] ml-auto"
                                        text={{
                                            label: "Assign Task",
                                            size: 13,
                                            weight: 'medium'
                                        }}
                                        onClick={(e: any) => {
                                            toggleShowModal(e)
                                        }}
                                    />
                                </div>

                            </div>

                            <div className="py-[0.3rem]">
                                <Divider show={true} padding={{ enable: true, top: 'pt-[2.5rem]', bottom: 'pb-[1.7rem]' }} />
                            </div>

                            <div className="flex items-start min-h-[70px]">
                                <div className="grow space-y-[0.9rem]">
                                    <div className="flex gap-3 items-center">
                                        <h3 className="font-mona pag-800 text-sm">Date Created: </h3>
                                        <p className="font-mona-light pag-400 text-sm">2nd Sept, 2025</p>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <h3 className="font-mona pag-800 text-sm">Field: </h3>
                                        <p className="font-mona-light pag-400 text-sm">UI/UX Design</p>
                                    </div>
                                </div>
                                <div className="h-[60px] w-[1px] mx-[4%] bg-pag-200"></div>
                                <div className="grow space-y-[0.9rem]">
                                    <div className="flex gap-3 items-center">
                                        <h3 className="font-mona pag-800 text-sm">Skill Level: </h3>
                                        <p className="font-mona-light pag-400 text-sm">Beginner</p>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <h3 className="font-mona pag-800 text-sm">Assigner: </h3>
                                        <p className="font-mona-light pag-400 text-sm">Admin</p>
                                    </div>
                                </div>
                                <div className="h-[60px] w-[1px] mx-[4%] bg-pag-200"></div>
                                <div className="grow space-y-[0.9rem]">
                                    {
                                        task !== StatusEnum.DRAFT &&
                                        <>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-sm">Due Date: </h3>
                                                <p className="font-mona-light pag-400 text-sm">10th Sept, 2025</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-sm">Duration: </h3>
                                                <p className="font-mona-light pag-400 text-sm">7 Days</p>
                                            </div>
                                        </>
                                    }
                                    {
                                        task === StatusEnum.DRAFT &&
                                        <>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-sm">Duration: </h3>
                                                <p className="font-mona-light pag-400 text-sm">7 Days</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-sm">Status: </h3>
                                                <Badge
                                                    type={formatStatus(task).type as any}
                                                    size="sm"
                                                    display="status"
                                                    label={formatStatus(task).label}
                                                    padding={{ y: 3, x: 10 }}
                                                    font={{
                                                        weight: 'regular',
                                                        size: 10
                                                    }}
                                                    upper={true}
                                                    close={false}
                                                />
                                            </div>
                                        </>
                                    }

                                </div>
                                <div className="h-[60px] w-[1px] mx-[4%] bg-pag-200"></div>
                                <div className="grow space-y-[0.9rem]">
                                    <div className="flex gap-3 items-center">
                                        <h3 className="font-mona pag-800 text-sm">{task === StatusEnum.DRAFT ? 'Type' : 'Status'} </h3>
                                        {
                                            task !== StatusEnum.DRAFT ? <Badge
                                                type={formatStatus(task).type as any}
                                                size="sm"
                                                display="status"
                                                label={formatStatus(task).label}
                                                padding={{ y: 3, x: 10 }}
                                                font={{
                                                    weight: 'regular',
                                                    size: 10
                                                }}
                                                upper={true}
                                                close={false}
                                            /> : <p className="font-mona-light pag-400 text-sm">Template</p>
                                        }

                                    </div>
                                </div>
                            </div>

                        </CardUI>

                        <Divider show={false} />

                        <ListBox>

                            <div>
                                <Tabs defaultIndex={parseInt(storage.fetch('task-tab'))} className={'task-tab hide-border px-4 py-3 min-h-[500px]'}>
                                    <TabList>
                                        <Tab onClick={(e: any) => { configTab(e, 0); }}>Description</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 1); }}>Instructions</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 2); }}>Resources</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 3); }}>Deliverables</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 4); }}>Feedback</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 5); }}>Comments</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 6); }}>Submission</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 7); }}>Reviewer</Tab>
                                    </TabList>

                                    <TabPanel tabIndex={0}>

                                        <div className="pt-[1.5rem] space-y-[0.6rem] pb-16">
                                            <h3 className="font-mona-medium pag-800 text-base">Objective</h3>
                                            <p className="font-rethink pag-800 text-sm leading-loose">You are required to design and prototype the Uber App user experience in Figma, showcasing smooth animations, transitions, and realistic interactions that mirror the actual ride-hailing flow. This task is meant to demonstrate strong UI/UX interaction design skills and the ability to use Figma’s prototyping and animation tools to create an engaging, user-centered digital experience.</p>
                                            <p className="font-rethink pag-800 text-sm leading-loose">You are required to design and prototype the Uber App user experience in Figma, showcasing smooth animations, transitions, and realistic interactions that mirror the actual ride-hailing flow. This task is meant to demonstrate strong UI/UX interaction design skills and the ability to use Figma’s prototyping and animation tools to create an engaging, user-centered digital experience.</p>

                                            <ol className="grid grid-cols-2 gap-8 list-inside leading-loose">
                                                <li className="font-rethink-medium pag-800 text-sm leading-loose">
                                                    <h3 className="font-rethink-medium pag-800 text-sm leading-loose mb-1">1. Onboarding & Authentication</h3>
                                                    <ul className="list-disc list-inside pl-6">
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Animated splash screen with Uber logo reveal.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Login, Signup, </li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose"> Forgot Password flow with form feedback animations.</li>
                                                    </ul>
                                                </li>
                                                <li className="font-rethink-medium pag-800 text-sm leading-loose">
                                                    <h3 className="font-rethink-medium pag-800 text-sm leading-loose mb-1">2. Home & Ride Request</h3>
                                                    <ul className="list-disc list-inside pl-6">
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Interactive map interface with animated pin-drop.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Enter pickup/drop-off location with smooth card transitions.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Ride option selection with animated expanding cards.</li>
                                                    </ul>
                                                </li>
                                                <li className="font-rethink-medium pag-800 text-sm leading-loose">
                                                    <h3 className="font-rethink-medium pag-800 text-sm leading-loose mb-1">3. Driver Matching & Ride Tracking</h3>
                                                    <ul className="list-disc list-inside pl-6">
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Loading animation for “Finding your driver.”</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Driver info card sliding up with car/ETA details.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Simulated car movement on map with status updates.</li>
                                                    </ul>
                                                </li>
                                                <li className="font-rethink-medium pag-800 text-sm leading-loose">
                                                    <h3 className="font-rethink-medium pag-800 text-sm leading-loose mb-1">4. Ride Completion & Feedback</h3>
                                                    <ul className="list-disc list-inside pl-6">
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Transition to payment summary screen.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Rating and feedback micro-interactions (tap animations on stars).</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Return to home screen.</li>
                                                    </ul>
                                                </li>
                                            </ol>
                                        </div>

                                    </TabPanel>

                                    <TabPanel tabIndex={1}>

                                        <div className="pt-[1.5rem] space-y-[0.6rem] pb-16">
                                            <h3 className="font-mona-medium pag-800 text-base leading-loose mb-4">Instructions</h3>

                                            <ol className="grid grid-cols-2 gap-8 list-inside leading-loose">
                                                <li className="font-rethink-medium pag-800 text-sm leading-loose">
                                                    <h3 className="font-rethink-medium pag-800 text-sm leading-loose mb-1">1. Set up the Project in Figma</h3>
                                                    <ul className="list-disc list-inside pl-6">
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Create a mobile frame (iOS/Android standard size).</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Build a consistent design system (colors, fonts, buttons, icons) aligned with Uber’s branding.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose"> Create a mobile frame (iOS/Android standard size).</li>
                                                    </ul>
                                                </li>
                                                <li className="font-rethink-medium pag-800 text-sm leading-loose">
                                                    <h3 className="font-rethink-medium pag-800 text-sm leading-loose mb-1">2. Design High-Fidelity Screens</h3>
                                                    <ul className="list-disc list-inside pl-6">
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Create all key screens for onboarding, home, ride booking, driver matching, ride in progress, and completion.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Keep layouts clean, minimal, and aligned with modern UX standards.</li>
                                                    </ul>
                                                </li>
                                                <li className="font-rethink-medium pag-800 text-sm leading-loose">
                                                    <h3 className="font-rethink-medium pag-800 text-sm leading-loose mb-1">3. Apply Animations & Interactions</h3>
                                                    <ul className="list-disc list-inside pl-6">
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Use Smart Animate for smooth transitions between screens.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Add micro-interactions (button states, input validations, hover/tap animations).</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Create overlay effects (sliding bottom sheets, expanding cards, loading states).</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Simulate map animations for ride tracking.</li>
                                                    </ul>
                                                </li>
                                                <li className="font-rethink-medium pag-800 text-sm leading-loose">
                                                    <h3 className="font-rethink-medium pag-800 text-sm leading-loose mb-1">4. Build the Interactive Prototype</h3>
                                                    <ul className="list-disc list-inside pl-6">
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Link screens together to simulate the full Uber journey.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Ensure transitions are smooth and intuitive.</li>
                                                        <li className="font-rethink pag-800 text-sm leading-loose">Test interactions to confirm usability.</li>
                                                    </ul>
                                                </li>
                                            </ol>
                                        </div>

                                    </TabPanel>

                                    <TabPanel tabIndex={2}>

                                        <div className="pt-[1.5rem] space-y-[0.6rem] pb-16">
                                            <div className="grid grid-cols-[43%_43%] justify-between gap-x-12">
                                                <div className="flex flex-col gap-4">
                                                    <h3 className="font-mona-medium pag-800 text-sm">Templates</h3>
                                                    {
                                                        templates.map((template) => (
                                                            <div key={template.id} className="ts-resource-card">
                                                                <div className="ts-type file">
                                                                    <Icon name="multiple-pages-empty" type="polio" className="text-[#D35B5C]" size={16} />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-mona-semibold pag-800 text-[13px] mb-1">{template.title}</h3>
                                                                    <p className="font-rethink pag-500 text-[12px]">{template.description}</p>
                                                                </div>
                                                            </div>

                                                        ))
                                                    }
                                                </div>
                                                <div className="flex flex-col gap-4">
                                                    <h3 className="font-mona-medium pag-800 text-sm">Pinterest Image</h3>

                                                    {
                                                        pinterests.map((pinterest) => (
                                                            <div key={pinterest.id} className="ts-resource-card">
                                                                <div className="ts-type image">
                                                                    <Icon name="media-image" type="polio" className="text-[#4A71C6]" size={16} />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-mona-semibold pag-800 text-[13px] mb-1">{pinterest.title}</h3>
                                                                    <p className="font-rethink pag-500 text-[12px]">{pinterest.description}</p>
                                                                </div>
                                                            </div>

                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <Divider padding={{ enable: true, top: 'pt-[1.5rem]', bottom: 'pb-[1.5rem]' }} />
                                            <div className="grid grid-cols-[43%_43%] justify-between gap-x-12">
                                                <div className="flex flex-col gap-4">
                                                    <h3 className="font-mona-medium pag-800 text-sm">Dribble Link Samples</h3>
                                                    {
                                                        dribbles.map((dribble) => (
                                                            <div key={dribble.id} className="ts-resource-card">
                                                                <div className="ts-type link">
                                                                    <Icon name="link" type="polio" className="text-[#4A71C6]" size={16} />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-mona-semibold pag-800 text-[13px] mb-1">{dribble.title}</h3>
                                                                    <p className="font-rethink pag-500 text-[12px]">{dribble.description}</p>
                                                                </div>
                                                            </div>

                                                        ))
                                                    }
                                                </div>

                                            </div>
                                        </div>

                                    </TabPanel>

                                    <TabPanel tabIndex={3}>

                                        <div className="pt-[1.5rem] space-y-[0.6rem] pb-16">
                                            <h3 className="font-mona-medium pag-800 text-base leading-loose mb-4">Submission Format</h3>

                                            <div className="font-rethink-medium pag-800 text-sm leading-loose">
                                                <h3 className="font-rethink pag-800 text-sm leading-loose mb-1">Please submit your task in the following format.</h3>
                                                <ul className="list-disc list-inside pl-3">
                                                    <li className="font-rethink pag-800 text-sm leading-loose">Submit the link of the  Figma environment you worked on.</li>
                                                    <li className="font-rethink pag-800 text-sm leading-loose">Submit the prototype link of the task.</li>
                                                    <li className="font-rethink pag-800 text-sm leading-loose">Submit the UI components file</li>
                                                    <li className="font-rethink pag-800 text-sm leading-loose">Design explanation essay.</li>
                                                </ul>
                                            </div>

                                        </div>
                                    </TabPanel>

                                    <TabPanel tabIndex={4}>

                                        <div className="pt-[1.5rem] space-y-[0.7rem] pb-16">
                                            <Feedback />
                                            <Feedback />
                                            <Feedback />
                                        </div>

                                    </TabPanel>

                                    <TabPanel tabIndex={5}>

                                        <div className="pt-[1.5rem] space-y-[0.6rem] pb-16">

                                            <h3 className="font-mona-semibold pag-800 text-sm mb-1">Task Title: Create a Simple Task-Completion Animation in Figma</h3>

                                            <Divider show={false} />

                                            <div className="">

                                                <div className="flex items-center gap-4">

                                                    <div className={`avatar round sm ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}
                                                        style={{ backgroundImage: `url("")` }}>
                                                        <span className="font-mona-semibold pab-900 text-sm uppercase">{helper.getInitials(`Oluwatobi Immanuel`)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-mona-semibold pag-900 text-[13px]">Immanuel Oluwatobi</h3>
                                                        <p className="font-mona text-[#717689] text-[11px]">Yesterday at 9:50 AM</p>
                                                    </div>

                                                </div>
                                                <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                <p className="font-mona-medium text-[#3A3E4F] text-xs leading-loose">Nice work on defining the goal of your animation early. I like that you tied it to positive reinforcement for the user. But you could improve the timing right now it feels a bit fast, which might overwhelm users. Try slowing it down slightly so the feedback feels smoother and more natural.</p>
                                                <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                <div className="flex items-center gap-5 mb-5">
                                                    <Link to='' onClick={(e) => onReplyClick(e)} className="flex items-center gap-2">
                                                        <Icon name="message-text" type="polio" size={16} className="color-black" />
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs">Reply</p>
                                                    </Link>
                                                    <Link to='' onClick={() => setShowPicker(val => !val)} className="flex items-center gap-2">
                                                        {/* <Icon name="smile" type="polio" size={16} className="color-black" /> */}
                                                        😀
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs">React</p>
                                                    </Link>

                                                </div>
                                                {
                                                    inputText &&
                                                    <div className="h-8 w-13 bg-pag-200 flex items-center justify-between rounded-2xl px-2 mb-4">
                                                        <p>{inputText}</p>
                                                        <p className="font-mona-medium text-[#3A3E4F] text-[11px]">+1</p>
                                                    </div>
                                                }


                                                {showPicker && (
                                                    <div className='absolute z-50 h-[300px] overflow-y-scroll'>
                                                        <EmojiPicker
                                                            onEmojiClick={onEmojiClick}
                                                            // Optional:you can customize the picker here
                                                            // theme="white"
                                                            lazyLoadEmojis={true}
                                                        />
                                                    </div>
                                                )}

                                                {
                                                    showReply &&
                                                    <div className="task-mce">
                                                        <TaskMCE ref={editorRef} height={200} />
                                                    </div>
                                                }

                                            </div>

                                            <Divider padding={{ top: 'pt-[1.3rem]', bottom: 'pb-[1.3rem]', enable: true, }} />

                                            <div className="ml-12">

                                                <div className="flex items-center gap-4">

                                                    <div className={`avatar round sm ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}
                                                        style={{ backgroundImage: `url("")` }}>
                                                        <span className="font-mona-semibold pab-900 text-sm uppercase">{helper.getInitials(`Oluwatobi Immanuel`)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-mona-semibold pag-900 text-[13px]">Immanuel Oluwatobi</h3>
                                                        <p className="font-mona text-[#717689] text-[11px]">Yesterday at 9:50 AM</p>
                                                    </div>

                                                </div>
                                                <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                <p className="font-mona-medium text-[#3A3E4F] text-xs leading-loose">Nice work on defining the goal of your animation early. I like that you tied it to positive reinforcement for the user. But you could improve the timing right now it feels a bit fast, which might overwhelm users. Try slowing it down slightly so the feedback feels smoother and more natural.</p>
                                                <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                <div className="flex items-center gap-5 mb-5">
                                                    <Link to='' onClick={(e) => onReplyClick(e)} className="flex items-center gap-2">
                                                        <Icon name="message-text" type="polio" size={16} className="color-black" />
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs">Reply</p>
                                                    </Link>
                                                    <Link to='' onClick={() => setShowPicker(val => !val)} className="flex items-center gap-2">
                                                        {/* <Icon name="smile" type="polio" size={16} className="color-black" /> */}
                                                        😀
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs">React</p>
                                                    </Link>

                                                </div>
                                                {
                                                    inputText &&
                                                    <div className="h-8 w-13 bg-pag-200 flex items-center justify-between rounded-2xl px-2 mb-4">
                                                        <p>{inputText}</p>
                                                        <p className="font-mona-medium text-[#3A3E4F] text-[11px]">+1</p>
                                                    </div>
                                                }
                                                {/* 
    // <textarea
    //     value={inputText}
    //     onChange={(e) => setInputText(e.target.value)}
    //     placeholder="Type a message or insert an emoji..."
    //     rows={3}
    //     cols={50}
    // /> */}

                                                {showPicker && (
                                                    <div className='absolute z-50 h-[300px] overflow-y-scroll'>
                                                        <EmojiPicker
                                                            onEmojiClick={onEmojiClick}
                                                            // Optional:you can customize the picker here
                                                            // theme="white"
                                                            lazyLoadEmojis={true}
                                                        />
                                                    </div>
                                                )}

                                                {
                                                    showReply &&
                                                    <div className="task-mce">
                                                        <TaskMCE ref={editorRef} height={200} />
                                                    </div>
                                                }

                                            </div>
                                            <Divider padding={{ top: 'pt-[1.3rem]', bottom: 'pb-[1.3rem]', enable: true, }} />
                                            <div className="">

                                                <div className="flex items-center gap-4">

                                                    <div className={`avatar round sm ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}
                                                        style={{ backgroundImage: `url("")` }}>
                                                        <span className="font-mona-semibold pab-900 text-sm uppercase">{helper.getInitials(`Oluwatobi Immanuel`)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-mona-semibold pag-900 text-[13px]">Immanuel Oluwatobi</h3>
                                                        <p className="font-mona text-[#717689] text-[11px]">Yesterday at 9:50 AM</p>
                                                    </div>

                                                </div>
                                                <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                <p className="font-mona-medium text-[#3A3E4F] text-xs leading-loose">Nice work on defining the goal of your animation early. I like that you tied it to positive reinforcement for the user. But you could improve the timing right now it feels a bit fast, which might overwhelm users. Try slowing it down slightly so the feedback feels smoother and more natural.</p>
                                                <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                <div className="flex items-center gap-5 mb-5">
                                                    <Link to='' onClick={(e) => onReplyClick(e)} className="flex items-center gap-2">
                                                        <Icon name="message-text" type="polio" size={16} className="color-black" />
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs">Reply</p>
                                                    </Link>
                                                    <Link to='' onClick={() => setShowPicker(val => !val)} className="flex items-center gap-2">
                                                        {/* <Icon name="smile" type="polio" size={16} className="color-black" /> */}
                                                        😀
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs">React</p>
                                                    </Link>

                                                </div>
                                                {
                                                    inputText &&
                                                    <div className="h-8 w-13 bg-pag-200 flex items-center justify-between rounded-2xl px-2 mb-4">
                                                        <p>{inputText}</p>
                                                        <p className="font-mona-medium text-[#3A3E4F] text-[11px]">+1</p>
                                                    </div>
                                                }

                                                {showPicker && (
                                                    <div className='absolute z-50 h-[300px] overflow-y-scroll'>
                                                        <EmojiPicker
                                                            onEmojiClick={onEmojiClick}
                                                            // Optional:you can customize the picker here
                                                            // theme="white"
                                                            lazyLoadEmojis={true}
                                                        />
                                                    </div>
                                                )}

                                                {
                                                    showReply &&
                                                    <div className="task-mce">
                                                        <TaskMCE ref={editorRef} height={200} />
                                                    </div>
                                                }

                                            </div>

                                            {

                                                (showReply || inputText) &&
                                                <>
                                                    <Divider show={false} padding={{ enable: true, top: 'pt-[1.4rem]', bottom: 'pb-[1.4rem]' }} />
                                                    <div className="flex justify-end">

                                                        <Button
                                                            type="primary"
                                                            semantic="normal"
                                                            size="rg"
                                                            loading={loading}
                                                            disabled={false}
                                                            block={false}
                                                            className="form-button min-w-[130px] ml-auto"

                                                            text={{
                                                                label: "Send",
                                                                size: 13,
                                                                weight: 'medium'
                                                            }}
                                                            onClick={(e) => { }}
                                                        />

                                                    </div>
                                                </>
                                            }

                                        </div>
                                    </TabPanel>

                                    <TabPanel tabIndex={6}>

                                        <div className="pt-[1.5rem] space-y-[0.6rem] pb-16 min-h-[500px]">

                                            {
                                                !viewSubmitted.includes(task as any) &&
                                                <EmptyState className="min-h-[30vh]" noBound={true}>
                                                    <span className="font-mona pag-600 text-[13px]">There no submissions yet for this task</span>
                                                </EmptyState>
                                            }

                                        </div>
                                    </TabPanel>

                                    <TabPanel tabIndex={7}>

                                        <div className="pt-[1.5rem] space-y-[0.6rem] pb-16">

                                            <div className="ts-mentor-card">

                                                <div className="flex items-center gap-3">

                                                    <div className={`avatar round rg ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}
                                                        style={{ backgroundImage: `url("")` }}>
                                                        <span className="font-mona-semibold pab-900 text-lg uppercase">{helper.getInitials(`Oluwatobi Immanuel`)}</span>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-rethink-semibold pag-900 text-base">Immanuel Oluwatobi</h3>
                                                        <p className="font-rethink text-[#717689] text-sm">Product Designer</p>
                                                    </div>

                                                </div>
                                                <p className="font-rethink text-[#4D657D] text-sm leading-loose">An experienced professional passionate about guiding and supporting others in their career journey. With 5+ years of experience in product design, I enjoy sharing practical tips, industry insights, and real-life lessons to help you grow faster. As a mentor, I provide personalized advice, share industry insights, and help you build the skills and confidence needed to achieve your goals.</p>
                                            </div>

                                        </div>
                                    </TabPanel>

                                </Tabs>
                            </div>

                        </ListBox>


                    </>
                }

            </section >

        </>
    )
};

export default TaskDetailsPage;
