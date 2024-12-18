import React, { useEffect, useState, useContext, CSSProperties } from "react"
import RoundButton from "../partials/buttons/RoundButton";
import Icon from "../partials/icons/Icon";
import { IPanelBox } from "../../utils/interfaces.util";

const PanelBox = (props: IPanelBox) => {

    const {
        show,
        title,
        animate = true,
        width = 442,
        children = <></>,
        closePanel
    } = props;

    const [anitex, setAnitex] = useState<boolean>(false)

    useEffect(() => {

        if (show && animate) {
            setTimeout(() => {
                setAnitex(true)
            }, 130)
        }

    }, [show])

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
            closePanel(e);
        }, 70)
    }

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
                        { children }
                    </div>

                    <div className="panel-footer"></div>

                </div>

            </div>
        </>
    )
};

export default PanelBox;
