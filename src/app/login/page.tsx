"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProviderClient"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogIn, Github } from "lucide-react"

export default function LoginPage() {
  const { signInWithGoogle, signInWithGithub, loading, firebaseUser, refreshProfile } = useAuth()
  const router = useRouter()

  const gotoAfterAuth = async () => {
    const p = await refreshProfile()
    if (!p) return router.replace("/onboarding")
    return router.replace(p.role === "teacher" ? "/teacher" : "/student")
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
      await gotoAfterAuth()
    } catch (err) {
      console.error(err)
    }
  }

  const handleGithub = async () => {
    try {
      await signInWithGithub()
      await gotoAfterAuth()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Sign in to CourseLLM</CardTitle>
          <CardDescription>Use Google or GitHub to continue — we'll only store the info needed for your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <Button onClick={handleGoogle} disabled={loading} size="lg">
              <LogIn className="mr-2" /> Sign in with Google
            </Button>
            <Button variant="outline" onClick={handleGithub} disabled={loading} size="lg">
              <Github className="mr-2" /> Sign in with GitHub
            </Button>
            {firebaseUser && (
              <div className="text-sm text-muted-foreground">Signed in as {firebaseUser.email}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
