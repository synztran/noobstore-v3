import React, { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { TConnectionStatus } from '../interface'
import { Send, ImagePlus, Paperclip, Receipt, Smile, X } from 'lucide-react'
import { IRoom } from '@/services/ChatWS'
import { IAuthUser } from '@/interface/Context/auth'
import { Button } from '@/components/ReUIComponent/Button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ReUIComponent/Tooltip'

interface IAttachment {
  name: string
  type: 'image' | 'file'
}

interface IProps {
  connectionStatus: TConnectionStatus
  roomId: string | null
  user: IAuthUser
  isAdmin: boolean
  currentRoom: IRoom | null
  isModule?: boolean
  onSendMessage?: (message: string, roomId: string, isAdmin: boolean, sendTo?: number) => void
}

export default function ChatInput({ connectionStatus, roomId, user, isAdmin = false, currentRoom = null, isModule = false, onSendMessage }: IProps) {
  const [inputValue, setInputValue] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [attachments, setAttachments] = useState<IAttachment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    const cursorPos = textareaRef?.current?.selectionStart || inputValue.length
    const newText = inputValue.slice(0, cursorPos) + emojiData.emoji + inputValue.slice(cursorPos)
    setInputValue(newText)
    setShowEmoji(false)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachments((prev) => [...prev, { name: file.name, type: 'file' }])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachments((prev) => [...prev, { name: file.name, type: 'image' }])
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    if (!roomId) return

    if (onSendMessage) {
      const sendTo = isAdmin ? currentRoom?.customerId : currentRoom?.adminId
      onSendMessage(inputValue, roomId, isAdmin, sendTo)
    }

    setInputValue('')
    setAttachments([])
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`
    }
  }, [inputValue])

  useEffect(() => {
    if (!showEmoji) return
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) && (event.target as HTMLElement).getAttribute('aria-label') !== 'emoji') {
        setShowEmoji(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmoji])

  const isDisabled = connectionStatus !== 'connected'

  if (isModule) {
    return (
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <div className="relative flex items-end gap-2 flex-1 rounded-xl border border-gray-200 bg-gray-50 p-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none bg-transparent border-none py-2 px-3 text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none max-h-32 min-h-[40px]"
              placeholder="Nhập tin nhắn..."
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
            />
            <div className="flex items-center gap-1 pb-1">
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200/50 hover:text-yellow-500 transition-colors disabled:opacity-50" onClick={() => setShowEmoji((v) => !v)} disabled={isDisabled} aria-label="emoji">
                <Smile className="w-5 h-5" />
              </button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSend} disabled={isDisabled || !inputValue.trim()}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div ref={emojiPickerRef} className="absolute bottom-20 right-4 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    )
  }

  return (
    <footer className="bg-white px-8 py-6 border-t border-gray-200 z-20">
      <div className="mx-auto max-w-4xl w-full flex flex-col gap-3">
        {/* Action Buttons */}
        <div className="flex items-center gap-3 px-1 pb-1 overflow-x-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-orange-500 border border-gray-200/60 transition-all text-xs font-medium whitespace-nowrap disabled:opacity-50"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isDisabled}
                >
                  <ImagePlus className="w-4 h-4" />
                  Tải ảnh
                </button>
              </TooltipTrigger>
              <TooltipContent>Tải ảnh lên</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-orange-500 border border-gray-200/60 transition-all text-xs font-medium whitespace-nowrap disabled:opacity-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isDisabled}
                >
                  <Paperclip className="w-4 h-4" />
                  Đính kèm
                </button>
              </TooltipTrigger>
              <TooltipContent>Đính kèm tệp</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-orange-500 border border-gray-200/60 transition-all text-xs font-medium whitespace-nowrap disabled:opacity-50" disabled={isDisabled}>
                  <Receipt className="w-4 h-4" />
                  Liên kết đơn
                </button>
              </TooltipTrigger>
              <TooltipContent>Liên kết đơn hàng</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Attachments */}
          {attachments.length > 0 && (
            <>
              <div className="h-4 w-px bg-gray-200 mx-1" />
              {attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 pl-2 pr-1 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md text-orange-500 text-xs font-medium">
                  {attachment.type === 'image' ? <ImagePlus className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
                  <span className="max-w-[100px] truncate">{attachment.name}</span>
                  <button type="button" className="hover:bg-orange-500/20 rounded-full p-0.5 transition-colors" onClick={() => handleRemoveAttachment(index)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="relative flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none bg-transparent border-none py-2.5 px-3 text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none max-h-32 min-h-[48px]"
            placeholder="Nhập tin nhắn của bạn..."
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
          />
          <div className="flex items-center gap-2 pb-1 pr-1">
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200/50 hover:text-yellow-500 transition-colors disabled:opacity-50" title="Chèn emoji" onClick={() => setShowEmoji((v) => !v)} disabled={isDisabled} aria-label="emoji">
              <Smile className="w-5 h-5" />
            </button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSend} disabled={isDisabled || !inputValue.trim()}>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Emoji Picker */}
        {showEmoji && (
          <div ref={emojiPickerRef} className="absolute bottom-32 right-8 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {/* Help Text */}
        <div className="text-center">
          <p className="text-[11px] text-gray-500">Enter để gửi, Shift + Enter để xuống dòng</p>
        </div>
      </div>
    </footer>
  )
}
