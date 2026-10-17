import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function TopProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true);
      setProgress(30);
      timer1 = setTimeout(() => {
        setProgress(75);
      }, 150);
    } else if (visible) {
      setProgress(100);
      timer2 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-buletin transition-all ease-out duration-200 shadow-[0_0_10px_#f0152f]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
