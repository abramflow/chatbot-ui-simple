"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AutoAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Проверяем сессию
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          // Создаём гостевого пользователя (email: guest@chatbot.local)
          const guestEmail = "guest@chatbot.local"
          const guestPassword = "guest-password-12345"
          
          // Попытка входа
          let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: guestEmail,
            password: guestPassword,
          })

          // Если не получилось войти - создаём пользователя
          if (signInError) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: guestEmail,
              password: guestPassword,
              options: {
                data: {
                  username: "guest",
                  display_name: "Guest User"
                }
              }
            })

            if (signUpError) {
              console.error("Auto auth error:", signUpError)
              setIsReady(true)
              return
            }

            // После регистрации создаём профиль и workspace
            if (signUpData.user) {
              await createProfileAndWorkspace(signUpData.user.id)
            }
          } else if (signInData.session) {
            // Проверяем есть ли профиль
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", signInData.session.user.id)
              .single()

            if (!profile) {
              await createProfileAndWorkspace(signInData.session.user.id)
            }
          }
          
          router.refresh()
        }
        
        setIsReady(true)
      } catch (error) {
        console.error("Auto login error:", error)
        setIsReady(true)
      }
    }

    const createProfileAndWorkspace = async (userId: string) => {
      try {
        // Создаём профиль
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            username: `user${userId.slice(0, 8)}`,
            display_name: "Guest",
            has_onboarded: true // Пропускаем onboarding
          })

        if (profileError) {
          console.error("Profile creation error:", profileError)
        }

        // Создаём workspace
        const { error: workspaceError } = await supabase
          .from("workspaces")
          .insert({
            user_id: userId,
            name: "Home",
            is_home: true
          })

        if (workspaceError) {
          console.error("Workspace creation error:", workspaceError)
        }
      } catch (error) {
        console.error("Setup error:", error)
      }
    }

    autoLogin()
  }, [supabase, router])

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    )
  }

  return <>{children}</>
}

