import React, { useEffect, useState, useContext } from "react"
import Divider from "../../components/partials/Divider";
import Alert from "../../components/partials/ui/AlertError";
import { IAlert } from "../../utils/interfaces.util";
import useGoTo from "../../hooks/useGoTo";
import FormField from "../../components/partials/inputs/FormField";
import TextInput from "../../components/partials/inputs/TextInput";
import PasswordInput from "../../components/partials/inputs/PasswordInput";
import Button from "../../components/partials/buttons/Button";
import LinkButton from "../../components/partials/buttons/LinkButton";
import useAuth from "../../hooks/app/useAuth";

const LoginPage = ({ }) => {

    const { goTo } = useGoTo()
    const { login } = useAuth()

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        method: 'email',
    })
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<IAlert>({
        name: '',
        type: 'success',
        show: false,
        message: ''
    });

    useEffect(() => {

    }, [])

    const handleLogin = async (e: any) => {

        if (e) { e.preventDefault(); }

        if (!loginData.email) {
            setAlert({ ...alert, type: 'error', show: true, name: 'email', message: 'email is required' });
        } else if (!loginData.password) {
            setAlert({ ...alert, type: 'error', show: true, name: 'password', message: 'password is required' });
        } else {

            setLoading(true);

            const response = await login({
                email: loginData.email,
                password: loginData.password,
                method: loginData.method as any
            })

            if (!response.error) {
                goTo('/dashboard')
            }

            if (response.error) {

                setLoading(false)

                if (response.errors.length > 0) {
                    setAlert({ ...alert, type: 'error', show: true, name: '', message: response.errors.join(',') });
                } else {
                    setAlert({ ...alert, type: 'error', show: true, name: '', message: response.message });
                }

            }

        }

        setTimeout(() => {
            setAlert({ ...alert, show: false, name: '' });
        }, 2000)

    }

    return (
        <>
            <section className="auth-page w-full h-[100vh] flex gap-x-0">

                <div className="left-halve w-[45%] px-[1.5rem] py-[1.5rem] h-full flex items-center flex-col pt-[5rem]">

                    <div className="w-full flex items-center justify-center min-h-[100px]">
                        <img src="../../../images/assets/logo.svg" className="w-[160px]" alt="logo.svg" />
                    </div>

                    <div className="w-[100%]">

                        <div className="text-center">
                            <h3 className="font-mona-medium text-[20px] pas-950">Welcome back!</h3>
                            <p className="mb-0 font-mona text-[16px] pag-800">Login to your admin account</p>
                        </div>

                        <Divider show={false} />

                        <div className="w-[55%] mx-auto my-0">

                            <Alert className="" type={alert.type} show={alert.show} message={alert.message} />

                            <FormField className="mb-[0.5rem]">
                                <TextInput
                                    type="email"
                                    size="rg"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Ex. you@example.com"
                                    isError={alert.name === 'email' ? true : false}
                                    label={{
                                        required: true,
                                        fontSize: 14,
                                        title: "Email address"
                                    }}
                                    onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }}
                                />
                            </FormField>

                            <FormField className="mb-[1rem]">
                                <PasswordInput
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="••••••••"
                                    isError={alert.name === 'password' ? true : false}
                                    label={{
                                        required: true,
                                        fontSize: 14,
                                        title: "Password"
                                    }}
                                    onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}
                                />
                            </FormField>

                            <Divider show={false} padding={{ top: 'pt-[0.6rem]', bottom: 'pb-[0.6rem]' }} />

                            <FormField className="mb-[1rem]">
                                <Button
                                    type="primary"
                                    size="md"
                                    loading={loading}
                                    disabled={false}
                                    block={true}
                                    className="form-button"
                                    text={{
                                        label: "Login",
                                        size: 15,
                                        weight: 'semibold'
                                    }}
                                    icon={{
                                        enable: true,
                                        child: <></>
                                    }}
                                    onClick={(e) => handleLogin(e)}
                                />
                            </FormField>

                            <FormField className="mb-[1rem] text-center pt-[1rem] pb-[1rem]">
                                <LinkButton
                                    text={{
                                        label: 'Forgot Password?',
                                        className: 'text-[14px]',
                                        weight: 'medium'
                                    }}
                                    disabled={false}
                                    loading={false}
                                    icon={{
                                        enable: false
                                    }}
                                    url=""
                                    onClick={(e) => { }}
                                />
                            </FormField>

                        </div>

                    </div>

                </div>
                <div className="right-halve w-[55%] pr-[1.5rem] py-[1.5rem] pl-0 h-full">
                    <div className="w-[100%] h-[100%] rounded-[20px]" style={{ backgroundColor: '#edf0f9' }}>

                    </div>
                </div>

            </section>
        </>
    )
};

export default LoginPage;
