// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');
const themeToggle = document.getElementById('themeToggle');
const successMessage = document.getElementById('successMessage');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRememberedUsername();
    initTheme();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    themeToggle.addEventListener('click', toggleTheme);
    usernameInput.addEventListener('input', () => clearError('username'));
    passwordInput.addEventListener('input', () => clearError('password'));
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = btn.classList.contains('google') ? 'Google' : 'GitHub';
            alert(`${provider} login would redirect to ${provider} OAuth`);
        });
    });

    // Forgot password
    document.querySelector('.forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password reset link would be sent to your email');
    });

    // Sign up
    document.querySelector('.signup').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Redirecting to sign up page...');
    });
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.innerHTML = isPassword ? '<span>🙈</span>' : '<span>👁️</span>';
}

// Form Validation
function validateForm() {
    let isValid = true;

    // Validate Username
    const username = usernameInput.value.trim();
    if (!username) {
        showError('username', 'Username or email is required');
        isValid = false;
    } else if (username.length < 3) {
        showError('username', 'Username must be at least 3 characters');
        isValid = false;
    } else if (!isValidUsernameOrEmail(username)) {
        showError('username', 'Please enter a valid username or email');
        isValid = false;
    }

    // Validate Password
    const password = passwordInput.value;
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    return isValid;
}

// Check if input is valid username or email
function isValidUsernameOrEmail(input) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input)) return true;

    // Username validation (alphanumeric and underscores)
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(input);
}

// Show Error
function showError(field, message) {
    const errorElement = document.getElementById(`${field}Error`);
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    const inputElement = field === 'username' ? usernameInput : passwordInput;
    inputElement.style.borderColor = 'var(--error-color)';
}

// Clear Error
function clearError(field) {
    const errorElement = document.getElementById(`${field}Error`);
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    
    const inputElement = field === 'username' ? usernameInput : passwordInput;
    inputElement.style.borderColor = '';
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    // Clear previous errors
    clearError('username');
    clearError('password');

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Disable button during submission
    const submitBtn = loginForm.querySelector('.login-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
        // Simulate API call
        await simulateLogin({
            username: usernameInput.value.trim(),
            password: passwordInput.value,
            rememberMe: rememberMeCheckbox.checked
        });

        // Show success message
        showSuccessMessage();

        // Save username if remember me is checked
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedUsername', usernameInput.value.trim());
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        // Redirect after delay
        setTimeout(() => {
            alert('Login successful! Redirecting to dashboard...');
            // In a real app, you would redirect like:
            // window.location.href = '/dashboard';
        }, 1500);

    } catch (error) {
        showError('password', error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
}

// Simulate API call
function simulateLogin(credentials) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate server validation
            // In production, this would be a real API call
            const validUsers = [
                { username: 'demo', password: 'demo123' },
                { username: 'user@example.com', password: 'password123' },
                { username: 'testuser', password: 'test123' }
            ];

            const user = validUsers.find(u => 
                (u.username === credentials.username && u.password === credentials.password)
            );

            if (user) {
                resolve({
                    success: true,
                    message: 'Login successful',
                    token: 'jwt_token_here'
                });
            } else {
                reject(new Error('Invalid username or password'));
            }
        }, 1000);
    });
}

// Show Success Message
function showSuccessMessage() {
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update button
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
}

// Initialize Theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

// Load Remembered Username
function loadRememberedUsername() {
    const remembered = localStorage.getItem('rememberedUsername');
    if (remembered) {
        usernameInput.value = remembered;
        rememberMeCheckbox.checked = true;
    }
}

// Test Credentials Display (for demo purposes)
console.log('Test Credentials:');
console.log('Username: demo | Password: demo123');
console.log('Email: user@example.com | Password: password123');
console.log('Username: testuser | Password: test123');