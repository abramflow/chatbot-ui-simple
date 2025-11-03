"use client"

import { ChatbotUISVG } from "@/components/icons/chatbotui-svg"
import { supabase } from "@/lib/supabase/browser-client"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const autoRedirect = async () => {
      try {
        let { data: { session } } = await supabase.auth.getSession()
        
        // Если нет сессии — автологин как guest
        if (!session) {
          const guestEmail = "guest@chatbot.local"
          const guestPassword = "guest-password-12345"
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: guestEmail,
            password: guestPassword,
          })

          if (error) {
            console.error("Auto login error:", error)
            setIsLoading(false)
            return
          }
          
          session = data.session
        }
        
        if (session) {
          // Получаем home workspace
          const { data: workspace } = await supabase
            .from("workspaces")
            .select("id")
            .eq("user_id", session.user.id)
            .eq("is_home", true)
            .single()

          if (workspace) {
            router.push(`/${workspace.id}/chat`)
          } else {
            setIsLoading(false)
          }
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Auto redirect error:", error)
        setIsLoading(false)
      }
    }

    autoRedirect()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex size-full flex-col items-center justify-center">
        <div className="text-2xl">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} />
      </div>

      <div className="mt-2 text-4xl font-bold">Chatbot UI</div>
      <div className="mt-4 text-lg text-gray-500">Инициализация...</div>
    </div>
  )
}
