import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    useEffect(() => {
        return () => {
            reset('email');
        };
    }, []);

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#9b87f5] via-[#7e69ab] to-[#1e90ff] p-2">
                <div className="w-full max-w-5xl flex bg-white/90 rounded-2xl shadow-xl overflow-hidden flex-col md:flex-row">
                    {/* Left Column (Form) */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
                        <div className="w-full max-w-sm mx-auto">
                            <h2 className="text-3xl font-bold mb-1 text-[#1A1F2C]">Reset Password</h2>
                            <p className="text-neutral-gray mb-8">Enter your email to receive reset instructions</p>
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

                                {/* Submit Button */}
                                <div>
                                    <PrimaryButton className="w-full mt-4 py-3 px-4 bg-[#1A1F2C] text-white rounded-lg hover:bg-[#7E69AB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9b87f5] transition-all duration-200" disabled={processing}>
                                        Send Reset Link
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* Right Column (Image) */}
                    <div className="hidden md:block md:w-1/2 bg-center bg-cover" 
                        style={{ backgroundImage: "url('/images/resetPassword-image.jpeg')" }}
                        aria-label="Reset password illustration"
                    >
                        {/* Decorative image only */}
                        <img
                            src="/images/resetPassword-image.jpeg"
                            alt="Reset password illustration"
                            className="w-full h-full object-cover"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
