"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IconButton } from "@radix-ui/themes";
import { RefreshButton } from "./RefreshButton";
import RefreshIcon from "./RefreshIcon";
import classNames from "classnames";
import dayjs from "dayjs";
import "./styles.css";

const SPIN_DURATION = 1500;

const getMockDelay = () => {
  let base = 2000 + Math.random() * 1000;
  const remainder = base % SPIN_DURATION;
  if (remainder < 300) base += 300;
  else if (remainder > SPIN_DURATION - 300) base -= 300;
  return base;
};

export const GracefulSpinnerDemo = () => {
  const [lastRefreshTime] = useState<dayjs.Dayjs>(dayjs());

  const [refreshStatus, setRefreshStatus] = useState<
    "idle" | "fetching" | "completing"
  >("idle");

  const [naiveSpinning, setNaiveSpinning] = useState(false);
  const [naiveJustStopped, setNaiveJustStopped] = useState(false);
  const [naiveElapsed, setNaiveElapsed] = useState(0);
  const [gracefulElapsed, setGracefulElapsed] = useState(0);
  const naiveStart = useRef<number | null>(null);
  const gracefulStart = useRef<number | null>(null);

  useEffect(() => {
    if (!naiveSpinning && refreshStatus === "idle") return;
    const id = setInterval(() => {
      if (naiveSpinning && naiveStart.current !== null) {
        setNaiveElapsed(Date.now() - naiveStart.current);
      }
      if (refreshStatus === "fetching" && gracefulStart.current !== null) {
        setGracefulElapsed(Date.now() - gracefulStart.current);
      }
    }, 10);
    return () => clearInterval(id);
  }, [naiveSpinning, refreshStatus]);

  const formatElapsed = useCallback((ms: number) => {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  }, []);

  const mockFetch = async () => {
    const delay = getMockDelay();
    await new Promise((resolve) => setTimeout(resolve, delay));
  };

  const handleNaiveRefresh = async () => {
    naiveStart.current = Date.now();
    setNaiveElapsed(0);
    setNaiveSpinning(true);
    const delay = getMockDelay();
    await new Promise((resolve) => setTimeout(resolve, delay));
    setNaiveSpinning(false);
    setNaiveJustStopped(true);
    naiveStart.current = null;
    setTimeout(() => setNaiveJustStopped(false), 1000);
  };

  const [gracefulFetched, setGracefulFetched] = useState(false);

  const handleGracefulStatusChange = (
    status: "idle" | "fetching" | "completing"
  ) => {
    if (status === "fetching") {
      gracefulStart.current = Date.now();
      setGracefulElapsed(0);
      setGracefulFetched(false);
    }
    if (status === "completing") {
      setGracefulFetched(true);
    }
    if (status === "idle") {
      gracefulStart.current = null;
    }
    setRefreshStatus(status);
  };

  const naiveStatusText = naiveSpinning
    ? "Stops mid-rotation when data arrives"
    : "Idle";

  const gracefulStatusText =
    refreshStatus === "fetching"
      ? "Fetching + animating spinner"
      : refreshStatus === "completing"
        ? "Completing animation gracefully..."
        : "Idle";

  return (
    <div className="flex items-center justify-center gap-4 py-12">
      <div className="flex flex-col items-center gap-5">
        <span className="text-[12px] font-medium text-gray-400">
          Abrupt stop
        </span>
        <IconButton
          onClick={handleNaiveRefresh}
          variant="surface"
          color={naiveJustStopped ? "red" : "gray"}
          radius="large"
          size="4"
        >
          <RefreshIcon
            width={24}
            height={24}
            className={
              naiveSpinning
                ? "[animation:refresh-spin_1.5s_linear_infinite]"
                : ""
            }
          />
        </IconButton>
        <div className="flex flex-col items-center gap-0.5">
          <span className="w-72 text-center text-[12px] text-gray-400">
            {naiveStatusText}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[12px] tabular-nums">
            <span className="text-gray-300">
              {formatElapsed(naiveElapsed)}
            </span>
            {(naiveSpinning || naiveElapsed > 0) && (
              <span
                className={classNames(
                  "text-[11px] transition-colors duration-300",
                  naiveSpinning ? "text-gray-400" : "text-gray-300"
                )}
              >
                {naiveSpinning ? "fetching" : "fetched"}
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="h-32 w-px bg-gray-200" />

      <div className="flex flex-col items-center gap-5">
        <span className="text-[12px] font-medium text-gray-400">
          Graceful completion
        </span>
        <RefreshButton
          onClick={mockFetch}
          lastRefreshTime={lastRefreshTime}
          onStatusChange={handleGracefulStatusChange}
          size="4"
          color={refreshStatus === "completing" ? "green" : "gray"}
        />
        <div className="flex flex-col items-center gap-0.5">
          <span className="w-72 text-center text-[12px] text-gray-400">
            {gracefulStatusText}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[12px] tabular-nums">
            <span className="text-gray-300">
              {formatElapsed(gracefulElapsed)}
            </span>
            {(refreshStatus === "fetching" || gracefulFetched) && (
              <span
                className={classNames(
                  "text-[11px] transition-colors duration-300",
                  refreshStatus === "fetching"
                    ? "text-gray-400"
                    : "text-gray-300"
                )}
              >
                {refreshStatus === "fetching" ? "fetching" : "fetched"}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
