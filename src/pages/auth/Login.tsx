import React, { useEffect, useState, MouseEvent } from "react"
import TextInput from "../../components/partials/inputs/TextInput";
import PasswordInput from "../../components/partials/inputs/PasswordInput";
import Button from "../../components/partials/buttons/Button";
import LinkButton from "../../components/partials/buttons/LinkButton";
import helper from "../../utils/helper.util";
import { IAlert } from "../../utils/interfaces.util";
import AxiosService from "../../services/axios.service";
import { PasswordType, UserEnumType } from "../../utils/enums.util";
import storage from "../../utils/storage.util";
import CookieService from "../../services/cookie.service";
import { useNavigate } from 'react-router-dom'
import Alert from "../../components/partials/alerts/Alert";

const Login = ({ }) => {

    const navigate = useNavigate()

    const [login, setLogin] = useState({
        email: '',
        password: '',
        method: 'email',
        error: ''
    })
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<IAlert>({
        type: 'success',
        show: false,
        message: ''
    });

    useEffect(() => {

    }, [])

    const handleLogin = async (e: MouseEvent<HTMLAnchorElement>) => {

        e.preventDefault();

        if (!login.email) {
            setAlert({ ...alert, type: 'error', show: true, message: 'email is required' });
            setLogin({ ...login, error: 'email' })
        } else if (!login.password) {
            setAlert({ ...alert, type: 'error', show: true, message: 'password is required' });
            setLogin({ ...login, error: 'password' })
        } else {

            setLoading(true)
            const response = await AxiosService.call({
                type: 'identity',
                method: 'POST',
                path: '/auth/login',
                payload: { email: login.email, password: login.password, method: login.method }
            });

            if (!response.error) {

                if (response.status === 200) {

                    if (response.data.isUser && response.data.isActive) {

                        if (response.data.userType === UserEnumType.SUPER || response.data.userType === UserEnumType.ADMIN) {

                            // store auth credentials
                            storage.storeAuth(response.token!, response.data._id);

                            if (response.data.passwordType === PasswordType.SELF || response.data.passwordType === PasswordType.SELF_CHANGED) {

                                CookieService.setData({
                                    key: 'userType',
                                    payload: response.data.userType,
                                    expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                                    path: '/'
                                })

                                navigate('/dashboard')

                            }

                            if (response.data.passwordType === PasswordType.GENERATED) {

                            }

                        } else {
                            setAlert({ ...alert, type: 'error', show: true, message: 'incorrect login details' });
                        }

                    } else {
                        setAlert({ ...alert, type: 'error', show: true, message: 'account currently inactive.' });
                    }

                }

                if (response.status === 206) {

                }

            }

            if (response.error) {

                setLoading(false)

                if (response.errors.length > 0) {
                    setAlert({ ...alert, type: 'error', show: true, message: response.errors.join(',') });
                } else {
                    setAlert({ ...alert, type: 'error', show: true, message: response.message });
                }

            }

        }

        setTimeout(() => {
            setAlert({ ...alert, show: false });
            setLogin({ ...login, error: '' })
        }, 2000)

    }

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

                            <Alert className="mrgb1" type={alert.type} show={alert.show} message={alert.message} />

                            <div className="form-field">
                                <TextInput
                                    type="email"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Ex. you@example.com"
                                    isError={login.error === 'email' ? true : false}
                                    label={{
                                        required: true,
                                        fontSize: 14,
                                        title: "Email address"
                                    }}
                                    onChange={(e) => { setLogin({ ...login, email: e.target.value }) }}
                                />
                            </div>

                            <div className="form-field">
                                <PasswordInput
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Type Here"
                                    isError={login.error === 'password' ? true : false}
                                    label={{
                                        required: true,
                                        fontSize: 14,
                                        title: "Password"
                                    }}
                                    onChange={(e) => { setLogin({ ...login, password: e.target.value }) }}
                                />
                            </div>

                            <div className="ui-separate-mini mrgb"></div>

                            <div className="form-field">
                                <Button
                                    text="Login"
                                    type="primary"
                                    size="md"
                                    loading={loading}
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
                                    onClick={(e) => handleLogin(e)}
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
