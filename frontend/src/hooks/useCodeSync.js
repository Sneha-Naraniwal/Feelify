import { useEffect, useRef, useCallback, useState } from "react";

/**
 * useCodeSync — Real-time code synchronization via Stream Chat custom events
 * 
 * Participant side: debounces code changes and sends them via channel.sendEvent
 * Host side: listens for all events and filters for code_sync
 */
export function useCodeSync(channel, isHost, isParticipant) {
  const [participantCode, setParticipantCode] = useState("");
  const [participantLanguage, setParticipantLanguage] = useState("javascript");
  const debounceRef = useRef(null);
  const channelRef = useRef(null);

  // Keep channel ref current
  useEffect(() => {
    channelRef.current = channel;
  }, [channel]);

  // HOST: Listen for code sync events from participant
  useEffect(() => {
    if (!channel || !isHost) return;

    // Listen to ALL events and filter manually (more reliable)
    const handler = (event) => {
      if (event.type === "code_sync" || event?.type === "code_sync") {
        if (event.code !== undefined) setParticipantCode(event.code);
        if (event.language) setParticipantLanguage(event.language);
      }
    };

    channel.on(handler);
    return () => channel.off(handler);
  }, [channel, isHost]);

  // PARTICIPANT: Send code changes (debounced)
  const sendCodeSync = useCallback(
    (code, language) => {
      if (!isParticipant) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        const ch = channelRef.current;
        if (!ch) return;
        try {
          await ch.sendEvent({
            type: "code_sync",
            code: code || "",
            language: language || "javascript",
          });
        } catch (err) {
          console.warn("Code sync send failed:", err.message);
        }
      }, 500);
    },
    [isParticipant]
  );

  return {
    participantCode,
    participantLanguage,
    sendCodeSync,
  };
}

/**
 * useRunRequest — Code execution approval flow via Stream Chat custom events
 */
export function useRunRequest(channel, isHost, isParticipant) {
  const [pendingRunRequest, setPendingRunRequest] = useState(null);
  const [runApproved, setRunApproved] = useState(null);
  const channelRef = useRef(null);

  useEffect(() => {
    channelRef.current = channel;
  }, [channel]);

  useEffect(() => {
    if (!channel) return;

    const handler = (event) => {
      if (event.type === "run_request" && isHost) {
        setPendingRunRequest({
          code: event.code,
          language: event.language,
          requestId: event.requestId,
        });
      }
      if (event.type === "run_response" && isParticipant) {
        setRunApproved({
          approved: event.approved,
          requestId: event.requestId,
        });
      }
    };

    channel.on(handler);
    return () => channel.off(handler);
  }, [channel, isHost, isParticipant]);

  const requestRun = useCallback(
    async (code, language) => {
      const ch = channelRef.current;
      if (!ch || !isParticipant) return;
      const requestId = Date.now().toString();
      setRunApproved(null);
      try {
        await ch.sendEvent({
          type: "run_request",
          code,
          language,
          requestId,
        });
      } catch (err) {
        console.warn("Run request send failed:", err.message);
      }
      return requestId;
    },
    [isParticipant]
  );

  const respondToRun = useCallback(
    async (approved, requestId) => {
      const ch = channelRef.current;
      if (!ch || !isHost) return;
      setPendingRunRequest(null);
      try {
        await ch.sendEvent({
          type: "run_response",
          approved,
          requestId,
        });
      } catch (err) {
        console.warn("Run response send failed:", err.message);
      }
    },
    [isHost]
  );

  return {
    pendingRunRequest,
    runApproved,
    requestRun,
    respondToRun,
    clearRunRequest: () => setPendingRunRequest(null),
  };
}
