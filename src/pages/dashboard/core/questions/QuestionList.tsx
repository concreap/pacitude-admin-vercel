import React, { useEffect, useState, useContext, Fragment, useRef } from "react"
import GeniusContext from "../../../../context/genius/geniusContext";
import SearchInput from "../../../../components/partials/inputs/SearchInput";
import Filter from "../../../../components/partials/drops/Filter";
import Button from "../../../../components/partials/buttons/Button";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import helper from "../../../../utils/helper.util";
import TableHead from "../../../../components/app/table/TableHead";
import CellData from "../../../../components/app/table/CellData";
import Icon from "../../../../components/partials/icons/Icon";
import RoundButton from "../../../../components/partials/buttons/RoundButton";
import { ICollection, ICoreContext, ICoreMetrics, IGeniusContext, IListUI, IMetricQuery, IPageSearch, IUserContext } from "../../../../utils/interfaces.util";
import Popout from "../../../../components/partials/drops/Popout";
import Question from "../../../../models/Question.model";
import UserContext from "../../../../context/user/userContext";
import CoreContext from "../../../../context/core/coreContext";
import { FormActionType } from "../../../../utils/types.util";
import TopicForm from "../topics/TopicForm";
import QuestionForm from "./QuestionForm";
import routil from "../../../../utils/routes.util";
import { useNavigate } from "react-router-dom";
import qHelper from "../../../../utils/question.util";
import useGoTo from "../../../../hooks/useGoTo";
import { difficulties, questionTypes, skillLevels } from "../../../../_data/seed";
import Field from "../../../../models/Field.model";

