import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import api from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
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
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Welcome Back"
      fields={[
        { name: "email", type: "email", label: "Email", placeholder: "you@example.com" },
        { name: "password", type: "password", label: "Password", placeholder: "Enter password" },
      ]}
      formData={formData}
      onChange={onChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      submitText="Login"
      footerText="Need an account?"
      footerLink="/register"
      footerLinkText="Register"
    />
  );
};

export default Login;
