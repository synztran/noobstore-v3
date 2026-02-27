import { useEffect, useState, useCallback } from 'react'
import { IMessage } from '@/services/ChatWS'
import { TConnectionStatus } from '@/components/MessageChat/interface'
import { IRoom, websocketService } from '@/services/ChatWS'
import { IAuthUser } from '@/interface/Context/auth'

// Helper to check if message is duplicate (same content within 5 seconds)
const isDuplicateMessage = (existing: IMessage[], newMsg: IMessage): boolean => {
  return existing.some((msg) => {
    const timeDiff = Math.abs(new Date(msg.timestamp).getTime() - new Date(newMsg.timestamp).getTime())
    return msg.message === newMsg.message && msg.senderRole === newMsg.senderRole && timeDiff < 5000
  })
}

const useMessageChat = ({ user, isModule, isOpen }: { user: IAuthUser | null; isModule?: boolean; isOpen?: boolean }) => {
  const [listRoom, setListRoom] = useState<IRoom[]>([])
  const [messages, setMessages] = useState<IMessage[]>([])
  const [currentRoom, setCurrentRoom] = useState<IRoom | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<TConnectionStatus>('connecting')
  const [connectionStats, setConnectionStats] = useState<any>(null)

  useEffect(() => {
    if (!user) return
    if (isModule && !isOpen) return

    // Only initialize websocket if not already initialized
    if (!websocketService.isConnected()) {
      websocketService.initialize(user)
    }

    const unsubscribe = websocketService.subscribe((message) => {
      if (message.action === 'message_receive') {
        const newMsg = message.payload as unknown as IMessage
        setMessages((prev) => {
          if (isDuplicateMessage(prev, newMsg)) return prev
          return [...prev, newMsg]
        })
      }
    })

    const statusUnsubscribe = websocketService.subscribeToStatus((status) => {
      setConnectionStatus(status)
      setConnectionStats(websocketService.getConnectionStats())
    })

    const messageUnsubscribe = websocketService.subscribe((message) => {
      setConnectionStats(websocketService.getConnectionStats())
      switch (message.action) {
        case 'sync_response':
          if (message.payload && Array.isArray(message.payload.messages)) {
            const mappedMessages = message.payload.messages.map((msg: any) => ({
              customerId: msg.customerId,
              senderId: msg.senderId,
              senderRole: msg.senderRole,
              message: msg.message,
              timestamp: msg.timestamp,
            }))
            setMessages(mappedMessages)
          }
          break
        case 'message_update':
          const mappedMessage: IMessage[] =
            message.payload.messages?.map((msg) => ({
              senderId: msg.senderId,
              senderRole: msg.senderRole,
              message: msg.message,
              timestamp: msg.timestamp,
              images: msg.images,
            })) || []
          if (mappedMessage && mappedMessage.length) {
            setMessages((prev) => {
              const newMessages = mappedMessage.filter((newMsg) => !isDuplicateMessage(prev, newMsg))
              return newMessages.length ? [...prev, ...newMessages] : prev
            })
          }
          break
        case 'session':
          if (message.payload && message.payload.room) {
            const mappedMessages = message.payload?.room?.messages?.map((msg: any) => ({
              senderId: msg.senderId,
              senderRole: msg.senderRole,
              message: msg.message,
              timestamp: msg.timestamp,
            }))
            setMessages(mappedMessages)
            setCurrentRoom(message?.payload?.room || null)
          }
          break
        case 'admin_sync_response':
          if (message.payload.rooms) {
            setListRoom(message.payload.rooms)
          }
          break
        case 'admin_selected_room_response':
          const adminMapMessage: IMessage[] =
            message.payload?.room?.messages?.map((msg) => ({
              senderId: msg.senderId,
              senderRole: msg.senderRole,
              message: msg.message,
              timestamp: msg.timestamp,
              images: msg.images,
            })) || []
          if (adminMapMessage && adminMapMessage.length) {
            setMessages(adminMapMessage)
          }
          setCurrentRoom(message?.payload?.room || null)
          break
        case 'message_sync':
          const syncMsg = message?.payload?.message as unknown as IMessage
          if (syncMsg) {
            setMessages((prev) => {
              if (isDuplicateMessage(prev, syncMsg)) return prev
              return [...prev, syncMsg]
            })
          }
          break
      }
    })

    const statsInterval = setInterval(() => {
      setConnectionStats(websocketService.getConnectionStats())
    }, 3000)

    return () => {
      unsubscribe()
      statusUnsubscribe()
      messageUnsubscribe()
      clearInterval(statsInterval)
      // Only cleanup if this is the last instance
      if (!isModule || !isOpen) {
        websocketService.cleanup()
      }
    }
  }, [user, user?.customerId, isModule, isOpen])

  const getStatusColor = (status: TConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'connecting':
        return 'bg-yellow-500'
      case 'disconnected':
      case 'error':
        return 'bg-red-500'
    }
  }

  // Send message with optimistic update
  const sendMessage = (message: string, roomId: string, isAdmin: boolean, sendTo?: number) => {
    if (!user || !roomId) return

    const timestamp = new Date().toISOString()
    const newMessage: IMessage = {
      senderId: user.customerId,
      senderRole: isAdmin ? 'admin' : 'customer',
      message,
      timestamp,
    }

    // Optimistic update - add message to state immediately
    setMessages((prev) => [...prev, newMessage])

    // Send via websocket
    websocketService.send({
      action: 'message_send',
      payload: {
        type: 'message',
        message,
        timestamp: Date.now(),
        roomId,
        sendFrom: user.customerId,
        userRole: user.role as 'admin' | 'customer',
        sendTo,
      },
    })
  }

  return {
    listRoom,
    setListRoom,
    messages,
    setMessages,
    currentRoom,
    setCurrentRoom,
    connectionStatus,
    setConnectionStatus,
    sendMessage,
    connectionStats,
    setConnectionStats,
    getStatusColor,
  }
}

export default useMessageChat
