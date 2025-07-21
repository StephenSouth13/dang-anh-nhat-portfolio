"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, MessageSquare, Send, X, Sparkles, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils" // Giả sử bạn có hàm tiện ích này từ shadcn/ui

interface Message {
  role: "user" | "assistant"
  content: string
}

// --- DỮ LIỆU MOCKUP MỚI - DỰA TRÊN CV CỦA ĐẶNG ANH NHẬT ---
const mockResponses = {
  vn: {
    "giới thiệu về đặng anh nhật":
      "Đặng Anh Nhật là một cá nhân năng động, sáng tạo và đầy nhiệt huyết trong lĩnh vực Marketing - Truyền thông. Anh ấy luôn mong muốn được cống hiến sức trẻ và học hỏi để hoàn thiện kỹ năng, tìm kiếm cơ hội phát triển sự nghiệp.",
    "kỹ năng của nhật là gì?":
      "Nhật có nhiều kỹ năng đa dạng, bao gồm:\n- **Video & Sáng tạo:** Edit video (CapCut, Premiere, After Effect), kỹ năng lập kế hoạch và viết bài truyền thông, sáng tạo content.\n- **Kỹ năng mềm:** Lãnh đạo đội nhóm, xử lý khủng hoảng truyền thông, và sẵn sàng học hỏi, thích nghi nhanh.\n- **Công cụ:** Sử dụng tốt Word, Excel, PowerPoint và ứng dụng AI vào công việc.",
    "anh ấy có kinh nghiệm làm việc ở đâu?":
      "Nhật đã có kinh nghiệm thực tế tại nhiều vị trí:\n- **Nexus Media (CTV Marketing):** Edit video, lập kế hoạch và thực thi truyền thông, quản trị fanpage.\n- **Văn Lang TV (CTV):** Biên tập, đạo diễn, quay & dựng nhiều series video.\n- **Jollibee Vietnam (Crew Leader):** Quản lý nhân sự và kiểm soát hàng hóa.",
    "anh ấy đã đạt được giải thưởng nào?":
      "Nhật đã giành được nhiều giải thưởng ấn tượng, nổi bật là:\n- Giải Nhất 'Môn điền kinh - Hội thao SV' 2025.\n- Giải Nhất 'PR Run' 2024.\n- Giải 'Quay phim xuất sắc nhất' từ Văn Lang TV.\n- Đạt học bổng và là sinh viên giỏi năm 2023.",
    "nhật học ở đâu?":
      "Nhật đã tốt nghiệp Trung cấp Nghiệp vụ nhà hàng tại Cao đẳng Hoà Bình Xuân Lộc (GPA 8.0/10) và hiện đang theo học ngành Truyền thông đa phương tiện tại Đại học Văn Lang (GPA 8.1/10).",
    "nhật có tham gia tình nguyện không?":
       "Có chứ! Nhật rất tích cực tham gia các hoạt động cộng đồng. Anh ấy đã đảm nhận vai trò Trưởng nhóm Tình nguyện viên và hỗ trợ tại nhiều giải marathon lớn như VPBank Vnexpress Marathon, HCMC Marathon, và Danang International Marathon.",
    "mục tiêu nghề nghiệp của nhật là gì?":
      "Mục tiêu của Nhật rất rõ ràng:\n- **Ngắn hạn:** Nhanh chóng thích nghi, nâng cao kỹ năng dựng video và đóng góp hiệu quả vào các dự án của công ty.\n- **Dài hạn:** Trở thành nhân sự chủ lực trong team Marketing và phát triển tư duy kể chuyện bằng hình ảnh.",
    default: "Cảm ơn câu hỏi của bạn! Đây là một chủ đề thú vị. Để có câu trả lời chi tiết nhất, bạn có thể liên hệ trực tiếp với Nhật qua email nhatngocdong123@gmail.com nhé.",
  },
  en: {
    "tell me about dang anh nhat":
      "Dang Anh Nhat is a dynamic, creative, and enthusiastic individual in the Marketing and Communications field. He is always eager to contribute his youthful energy and learn new things to perfect his skills and advance his career.",
    "what are nhat's skills?":
      "Nhat has a diverse skill set, including:\n- **Video & Creativity:** Video editing (CapCut, Premiere, After Effects), planning and writing for communications, and content creation.\n- **Soft Skills:** Team leadership, crisis communication management, and a strong willingness to learn and adapt quickly.\n- **Tools:** Proficient in Word, Excel, PowerPoint, and applying AI in the workplace.",
    "where has he worked?":
      "Nhat has gained practical experience in several roles:\n- **Nexus Media (Marketing Contributor):** Edited videos, planned and executed communication strategies, and managed fan pages.\n- **Van Lang TV (Contributor):** Edited, directed, and filmed various video series.\n- **Jollibee Vietnam (Crew Leader):** Managed personnel and controlled inventory.",
    "what awards has he received?":
      "Nhat has won several impressive awards, notably:\n- First Place in 'Athletics - Student Sports Festival' 2025.\n- First Place in 'PR Run' 2024.\n- 'Best Cinematographer' award from Van Lang TV.\n- He has also earned scholarships and was recognized as an excellent student in 2023.",
    "what is his educational background?":
      "Nhat graduated with a vocational degree in Restaurant Operations from Hoa Binh Xuan Loc College (GPA 8.0/10) and is currently studying Multimedia Communications at Van Lang University (GPA 8.1/10).",
    "does he have any volunteer experience?":
       "Yes, he does! Nhat is very active in community events. He has served as a Volunteer Leader and event crew member at major marathons like the VPBank Vnexpress Marathon, HCMC Marathon, and Danang International Marathon.",
    "what are nhat's career goals?":
      "Nhat's goals are very clear:\n- **Short-term:** To quickly adapt to the work environment, enhance his video editing skills, and contribute effectively to the company's projects.\n- **Long-term:** To become a key member of the Marketing team and develop his visual storytelling mindset.",
    default: "Thank you for your question! That's an interesting topic. for the most detailed answer, you can contact Nhat directly via email at nhatngocdong123@gmail.com.",
  },
}

