import React, { FormEventHandler, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/Components/ui/select";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function CompleteProfile() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        matric_no: '',
        university: '',
        faculty: '',
        phone_no: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.complete'), {
            onFinish: () => reset('name', 'matric_no', 'university', 'faculty', 'phone_no'),
        });
    };

    const handleFacultyChange = (value: string) => {
        setData('faculty', value);
    };

    const handleUniversityChange = (value: string) => {
        setData('university', value);
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="matric_no" value="Matric No." />

                    <TextInput
                        id="matric_no"
                        type="text"
                        name="matric_no"
                        value={data.matric_no}
                        className="mt-1 block w-full"
                        autoComplete="matric_no"
                        isFocused={true}
                        onChange={(e) => setData('matric_no', e.target.value)}
                        required
                    />

                    <InputError message={errors.matric_no} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone_no" value="Phone No." />
                    <PhoneInput
                        id="phone_no"
                        placeholder="Enter phone number"
                        value={data.phone_no}
                        onChange={(value) => setData('phone_no', value || '')}
                        defaultCountry="MY"  // Set the default country code (e.g., MY for Malaysia)
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                    <InputError message={errors.phone_no} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="university" value="University" />
                    <Select onValueChange={handleUniversityChange} value={data.university}>
                        <SelectTrigger className="w-[400px]">
                            <SelectValue placeholder="Select your University" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="University Teknologi Malaysia (UTM)">University Teknologi Malaysia (UTM)</SelectItem>
                        </SelectContent>
                    </Select>

                    <InputError className="mt-2" message={errors.university} />
                </div>
                
                <div className="mt-4">
                    <InputLabel htmlFor="faculty" value="Faculty" />
                    <Select onValueChange={handleFacultyChange} value={data.faculty}>
                        <SelectTrigger className="w-[400px]">
                            <SelectValue placeholder="Select your Faculty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Faculty of Computing (FC)">Faculty of Computing (FC)</SelectItem>
                            <SelectItem value="Faculty of Build Environment (FABU)">Faculty of Build Environment and Surveying (FABU)</SelectItem>
                            <SelectItem value="Faculty of Chemical and Energy Engineering (FKT)">Faculty of Chemical and Energy Engineering (FKT)</SelectItem>
                            <SelectItem value="Faculty of Civil Engineering (FKA)">Faculty of Civil Engineering (FKA)</SelectItem>
                            <SelectItem value="Faculty of Mechanical Engineering (FKM)">Faculty of Mechanical Engineering (FKM)</SelectItem>
                            <SelectItem value="Faculty of Electrical Engineering (FKE)">Faculty of Electrical Engineering (FKE)</SelectItem>
                            <SelectItem value="Faculty of Science (FS)">Faculty of Science (FS)</SelectItem>
                            <SelectItem value="Faculty of Social Sciences and Humanities (FSSH)">Faculty of Social Sciences and Humanities (FSSH)</SelectItem>
                            <SelectItem value="Faculty of Management (FM)">Faculty of Management (FM)</SelectItem>
                            <SelectItem value="Faculty of Artificial Intelligence (FAI)">Faculty of Artificial Intelligence (FAI)</SelectItem>
                            <SelectItem value="Malaysia-Japan International Institute of Technology (MIJIT)">Malaysia-Japan International Institute of Technology (MIJIT)</SelectItem>
                            <SelectItem value="Azman Hashim International Business School (AHIBS)">Azman Hashim International Business School (AHIBS)</SelectItem>
                            <SelectItem value="UTMSPACE (School of Professional and Continuing Education)">UTMSPACE (School of Professional and Continuing Education)</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.faculty} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Complete Profile
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
