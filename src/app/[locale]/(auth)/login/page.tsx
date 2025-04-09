'use client'

import AuthCard from "../components/AuthCard"
import LoginForm from "./components/LoginForm"


export default function LoginPage() {
  return (
    <AuthCard
      titleKey="auth.sign_in"
      descriptionKey="auth.welcome_back"
    >
      <LoginForm />
    </AuthCard>
  )
}