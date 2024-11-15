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

const Home = ({ }) => {

    useEffect(() => {

    }, [])


    return (
        <>
            <section className="section comp">

                <div style={{ width: '35%' }}>
                    {/* <Alert type="success" dismiss={true} /> */}
                    <Icon
                        type="polio"
                        name={'search'}
                        size={20}
                        clickable={true}
                        position="relative"
                        onClick={() => {}}
                    />
                </div>

            </section>

        </>
    )
};

export default Home;
