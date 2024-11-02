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

const Home = ({ }) => {

    useEffect(() => {

    }, [])

    return (
        <>
            <section className="section comp">

                <div style={{ width: '25%' }}>
                    <PinInput
                        type="password"
                        showFocus={true}
                        length={4}
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Enter your PIN"
                        }}
                        onChange={(pin) => { console.log(pin) }}
                    />
                </div>

            </section>
        </>
    )
};

export default Home;
