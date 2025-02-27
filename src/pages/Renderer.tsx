import React, { useEffect, useState, useContext } from "react"
import PasswordInput from "../components/partials/inputs/PasswordInput";
import TextInput from "../components/partials/inputs/TextInput";
import SelectInput from "../components/partials/inputs/SelectInput";
import TextAreaInput from "../components/partials/inputs/TextAreaInput";
import PhoneInput from "../components/partials/inputs/PhoneInput";
import NumberInput from "../components/partials/inputs/NumberInput";
import CountryInput from "../components/partials/inputs/CountryInput";
import SearchInput from "../components/partials/inputs/SearchInput";
import FileInput from "../components/partials/inputs/FileInput";
import PinInput from "../components/partials/inputs/PinInput";
import DateInput from "../components/partials/inputs/DateInput";
import CustomModal from "../components/layouts/CustomModal";
import ForgotPasswordModal from "../components/partials/dialogs/ForgotPasswordModal";
import RoundButton from "../components/partials/buttons/RoundButton";
import Icon from "../components/partials/icons/Icon";
import Button from "../components/partials/buttons/Button";
import LinkButton from "../components/partials/buttons/LinkButton";

const ComponentRender = ({ }) => {

    const [show, setShow] = useState<boolean>(true)

    useEffect(() => {

    }, [])

    const toggleShow = (e: any) => {
        if (e) { e.preventDefault() }

        setShow(!show)
    }

    return (
        <>

            <section className="section comp">

                {/* <div style={{ width: '25%' }}>
                    <LinkButton 
                        text="Get Started"
                        disabled={false}
                        size="rg"
                        lineHeight={16}
                        loading={false}
                        url=""
                        onClick={(e) => {}}
                        icon={{
                            enable: true,
                            name: 'nav-arrow-right',
                            size: 16,
                            style: {}
                        }}
                    />
                </div> */}

                {/* <div style={{ width: '25%' }}>
                    <TextInput
                        type="email"
                        showFocus={true}
                        autoComplete={false}
                        isError={false}
                        placeholder="Ex. you@example.com"
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Email address"
                        }}
                        onChange={(e) => { }}
                    />
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                {/* <div style={{ width: '25%' }}>
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
                </div> */}

                <div style={{ width: '25%' }}>
                    <DateInput
                        showFocus={true}
                        placeholder={{
                            value: 'Select Date',
                            enable: true
                        }}
                        time={{ enable: true }}
                        position="top"
                        label={{
                            required: true,
                            fontSize: 14,
                            title: "Start date"
                        }}
                        onChange={(calendar) => {
                            
                        }}
                    />
                </div>

                {/* <div style={{ width: '25%' }}>

                    <RoundButton
                        size="lg"
                        icon={<Icon type="polio" name="cancel" clickable={false} size={25} />}
                        className=""
                        clickable={true}
                        onClick={(e) => { }}
                    />

                </div> */}

                {/* <div style={{ width: '25%' }}>

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
                            loaderColor: ''
                        }}
                        onClick={(e) => {}}
                    />

                </div> */}

                {/* <form className="form" onSubmit={(e) => e.preventDefault()}>

                    <div className="form-field">
                        <div className="row">
                            <div className="col-6">
                                <TextInput
                                    type="email"
                                    showFocus={true}
                                    size="sm"
                                    autoComplete={false}
                                    placeholder="Ex. Sample Topic"
                                    isError={error === 'name' ? true : false}
                                    label={{
                                        required: true,
                                        fontSize: 13,
                                        title: "Topic name"
                                    }}
                                    onChange={(e) => { }}
                                />
                            </div>
                            <div className="col-6">
                                <TextInput
                                    type="email"
                                    showFocus={true}
                                    size="sm"
                                    autoComplete={false}
                                    placeholder="Ex. Sample Topic"
                                    isError={error === 'name' ? true : false}
                                    label={{
                                        required: true,
                                        fontSize: 13,
                                        title: "Topic name"
                                    }}
                                    onChange={(e) => { }}
                                />
                            </div>
                        </div>
                    </div>

                </form> */}

            </section>

            <ForgotPasswordModal
                show={false}
                flattened={true}
                title="Forgot Password"
                closeModal={toggleShow}
                slim="lg"
            />

            <CustomModal
                show={false}
                flattened={true}
                title="Modal Title"
                closeModal={() => { }}
                slim="lg"
                children={{
                    main: <>Help</>
                }}
            />

        </>
    )
};

export default ComponentRender;
