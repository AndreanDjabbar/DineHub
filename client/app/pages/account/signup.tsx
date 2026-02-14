import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router";
import {
  FiMail,
  FiLock,
  FiUser,
} from "react-icons/fi";
import { BottomNavigation, TextInput, Button } from "~/components";
import { useRequest } from "~/hooks";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { 
    makeRequest: registerRequest,
    isSuccess,
    validationErrors: registrationValidationErrors,
    data: registerData,
    isLoading: registerLoading,
  } = useRequest();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await registerRequest({
      method: "POST",
      url: "http://localhost:4000/dinehub/api/auth/register",
      payload: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      const token = registerData?.data?.token;
      navigate(`/verify-otp?email=${formData.email}&token=${token}`);
    }
  }, [isSuccess, formData.email, navigate]);

  return (
    <div className="h-screen">
      <div className="h-[90vh] bg-gray-50 overflow-auto font-sans text-gray-900 px-6 py-6 flex flex-col ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-500">Sign up to get started!</p>
        </div>

        <div className="">
          <form className="flex-col flex gap-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Full Name
              </label>
              <div className="relative">
                <TextInput
                  type="text"
                  name="name"
                  error={registrationValidationErrors?.name}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  icon={FiUser}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
              <div className="relative">
                <TextInput
                  type="email"
                  name="email"
                  value={formData.email}
                  error={registrationValidationErrors?.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                  icon={FiMail}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative">
                <TextInput
                  type={"password"}
                  name="password"
                  error={registrationValidationErrors?.password}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  icon={FiLock}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <TextInput
                  type={"password"}
                  error={registrationValidationErrors?.confirmPassword}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  icon={FiLock}
                />
              </div>
            </div>

            <Button 
            type="submit" 
            isLoading={registerLoading} 
            isLoadingText="Signing Up..."
            text="Sign Up" />
          </form>

          {/* --- Footer: Login Link --- */}
          <div className="grow flex justify-center pb-4 mt-6">
            <p className="text-sm font-medium text-gray-500">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-red-600 font-bold hover:underline"
              >
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Signup;
