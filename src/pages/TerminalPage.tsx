import { useEffect, useRef, useState, useCallback } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import "@xterm/xterm/css/xterm.css";
import { getWsUrl, initiateXterm, sendResize } from "@/utils/terminal";
import { useAppSecret } from "@/hooks/useAppSecret";
import { AppSecretModal } from "@/components/ui/app-secret-modal";

const XTERM_THEME = {
  background: "#0a0a0a",
  foreground: "#e0e0e0",
  cursor: "#ffffff",
  cursorAccent: "#0a0a0a",
  selectionBackground: "rgba(255,255,255,0.15)",
  black: "#1a1a1a",
  brightBlack: "#3a3a3a",
  red: "#f87171",
  brightRed: "#fca5a5",
  green: "#86efac",
  brightGreen: "#bbf7d0",
  yellow: "#fde047",
  brightYellow: "#fef08a",
  blue: "#93c5fd",
  brightBlue: "#bfdbfe",
  magenta: "#d8b4fe",
  brightMagenta: "#e9d5ff",
  cyan: "#67e8f9",
  brightCyan: "#a5f3fc",
  white: "#e5e5e5",
  brightWhite: "#ffffff",
};

type ConnStatus = "idle" | "connecting" | "connected" | "error";

export function TerminalPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const inputHandlerRef = useRef<{ dispose(): void } | null>(null);

  const [status, setStatus] = useState<ConnStatus>("idle");
  const { prompt, cancelPrompt, getSecret, submitPrompt } = useAppSecret();

  useEffect(() => {
    return initiateXterm(XTERM_THEME, { containerRef, fitRef, termRef, wsRef });
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const connect = useCallback(async () => {
    if (wsRef.current) return;
    const secret = await getSecret();
    if (!secret) return;
    setStatus("connecting");

    const url = getWsUrl();
    const ws = new WebSocket(url, ["app-secret", secret]);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");

      // Dispose stale handler before registering new one (prevents double-send on reconnect)
      inputHandlerRef.current?.dispose();
      inputHandlerRef.current = termRef.current!.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
      });

      fitRef.current?.fit();

      // Send initial PTY size after fit resolves
      const term = termRef.current!;
      sendResize(ws, term.cols, term.rows);

      termRef.current?.focus();
    };

    ws.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        termRef.current?.write(new Uint8Array(e.data));
      } else {
        termRef.current?.write(e.data as string);
      }
    };

    ws.onclose = (e) => {
      // code 1003 / 1008 = server rejected (wrong secret or forbidden)
      if (e.code === 1003 || e.code === 1008 || e.code === 4003) {
        termRef.current?.writeln("\r\n\x1b[31mConnection rejected — invalid app secret.\x1b[0m");
      }
      setStatus(e.wasClean ? "idle" : "error");
      wsRef.current = null;
    };

    ws.onerror = () => setStatus("error");
  }, []);

  const disconnect = useCallback(() => {
    wsRef.current?.close(1000, "user disconnect");
  }, []);

  const badgeClass: Record<ConnStatus, string> = {
    idle: "border-border-sub text-muted",
    connecting: "border-border-drag text-[#666666]",
    connected: "border-emerald-800/60 bg-emerald-950/30 text-emerald-400",
    error: "border-red-800/60 bg-red-950/30 text-red-400",
  };
  const badgeLabel: Record<ConnStatus, string> = {
    idle: "disconnected",
    connecting: "connecting…",
    connected: "connected",
    error: "error",
  };

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-0">
      <div className="flex h-10 items-center gap-3 rounded-t-lg border border-border bg-[#0f0f0f] px-3.5">
        {/* macOS traffic lights */}
        <div className="flex gap-1.5 shrink-0">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="text-2xs font-bold uppercase tracking-widest text-muted">terminal</span>
          <div className={cn("flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs transition-all", badgeClass[status])}>
            <div className={cn("h-1.5 w-1.5 rounded-full bg-current", isConnected && "animate-pulse")} />
            {badgeLabel[status]}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            className={cn(
              "cursor-pointer rounded px-2 py-0.5 text-2xs text-dim hover:text-dg disabled:opacity-40 transition-colors",
              isConnected && "hover:text-red-400",
            )}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </button>
          <button
            onClick={() => termRef.current?.clear()}
            className="cursor-pointer rounded px-2 py-0.5 text-2xs text-muted hover:text-subtle transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ── xterm area ─────────────────────────────────────────────────────── */}
      <div className="relative border-x border-border bg-base">
        <div ref={containerRef} className="h-105 w-full p-1" />

        {/* Overlays */}
        <AnimatePresence>
          {/* Idle / error overlay when not connected and no modal */}
          {!isConnected && !isConnecting && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base/90"
            >
              <p className="text-xs text-muted">
                {status === "error" ? "connection failed — " : "not connected — "}
                <button onClick={connect} className="cursor-pointer text-subtle underline underline-offset-2 hover:text-dg">
                  {status === "error" ? "retry" : "connect"}
                </button>
              </p>
            </motion.div>
          )}

          {/* Connecting spinner */}
          {isConnecting && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-base/80"
            >
              <Loader2 className="h-4 w-4 animate-spin text-muted-strong" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AppSecretModal onCancel={cancelPrompt} onSubmit={submitPrompt} open={prompt} />
    </motion.div>
  );
}
