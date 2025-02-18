import React, { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom";
import UserContext from "../../../../context/user/userContext";
import CoreContext from "../../../../context/core/coreContext";
import { ICoreContext, IUserContext } from "../../../../utils/interfaces.util";
import helper from "../../../../utils/helper.util";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import qHelper from "../../../../utils/question.util";
import { IQuestionAnswer } from "../../../../models/Question.model";
import AnswersList from "../../../../components/app/question/AnswersList";
import QuestionRubric from "../../../../components/app/question/QuestionRubric";

const QuestionDetailsPage = ({ }) => {

    const { id } = useParams();

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)

    const [loading, setLoading] = useState<boolean>(false)
    const [showPanel, setShowPanel] = useState<boolean>(false)

    useEffect(() => {

        initSidebar();
        getQuestion()

        coreContext.getFields({ limit: 9999, page: 1, order: 'desc' })

    }, [])

    const initSidebar = () => {

        const result = userContext.currentSidebar(userContext.sidebar.collapsed);
        if (result) {
            userContext.setSidebar(result)
        }

    }

    const getQuestion = () => {
        if (id) {
            coreContext.getQuestion(id);
        }
    }

    const togglePanel = (e: any) => {
        if (e) { e.preventDefault() }
        setShowPanel(!showPanel)
    }

    const getFields = () => {

        let result: Array<any> = [];

        if (coreContext.fields.data.length > 0) {

            result = coreContext.fields.data.map((f) => {
                let c = {
                    value: f._id,
                    label: helper.capitalizeWord(f.name),
                    left: '',
                    image: ''
                }
                return c;
            })

        }


        return result;

    }

    return (
        <>

            {
                coreContext.loading &&
                <>
                    <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                        <span className="loader lg primary"></span>
                    </EmptyState>
                </>
            }

            {
                !coreContext.loading &&
                <>

                    <div className="details-header">

                        <div className="avatar">
                            <span className="font-hostgro-bold pab-900 fs-18 ui-upcase">NA</span>
                        </div>

                        <div className="pdl mrgl1">
                            <h3 className="font-hostgro-bold fs-16 mrgb0">{coreContext.question.code || '--'}</h3>
                            <span className="font-hostgro fs-13 pag-500">{qHelper.shortenRubric(coreContext.question, 'level')}</span>
                            <span className="font-hostgro fs-14 pag-500 pdr pdl">|</span>
                            <span className="font-hostgro fs-14 pag-500">{qHelper.shortenRubric(coreContext.question, 'difficulty')}</span>
                        </div>

                        <div className={`actions ${loading ? 'disabled-light' : ''}`}>


                            <Button
                                text={coreContext.question.isEnabled ? 'Disable' : 'Enable'}
                                type="ghost"
                                semantic={coreContext.question.isEnabled ? 'info' : 'success'}
                                reverse="row"
                                size="mini"
                                loading={false}
                                disabled={false}
                                fontSize={13}
                                fontWeight={'medium'}
                                lineHeight={16}
                                className="export-btn"
                                icon={{
                                    enable: true,
                                    type: 'feather',
                                    name: coreContext.question.isEnabled ? 'x' : 'check',
                                    size: 13
                                }}
                                onClick={(e) => { }}
                            />
                            <Button
                                text="Delete"
                                type="ghost"
                                semantic="error"
                                reverse="row"
                                size="mini"
                                loading={false}
                                disabled={false}
                                fontSize={13}
                                fontWeight={'medium'}
                                lineHeight={16}
                                className="delete-btn blind"
                                icon={{
                                    enable: true,
                                    type: 'feather',
                                    name: 'trash',
                                    size: 12
                                }}
                                onClick={(e) => { }}
                            />
                        </div>

                    </div>

                    <div className="ui-separate-mini">
                        <div className="ui-line bg-pag-50"></div>
                    </div>



                    <div className="row no-gutters mrgt1">

                        <div className="col-md-7">

                            <div className="ui-dashboard-card">

                                <div className="ui-flexbox align-center">
                                    <h3 className="font-hostgro-medium fs-14 pag-950 mrgb1">Question:</h3>
                                    <div className={`ui-ml-auto ${loading ? 'disabled-light' : ''}`}>
                                        <Button
                                            text="Edit"
                                            type="ghost"
                                            semantic="ongoing"
                                            reverse="row"
                                            size="mini"
                                            loading={false}
                                            disabled={false}
                                            fontSize={13}
                                            fontWeight={'medium'}
                                            lineHeight={16}
                                            className="export-btn"
                                            icon={{
                                                enable: true,
                                                type: 'polio',
                                                name: 'edit',
                                                size: 13
                                            }}
                                            onClick={(e) => togglePanel(e)}
                                        />
                                    </div>
                                </div>

                                {
                                    coreContext.question.body &&
                                    <div className="font-hostgro fs-16 pab-900 mrgb1">{coreContext.question.body}</div>
                                }

                                {
                                    coreContext.question.answers &&
                                    coreContext.question.answers.length > 0 &&
                                    <AnswersList answers={coreContext.question.answers} />
                                }

                            </div>


                        </div>

                        <div className="col-md-5">

                            <div className="ui-dashboard-card">

                                <h3 className="font-hostgro-medium fs-14 pag-950 mrgb1-mid">Question Rubrics:</h3>

                                <div>
                                    <QuestionRubric question={coreContext.question} type="level" close={true} />
                                    <div className="ui-line bg-pag-50"></div>
                                    <QuestionRubric question={coreContext.question} type="difficulty" close={true} />
                                    <div className="ui-line bg-pag-50"></div>
                                    <QuestionRubric question={coreContext.question} type="question-type" close={true} />
                                    <div className="ui-line bg-pag-50"></div>
                                    <div className="ui-flexbox align-center">
                                        <QuestionRubric question={coreContext.question} type="time" flex={true} />
                                        <span className="pdl2"></span>
                                        <QuestionRubric question={coreContext.question} type="score" flex={true} />
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>

                </>
            }

        </>
    )

};

export default QuestionDetailsPage;
