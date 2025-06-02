import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaEnvelope,
    FaLinkedinIn,
    FaCode,
    FaRocket,
    FaBrain,
    FaLightbulb,
    FaSun,
    FaMoon
} from 'react-icons/fa';

export default function Welcome({ auth }) {
    const { canLogin, canRegister } = usePage().props;
    const [darkMode, setDarkMode] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const getActionRoute = () => {
        return auth.user ? route('dashboard') : route('login');
    };

    return (
        <>
            <Head title="Coding Made Effortless" />

            <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20"></div>
                    <div
                        className="absolute w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"
                        style={{
                            left: mousePosition.x - 192,
                            top: mousePosition.y - 192,
                            transition: 'all 0.3s ease-out'
                        }}
                    ></div>
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-bounce"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Navigation */}
                <nav className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300 ${
                    darkMode
                        ? 'bg-gray-900/80 border-gray-700/50'
                        : 'bg-white/80 border-gray-200/50'
                }`}>
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex justify-between items-center">
                            {/* Logo */}
                            <div className="flex items-center group">
                                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                    <FaCode className="text-white text-lg" />
                                </div>
                                <span className={`ml-3 text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent`}>
                                    CodeFuture
                                </span>
                            </div>

                            {/* Navigation Menu */}
                            <div className="hidden md:flex space-x-8">
                                {['Home', 'Features', 'Courses', 'Contact'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className={`relative group px-4 py-2 rounded-lg transition-all duration-300 ${
                                            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        {item}
                                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                    </a>
                                ))}
                            </div>

                            {/* Theme Toggle & Auth */}
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`p-2 rounded-xl transition-all duration-300 ${
                                        darkMode
                                            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {darkMode ? <FaSun /> : <FaMoon />}
                                </button>

                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex space-x-3">
                                        {canLogin && (
                                            <Link
                                                href={route('login')}
                                                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                                                    darkMode
                                                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                                                }`}
                                            >
                                                Login
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link
                                                href={route('register')}
                                                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Sign Up
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className={`inline-block p-3 rounded-2xl mb-8 backdrop-blur-sm border transition-all duration-500 transform ${
                                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            } ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'}`}>
                                <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    🚀 Welcome to the Future of Learning
                                </span>
                            </div>

                            <h1 className={`text-6xl md:text-8xl font-black mb-6 transition-all duration-700 delay-200 transform ${
                                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            } ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                                    Coding
                                </span>
                                <br />
                                <span className="relative">
                                    Made Effortless
                                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-2xl rounded-lg"></div>
                                </span>
                            </h1>

                            <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto transition-all duration-700 delay-400 transform ${
                                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            } ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Master coding skills with our{' '}
                                <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    AI-powered interactive learning platform
                                </span>
                                {' '}that adapts to your pace
                            </p>

                            <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-700 delay-600 transform ${
                                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                                <Link
                                    href={getActionRoute()}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-2xl text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25"
                                >
                                    <span className="relative z-10 flex items-center">
                                        Start Learning Now
                                        <FaRocket className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>

                                <button className={`px-8 py-4 font-bold rounded-2xl text-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                                    darkMode
                                        ? 'border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10'
                                        : 'border-gray-300 text-gray-700 hover:border-cyan-400 hover:text-cyan-600 hover:shadow-lg hover:shadow-cyan-500/10'
                                }`}>
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        {/* 3D Hero Image */}
                        <div className={`relative transition-all duration-1000 transform ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}>
                            <div className="relative mx-auto max-w-4xl">
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 blur-3xl rounded-3xl animate-pulse"></div>
                                <div className={`relative backdrop-blur-xl rounded-3xl border p-8 transform hover:rotate-1 transition-all duration-500 ${
                                    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
                                }`}>
                                    <img
                                        src="hero.svg"
                                        alt="Futuristic Coding Illustration"
                                        className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-6 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className={`text-5xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Explore Our{' '}
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Features
                                </span>
                            </h2>
                            <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Discover the benefits of our programming education platform through these revolutionary features
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Learn',
                                    description: 'Engage with interactive lessons and hands-on coding exercises in structured courses.',
                                    gradient: 'from-cyan-400 to-blue-500',
                                    icon: FaBrain,
                                    delay: '0'
                                },
                                {
                                    title: 'Earn',
                                    description: 'Unlock career opportunities, freelance potential, and earn certifications.',
                                    gradient: 'from-purple-400 to-pink-500',
                                    icon: FaRocket,
                                    delay: '200'
                                },
                                {
                                    title: 'Free',
                                    description: 'Enjoy free access to learning resources and open-source codes.',
                                    gradient: 'from-green-400 to-teal-500',
                                    icon: FaLightbulb,
                                    delay: '400'
                                }
                            ].map((feature, index) => (
                                <div
                                    key={feature.title}
                                    className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-700 transform hover:scale-105 hover:-rotate-1 ${
                                        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                    }`}
                                    style={{ transitionDelay: `${feature.delay}ms` }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>

                                    <div className="relative z-10 text-white">
                                        <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                            <feature.icon className="text-4xl" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                                        <p className="text-white/90 mb-8 leading-relaxed">
                                            {feature.description}
                                        </p>
                                        <Link
                                            href={getActionRoute()}
                                            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 group-hover:translate-x-2"
                                        >
                                            Get Started
                                            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                                        </Link>
                                    </div>

                                    {/* Floating particles */}
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                                    <div className="absolute bottom-8 left-8 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section id="courses" className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className={`text-5xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Explore Our{' '}
                                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                    Courses
                                </span>
                            </h2>
                            <p className={`text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Choose from a variety of courses designed to enhance your programming skills and advance your career
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { name: 'Web Development', image: 'web-development.png', color: 'from-blue-400 to-cyan-400' },
                                { name: 'Front-End Developer', image: 'frontend.png', color: 'from-green-400 to-blue-400' },
                                { name: 'Back-End Developer', image: 'backend.png', color: 'from-purple-400 to-pink-400' },
                                { name: 'Python', image: 'python.png', color: 'from-yellow-400 to-orange-400' }
                            ].map((course, index) => (
                                <div
                                    key={course.name}
                                    className={`group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 ${
                                        darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'
                                    } backdrop-blur-xl`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>

                                    <div className="relative p-6">
                                        <div className="mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} p-4 mx-auto flex items-center justify-center`}>
                                                <img
                                                    src={`/images/${course.image}`}
                                                    alt={course.name}
                                                    className="w-8 h-8 filter brightness-0 invert"
                                                />
                                            </div>
                                        </div>

                                        <h3 className={`text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${course.color} group-hover:bg-clip-text transition-all duration-300 ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {course.name}
                                        </h3>

                                        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Master the fundamentals and advanced concepts with hands-on projects.
                                        </p>

                                        <Link
                                            href={getActionRoute()}
                                            className={`inline-flex items-center font-semibold transition-all duration-300 group-hover:translate-x-2 ${
                                                darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'
                                            }`}
                                        >
                                            Enroll Now
                                            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                                        </Link>
                                    </div>

                                    {/* Hover effects */}
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Connect Section */}
                <section id="contact" className="py-20 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className={`text-5xl font-black mb-16 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Connect with{' '}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Us
                            </span>
                        </h2>

                        <div className="grid md:grid-cols-5 gap-8">
                            {[
                                { name: 'Facebook', icon: FaFacebookF, color: 'from-blue-500 to-blue-600' },
                                { name: 'Instagram', icon: FaInstagram, color: 'from-pink-500 to-purple-600' },
                                { name: 'Twitter', icon: FaTwitter, color: 'from-blue-400 to-cyan-400' },
                                { name: 'Email', icon: FaEnvelope, color: 'from-gray-500 to-gray-600'},
                                { name: 'LinkedIn', icon: FaLinkedinIn, color: 'from-blue-600 to-blue-700'}
                            ].map((social) => (
                                <div key={social.name} className="group">
                                    <div className={`relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 cursor-pointer`}>
                                        <social.icon className="text-white text-xl" />
                                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <h3 className={`font-bold mt-4 mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {social.name}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className={`py-12 px-6 border-t ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white/50 border-gray-200'} backdrop-blur-xl`}>
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <FaCode className="text-white text-sm" />
                            </div>
                            <span className="ml-2 font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                CodeFuture
                            </span>
                        </div>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            © 2024 CodeFuture. All rights reserved. Building the future of education.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