const QuestionList = (props: IListUI) => {

    const { type, resource, resourceId } = props;

    const filtRef = useRef<any>(null)
    const fieldRef = useRef<any>(null)
    const { goTo } = useGoTo()

    const LIMIT = 25;

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)

    const [showPanel, setShowPanel] = useState<boolean>(false);
    const [form, setForm] = useState<{ action: FormActionType, questionId: string }>({ action: 'add-resource', questionId: '' })
    const [search, setSearch] = useState<IPageSearch>({ key: '', hasResult: false, type: 'search', filters: {}, resourceId: '', resource: 'field' })

    useEffect(() => {
        initList()
    }, [resourceId])

    useEffect(() => {
        configureSearch()
    }, [coreContext.search])

    const initList = () => {
        if (type === 'self') {
            coreContext.getQuestions({ limit: LIMIT, page: 1, order: 'desc' })
            coreContext.getFields({ limit: 9999, page: 1, order: 'desc' });
        }

        if (type === 'resource' && resource && resourceId) {
            coreContext.getResourceQuestions({ limit: LIMIT, page: 1, order: 'desc', resource, resourceId })
        }
    }

    const configureSearch = () => {

        if (coreContext.search.data.length > 0) {
            setSearch({
                ...search,
                key: search.key,
                hasResult: true,
                resourceId: search.resourceId,
                type: search.type
            })
        } else {

            if (!coreContext.search.loading) {
                if (filtRef.current) {
                    filtRef.current.clear()
                }
                if (fieldRef.current) {
                    fieldRef.current.clear()
                }
            }

            setSearch({
                ...search,
                key: '',
                hasResult: false,
                resourceId: '',
                type: 'search',
                resource: 'field'
            })
        }

    }

    const clearSearch = (e: any) => {

        if(e) { e.preventDefault() }

        const qmt = coreContext.metrics.question;

        coreContext.clearSearch();

        setSearch({ ...search, key: '', hasResult: false, type: 'search' });

        if (filtRef.current) {
            filtRef.current.clear()
        }

        if (fieldRef.current) {
            fieldRef.current.clear()
        }

        coreContext.setResourceMetrics({
            ...coreContext.metrics,
            resource: 'default',
            question: {
                total: qmt ? qmt.total : 0,
                enabled: qmt ? qmt.enabled : 0,
                disabled: qmt ? qmt.disabled : 0,
                resource: { total: 0, disabled: 0, enabled: 0 }
            }
        });
    }

    const toDetails = (e: any, id: string) => {

        if (e) { e.preventDefault(); }

        const route = routil.inRoute({
            route: 'core',
            name: 'question-details',
            params: [{ type: 'url', name: 'details', value: id }]
        });

        goTo(route);

    }

    const toAIDetails = (e: any) => {

        e.preventDefault();

        const route = routil.inRoute({
            route: 'core',
            name: 'ai-questions',
            params: []
        });

        goTo(route);

    }

    const pagiNext = async (e: any) => {
        if (e) { e.preventDefault() }
        const { next } = coreContext.questions.pagination;


        if (type === 'self') {

            if (search.hasResult) {

                const { next: sn } = coreContext.search.pagination;

                if (search.type === 'search') {
                    await coreContext.searchResource({
                        limit: sn.limit, page: sn.page, order: 'desc',
                        resource: 'questions',
                        payload: search.key
                    })
                } else if (search.type === 'filter') {
                    await coreContext.filterResource({
                        limit: sn.limit, page: sn.page, order: 'desc',
                        resource: 'questions',
                        payload: search.filters
                    });
                }

            } else {
                await coreContext.getQuestions({ limit: next.limit, page: next.page, order: 'desc' })
            }
        }

        if (type === 'resource') {
            await coreContext.getResourceQuestions({ limit: next.limit, page: next.page, order: 'desc', resource, resourceId })
        }

        helper.scrollToTop()
    }

    const pagiPrev = async (e: any) => {
        if (e) { e.preventDefault() }

        const { prev } = coreContext.questions.pagination;

        if (type === 'self') {

            if (search.hasResult) {

                const { prev: sp } = coreContext.search.pagination;

                if (search.type === 'search') {
                    await coreContext.searchResource({
                        limit: sp.limit, page: sp.page, order: 'desc',
                        resource: 'questions',
                        payload: search.key
                    })
                } else if (search.type === 'filter') {
                    await coreContext.filterResource({
                        limit: sp.limit, page: sp.page, order: 'desc',
                        resource: 'questions',
                        payload: search.filters
                    });
                }

            } else {
                await coreContext.getQuestions({ limit: prev.limit, page: prev.page, order: 'desc' })
            }

        }

        if (type === 'resource') {
            await coreContext.getResourceQuestions({ limit: prev.limit, page: prev.page, order: 'desc', resource, resourceId })
        }

        helper.scrollToTop()
    }

    const togglePanel = (e: any, form?: { action: FormActionType, id?: string }) => {
        if (e) { e.preventDefault() }

        if (!showPanel && form) {
            setForm({ action: form.action, questionId: form.id ? form.id : '' })
        }

        setShowPanel(!showPanel)

    }

    return (
        <>
            <div id="listbox" className="listbox">

                <div className="header">
                    <div className="left-halve">

                        <SearchInput
                            showFocus={true}
                            autoComplete={false}
                            size="sm"
                            placeholder="Search Here"
                            hasResult={search.hasResult}
                            onChange={(e) => { setSearch({ ...search, key: e.target.value }) }}
                            onSearch={async (e) => {

                                if (search.hasResult) {
                                    clearSearch(e)
                                } else {
                                    if (search.key) {
                                        await coreContext.searchResource({
                                            resource: 'questions',
                                            key: search.key
                                        });
                                    }
                                }
                            }}
                        />

                        <span className="pdl1"></span>

                        <div className="wp-25">
                            <Filter
                                ref={fieldRef}
                                size="sm"
                                position="bottom"
                                disabled={search.hasResult}
                                noFilter={false}
                                placeholder="Field"
                                icon={{ type: 'polio', name: 'filter-2', style: { color: '#0a6d9a' } }}
                                items={
                                    coreContext.fields.data.map((x: Field) => {
                                        return {
                                            value: x._id,
                                            label: helper.capitalize(x.name)
                                        }
                                    })
                                }
                                onChange={async (data) => {
                                    setSearch({ ...search, type: 'filter', resourceId: data.value });
                                }}
                            />
                        </div>

                        <span className="pdl1"></span>

                        <Filter
                            ref={filtRef}
                            size="sm"
                            position="bottom"
                            disabled={search.hasResult}
                            icon={{ type: 'polio', name: 'filter-2', style: { color: '#0a6d9a' } }}
                            items={[
                                {
                                    value: 'level',
                                    label: 'By Level',
                                    subitems: skillLevels.map((x) => { return { label: x.name, value: x.value } })
                                },
                                {
                                    value: 'difficulty',
                                    label: 'By Difficulty',
                                    subitems: difficulties.map((x) => { return { label: x.name, value: x.value } })
                                },
                                {
                                    value: 'type',
                                    label: 'By Type',
                                    subitems: questionTypes.map((x) => { return { label: x.name, value: x.value } })
                                },
                            ]}
                            onChange={async (data) => {

                                let payload: any = { type: 'default' }

                                if (data.item) {

                                    if (data.item.value === 'level') {
                                        payload.levels = [data.value]
                                    } else if (data.item.value === 'difficulty') {
                                        payload.difficulties = [data.value]
                                    } else if (data.item.value === 'type') {
                                        payload.types = [data.value]
                                    }

                                    setSearch({ ...search, type: 'filter', filters: payload });

                                    if (!search.hasResult && !search.resourceId) {

                                        await coreContext.filterResource({
                                            resource: 'questions',
                                            payload: payload
                                        });
                                    }


                                }

                            }}
                        />

                        {
                            !search.hasResult && search.resourceId &&
                            <>
                                <span className="pdl1"></span>
                                <Button
                                    text="Apply"
                                    type="ghost"
                                    size="xsm"
                                    loading={coreContext.search.loading}
                                    disabled={coreContext.search.loading}
                                    fontSize={14}
                                    fontWeight={'regular'}
                                    lineHeight={16}
                                    className="export-btn"
                                    icon={{
                                        enable: false,
                                    }}
                                    onClick={async (e) => {

                                        let payload: any = { resourceId: search.resourceId, resource: 'field' }

                                        if (!helper.isEmpty(search.filters, 'object')) {
                                            payload = { ...payload, ...search.filters, type: 'default' }
                                        } else {
                                            payload = { ...payload, type: 'field' }
                                        }

                                        coreContext.getResourceMetrics({
                                            metric: 'overview',
                                            type: 'question',
                                            resource: 'field',
                                            resourceId: search.resourceId,
                                        });

                                        await coreContext.filterResource({
                                            resource: 'questions',
                                            payload: payload
                                        });

                                    }}
                                />
                            </>
                        }

                    </div>
                    <div className="right-halve">
                        <Button
                            text="Add Question"
                            type="primary"
                            size="xsm"
                            loading={false}
                            disabled={false}
                            fontSize={14}
                            lineHeight={16}
                            className="add-new-btn"
                            icon={{
                                enable: true,
                                name: 'plus',
                                size: 20,
                                loaderColor: ''
                            }}
                            onClick={(e) => togglePanel(e, { action: 'add-resource' })}
                        />
                        <span className="pdl"></span>
                        <Button
                            text="AI Tool"
                            type="ghost"
                            size="xsm"
                            loading={false}
                            disabled={false}
                            fontSize={14}
                            lineHeight={16}
                            className="export-btn"
                            icon={{
                                enable: false,
                            }}
                            onClick={(e) => toAIDetails(e)}
                        />
                    </div>
                </div>

                <div className="ui-separate-small"></div>

                <div className="body">

                    {
                        (coreContext.questions.loading || coreContext.search.loading) &&
                        <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                            <span className="loader lg primary"></span>
                        </EmptyState>
                    }

                    {
                        (!coreContext.questions.loading && !coreContext.search.loading) &&
                        <div className="tablebox responsive">

                            {
                                coreContext.questions.data.length === 0 &&
                                <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                                    <span className={`ts-icon terra-link`}>
                                        <i className='path1 fs-28'></i>
                                        <i className='path2 fs-28'></i>
                                    </span>
                                    <div className='font-hostgro mrgb1 fs-14 ui-line-height mx-auto pas-950'>{coreContext.questions.message}</div>
                                </EmptyState>
                            }

                            {
                                coreContext.questions.data.length > 0 &&
                                <table className="table" style={{ borderCollapse: 'collapse' }}>

                                    <TableHead
                                        items={[
                                            { label: 'Date Created' },
                                            { label: 'Title' },
                                            { label: 'Level' },
                                            { label: 'Difficulty' },
                                            { label: 'Type' },
                                            { label: 'Answers', className: 'ui-text-center' },
                                            { label: 'Status' },
                                            { label: 'Action', className: 'ui-text-center' }
                                        ]}
                                    />

                                    <tbody>

                                        {
                                            coreContext.search.data.length > 0 &&
                                            coreContext.search.data.map((question: Question, index) =>
                                                <Fragment key={question._id}>
                                                    <tr className="table-row">
                                                        <CellData fontSize={13} className="wp-15" render={helper.formatDate(question.createdAt, 'basic')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} className="wp-25" render={helper.addElipsis(question.body, 38)} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} render={qHelper.shortenRubric(question, 'level')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} render={qHelper.shortenRubric(question, 'difficulty')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} render={qHelper.shortenRubric(question, 'question-type')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} className="ui-upcase ui-text-center" render={question.answers.length} />
                                                        <CellData fontSize={13} className="" status={{ enable: true, type: 'enabled', value: question.isEnabled }} render={<></>} />
                                                        <CellData fontSize={13} render={
                                                            <div className="popout-wrapper">
                                                                <Popout
                                                                    position="left"
                                                                    items={[
                                                                        { label: 'Details', value: 'details', icon: { name: 'menu', size: 16, type: 'polio' }, onClick: (e) => { } },
                                                                        { label: 'Delete', value: 'delete', icon: { name: 'trash', type: 'feather' }, onClick: (e) => { } }
                                                                    ]}
                                                                />
                                                            </div>
                                                        } />
                                                    </tr>
                                                </Fragment>
                                            )
                                        }

                                        {
                                            coreContext.search.data.length === 0 &&
                                            coreContext.questions.data.map((question: Question, index) =>
                                                <Fragment key={question._id}>
                                                    <tr className="table-row">
                                                        <CellData fontSize={13} className="wp-15" render={helper.formatDate(question.createdAt, 'basic')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} className="wp-25" render={helper.addElipsis(question.body, 38)} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} render={qHelper.shortenRubric(question, 'level')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} render={qHelper.shortenRubric(question, 'difficulty')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} render={qHelper.shortenRubric(question, 'question-type')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, question._id)} className="ui-upcase ui-text-center" render={question.answers.length} />
                                                        <CellData fontSize={13} className="" status={{ enable: true, type: 'enabled', value: question.isEnabled }} render={<></>} />
                                                        <CellData fontSize={13} render={
                                                            <div className="popout-wrapper">
                                                                <Popout
                                                                    position="left"
                                                                    items={[
                                                                        { label: 'Details', value: 'details', icon: { name: 'menu', size: 16, type: 'polio' }, onClick: (e) => { } },
                                                                        { label: 'Delete', value: 'delete', icon: { name: 'trash', type: 'feather' }, onClick: (e) => { } }
                                                                    ]}
                                                                />
                                                            </div>
                                                        } />
                                                    </tr>
                                                </Fragment>
                                            )
                                        }

                                    </tbody>

                                </table>
                            }

                        </div>
                    }


                </div>

                <div className="ui-separate-small"></div>

                <div className={`footer pdb2 ${coreContext.questions.loading ? 'disabled-light' : ''}`}>

                    <div className="left-halve">
                        <Filter
                            size="xsm"
                            position="top"
                            noFilter={false}
                            placeholder={LIMIT.toString()}
                            icon={{ type: 'feather', name: 'chevron-down' }}
                            items={[{ label: '10', value: 10 }, { label: '15', value: 15 }, { label: '25', value: 25 }, { label: '45', value: 45 }, { label: '50', value: 50 }]}
                            onChange={(item) => { }}
                        />
                        <div className="pdl1">
                            <span className="fs-13 pas-950">Displaying {coreContext.questions.count} questions on page {helper.getCurrentPage(coreContext.questions.pagination)}</span>
                        </div>
                    </div>

                    <div className="right-halve ui-text-right">
                        <RoundButton
                            size="rg"
                            icon={<Icon type="feather" name="chevron-left" clickable={false} size={16} />}
                            className={`${helper.canPrev(search.hasResult ? coreContext.search.pagination : coreContext.questions.pagination) ? '' : 'disabled'}`}
                            clickable={true}
                            onClick={(e) => pagiPrev(e)}
                        />
                        <span className="pdl"></span>
                        <RoundButton
                            size="rg"
                            icon={<Icon type="feather" name="chevron-right" clickable={false} size={16} />}
                            className={`${helper.canNext(search.hasResult ? coreContext.search.pagination : coreContext.questions.pagination) ? '' : 'disabled'}`}
                            clickable={true}
                            onClick={(e) => pagiNext(e)}
                        />
                    </div>

                </div>

            </div>

            <QuestionForm
                show={showPanel}
                closeForm={togglePanel}
                type={form.action}
                questionId={form.questionId}
                display="table"
                title={form.action === 'add-resource' ? 'Add Questions' : 'Edit Question'}
            />

        </>
    )

};

export default QuestionList;
