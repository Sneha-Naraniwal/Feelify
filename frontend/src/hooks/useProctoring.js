import { useEffect, useRef, useCallback, useState } from "react";

/**
 * useProctoring — Anti-cheat detection for participant sessions
 * 
 * Monitors: tab switches, paste events, split-screen/window blur
 * Sends alerts to host via Stream Chat custom events
 */
export function useProctoring(channel, isParticipant) {
  const [alerts, setAlerts] = useState([]);
  const channelRef = useRef(null);

  useEffect(() => {
    channelRef.current = channel;
  }, [channel]);

  const addAlert = useCallback((alert) => {
    setAlerts((prev) => [alert, ...prev].slice(0, 50));
  }, []);

  // HOST: Listen for proctoring alerts (catch-all listener)
  useEffect(() => {
    if (!channel || isParticipant) return;

    const handler = (event) => {
      if (event.type === "proctor_alert") {
        addAlert({
          type: event.alertType,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now(),
        });
      }
    };

    channel.on(handler);
    return () => channel.off(handler);
  }, [channel, isParticipant, addAlert]);

  // PARTICIPANT: Send proctoring alert
  const sendAlert = useCallback(
    async (alertType) => {
      const ch = channelRef.current;
      if (!ch || !isParticipant) return;
      try {
        await ch.sendEvent({
          type: "proctor_alert",
          alertType,
        });
      } catch (err) {
        console.warn("Proctor alert send failed:", err.message);
      }
    },
    [isParticipant]
  );

  // PARTICIPANT: Tab visibility change detection
  useEffect(() => {
    if (!isParticipant) return;

    const handleVisibility = () => {
      if (document.hidden) {
        sendAlert("tab_switch");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isParticipant, sendAlert]);

  // PARTICIPANT: Window blur detection (split screen, alt-tab)
  useEffect(() => {
    if (!isParticipant) return;

    const handleBlur = () => {
      sendAlert("split_screen");
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [isParticipant, sendAlert]);

  // PARTICIPANT: Paste detection
  useEffect(() => {
    if (!isParticipant) return;

    const handlePaste = () => {
      sendAlert("paste");
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [isParticipant, sendAlert]);

  return {
    alerts,
    clearAlerts: () => setAlerts([]),
  };
}
