import React, { useEffect, ReactElement, Fragment } from "react"
import Placeholder from "../../partials/Placeholder";

interface IOverview {
    title: string,
    loading: boolean,
    metrics: Array<{
        data: ReactElement,
        label: {
            pos: 'above' | 'below',
            text: string
        },
    }>
}

const Overview = (props: IOverview) => {

    const {
        title,
        metrics,
        loading
    } = props;

    const holders = new Array(4).fill(1);

    useEffect(() => {

    }, [])

    return (
        <>
            <div className="overview">

                <h3 className="font-hostgro pab-950 mrgb2 fs-14">{title}</h3>

                <div className="metrics">

                    {
                        loading && holders.map((ph, index) =>
                            <Fragment key={index}>
                                <div className="metric ui-line-height-small">
                                    <Placeholder height='14px' width="70px" radius={'100px'} bgColor='#bde7fa' animate={true} flex={true} />
                                    <Placeholder height='10px' width="60px" radius={'100px'} bgColor='#bde7fa' animate={true} />
                                </div>
                                {(index + 1) < holders.length && <div className="divider"></div>}
                            </Fragment>
                        )
                    }

                    {
                        !loading && metrics.length > 0 &&
                        <>
                            {
                                metrics.map((metric, index) =>
                                    <Fragment key={index}>
                                        <div className="metric">
                                            {metric.label.pos === 'above' && <span className="font-hostgro pab-800 fs-13">{metric.label.text}</span>}
                                            {metric.data}
                                            {metric.label.pos === 'below' && <span className="font-hostgro pab-800 fs-13">{metric.label.text}</span>}
                                        </div>
                                        {(index + 1) < metrics.length && <div className="divider"></div>}
                                    </Fragment>
                                )
                            }
                        </>
                    }

                </div>



            </div>
        </>
    )
};

export default Overview;
