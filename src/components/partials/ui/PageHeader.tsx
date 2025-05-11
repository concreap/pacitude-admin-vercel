import React, { useEffect, useState, useContext, ReactNode } from "react"

interface IPageHeader{
    title: string,
    description?: string
    children?: ReactNode
}

const PageHeader = (props: IPageHeader) => {

    const {
        title,
        description = '',
        children = null
    } = props;

    useEffect(() => {

    }, [])
    return (
        <>
            <div className="page-header w-full flex items-center">

                <div>
                    <h2 className="font-mona text-[18px] pag-700">{ title }</h2>
                    <p className="font-mona text-[13px] pag-400">{ description }</p>
                </div>

                {
                    children &&
                    <div className="ml-auto">
                        {children}
                    </div>
                }

            </div>
        </>
    )
};

export default PageHeader;
