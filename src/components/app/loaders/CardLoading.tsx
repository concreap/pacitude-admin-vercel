import React, { useEffect, useState, useContext, Fragment } from "react"
import { ResourceType } from "../../../utils/types.util";
import Placeholder from "../../partials/Placeholder";
import Divider from "../../partials/Divider";
import CardUI from "../../partials/ui/CardUI";

interface ICardLoading {
    type: ResourceType | 'task' | 'default' | 'plan',
    size: number
}

const CardLoading = (props: ICardLoading) => {

    const {
        type,
        size
    } = props;

    const list = Array(size).fill(null)

    useEffect(() => {

    }, [])

    return (
        <>

            {
                type === 'task' &&
                list.map((_, index) =>
                    <Fragment key={index + 1}>

                        <CardUI padding={{ x: 1.5, y: 1.3 }}>
                            <div className="flex items-center min-h-[70px]">
                                <div className="flex items-center gap-x-[2rem]">
                                    <Placeholder width="min-w-[140px]" height="h-[86px] min-h-[86px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                                    <div className="space-y-[0.67rem]">
                                        <Placeholder block={true} width="min-w-[350px]" height="h-[18px] min-h-[18px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="min-w-[200px]" height="h-[12px] min-h-[12px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    </div>
                                </div>

                                <Placeholder width="min-w-[150px]" className="ml-auto" height="h-[45px] min-h-[45px]" radius={'rounded-[10px]'} bgColor="bg-pag-100" />
                            </div>

                            <div className="py-[0.3rem]">
                                <Divider />
                            </div>

                            <div className="flex items-center min-h-[70px]">
                                <Placeholder width="min-w-[21px]" className="grow" height="h-[35px] min-h-[35px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                                <div className="h-[40px] w-[1px] mx-[4%] bg-pag-200"></div>
                                <Placeholder width="min-w-[21px]" className="grow" height="h-[35px] min-h-[35px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                                <div className="h-[40px] w-[1px] mx-[4%] bg-pag-200"></div>
                                <Placeholder width="min-w-[21px]" className="grow" height="h-[35px] min-h-[35px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                                <div className="h-[40px] w-[1px] mx-[4%] bg-pag-200"></div>
                                <Placeholder width="min-w-[21px]" className="grow" height="h-[35px] min-h-[35px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                            </div>
                        </CardUI>

                        <Divider show={false} />

                        <div className="grid grid-cols-2 gap-x-[1.5rem]">

                            <CardUI className="space-y-[2rem]">

                                <div className="flex items-center">
                                    <Placeholder width="min-w-[150px]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    <Placeholder width="min-w-[100px]" className="ml-auto" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                </div>

                                <div className="flex items-center gap-x-[3.5rem]">

                                    <Placeholder width="min-w-[186px]" height="h-[186px] min-h-[186px]" radius={'rounded-full'} bgColor="bg-pag-100" />

                                    <div className="space-y-[1rem] grow">
                                        <Placeholder width="w-[230px]" block={true} height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="w-[200px]" block={true} height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="w-[180px]" block={true} height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    </div>

                                </div>

                            </CardUI>

                            <CardUI className="space-y-[0.5rem]">

                                <div className="flex items-center">
                                    <Placeholder width="min-w-[150px]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    <Placeholder width="min-w-[100px]" className="ml-auto" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                </div>

                                <Divider show={false} />

                                <div>
                                    <div className="flex items-center gap-x-[3.5rem]">
                                        <Placeholder width="w-[230px]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="w-[130px]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    </div>

                                    <Divider />
                                    <div className="flex items-center gap-x-[3.5rem]">
                                        <Placeholder width="w-[230px]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="w-[130px]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    </div>

                                    <Divider />
                                    <div className="flex items-center gap-x-[3.5rem]">
                                        <Placeholder width="w-[230px]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="w-[130px]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    </div>

                                </div>

                            </CardUI>

                        </div>


                    </Fragment>
                )
            }

            {
                type === 'default' &&
                list.map((_, index) =>
                    <Fragment key={index + 1}>

                        <CardUI padding={{ x: 1.5, y: 1.3 }}>
                            <div className="flex items-center min-h-[70px]">
                                <div className="flex items-center gap-x-[2rem]">
                                    <div className="space-y-[0.67rem]">
                                        <Placeholder block={true} width="min-w-[350px]" height="h-[18px] min-h-[18px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="min-w-[200px]" height="h-[12px] min-h-[12px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    </div>
                                </div>

                                <Placeholder width="min-w-[150px]" className="ml-auto" height="h-[45px] min-h-[45px]" radius={'rounded-[10px]'} bgColor="bg-pag-100" />
                            </div>
                        </CardUI>

                        <Divider show={false} />

                        <CardUI flat={true} padding={{ x: 1.5, y: 1.3 }}>
                            <div className="grid grid-cols-[65%_35%] gap-0">

                                <div className="px-[1.5rem] py-[1.3rem] ">

                                    <div className="flex items-center gap-x-[2rem]">
                                        <Placeholder width="min-w-[200px]" height="h-[12px] min-h-[12px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="min-w-[100px]" height="h-[12px] min-h-[12px]" radius={'rounded-full'} bgColor="bg-pag-100" className="ml-auto" />
                                    </div>

                                    <Divider show={false} padding={{ enable: true }} />

                                    <div className="space-y-[0.3rem]">
                                        <Placeholder block={true} height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        <Placeholder width="min-w-[85%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    </div>

                                    <Divider show={true} />

                                    <div className="space-y-[1.5rem]">
                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[30px]" height="min-h-[30px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder width="min-w-[65%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>
                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[30px]" height="min-h-[30px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder width="min-w-[75%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>
                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[30px]" height="min-h-[30px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder width="min-w-[70%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>
                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[30px]" height="min-h-[30px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder width="min-w-[70%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>
                                    </div>

                                </div>

                                <div className="min-h-[25vh] border-l bdr-pag-100 px-[1.5rem] py-[1.3rem]">

                                    <div className="flex items-center gap-x-[2rem]">
                                        <Placeholder width="min-w-[150px]" height="h-[12px] min-h-[12px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                    </div>

                                    <Divider show={false} padding={{ enable: true, top: 'pt-[2rem]', bottom: 'pb-[2rem]' }} />

                                    <div className="space-y-[1.8rem]">
                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[20%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder className="ml-auto" width="min-w-[40%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>

                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[20%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder className="ml-auto" width="min-w-[50%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>

                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[20%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder className="ml-auto" width="min-w-[40%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>
                                    </div>

                                    <Divider show={true} padding={{ enable: true, top: 'pt-[2rem]', bottom: 'pb-[2rem]' }} />

                                    <div className="space-y-[1.8rem]">
                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[20%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder className="ml-auto" width="min-w-[40%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>

                                        <div className="flex items-center gap-x-[2rem]">
                                            <Placeholder width="min-w-[20%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                            <Placeholder className="ml-auto" width="min-w-[50%]" height="h-[10px] min-h-[10px]" radius={'rounded-full'} bgColor="bg-pag-100" />
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </CardUI>


                    </Fragment>
                )
            }

            {
                type === 'career' &&
                list.map((_, index) =>
                    <Fragment key={index + 1}>

                        <div className="flex items-center min-h-[70px]">
                            <Placeholder width="min-w-[21px]" className="grow" height="h-[60px] min-h-[60px]" radius={'rounded-[10px]'} bgColor="bg-pag-100" />
                            <div className="h-[40px] w-[1px] mx-[4%] bg-pag-200"></div>
                            <Placeholder width="min-w-[21px]" className="grow" height="h-[60px] min-h-[60px]" radius={'rounded-[10px]'} bgColor="bg-pag-100" />
                        </div>

                        <div className="py-[0.3rem]">
                            <Divider />
                        </div>

                        <div className="flex items-center min-h-[70px]">
                            <Placeholder width="min-w-[21px]" className="grow" height="h-[35px] min-h-[35px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                            <div className="h-[40px] w-[1px] mx-[4%] bg-pag-200"></div>
                            <Placeholder width="min-w-[21px]" className="grow" height="h-[35px] min-h-[35px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                            <div className="h-[40px] w-[1px] mx-[4%] bg-pag-200"></div>
                            <Placeholder width="min-w-[21px]" className="grow" height="h-[35px] min-h-[35px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                            <div className="h-[40px] w-[1px] mx-[4%] bg-pag-200"></div>
                            <Placeholder width="min-w-[21px]" className="grow" height="h-[35px] min-h-[35px]" radius={'rounded-[6px]'} bgColor="bg-pag-100" />
                        </div>

                    </Fragment>
                )
            }

        </>
    )
};

export default CardLoading;
