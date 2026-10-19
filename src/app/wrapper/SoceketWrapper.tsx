"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Suspense,
} from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminAuth } from "@/src/Hooks/Auth/useAdminAuth";

const socketUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadCount: number;
  clearUnreadCount: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  unreadCount: 0,
  clearUnreadCount: () => {},
});

export const useSocket = () => useContext(SocketContext);

/**
 * Provides persistent WebSocket connectivity context using Socket.io across the entire app.
 * Workflow:
 * - Instantiates socket connection only when the user is authenticated.
 * - Listens globally for `new_message_notification` events.
 * - Auto-invalidates API query caches for chats upon receiving messages.
 * - Handles playing notification sounds and showing toaster notifications if the user isn't actively looking at the relevant chat.
 */
export default function SocketWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminId, adminInfo, isAuthenticated } = useAdminAuth() as any;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const clearUnreadCount = () => setUnreadCount(0);

  useEffect(() => {
    if (isAuthenticated && adminId) {
      const newSocket = io(socketUrl, {
        path: "/socket.io",
        query: {
          userId: adminId,
          role: adminInfo?.role || "USER",
        },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("Socket connected:", newSocket.id);
        newSocket.emit("joinConversation", `user_${adminId}`);
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Socket disconnected");
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, adminId, adminInfo?.role]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, unreadCount, clearUnreadCount }}
    >
      <Suspense fallback={null}>
        <SocketEvents socket={socket} setUnreadCount={setUnreadCount} />
      </Suspense>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Internal component to handle searchParams-dependent logic within a Suspense boundary.
 */
function SocketEvents({
  socket,
  setUnreadCount,
}: {
  socket: Socket | null;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { userId } = useAdminAuth() as any;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const playNotificationSound = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3",
    );
    audio.play().catch((err) => console.error("Sound play failed:", err));
  };

  useEffect(() => {
    if (!socket) return;

    // Global notification listener
    const listener = (data: any) => {
      console.log("Global Notification:", data);

      if (data.message?.senderId === userId) return;

      const conversationId = data.conversationId;

      // 1. Invalidate conversation list
      queryClient.invalidateQueries({ queryKey: ["conversation"] });

      // 2. Update chat history cache
      if (conversationId && data.message) {
        const newMessage = {
          ...data.message,
          conversationId: conversationId,
        };

        queryClient.setQueryData(
          ["chat-history", conversationId],
          (oldData: any) => {
            if (!oldData || !oldData.pages)
              return { pages: [[newMessage]], pageParams: [0] };

            const firstPage = [...oldData.pages[0]];
            const exists = firstPage.some(
              (m: any) =>
                m._id === newMessage._id ||
                (m.tempId && m.tempId === newMessage.tempId),
            );
            if (exists) return oldData;

            const newPages = [...oldData.pages];
            newPages[0] = [newMessage, ...firstPage];

            return {
              ...oldData,
              pages: newPages,
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: ["chat-history", conversationId],
        });
      }

      // 3. Handle notifications (Toasts & Count)
      const isChatPage = pathname.includes("/chat");
      const activeConvId = searchParams.get("conv");

      playNotificationSound();

      if (!isChatPage || activeConvId !== conversationId) {
        setUnreadCount((prev) => prev + 1);
      }

      if (!isChatPage || (isChatPage && activeConvId !== conversationId)) {
        const messageContent =
          data.message?.content || "You received a new message";
        const senderName = data.message?.senderName || "New Message";

        toast.message(senderName, {
          description: messageContent,
          action: {
            label: "View",
            onClick: () => {
              if (conversationId) {
                router.push(`/chat?conv=${conversationId}`);
              } else {
                router.push("/chat");
              }
            },
          },
        });
      }
    };

    socket.on("new_message_notification", listener);

    return () => {
      socket.off("new_message_notification", listener);
    };
  }, [socket, userId, pathname, searchParams, queryClient, router]);

  return null;
}
