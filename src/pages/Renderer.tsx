import React, { useEffect, useState, useContext } from "react"
import '../index.css'
import Placeholder from "../components/partials/Placeholder";
import Divider from "../components/partials/Divider";
import Icon from "../components/partials/icons/Icon";
import TextInput from "../components/partials/inputs/TextInput";
import TextAreaInput from "../components/partials/inputs/TextAreaInput";
import SelectInput from "../components/partials/inputs/SelectInput";
import SearchInput from "../components/partials/inputs/SearchInput";
import PasswordInput from "../components/partials/inputs/PasswordInput";
import NumberInput from "../components/partials/inputs/NumberInput";
import FileInput from "../components/partials/inputs/FileInput";
import Checkbox from "../components/partials/inputs/Checkbox";
import helper from "../utils/helper.util";
import { IFilterItem } from "../utils/interfaces.util";
import Filter from "../components/partials/drops/Filter";
import SearchFilter from "../components/partials/drops/SearchFilter";
import { talents } from "../_data/seed";
import Button from "../components/partials/buttons/Button";
import IconButton from "../components/partials/buttons/IconButton";
import LinkButton from "../components/partials/buttons/LinkButton";
import Badge from "../components/partials/badges/Badge";

const RendererPage = ({ }) => {

    useEffect(() => {

    }, [])

    return (
        <>
            <section className="section w-full h-[100vh] flex items-center justify-center">

                {/* <div className="w-[25%]">
                    <Placeholder width="w-[160px]"/>
                </div> */}

                {/* <div className="w-[25%]">
                    <Divider bg="bg-pag-200" />
                </div> */}

                {/* <div className="w-[25%]">
                    <Icon type="polio" name="search" size={16} clickable={false} />
                </div> */}

                {/* <div className="w-[25%]">
                    <TextInput
                        type="email"
                        size="sm"
                        showFocus={true}
                        autoComplete={false}
                        placeholder="Ex. you@example.com"
                        isError={false}
                        label={{
                            className: '',
                            fontSize: 13,
                            title: "Email Address"
                        }}
                        icon={{
                            enable: true,
                            position: 'left',
                            child: <Icon name="search" className="pacb-800" type="polio" size={16} />
                        }}
                        className=""
                        onChange={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <TextAreaInput
                        type="email"
                        showFocus={true}
                        autoComplete={false}
                        placeholder="Ex. you@example.com"
                        isError={false}
                        rows={10}
                        label={{
                            className: '',
                            fontSize: 13,
                            title: "Email Address"
                        }}
                        className=""
                        onChange={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <SelectInput
                        size="sm"
                        showFocus={true}
                        placeholder={{
                            enable: true,
                            value: 'Select'
                        }}
                        isError={false}
                        label={{
                            className: '',
                            fontSize: 13,
                            title: "Email Address"
                        }}
                        className=""
                        options={[
                            { name: 'Name', value: 'name' },
                            { name: 'Age', value: 'age' }
                        ]}
                        onSelect={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <SearchInput
                        size="sm"
                        showFocus={true}
                        placeholder="Search"
                        isError={false}
                        hasResult={false}
                        label={{
                            className: '',
                            fontSize: 13,
                            title: "Search Transactions"
                        }}
                        className=""
                        onChange={(e) => { }}
                        onSearch={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <PasswordInput
                        size="sm"
                        showFocus={true}
                        placeholder="Type here"
                        isError={false}
                        label={{
                            className: '',
                            fontSize: 13,
                            title: "Enter Password"
                        }}
                        className=""
                        onChange={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <NumberInput
                        size="sm"
                        showFocus={true}
                        autoComplete={false}
                        placeholder="Ex. 1000"
                        isError={false}
                        label={{
                            className: '',
                            fontSize: 13,
                            title: "Email Address"
                        }}
                        icon={{
                            enable: true,
                            position: 'left',
                            child: <Icon name="dollar-sign" className="pacb-800" type="feather" size={16} />
                        }}
                        className=""
                        onChange={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <FileInput
                        size="sm"
                        showFocus={true}
                        placeholder="Type here"
                        isError={false}
                        label={{
                            className: '',
                            fontSize: 13,
                            title: "Enter Password"
                        }}
                        className=""
                        onChange={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <Checkbox
                        id={'2347890987'}
                        size="sm"
                        checked={false}
                        label={{
                            title: helper.capitalize('Remember Me'),
                            className: '',
                            fontSize: '[13px]'
                        }}
                        onChange={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <Filter
                        ref={null}
                        size='sm'
                        className='la-filter'
                        placeholder="Code"
                        position="bottom"
                        menu={{
                            style: {},
                            search: true,
                            fullWidth: true,
                            limitHeight: 'lh-sm'
                        }}
                        items={
                            helper.listCountries().map((x) => {
                                return {
                                    label: x.phone,
                                    value: x.phone,
                                    image: `../../../images/flags/${x.code.toLowerCase()}.svg`
                                }
                            })
                        }
                        noFilter={false}
                        onChange={(data) => {

                        }}
                    />
                </div> */}

                <div className="w-[25%]">
                    <SearchFilter
                        ref={null}
                        size='sm'
                        className='la-filter'
                        placeholder="Search"
                        defaultValue={''}
                        noFilter={false}
                        items={
                            talents.map((x) => {
                                return {
                                    label: x.name,
                                    value: x.firstName.toLowerCase(),
                                    image: x.avatar
                                }
                            })
                        }
                        onChange={async (data) => {
                            
                        }}
                    />
                </div>

                {/* <div className="w-[25%]">
                    <Button
                        type="primary"
                        size="sm"
                        semantic="normal"
                        text={{
                            label: "New Application"
                        }}
                        className=""
                        icon={{
                            enable: true,
                            child: <Icon type="polio" name="plus" className="top-[0.01rem]" size={16} />
                        }}
                        onClick={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <IconButton
                        className="bg-goe-100"
                        size="min-w-[2.2rem] min-h-[2.2rem]"
                        active={true}
                        icon={{
                            name: 'eye',
                            type: 'feather',
                            size: 16
                        }}
                        onClick={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%]">
                    <LinkButton
                        className="ml-auto"
                        text={{
                            label: "Click Link",
                            className: 'text-[14px]',
                            weight: 'medium'
                        }}
                        icon={{
                            enable: true,
                            child: <Icon type="feather" name="chevron-right" size={15} className="pacb-900 top-[1px]" />
                        }}
                        onClick={(e) => { }}
                    />
                </div> */}

                {/* <div className="w-[25%] text-center space-x-[1.5rem]">
                    <Badge 
                        type="normal"
                        size="rg"
                        display="badge"
                        label="Badge"
                        upper={true}
                        close={false}
                    />
                    <Badge 
                        type="normal"
                        size="rg"
                        display="status"
                        label="Badge"
                        upper={true}
                        close={false}
                    />
                </div> */}

                {/* <div className="w-[65%] text-center flex items-center gap-[0.5rem]">
                    <div className="w-[80px] h-[80px] bg-pag-25 flex items-center justify-center">25</div>
                    <div className="w-[80px] h-[80px] bg-pag-50 flex items-center justify-center">50</div>
                    <div className="w-[80px] h-[80px] bg-pag-100 flex items-center justify-center">100</div>
                    <div className="w-[80px] h-[80px] bg-pag-200 flex items-center justify-center">200</div>
                    <div className="w-[80px] h-[80px] bg-pag-300 flex items-center justify-center">300</div>
                    <div className="w-[80px] h-[80px] bg-pag-400 flex items-center justify-center">400</div>
                    <div className="w-[80px] h-[80px] bg-pag-500 flex items-center justify-center color-white">500</div>
                    <div className="w-[80px] h-[80px] bg-pag-600 flex items-center justify-center color-white">600</div>
                    <div className="w-[80px] h-[80px] bg-pag-700 flex items-center justify-center color-white">700</div>
                    <div className="w-[80px] h-[80px] bg-pag-800 flex items-center justify-center color-white">800</div>
                    <div className="w-[80px] h-[80px] bg-pag-900 flex items-center justify-center color-white">900</div>
                    <div className="w-[80px] h-[80px] bg-pag-950 flex items-center justify-center color-white">950</div>
                </div> */}

            </section>
        </>
    )
};

export default RendererPage;
