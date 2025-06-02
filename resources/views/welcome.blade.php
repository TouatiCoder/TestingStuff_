{{-- <!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>L-Earn Platform - Coding Made Effortless</title>

        <!-- Fonts -->
        <link href="https://fonts.bunny.net/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }

            /* Navigation */
            .navbar {
                position: fixed;
                top: 0;
                width: 100%;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 1rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 1000;
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            }

            .logo img {
                width: 60px;
                height: 60px;
                object-fit: contain;
            }

            .nav-links {
                display: flex;
                gap: 2rem;
            }

            .nav-link {
                text-decoration: none;
                color: #333;
                font-weight: 500;
                transition: color 0.3s ease;
            }

            .nav-link:hover {
                color: #667eea;
            }

            .auth-buttons {
                display: flex;
                gap: 1rem;
            }

            .btn {
                padding: 0.75rem 1.5rem;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                display: inline-block;
                text-align: center;
            }

            .btn-login {
                background: transparent;
                color: #333;
                border: 2px solid #333;
            }

            .btn-login:hover {
                background: #333;
                color: white;
            }

            .btn-signup {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: 2px solid transparent;
            }

            .btn-signup:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }

            /* Hero Section */
            .hero-section {
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 5%;
                max-width: 1400px;
                margin: 0 auto;
            }

            .hero-content {
                flex: 1;
                max-width: 600px;
                color: white;
            }

            .hero-title {
                font-size: 4rem;
                font-weight: 700;
                margin-bottom: 1rem;
                line-height: 1.1;
                background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .hero-subtitle {
                font-size: 1.25rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }

            .btn-primary {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                font-size: 1.1rem;
                padding: 1rem 2rem;
                box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
            }

            .btn-primary:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(79, 172, 254, 0.4);
            }

            .hero-visual {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .coding-illustration {
                width: 100%;
                max-width: 600px;
                height: 400px;
                background: url('images/hero-section.svg') no-repeat center;
                background-size: contain;
                position: relative;
            }

            /* Sections */
            .section {
                padding: 5rem 5%;
                max-width: 1400px;
                margin: 0 auto;
            }

            .section-title {
                font-size: 3rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 1.5rem;
                color: #333;
            }

            .section-description {
                font-size: 1.2rem;
                text-align: center;
                margin-bottom: 3rem;
                color: #666;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
            }

            /* Features Section */
            .features-section {
                background: white;
                border-radius: 20px;
                margin: 2rem 5%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            }

            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-top: 3rem;
            }

            .feature-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 2.5rem;
                border-radius: 20px;
                color: white;
                text-align: left;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .feature-card:nth-child(2) {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            }

            .feature-card:nth-child(3) {
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            }

            .feature-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            }

            .feature-title {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 1rem;
            }

            .feature-description {
                font-size: 1.1rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }

            .btn-feature {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(10px);
            }

            .btn-feature:hover {
                background: white;
                color: #333;
            }

            /* Courses Section */
            .courses-section {
                background: #f8fafc;
                border-radius: 20px;
                margin: 2rem 5%;
            }

            .courses-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 2rem;
                margin-top: 3rem;
            }

            .course-card {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .course-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            }

            .course-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 1.5rem;
                background: #f1f5f9;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .course-icon img {
                width: 50px;
                height: 50px;
                object-fit: contain;
            }

            .course-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #333;
            }

            .course-description {
                color: #666;
                margin-bottom: 2rem;
                line-height: 1.6;
            }

            .btn-course {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                width: 100%;
            }

            .btn-course:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }

            /* Contact Section */
            .contact-section {
                background: #1a202c;
                color: white;
                border-radius: 20px;
                margin: 2rem 5%;
            }

            .contact-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
                margin-top: 3rem;
            }

            .social-platform {
                text-align: center;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                transition: background 0.3s ease;
            }

            .social-platform:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .social-platform h4 {
                font-size: 1.2rem;
                margin-bottom: 0.5rem;
                color: #4facfe;
            }

            .social-platform p {
                color: #cbd5e0;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .navbar {
                    padding: 1rem;
                    flex-direction: column;
                    gap: 1rem;
                }

                .nav-links {
                    gap: 1rem;
                }

                .hero-section {
                    flex-direction: column;
                    text-align: center;
                    padding-top: 8rem;
                }

                .hero-title {
                    font-size: 2.5rem;
                }

                .hero-visual {
                    margin-top: 2rem;
                }

                .section {
                    padding: 3rem 1rem;
                }

                .section-title {
                    font-size: 2rem;
                }

                .features-grid,
                .courses-grid {
                    grid-template-columns: 1fr;
                }

                .contact-info {
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                }
            }

            /* Smooth scroll */
            html {
                scroll-behavior: smooth;
            }

            /* Loading animation */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .hero-content,
            .feature-card,
            .course-card {
                animation: fadeInUp 0.8s ease-out;
            }
        </style>
    </head>
    <body>
        <!-- Navigation Bar -->
        <nav class="navbar">
            <div class="logo">
                <img src="images/deep-learning.png" alt="L-Earn Platform Logo">
            </div>
            <div class="nav-links">
                <a href="#home" class="nav-link">Home</a>
                <a href="#features" class="nav-link">Features</a>
                <a href="#courses" class="nav-link">Courses</a>
                <a href="#contact" class="nav-link">Contact</a>
            </div>
            <div class="auth-buttons">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ route('dashboard') }}" class="btn btn-login">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="btn btn-login">Login</a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="btn btn-signup">Sign Up</a>
                        @endif
                    @endauth
                @endif
            </div>
        </nav>

        <!-- Hero Section -->
        <section id="home" class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">Coding Made Effortless</h1>
                <p class="hero-subtitle">Master coding skills with our interactive learning platform</p>

                @auth
                    <a href="{{ route('dashboard') }}" class="btn btn-primary">Start Learning Now</a>
                    @else
                    <a href="{{ route('login') }}" class="btn btn-primary">Start Learning Now</a>
                @endauth

            </div>
            <div class="hero-visual">
                <div class="coding-illustration"></div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="features-section section">
            <h2 class="section-title">Explore Our Features</h2>
            <p class="section-description">
                Discover the benefits of our programming education platform through these key features:
            </p>

            <div class="features-grid">
                <!-- Learn Feature -->
                <div class="feature-card">
                    <h3 class="feature-title">Learn</h3>
                    <p class="feature-description">
                        Engage with interactive lessons and hands-on coding exercises in structured courses.
                    </p>
                    <button class="btn btn-feature">Get Started</button>
                </div>

                <!-- Earn Feature -->
                <div class="feature-card">
                    <h3 class="feature-title">Earn</h3>
                    <p class="feature-description">
                        Unlock career opportunities, freelance potential, and earn certifications.
                    </p>
                    <button class="btn btn-feature">Discover More</button>
                </div>

                <!-- Free Feature -->
                <div class="feature-card">
                    <h3 class="feature-title">Free</h3>
                    <p class="feature-description">
                        Enjoy free access to learning resources and open-source codes.
                    </p>
                    <button class="btn btn-feature">Join Now</button>
                </div>
            </div>
        </section>

        <!-- Courses Section -->
        <section id="courses" class="courses-section section">
            <h2 class="section-title">Explore Our Courses</h2>
            <p class="section-description">
                Choose from a variety of courses to enhance your programming skills and advance your career.
            </p>

            <div class="courses-grid">
                <!-- Web Development Course -->
                <div class="course-card">
                    <div class="course-icon">
                        <img src="images/web-developpment.png" alt="Web Development">
                    </div>
                    <h3 class="course-title">Web Development</h3>
                    <p class="course-description">
                        Learn the fundamentals of web development and create stunning websites.
                    </p>
                    <button class="btn btn-course">Enroll Now</button>
                </div>

                <!-- Front-End Developer Course -->
                <div class="course-card">
                    <div class="course-icon">
                        <img src="images/frontend.png" alt="Front-End Developer">
                    </div>
                    <h3 class="course-title">Front-End Developer</h3>
                    <p class="course-description">
                        Master the art of frontend development with hands-on projects.
                    </p>
                    <button class="btn btn-course">Enroll Now</button>
                </div>

                <!-- Back-End Developer Course -->
                <div class="course-card">
                    <div class="course-icon">
                        <img src="images/backend.png" alt="Back-End Developer">
                    </div>
                    <h3 class="course-title">Back-End Developer</h3>
                    <p class="course-description">
                        Dive into backend development and learn to create robust solutions.
                    </p>
                    <button class="btn btn-course">Enroll Now</button>
                </div>

                <!-- Python Course -->
                <div class="course-card">
                    <div class="course-icon">
                        <img src="images/python.png" alt="Python">
                    </div>
                    <h3 class="course-title">Python</h3>
                    <p class="course-description">
                        Get started with Python programming and unlock endless possibilities.
                    </p>
                    <button class="btn btn-course">Enroll Now</button>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact-section section">
            <h2 class="section-title">Connect with Us</h2>

            <div class="contact-info">
                <div class="social-platform">
                    <h4>Facebook</h4>
                    <p>@l-earn_platform</p>
                </div>

                <div class="social-platform">
                    <h4>Instagram</h4>
                    <p>@l-earn_platform</p>
                </div>

                <div class="social-platform">
                    <h4>Twitter</h4>
                    <p>@l-earn_platform</p>
                </div>

                <div class="social-platform">
                    <h4>Email</h4>
                    <p>info@l-earn.com</p>
                </div>

                <div class="social-platform">
                    <h4>LinkedIn</h4>
                    <p>l-earn_platform</p>
                </div>
            </div>
        </section>

        <script>
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add scroll effect to navbar
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                }
            });
        </script>
    </body>
</html> --}}
