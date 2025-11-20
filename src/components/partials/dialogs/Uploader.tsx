import React, { useEffect, useState, useContext, useRef } from "react"
import Icon from "../icons/Icon";
import LinkButton from "../buttons/LinkButton";
import Fileog from "./Fileog";
import { UploadAcceptType, UploadFormat } from "../../../utils/types.util";
import { UIViewEnum } from "../../../utils/enums.util";
import { IFileUpload, IResult } from "../../../utils/interfaces.util";
import IconButton from "../buttons/IconButton";
import useUploader from "../../../hooks/app/useUploader";

interface IUploader {
    accept: UploadAcceptType,
    instant: boolean,
    title?: string,
    format: UploadFormat,
    className?: string,
    onUpload(data: IResult): void
}

const Uploader = (props: IUploader) => {

    const dialogRef = useRef<any>(null)

    const {
        instant,
        accept,
        title = "Drag and drop your file or ",
        format,
        className,
        onUpload
    } = props;

    const { uploadFile, loading } = useUploader()
    const [view, setView] = useState<string>(UIViewEnum.BROWSE)
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [file, setFile] = useState<IFileUpload | null>(null);
    const [form, setForm] = useState({
        type: 'image' as 'image' | 'pdf',
        error: 'There was an error uploading file'
    })

    useEffect(() => {

        if(accept.every((x) => x.includes('image'))){
            setForm({ ...form, type: 'image' })
        } else if(accept.every((x) => x.includes('pdf'))){
            setForm({ ...form, type: 'pdf' })
        }

    }, [accept])

    useEffect(() => {

        handleTrigger()

    }, [file])

    const czc = () => {

        let result = `flex flex-col items-center justify-center space-y-[0.5rem] w-[100%] rounded-[6px] bg-color-white text-center py-[1rem] relative`

        if (view === UIViewEnum.UPLOADED || loading) {
            result = result + ` min-h-[190px]`
        } else {
            result = result + ` min-h-[190px]`
        }

        if (isDragging) {
            result = result + ` border bdr-pacb-500`
        }

        return result;

    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const fileData = Array.from(e.dataTransfer.files);

        const fileSize = dialogRef?.current?.getSize(fileData[0]) || { KB: 0, MB: 0 };
        const ext = fileSize.MB > 0 ? 'MB' : fileSize.KB > 0 ? 'KB' : 'NA';

        if (fileData[0].type.includes('image')) {

            let reader = new FileReader();

            // as base64
            reader.onloadend = (e: any) => {

                setFile({
                    raw: fileData[0],
                    name: fileData[0].name,
                    size: fileData[0].size,
                    type: fileData[0].type,
                    base64: e.target.result,
                    parsedSize: fileSize.MB > 0 ? fileSize.MB : fileSize.KB,
                    sizeExt: ext,
                    dur: 0
                });

            };

            reader.readAsDataURL(fileData[0]);

        }

        else {

            setFile({
                raw: fileData[0],
                name: fileData[0].name,
                size: fileData[0].size,
                type: fileData[0].type,
                base64: '',
                parsedSize: fileSize.MB > 0 ? fileSize.MB : fileSize.KB,
                sizeExt: ext,
                dur: 0
            });

        }

    };

    const handleTrigger = () => {
        if (file && file !== null) {

            if (instant) {
                handleUpload()
            } else {
                setView(UIViewEnum.FILE_SELECTED)
            }

        }
    }

    const handleUpload = async (e?: any) => {

        if(e){ e.preventDefault() }

        const response = await uploadFile({
            type: form.type,
            format: format,
            file: file,
            name: ''
        })

        if(!response.error && response.status === 200){

            setView(UIViewEnum.UPLOADED);
            onUpload({
                error: response.error,
                data: response.data,
                message: response.message
            })

        } 
        
        else {

            setView(UIViewEnum.UPLOAD_ERROR);
            setForm({ ...form, error: response.message })
            onUpload({
                error: response.error,
                data: response.data,
                message: response.message
            })

        }

    }

    return (
        <>
            <Fileog
                ref={dialogRef}
                type="image"
                accept={accept}
                sizeLimit={8}
                onSelect={(file) => {
                    setFile(file)
                }}
            />
            <div className={`rounded-[10px] min-h-[100px] bg-pag-50 p-[0.5rem] ${className ? className : ''}`}>

                <div
                    onDragEnter={handleDragEnter}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={czc()}>

                    {
                        loading &&
                        <>
                            <span className="loader lg blue"></span>
                            <span className="font-mona text-[15px] pacb-800">uploading your file...</span>
                        </>
                    }

                    {
                        !loading &&
                        <>

                            {
                                view === UIViewEnum.BROWSE &&
                                <>

                                    <span className="flex items-center justify-center bg-pacb-100 w-[50px] h-[50px] rounded-full">
                                        <Icon name="upload" type="feather" className="pacb-600" size={20} />
                                    </span>

                                    <div>
                                        <div className="text-center">
                                            <span className="font-mona pacb-900 text-[15px]">{title}</span>
                                            <LinkButton
                                                text={{
                                                    label: 'browse',
                                                    className: 'text-[15px] pacb-600 underline',
                                                    weight: 'regular'
                                                }}
                                                disabled={false}
                                                loading={false}
                                                icon={{ enable: false }}
                                                url=""
                                                onClick={(e) => { dialogRef?.current?.open(e) }}
                                            />
                                            <span className="font-mona pacb-900 text-[15px]">to upload</span>
                                        </div>
                                        <span className="font-mona-light pag-300 text-[13px]">Images, PDFs and docs only. Max size, 10MB.</span>
                                    </div>

                                </>
                            }

                            {
                                view === UIViewEnum.FILE_SELECTED &&
                                <>

                                    <IconButton
                                        size="min-w-[1.6rem] min-h-[1.6rem]"
                                        className="bg-par-50 bgh-par-200 par-700 parh-700 ml-auto absolute right-[0.5rem]"
                                        icon={{
                                            type: 'feather',
                                            name: 'x',
                                            size: 14,
                                        }}
                                        onClick={(e) => {
                                            setFile(null)
                                            setView(UIViewEnum.BROWSE)
                                        }}
                                    />

                                    <span className="flex items-center justify-center bg-pacb-100 w-[50px] h-[50px] rounded-full">
                                        <Icon name="file" type="feather" className="pacb-600" size={20} />
                                    </span>

                                    <div className="space-y-[0.2rem]">
                                        <p className="font-mona pag-500 text-[14px]">File selected:</p>
                                        <p className="font-mona pag-700 text-[14px]">{file?.name || 'No Name'}</p>
                                    </div>

                                    <div>
                                        <LinkButton
                                            text={{
                                                label: 'Upload File',
                                                className: 'text-[15px] pacb-600 underline',
                                                weight: 'regular'
                                            }}
                                            disabled={false}
                                            loading={false}
                                            icon={{ enable: false }}
                                            url=""
                                            onClick={(e) => {
                                                handleUpload()
                                            }}
                                        />
                                    </div>

                                </>
                            }

                            {
                                view === UIViewEnum.UPLOADED &&
                                <>

                                    <span className="flex items-center justify-center bg-pagr-100 w-[50px] h-[50px] rounded-full">
                                        <Icon name="check" type="feather" className="pagr-700" size={20} />
                                    </span>

                                    <span className="font-mona pag-500 text-[15px]">File uploaded successfuly</span>

                                    <LinkButton
                                        text={{
                                            label: 'Ok, Got It',
                                            className: 'text-[14px] pacb-600 underline',
                                            weight: 'regular'
                                        }}
                                        disabled={false}
                                        loading={false}
                                        icon={{ enable: false }}
                                        url=""
                                        onClick={(e) => { 
                                            setFile(null)
                                            setForm({ ...form, error: '' })
                                            setView(UIViewEnum.BROWSE) 
                                        }}
                                    />

                                </>
                            }

                            {
                                view === UIViewEnum.UPLOAD_ERROR &&
                                <>

                                    <span className="flex items-center justify-center bg-par-100 w-[50px] h-[50px] rounded-full">
                                        <Icon name="x" type="feather" className="par-700" size={20} />
                                    </span>

                                    <span className="font-mona pag-500 text-[15px]">{ form.error }</span>

                                    <LinkButton
                                        text={{
                                            label: 'Ok, Got It',
                                            className: 'text-[14px] pacb-600 underline',
                                            weight: 'regular'
                                        }}
                                        disabled={false}
                                        loading={false}
                                        icon={{ enable: false }}
                                        url=""
                                        onClick={(e) => {
                                            setFile(null)
                                            setForm({ ...form, error: '' })
                                            setView(UIViewEnum.BROWSE)
                                        }}
                                    />

                                </>
                            }


                        </>
                    }


                </div>

            </div>
        </>
    )
};

export default Uploader;
