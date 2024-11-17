import React, { useEffect, useState, useContext } from "react"
import TextInput from "../../components/partials/inputs/TextInput";
import PasswordInput from "../../components/partials/inputs/PasswordInput";
import Button from "../../components/partials/buttons/Button";
import LinkButton from "../../components/partials/buttons/LinkButton";
import helper from "../../utils/helper.util";

const Login = ({ }) => {

    useEffect(() => {

    }, [])

    return (
        <>
            <section className="auth-page auth-login">

                <div className="halve left-halve ui-relative">

                    <div className="logo-box">
                        <img src="../../../images/assets/logo.svg" className="logo" alt="logo.svg" />
                    </div>

                    <div className="auth-caption ui-text-center">
                        <h3 className="font-hostgro-medium fs-20 color-black mrgb0">Welcome back!</h3>
                        <div className="mrgb"></div>
                        <p className="mrgb0 fs-14 pag-700">Login to your admin account</p>
                    </div>

                    <div className="ui-separate small"></div>

                    <form className="form" onSubmit={(e) => e.preventDefault()}>

                        <div className="auth-form">

                            <div className="form-field">
                                <TextInput
                                    type="email"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Ex. you@example.com"
                                    label={{
                                        required: true,
                                        fontSize: 14,
                                        title: "Email address"
                                    }}
                                    onChange={(e) => { }}
                                />
                            </div>

                            <div className="form-field">
                                <PasswordInput
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Type Here"
                                    label={{
                                        required: true,
                                        fontSize: 14,
                                        title: "Password"
                                    }}
                                    onChange={(e) => { }}
                                />
                            </div>

                            <div className="ui-separate-mini mrgb"></div>

                            <div className="form-field">
                                <Button
                                    text="Get Started"
                                    type="primary"
                                    size="md"
                                    loading={false}
                                    disabled={false}
                                    block={true}
                                    fontSize={15}
                                    lineHeight={16}
                                    className="form-button"
                                    icon={{
                                        enable: true,
                                        name: 'nav-arrow-right',
                                        size: 18,
                                        loaderColor: ''
                                    }}
                                    onClick={(e) => { }}
                                />
                            </div>

                            <div className="form-field ui-text-center mrgt1 pdt pdb">
                                <LinkButton
                                    text="Forgot Password?"
                                    disabled={false}
                                    lineHeight={16}
                                    loading={false}
                                    icon={{
                                        enable: false
                                    }}
                                    url=""
                                    onClick={(e) => { }}
                                />
                            </div>

                        </div>


                    </form>

                    <div className="ui-text-center ui-absolute auth-footer" style={{ bottom: '1.5rem' }}>
                        <LinkButton
                            text="Create Your Account"
                            disabled={false}
                            lineHeight={16}
                            loading={false}
                            icon={{
                                enable: true,
                                name: 'nav-arrow-right'
                            }}
                            url=""
                            onClick={(e) => { }}
                        />
                        <div className="font-hostgro copyright">
                            <span className="pag-400 fs-13 pdr">
                                Copyright&copy;{helper.currentDate().getFullYear()},
                            </span>
                            <LinkButton
                                text="Concreap Technologies"
                                disabled={false}
                                lineHeight={16}
                                loading={false}
                                color="pag-400"
                                icon={{
                                    enable: false
                                }}
                                newtab={true}
                                url="https://concreap.com"
                            />
                        </div>
                    </div>

                </div>

                <div className="halve right-halve">

                    <div className="auth-board">

                    </div>

                </div>

            </section>
        </>
    )

};

export default Login;
