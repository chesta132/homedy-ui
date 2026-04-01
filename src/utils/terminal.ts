import { VITE_BACKEND_URL } from "@/config";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal, type ITheme } from "@xterm/xterm";

export function sendResize(ws: WebSocket, cols: number, rows: number) {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: "resize", resize: { x: cols, y: rows } }));
}

function createURL(path: string) {
  try {
    return new URL(path);
  } catch {
    // join as relative
    return new URL(path, window.location.href);
  }
}

export function getWsUrl(): string {
  const url = createURL(VITE_BACKEND_URL!);
  const proto = url.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${url.host}${url.pathname}/ws/terminal`;
}

export type InitiateXtermRefs = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  termRef: React.RefObject<Terminal | null>;
  fitRef: React.RefObject<FitAddon | null>;
  wsRef: React.RefObject<WebSocket | null>;
};
export const initiateXterm = (theme: ITheme, { containerRef, fitRef, termRef, wsRef }: InitiateXtermRefs) => {
  const term = new Terminal({
    fontFamily: '"Fira Code", "Cascadia Code", monospace',
    fontSize: 13,
    lineHeight: 1.5,
    cursorBlink: true,
    cursorStyle: "block",
    theme,
    allowProposedApi: true,
  });

  const fit = new FitAddon();
  term.loadAddon(fit);
  term.open(containerRef.current!);
  requestAnimationFrame(() => fit.fit());

  const onResize = () => fit.fit();
  window.addEventListener("resize", onResize);

  termRef.current = term;
  fitRef.current = fit;

  // When xterm dimensions change (window resize / fit), notify the PTY
  term.onResize(({ cols, rows }) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      sendResize(wsRef.current, cols, rows);
    }
  });

  return () => {
    window.removeEventListener("resize", onResize);
    term.dispose();
  };
};
