import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#9b87f5] via-[#7e69ab] to-[#1e90ff] p-2">
                <div className="w-full max-w-5xl flex bg-white/90 rounded-2xl shadow-xl overflow-hidden flex-col md:flex-row">
                    {/* Left Column (Form) */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6">
                        <div className="w-full max-w-sm mx-auto">
                            <h2 className="text-2xl font-bold mb-0.5 text-[#1A1F2C]">Create Account</h2>
                            <p className="text-neutral-gray mb-4">Join us and start your journey</p>
                            <form onSubmit={submit} className="space-y-3">
                                {/* Name Field */}
                                <div>
                                    <InputLabel htmlFor="name" value="Name" className="mb-0.5" />
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </span>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="pl-10 pr-3 py-2 bg-gray-100 border-0 rounded-lg shadow-sm w-full placeholder-gray-400 focus:ring-2 focus:ring-[#9b87f5] focus:border-[#9b87f5]"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={handleOnChange}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <InputLabel htmlFor="email" value="Email" className="mb-0.5" />
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="m22 7-9.5 7L2 7"/></svg>
                                        </span>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="pl-10 pr-3 py-2 bg-gray-100 border-0 rounded-lg shadow-sm w-full placeholder-gray-400 focus:ring-2 focus:ring-[#9b87f5] focus:border-[#9b87f5]"
                                            autoComplete="username"
                                            onChange={handleOnChange}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <InputLabel htmlFor="password" value="Password" className="mb-0.5" />
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </span>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="pl-10 pr-3 py-2 bg-gray-100 border-0 rounded-lg shadow-sm w-full placeholder-gray-400 focus:ring-2 focus:ring-[#9b87f5] focus:border-[#9b87f5]"
                                            autoComplete="new-password"
                                            onChange={handleOnChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="mb-0.5" />
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </span>
                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="pl-10 pr-3 py-2 bg-gray-100 border-0 rounded-lg shadow-sm w-full placeholder-gray-400 focus:ring-2 focus:ring-[#9b87f5] focus:border-[#9b87f5]"
                                            autoComplete="new-password"
                                            onChange={handleOnChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>

                                {/* Submit Button & Links */}
                                <div>
                                    <PrimaryButton className="w-full mt-2 py-2 px-4 bg-[#1A1F2C] text-white rounded-lg hover:bg-[#7E69AB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b87f5] transition-all duration-200" disabled={processing}>
                                        Create Account
                                    </PrimaryButton>
                                </div>
                                <div className="text-center text-sm">
                                    <span className="text-gray-600">Already have an account? </span>
                                    <Link href={route('login')} className="text-[#1EAEDB] font-medium hover:underline">Sign in</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* Right Column (Image) */}
                    <div className="hidden md:block md:w-1/2 bg-center bg-cover"
                        style={{ backgroundImage: "url('/images/signup-image.jpeg')" }}
                        aria-label="Sign up illustration"
                    >
                        {/* Decorative image only */}
                        <img
                            src="/images/signup-image.jpeg"
                            alt="Sign up illustration"
                            className="w-full h-full object-cover"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
