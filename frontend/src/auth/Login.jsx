import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchToken = () => {
        const token = localStorage.getItem('token');
        if(token){
            window.location.href = '/admin/dashboard'
        }
    }

    useEffect(() => {
        fetchToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Please fill in both fields.');
            setLoading(false);
            return;
        }

        const loginRequest = new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post('http://localhost/barangay/backend/login.php', { email, password });
                if (res.data.status === 'success') {
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', JSON.stringify({ email, password }));
                    }
                    localStorage.setItem('qr', JSON.stringify(res.data.token));
                    window.location.href = '/qr';
                    resolve({ message: res.data.message });
                } else {
                    reject(new Error('Invalid email or password')); 
                }
            } catch (err) {
                reject(new Error('Network or server error')); 
            }
        });

        toast.promise(loginRequest, {
            loading: 'Logging in...',
            success: (data) => {
                return `${data.message} - Login Successful`;
            },
            error: (err) => {
                return `Error: ${err.message}`;
            },
        });

        setLoading(false); 
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-4 mt-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full p-4 mt-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="h-5 w-5 text-blue-500 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">Remember Me</label>
                    </div>

                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
