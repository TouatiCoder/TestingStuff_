import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#9b87f5] via-[#7e69ab] to-[#1e90ff] p-2">
                <div className="w-full max-w-5xl flex bg-white/90 rounded-2xl shadow-xl overflow-hidden flex-col md:flex-row">
                    {/* Left Column (Form) */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
                        <div className="w-full max-w-sm mx-auto">
                            <h2 className="text-3xl font-bold mb-1 text-[#1A1F2C]">Sign In</h2>
                            <p className="text-neutral-gray mb-8">Use your email and password to sign in</p>
                            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <InputLabel htmlFor="email" value="Email" className="mb-1" />
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="m22 7-9.5 7L2 7"/></svg>
                                        </span>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-lg shadow-sm w-full placeholder-gray-400 focus:ring-2 focus:ring-[#9b87f5] focus:border-[#9b87f5]"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={handleOnChange}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                {/* Password Field */}
                                <div>
                                    <InputLabel htmlFor="password" value="Password" className="mb-1" />
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </span>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-lg shadow-sm w-full placeholder-gray-400 focus:ring-2 focus:ring-[#9b87f5] focus:border-[#9b87f5]"
                                            autoComplete="current-password"
                                            onChange={handleOnChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                                {/* Remember Checkbox */}
                                <div className="flex items-center mt-3">
                                    <Checkbox name="remember" value={data.remember} onChange={handleOnChange} id="remember" />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
                                </div>
                                {/* Submit Button & Links */}
                                <div>
                                    <PrimaryButton className="w-full mt-4 py-3 px-4 bg-[#1A1F2C] text-white rounded-lg hover:bg-[#7E69AB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b87f5] transition-all duration-200" disabled={processing}>
                                        Sign In
                                    </PrimaryButton>
                                </div>
                                <div className="flex items-center justify-between mt-4 text-sm">
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-[#1EAEDB] hover:underline font-medium"
                                        >
                                            Forgot the password?
                                        </Link>
                                    )}
                                    <span>
                                        <span className="text-gray-600">New? </span>
                                        <Link href={route('register')} className="text-[#1EAEDB] font-medium hover:underline">Sign up</Link>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* Right Column (Image) */}
                    <div className="hidden md:block md:w-1/2 bg-center bg-cover" 
                        style={{ backgroundImage: "url('/images/signin-image.jpeg')" }}
                        aria-label="Sign in illustration"
                    >
                        {/* Decorative image only */}
                        <img
                            src="/images/signin-image.jpeg"
                            alt="Sign in illustration"
                            className="w-full h-full object-cover"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}