const getMockResponse = (question: string, lang: "vn" | "en"): string => {
  const normalizedQuestion = question.toLowerCase().replace(/[?.,]/g, "").trim()
  const responses = mockResponses[lang]
  // Tìm key khớp nhất
  const bestMatch = Object.keys(responses).find(key => normalizedQuestion.includes(key) || key.includes(normalizedQuestion));
  return responses[bestMatch as keyof typeof responses] || responses.default
}
// --- KẾT THÚC DỮ LIỆU MOCKUP ---

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  const initialGreeting =
    language === "vn"
      ? "Chào bạn! Tôi là trợ lý AI của Đặng Anh Nhật. Bạn muốn tìm hiểu về kinh nghiệm Marketing của anh ấy chứ?"
      : "Hi there! I'm Dang Anh Nhat's AI assistant. Curious about his Marketing experience?"

  const suggestedQuestions =
    language === "vn"
      ? [
          "Kỹ năng của Nhật là gì?",
          "Anh ấy có kinh nghiệm làm việc ở đâu?",
          "Mục tiêu nghề nghiệp của Nhật là gì?",
        ]
      : ["What are Nhat's skills?", "Where has he worked?", "What are Nhat's career goals?"]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: initialGreeting }])
    }
  }, [isOpen, messages.length, initialGreeting])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  const handleSendMessage = (e: FormEvent<HTMLFormElement> | null = null, question?: string) => {
    if (e) e.preventDefault()
    const messageContent = question || input
    if (messageContent.trim() === "" || isLoading) return

    const userMessage: Message = { role: "user", content: messageContent }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const botResponseContent = getMockResponse(messageContent, language)
      const botMessage: Message = { role: "assistant", content: botResponseContent }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1200 + Math.random() * 500)
  }

  return (
    <>
      {/* Nút Chat nổi */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 z-[100]"
      >
        <Button
          size="icon"
          className="h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={isOpen ? "x" : "message"}
              initial={{ opacity: 0, scale: 0.5, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Cửa sổ Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-24 right-6 z-[99] w-[calc(100vw-48px)] max-w-md"
          >
            <Card className="h-[600px] flex flex-col shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border-2 border-transparent bg-clip-padding [border-image:linear-gradient(to_bottom_right,theme(colors.indigo.400),theme(colors.purple.500))_1]">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-7 w-7 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {language === "vn" ? "Trợ lý AI của Nhật" : "Nhat's AI Assistant"}
                    </CardTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="space-y-6 p-4 whitespace-pre-line">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={cn("flex items-end gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
                      >
                        {msg.role === 'assistant' && (
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                             <Bot className="h-5 w-5 text-white" />
                           </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-md",
                            msg.role === "user"
                              ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none"
                          )}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end gap-2 justify-start"
                      >
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                           <Bot className="h-5 w-5 text-white" />
                         </div>
                        <div className="max-w-[80%] rounded-2xl p-3 text-sm bg-white dark:bg-slate-800 rounded-bl-none shadow-md">
                          <div className="flex items-center gap-2 text-slate-500">
                            <Sparkles className="h-4 w-4 animate-pulse text-indigo-500" />
                            <span>{language === "vn" ? "Đang gõ..." : "Typing..."}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-4 border-t dark:border-slate-700 flex flex-col items-start gap-3">
                <div className="w-full">
                  <ScrollArea className="w-full max-w-full">
                    <div className="flex gap-2 pb-2">
                      {suggestedQuestions.map((q, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                          onClick={() => handleSendMessage(null, q)}
                          className="text-xs h-auto py-1 px-3 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 flex-shrink-0 whitespace-nowrap"
                        >
                          <Lightbulb className="h-3 w-3 mr-1.5" />
                          {q}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                  <Input
                    placeholder={language === "vn" ? "Hỏi gì đó về Nhật..." : "Ask something about Nhat..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:brightness-100"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
