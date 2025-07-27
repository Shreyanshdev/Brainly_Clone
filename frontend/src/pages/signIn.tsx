import { Button } from "../components/ui/Button";
import { useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function SignIn() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function handleSignIn() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        // Basic client-side validation
        if (!username || !password) {
            alert("Please enter both username and password to sign in.");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/signin`, {
                username,
                password
            });

            const jwt = response.data.token;
            // Store the token securely (e.g., localStorage is fine for this context)
            localStorage.setItem("token", jwt);
            // Navigate to the dashboard upon successful sign-in
            navigate("/dashboard");

        } catch (error) {
            console.error("Sign In failed:", error);
            // Provide user feedback for failed sign-in
            alert("Sign in failed. Please check your credentials and try again.");
            // Optionally clear password field for security
            if (passwordRef.current) {
                passwordRef.current.value = '';
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    Welcome Back!
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Sign in to access your content.
                </p>

                <div className="space-y-5 mb-8">
                    <input
                        ref={usernameRef}
                        placeholder="Username"
                        type="text" // Explicitly set type
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                    <input
                        ref={passwordRef}
                        placeholder="Password"
                        type="password" // Essential for password fields
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                </div>

                <Button
                    onClick={handleSignIn}
                    varaint="primary"
                    size="lg" 
                    text="Sign In" 
                />

                <p className="mt-8 text-center text-gray-600 text-sm">
                    Don't have an account? <a href="/signup" className="font-medium text-blue-600 hover:text-blue-800 transition">Sign Up</a>
                </p>
            </div>
        </div>
    );
}