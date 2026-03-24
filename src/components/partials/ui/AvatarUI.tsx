import React from "react"

interface IAvatarUI{
    url: string,
    width?: string,
    height?: string,
    radius?: string,
}

const AvatarUI = (props: IAvatarUI) => {

    const {
        url,
        width = 'min-w-[1.2rem]',
        height = 'min-h-[1.2rem]',
        radius
    } = props;

    return (
        <>
            <div
                className={`${width} ${height} bg-pag-100 inline-flex ${radius ? radius : 'rounded-full'} rounded-full full-bg bg-center ring ring-transparent`}
                style={{ backgroundImage: `url("${url}")` }}>
            </div>
        </>
    )
};

export default AvatarUI;
