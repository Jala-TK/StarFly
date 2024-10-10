import RegisterForm from "@/components/(auth)/register/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro",
  description: "Registrar um novo usuário",
};

const LoginPage = () => {
  return (
    <RegisterForm />
  );
};
export default LoginPage;