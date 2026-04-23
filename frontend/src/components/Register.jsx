import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import api from "../api";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", formData);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create Account"
      fields={[
        { name: "name", type: "text", label: "Name", placeholder: "Your name" },
        { name: "email", type: "email", label: "Email", placeholder: "you@example.com" },
        { name: "password", type: "password", label: "Password", placeholder: "Enter password" },
      ]}
      formData={formData}
      onChange={onChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      submitText="Register"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login"
    />
  );
};

export default Register;
