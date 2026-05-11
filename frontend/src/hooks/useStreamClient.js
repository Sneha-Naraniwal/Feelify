import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);
  const hasInitialized = useRef(false);

  // Only depend on callId and status — NOT the full session object
  // This prevents Stream from tearing down when problem index changes
  const callId = session?.callId;
  const sessionStatus = session?.status;
  const canJoin = (isHost || isParticipant) && !loadingSession;

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    let isCancelled = false;

    const initCall = async () => {
      if (!callId || !canJoin) return;
      if (sessionStatus === "completed") return;
      if (hasInitialized.current) return; // Don't re-init if already connected

      hasInitialized.current = true;

      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        if (isCancelled) return;

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (isCancelled) return;

        setStreamClient(client);

        videoCall = client.call("default", callId);
        await videoCall.join({ create: true });

        if (isCancelled) return;

        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (isCancelled) return;

        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", callId);
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        if (!isCancelled) {
          toast.error("Failed to join video call");
          console.error("Error init call", error);
        }
      } finally {
        if (!isCancelled) {
          setIsInitializingCall(false);
        }
      }
    };

    initCall();

    return () => {
      isCancelled = true;
      hasInitialized.current = false;
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [callId, sessionStatus, canJoin]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;