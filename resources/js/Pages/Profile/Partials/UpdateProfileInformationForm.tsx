import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { FormEventHandler } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PageProps{
    auth: {
        user: User;
    };
    [key: string]: any; // Index signature to allow additional properties
}

interface User {
    id: number; // Assuming id is a required field with this type
    name: string;
    email: string;
    matric_no: string;
    university: string;
    faculty: string;
    phone_no: string;
    email_verified_at?: string | null;
}

interface UpdateProfileInformationProps {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }: UpdateProfileInformationProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        matric_no: user.matric_no,
        university: user.university,
        faculty: user.faculty,
        phone_no: user.phone_no,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    const handleFacultyChange = (value: string) => {
        setData('faculty', value);
    };

    const handleUniversityChange = (value: string) => {
        setData('university', value);
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="matric_no" value="Matric No." />

                    <TextInput
                        id="matric_no"
                        type="text"
                        value={data.matric_no}
                        className="mt-1 block w-full"
                        autoComplete="matric_no"
                        isFocused={true}
                        onChange={(e) => setData('matric_no', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.matric_no} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                        value={data.email}
                        required
                        autoComplete="username"
                        disabled={true}
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone_no" value="Phone No." />
                    <PhoneInput
                        id="phone_no"
                        placeholder="Enter phone number"
                        value={data.phone_no}
                        onChange={(value) => setData('phone_no', value || '')}
                        defaultCountry="MY"  // Set the default country code, e.g., MY for Malaysia
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.phone_no} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="university" value="University" />
                    <Select onValueChange={handleUniversityChange} value={data.university}>
                        <SelectTrigger className="w-[575px]">
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
                        <SelectTrigger className="w-[575px]">
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

                    <InputError className="mt-2" message={errors.faculty} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
