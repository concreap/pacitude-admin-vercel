import React, { useEffect, useState, useContext } from "react"
import TextInput from "../components/partials/inputs/TextInput";
import PasswordInput from "../components/partials/inputs/PasswordInput";
import SelectInput from "../components/partials/inputs/SelectInput";
import TextAreaInput from "../components/partials/inputs/TextAreaInput";
import PhoneInput from "../components/partials/inputs/PhoneInput";
import NumberInput from "../components/partials/inputs/NumberInput";
import CountryInput from "../components/partials/inputs/CountryInput";
import SearchInput from "../components/partials/inputs/SearchInput";
import FileInput from "../components/partials/inputs/FileInput";
import PinInput from "../components/partials/inputs/PinInput";
import WebfixCalendar from "../components/layouts/WebfixCalendar";
import DateInput from "../components/partials/inputs/DateInput";
import Modal from "../components/layouts/CustomModal";
import ForgotPasswordModal from "../components/partials/dialogs/ForgotPasswordModal";
import Alert from "../components/partials/alerts/Alert";
import Icon from "../components/partials/icons/Icon";
import RoundButton from "../components/partials/buttons/RoundButton";
import Button from "../components/partials/buttons/Button";

const Home = ({ }) => {

    useEffect(() => {

    }, [])


    return (
        <>
            <section className="section comp">

                <div style={{ width: '25%' }}>

                    <Button 
                        text="Get Started"
                        type="primary"
                        size="rg"
                        loading={false}
                        disabled={false}
                        fontSize={14}
                        lineHeight={16}
                        className="form-button"
                        icon={{
                            enable: true,
                            name: 'check',
                            size: 20,
                            loaderColor: 'primary'
                        }}
                        onClick={(e) => { }}
                    />

                </div>

            </section>

        </>
    )
};

export default Home;
