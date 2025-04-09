'use client'

import AuthCard from "../components/AuthCard"
import RegisterForm from "./components/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthCard
      titleKey="auth.sign_up"
      descriptionKey="auth.create_account_description"
    >
      <RegisterForm />
    </AuthCard>
  )
}