import React, { useEffect, useImperativeHandle, forwardRef, useRef, useState, useContext } from "react"
import { IFileog, IFileUpload, IResourceContext } from "../../../utils/interfaces.util";
import ResourceContext from "../../../context/resource/resourceContext";

const Fileog = forwardRef((props: IFileog, ref) => {

    const {
        accept,
        type,
        sizeLimit = 5,
        onSelect
    } = props;

    const KILOBYTE = 1024;
    const fileLink = useRef<any>(null);

    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const [file, setFile] = useState<IFileUpload | null>(null);

    useEffect(() => {

    }, [])

    const openDialog = async (e: any) => {
        e.preventDefault();
        fileLink.current.click();
    }

    const getSize = (size: number): { KB: number, MB: number } => {

        const KB = parseFloat((size / KILOBYTE).toString())
        const MB = parseFloat((KB / 1000).toFixed(2))

        return { KB, MB };

    }

    const browseFile = (e: any) => {


        if (e.target.files && e.target.files[0]) {

            const fileSize = getSize(e.target.files[0].size);

            if (fileSize.MB > sizeLimit) {

                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    type: 'error',
                    message: `file cannot be more than ${sizeLimit}MB in size`
                })

            } else {

                getFileSource(e.target.files[0]);

            }

        }

        setTimeout(() => {
            resourceContext.setToast({ ...resourceContext.toast, show: false })
        }, 3500)
    }

    const getFileSource = (data: any) => {

        if (type !== 'image') {

            setFile({
                raw: data,
                name: data.name,
                size: data.size,
                type: data.type,
                base64: '',
                parsedSize: getSize(data.size).MB,
                dur: 0
            });

            onSelect({
                raw: data,
                name: data.name,
                size: data.size,
                type: data.type,
                base64: '',
                parsedSize: getSize(data.size).MB,
                dur: 0
            })

        } else {

            let reader = new FileReader();

            // as base64
            reader.onloadend = (e: any) => {

                setFile({
                    raw: data,
                    name: data.name,
                    size: data.size,
                    type: data.type,
                    base64: e.target.result,
                    parsedSize: getSize(data.size).MB,
                    dur: 0
                });
                
                onSelect({
                    raw: data,
                    name: data.name,
                    size: data.size,
                    type: data.type,
                    base64: e.target.result,
                    parsedSize: getSize(data.size).MB,
                    dur: 0
                })

            };
            reader.readAsDataURL(data);

        }

    }

    // expose child component functions to parent component
    useImperativeHandle(ref, () => ({
        open: openDialog,
        browse: browseFile,
    }))

    return (
        <>
            <input onChange={(e) => browseFile(e)} ref={fileLink} type="file" accept={accept.join(',')} className="ui-hide" />
        </>
    )
})

export default Fileog;
