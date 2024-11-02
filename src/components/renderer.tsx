import React, { useEffect, useState, useContext } from "react"
import PasswordInput from "./partials/inputs/PasswordInput";
import TextInput from "./partials/inputs/TextInput";
import SelectInput from "./partials/inputs/SelectInput";
import TextAreaInput from "./partials/inputs/TextAreaInput";
import PhoneInput from "./partials/inputs/PhoneInput";
import NumberInput from "./partials/inputs/NumberInput";
import CountryInput from "./partials/inputs/CountryInput";
import SearchInput from "./partials/inputs/SearchInput";
import FileInput from "./partials/inputs/FileInput";

const CompRender = ({ }) => {
    useEffect(() => {

    }, [])
    return (
        <>

            <section className="section comp">

                <div style={{ width: '25%' }}>
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

                <div style={{ width: '25%' }}>
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

                <div style={{ width: '25%' }}>
                    <SelectInput
                        showFocus={true}
                        placeholder={{
                            value: 'Choose',
                            enable: true
                        }}
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Password"
                        }}
                        options={[{ name: 'Male', value: 'male' }]}
                        onSelect={(e) => { }}
                    />
                </div>

                <div style={{ width: '25%' }}>
                    <TextAreaInput
                        showFocus={true}
                        autoComplete={false}
                        placeholder="Type here"
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Write your bio"
                        }}
                        onChange={(e) => { }}
                    />
                </div>

                <div style={{ width: '25%' }}>
                    <PhoneInput
                        showFocus={true}
                        autoComplete={false}
                        placeholder="Ex. 08137031202"
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Phone number"
                        }}
                        dropdown={{

                        }}
                        onSelect={(data) => { }}
                        onChange={(e) => { }}
                    />
                </div>

                <div style={{ width: '25%' }}>
                    <NumberInput
                        showFocus={true}
                        autoComplete={false}
                        step={'0.1'}
                        placeholder="Ex. 0.00"
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Enter amount"
                        }}
                        onChange={(e) => { }}
                    />
                </div>

                <div style={{ width: '25%' }}>
                    <CountryInput
                        showFocus={true}
                        autoComplete={false}
                        placeholder="Ex. 08137031202"
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Select counrty"
                        }}
                        dropdown={{
                            contryName: true,
                            countryCode: true
                        }}
                        onSelect={(data) => { }}
                    />
                </div>

                <div style={{ width: '25%' }}>
                    <SearchInput
                        showFocus={true}
                        autoComplete={false}
                        placeholder="Type Here"
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Search by name"
                        }}
                        onChange={(e) => { }}
                        onSearch={(e) => { }}
                    />
                </div>

                <div style={{ width: '25%' }}>
                    <FileInput
                        showFocus={true}
                        autoComplete={false}
                        placeholder="No file chosen"
                        file={{
                            name: '',
                            type: ''
                        }}
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Browse file"
                        }}
                        onChange={(e) => { }}
                    />
                </div>

            </section>


        </>
    )
};

export default CompRender;
