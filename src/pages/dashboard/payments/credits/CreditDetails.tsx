import React, { useEffect, useState, useContext, Fragment } from "react"
import useSidebar from "../../../../hooks/useSidebar";
import CardUI from "../../../../components/partials/ui/CardUI";
import Button from "../../../../components/partials/buttons/Button";
import useLibrary from "../../../../hooks/app/useLibrary";
import useToast from "../../../../hooks/useToast";
import AccordionUI from "../../../../components/partials/ui/AccordionUI";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import helper from "../../../../utils/helper.util";
import LinkButton from "../../../../components/partials/buttons/LinkButton";
import IconButton from "../../../../components/partials/buttons/IconButton";
import useGoTo from "../../../../hooks/useGoTo";
import Divider from "../../../../components/partials/Divider";
import Badge from "../../../../components/partials/badges/Badge";
import { Module } from "../../../../models/Module.model";
import { Lesson } from "../../../../models/Lesson.model";
import { CurrencySymbol, CurrencyType, UIEnum } from "../../../../utils/enums.util";
import Talent from "../../../../models/Talent.model";
import UserAvatar from "../../../../components/partials/ui/UserAvatar";
import useUser from "../../../../hooks/app/useUser";
import useCredit from "../../../../hooks/app/useCredit";

const LibraryDetailsPage = ({ }) => {

    const { id } = useParams()

    useSidebar({ type: 'sidebar', init: false })
    const { goTo } = useGoTo()
    const { toast, setToast } = useToast()
    const { getFullname } = useUser()
    const {
        loading, credit, loader, CreditStatus,
        getCredit, getStatusType, displayValue, displayCurrency, revokeCredit
    } = useCredit()

    useEffect(() => {

        if (id) {
            getCredit(id)
        }

    }, [id])

    const handleRevoke = async (e: any) => {

        if (e) { e.preventDefault() }

        const response = await revokeCredit({ id: credit?.business?._id })

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

    return (
        <>

            <section className="space-y-[2.5rem]">

                {
                    loading &&
                    <EmptyState className="min-h-[50vh]" noBound={true}>
                        <span className="loader lg primary"></span>
                        <span className="font-mona text-[16px] pas-950">Fetching credit data</span>
                    </EmptyState>
                }

                {
                    !loading && helper.isEmpty(credit, 'object') &&
                    <EmptyState className="min-h-[50vh]" noBound={true} >
                        <span className="font-mona text-[14px] pas-950">Credit details not found!</span>
                    </EmptyState>

                }

                {
                    !loading && !helper.isEmpty(credit, 'object') &&
                    <>

                        <CardUI padding={{ x: 1.5, y: 1.5 }}>
                            <div className="grid grid-cols-[35%_60%] gap-x-[5%]">

                                <div>
                                    <div className="min-h-[200px] rounded-[14px] bg-pag-25 flex flex-col items-center justify-center gap-y-[1rem]">
                                        <UserAvatar
                                            size="w-[45px] h-[45px]"
                                            className="leader-avatar"
                                            avatar={credit?.business?.logo || '../../../images/assets/avatar.png'}
                                            name={credit?.business?.name || 'Business'}
                                        />
                                        <div className="leading-[1rem]">
                                            <h3 className="font-mona text-[15px] pag-800">{credit?.business?.name || 'Business'}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div>

                                    <div className="flex items-center">

                                        <div className="space-y-[0.5rem]">
                                            <h3 className="font-mona-medium pas-950 text-[18px]">{displayValue(credit.currency, credit.value)} for {credit.months.total} month{credit.months.total > 1 ? 's' : ''}</h3>
                                            <div className="flex items-center gap-x-[1rem]">
                                                <h3 className="font-mona-light pag-600 text-[13px]">Code: {credit.code}</h3>
                                            </div>
                                        </div>

                                        <div className="ml-auto flex items-center gap-x-[1rem]">
                                            {
                                                loader &&
                                                <>
                                                    <span className="font-mona text-[14px] pag-600">Revoking</span>
                                                    <span className="loader sm primary"></span>
                                                </>
                                            }
                                        </div>

                                    </div>

                                    <Divider />

                                    <div className="flex items-center gap-x-[1rem]">
                                        <h4 className="">
                                            <span className="font-mona-light pag-500 text-[15px]">Starts At - </span>
                                            <span className="font-mona pag-800 text-[15px]">{helper.formatDate(credit.startAt, 'basic')}</span>
                                        </h4>
                                        <span>&nbsp; | &nbsp;</span>
                                        <h4 className="">
                                            <span className="font-mona-light pag-500 text-[15px]">Expires At - </span>
                                            <span className="font-mona pag-800 text-[15px]">{helper.formatDate(credit.expiresAt, 'basic')}</span>
                                        </h4>
                                    </div>

                                    <Divider />

                                    <div className="flex items-center gap-x-[0.5rem]">
                                        <span className="font-mona-light pag-500 text-[15px]">Status - </span>
                                        <Badge
                                            type={getStatusType(credit.status)}
                                            size="sm"
                                            display="badge"
                                            label={helper.capitalize(credit.status)}
                                            padding={{ y: 2, x: 12 }}
                                            font={{
                                                weight: 'medium',
                                                size: 11
                                            }}
                                            upper={true}
                                            close={false}
                                        />
                                        <div className="flex items-center ml-auto gap-x-[0.55rem]">
                                            <IconButton
                                                size="min-w-[2.3rem] min-h-[2.3rem]"
                                                className="bg-pacb-100 bgh-pacb-200 pacb-600"
                                                disable={loader}
                                                icon={{
                                                    type: 'feather',
                                                    name: 'rotate-ccw',
                                                    size: 14,
                                                }}
                                                onClick={(e) => {
                                                    getCredit(credit._id)
                                                }}
                                            />
                                            {
                                                credit.status !== CreditStatus.REVOKED &&
                                                <IconButton
                                                    size="min-w-[2.3rem] min-h-[2.3rem]"
                                                    className="bg-par-100 bgh-par-200 par-600"
                                                    disable={loader}
                                                    icon={{
                                                        type: 'feather',
                                                        name: 'x',
                                                        size: 14,
                                                    }}
                                                    onClick={(e) => handleRevoke(e)}
                                                />
                                            }
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </CardUI>

                        <CardUI padding={{ x: 2, y: 2 }}>
                            <div className="grid grid-cols-[45%_2%_45%] gap-x-[4%]">

                                <div>
                                    <div className="space-y-[0rem]">
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Subscription Plan - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{credit?.plan?.name || '---'}</h3>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Currency - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{displayCurrency(credit.currency)}</h3>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Months Total - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{credit.months.total} Month{credit.months.total > 1 ? 's' : ''}</h3>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Months Remaining - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{credit.months.remaining} Month{credit.months.remaining > 1 ? 's' : ''}</h3>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Granted By - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{credit.createdBy ? getFullname(credit.createdBy) : '---'}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <div className="min-h-[100%] w-[1px] bg-pag-200"></div>
                                </div>

                                <div>
                                    <div className="space-y-[0rem]">
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Mode Rule - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{helper.capitalize(credit?.rules?.mode || '---')}</h3>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Exhaust Rule - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{helper.capitalize(credit?.rules?.exhaust || '---')}</h3>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Last Consumed At - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{credit.consumedAt.last ? helper.formatDate(credit.consumedAt.last, 'basic') : '---'}</h3>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Next Consume At - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{credit.consumedAt.next ? helper.formatDate(credit.consumedAt.next, 'basic') : '---'}</h3>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center gap-x-[1rem]">
                                            <h3 className="font-mona-light pag-500 text-[15px]">Granted On - </h3>
                                            <h3 className="font-mona pas-950 text-[15px] ml-auto">{helper.formatDate(credit.createdAt, 'basic')}</h3>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </CardUI>

                    </>
                }

            </section>

        </>
    )
};

export default LibraryDetailsPage;
