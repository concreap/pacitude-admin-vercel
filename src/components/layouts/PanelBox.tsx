import React, { useEffect, useState, useContext, CSSProperties, forwardRef, ForwardedRef, useImperativeHandle } from "react"
import RoundButton from "../partials/buttons/RoundButton";
import Icon from "../partials/icons/Icon";
import { IPanelBox } from "../../utils/interfaces.util";

const PanelBox = forwardRef((props: IPanelBox, ref: ForwardedRef<any>) => {

    const {
        title,
        animate = true,
        width = 442,
        children = <></>,
        onOpen = (e: any) => {},
        onClose = (e: any) => {}
    } = props;

    const [anitex, setAnitex] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false)

    useEffect(() => {

    }, [])

    const computeStyle = (type: 'open' | 'close' = 'open') => {

        let result: CSSProperties = {};

        result.width = `${width}px`;

        if (type === 'open') {
            if (anitex === false) {
                if (animate) {
                    result.WebkitTransform = `translateX(${width + 2}px)`;
                    result.MozTransform = `translateX(${width + 2}px)`;
                    result.transform = `translateX(${width + 2}px)`;
                }
            } else {
                result.WebkitTransform = `translateX(0px)`;
                result.MozTransform = `translateX(0px)`;
                result.transform = `translateX(0px)`;
            }
        }

        if (type === 'close') {

            if (animate) {
                result.WebkitTransform = `translateX(${width + 2}px)`;
                result.MozTransform = `translateX(${width + 2}px)`;
                result.transform = `translateX(${width + 2}px)`;
            }

            setAnitex(false)

        }

        return result;

    }

    const handleClose = (e: any) => {
        if (e) { e.preventDefault() }
        computeStyle('close');
        setTimeout(() => {
            setAnitex(false)
            setShow(false)
            onClose(e)
        }, 130)
    }

    const handleOpen = (e: any) => {
        if (e) { e.preventDefault() }
        computeStyle('open');
        setShow(true)
        setTimeout(() => {
            setAnitex(true)
            onOpen(e)
        }, 130)
    }

    // expose child component functions to parent component
    useImperativeHandle(ref, () => ({
        close: handleClose,
        open: handleOpen,
        isOpen: show
    }))

    return (
        <>
            <div className={`panel-box ${show ? '' : 'ui-hide'}`}>

                <div className={`panel`} style={computeStyle()}>

                    <div className="panel-head">
                        <h2 className="fs-18 mrgb0 font-hostgro-medium pas-950">{title}</h2>
                        <RoundButton
                            icon={<Icon type="polio" name="cancel" clickable={false} size={16} />}
                            className="ui-ml-auto"
                            clickable={true}
                            onClick={(e) => handleClose(e)}
                        />
                    </div>
                    <div className="ui-line bg-pag-50"></div>

                    <div className="panel-body">
                        {children}
                    </div>

                    <div className="panel-footer"></div>

                </div>

            </div>
        </>
    )
})

export default PanelBox;
