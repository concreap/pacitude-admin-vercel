import React, { useEffect, useState } from "react"
import { IResult } from "../../utils/interfaces.util";
import IconButton from "../partials/buttons/IconButton";
import Uploader from "../partials/dialogs/Uploader";

interface IImageUI {
    url?: string,
    className?: string,
    title: string
    onChange(data: IResult): void
}

const ImageUI = (props: IImageUI) => {

    const {
        url,
        title,
        className,
        onChange
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

    }, [])

    return (
        <>
            <div className={`${isOpen ? 'space-y-[0.65rem]' : ''} border bdr-pag-100 rounded-[8px] px-[0.5rem] py-[0.5rem]`}>

                <div className="flex items-center">
                    <div className="flex items-center grow gap-x-[1rem]">
                        <div className="min-h-[60px] min-w-[25%] rounded-[8px] full-bg" style={{ backgroundImage: `url("${url ? url : '../../../images/assets/bg@core_03.webp'}")` }}></div>
                        <span className="font-mona text-[15px] pag900-800">{ title }</span>
                    </div>
                    <div className="flex items-center gap-x-[1rem] ml-auto">

                        <IconButton
                            size="min-w-[1.8rem] min-h-[1.8rem]"
                            className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                            icon={{
                                type: 'feather',
                                name: isOpen ? 'chevron-up' : 'chevron-down',
                                size: 14,
                            }}
                            onClick={(e) => setIsOpen(!isOpen)}
                        />
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>

                    <Uploader
                        instant={false}
                        format="base64"
                        accept={['image/jpg', 'image/png', '.csv', 'application/pdf']}
                        onUpload={(data) => {
                            onChange(data)
                        }}
                    />

                </div>

            </div>
        </>
    )
};

export default ImageUI;
