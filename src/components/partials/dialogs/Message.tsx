import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IMessageCompProps } from '../../../utils/interfaces.util'
import Button from '../buttons/Button'
import Icon from '../icons/Icon'

const MessageComp = ({
    title,
    message, action, actionType,
    buttonText, setBg, bgColor,
    buttonPosition,
    icon,
    slim,
    slimer, className,
    displayTitle,
    displayMessage,
    titleColor,
    messageColor,
    messageWidth,
    buttonContainerWidth,
    msgColor,
    msgSize,
    titleSize,
    cardSize,
    status
}: Partial<IMessageCompProps>) => {

    const navigate = useNavigate()

    useEffect(() => {

    }, [])

    const fireAction = (e: any): void => {

        if (e) e.preventDefault();

        if (actionType === 'close') {
            action(e);
        } else {
            if (typeof (action) === 'string' && action) {
                navigate(action);
            } else {
                action(e)
            }

        }



    }

    return (
        <>
            <div className={`${slim ? 'pdl2 pdr2' : slimer ? 'pdl4 pdr4' : ''}`}>
                <div
                    className={`${className ? className : ''}`}
                    style={{ backgroundColor: setBg ? bgColor : 'transparent', padding: setBg ? '1.5rem 1.5rem' : '', borderRadius: setBg ? '1.5rem' : '' }}>

                    {
                        status && status === 'success' &&
                        <>
                            <div className='ui-text-center d-flex justify-content-center'>
                                <span className={`round-button bxxlg ${cardSize ? cardSize : 'xlg'} bg-color-success`}>
                                    <Icon
                                        clickable={false}
                                        type='feather'
                                        size={30}
                                        name='check'
                                        className='onwhite'
                                    />
                                </span>
                            </div>
                        </>
                    }

                    {
                        status && status === 'error' &&
                        <>
                            <div className='ui-text-center d-flex justify-content-center'>
                                <span className={`link-round ${cardSize ? cardSize : 'xlg'} bg-aliz`}>
                                    <i className='fe fe-x fs-30 onwhite'></i>
                                </span>
                            </div>
                        </>
                    }

                    {
                        status && status === 'info' &&
                        <>
                            <div className='ui-text-center d-flex justify-content-center'>
                                <span className={`link-round ${cardSize ? cardSize : 'xlg'} bg-cyan`} style={{ zIndex: 2 }}>
                                    <i className='fe fe-alert-circle fs-30 onwhite'></i>
                                </span>
                            </div>
                        </>
                    }

                    <div className="ui-text-center mrgt mrgb">
                        {
                            (displayTitle === undefined || displayTitle === true) &&
                            <h1 className={`${titleSize ? titleSize : 'fs-32'} font-golos-semibold mrgb0 mrgt1 pt-2 las-700`}>{title ? title : 'No Title'}</h1>
                        }

                        <div className='row mrgb2 mrgt1'>
                            <div className={`col-md-${messageWidth ? messageWidth : '7'} mx-auto`}>
                                <p className={`${msgSize ? msgSize : 'fs-15'} font-golos  mrgb0 ui-line-height ui-text-center ${msgColor ? msgColor : 'onblack'}`}>{message ? message : 'No Message'}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className={`col-md-${buttonContainerWidth ? buttonContainerWidth : '5'} mx-auto`}>

                                {
                                    buttonPosition === 'inside' &&
                                    <Button
                                        text={buttonText || ''}
                                        type="primary"
                                        size="rg"
                                        loading={false}
                                        disabled={false}
                                        block={true}
                                        fontSize={15}
                                        fontWeight={'medium'}
                                        lineHeight={16}
                                        className="form-button"
                                        icon={{
                                            enable: true,
                                            type: 'polio',
                                            name: 'nav-arrow-right',
                                            size: 16,
                                            style: { top: '1px' }
                                        }}
                                        onClick={(e) => fireAction(e)}
                                    />

                                }

                            </div>
                        </div>
                    </div>
                </div>

                {
                    buttonPosition === 'outside' &&

                    <div className='ui-text-center mrgt1'>
                        <Button
                            text={buttonText || ''}
                            type="primary"
                            size="rg"
                            loading={false}
                            disabled={false}
                            block={true}
                            fontSize={15}
                            fontWeight={'medium'}
                            lineHeight={16}
                            className="form-button"
                            icon={{
                                enable: true,
                                name: 'nav-arrow-right',
                                size: 18,
                                loaderColor: ''
                            }}
                            onClick={(e) => fireAction(e)}
                        />

                    </div>
                }
            </div>
        </>
    )

}

export default MessageComp