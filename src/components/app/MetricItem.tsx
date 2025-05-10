import React, { ReactNode } from "react";
import { avatars } from "../../_data/seed";
import UserAvatar from "../partials/ui/UserAvatar";
import Icon from "../partials/icons/Icon";

interface IMetric {
    name: string,
    value: string,
    change?: string,
    changeType?: 'increase' | 'decrease',
    description?: string,
    stack?: boolean,
    isChange?: boolean
}

interface IMetricItem {
    metric: IMetric,
    className?: string,
}

const MetricItem = (props: IMetricItem) => {
    const {
        metric,
        className = '',
    } = props;
    return (
        <>
            <div
                className={`relative bg-white px-4 py-5 transition-colors duration-200 ${className}`}
            >

                <div>
                    <p className="truncate text-[13px] font-rethink pag-600">{metric.name}</p>
                    <div className="flex items-center">
                        <h3 className="font-uncut-bold text-[34px] pas-950">{metric.value}</h3>
                        <span className="pl-[0.5rem]"></span>
                        {
                            metric.stack &&
                            <div className="flex items-center flex-row">
                                <UserAvatar name="Sandra Booze" avatar={avatars[0].avatar} />
                                <UserAvatar name="Vivek Shunan" avatar={avatars[2].avatar} style={{ marginLeft: '-0.75rem' }} />
                                <UserAvatar name="Minho Barbaz" avatar={avatars[4].avatar} style={{ marginLeft: '-0.75rem' }} />
                                <UserAvatar name="+2" avatar={''} style={{ marginLeft: '-0.75rem' }} />
                            </div>
                        }
                        {
                            !metric.stack &&
                            <>
                                <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center ${metric.changeType === 'increase' ? 'bg-pagr-600' : 'bg-par-600'}`}>
                                    {metric.changeType === 'increase' && <Icon name="arrow-up" type="feather" className="color-white" /> }
                                    {metric.changeType === 'decrease' && <Icon name="arrow-down" type="polio" className="color-white" />}
                                </div>
                                {
                                    metric.isChange &&
                                    <>
                                        <span className="pl-[0.2rem]"></span>
                                        <span className={`font-rethink text-[14px] ${metric.changeType === 'increase' ? 'pagr-600' : 'par-600'}`}>{metric.change}</span>
                                    </>
                                }
                            </>
                        }

                    </div>
                    { metric.description && <p className="mt-1 font-rethink text-[12px] pag-500">{metric.description}</p> }
                </div>
            </div>
        </>
    )
}

export default MetricItem;
