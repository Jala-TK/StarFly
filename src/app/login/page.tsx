import LoginForm from "@/components/login/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login",
};

const LoginPage = () => {
  return (
    <LoginForm />
  );
};
export default LoginPage;