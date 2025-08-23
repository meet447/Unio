import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/AuthForm";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (!error) {
      navigate("/check-email");
    }
    
    setLoading(false);
  };

  return (
    <AuthForm 
      isRegister
      onSubmit={handleSubmit}
      loading={loading}
      email={email}
      password={password}
      fullName={fullName}
      setEmail={setEmail}
      setPassword={setPassword}
      setFullName={setFullName}
    />
  );
};

export default Register;
