import { Button } from "../components/ui/Button";
import { useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export function SignUp() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function handleSignUp() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/signup`, {
                username,
                password
            });
            console.log(response.data);
            alert("Sign Up Successful!");
            // Optionally clear fields or redirect
            if (usernameRef.current) usernameRef.current.value = '';
            if (passwordRef.current) passwordRef.current.value = '';

        } catch (error) {
            console.error("Sign Up failed:", error);
            alert("Sign Up failed. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    Create Your Account
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Join us to manage your content effortlessly.
                </p>

                <div className="space-y-5 mb-8">
                    <input
                        ref={usernameRef}
                        placeholder="Username"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                    <input
                        ref={passwordRef}
                        placeholder="Password"
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                </div>

                <Button
                    onClick={handleSignUp}
                    varaint="primary"
                    size="lg"
                    text="Sign Up"
                />

                <p className="mt-8 text-center text-gray-600 text-sm">
                    Already have an account? <a href="/signin" className="font-medium text-blue-600 hover:text-blue-800 transition">Sign In</a>
                </p>
            </div>
        </div>
    );
}