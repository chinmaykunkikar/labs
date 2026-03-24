import RefreshIcon from "./RefreshIcon";
import { IconButton, IconButtonProps } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";

dayjs.extend(relativeTime);

type RefreshButtonProps = IconButtonProps & {
  onClick: () => Promise<void>;
  showUpdateText?: boolean;
  lastRefreshTime?: dayjs.Dayjs;
  onStatusChange?: (status: "idle" | "fetching" | "completing") => void;
};

export const RefreshButton = ({
  onClick,
  showUpdateText = true,
  lastRefreshTime,
  onStatusChange,
  ...props
}: RefreshButtonProps) => {
  const MINUTE_MS = 60000;
  const [lastUpdateTime, setLastUpdateTime] = useState<dayjs.Dayjs>(dayjs());
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>(dayjs());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  // This state takes care of the animation completion of the refresh icon.
  // It completes the current iteration of the animation even if the refresh
  // is completed before the animation is finished
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);

  useEffect(() => {
    if (lastRefreshTime && showUpdateText) {
      setLastUpdateTime(lastRefreshTime);
      setCurrentTime(lastRefreshTime);
    }
  }, [lastRefreshTime, showUpdateText]);

  const handleRefresh = async () => {
    const now = dayjs();
    setIsRefreshing(true);
    setIsAnimating(true);
    setIsSettling(false);
    onStatusChange?.("fetching");
    await onClick();
    setIsRefreshing(false);
    onStatusChange?.("completing");
    if (showUpdateText) {
      setLastUpdateTime(now);
      setCurrentTime(now);
    }
  };

  useEffect(() => {
    if (showUpdateText) {
      const interval = setInterval(() => {
        setCurrentTime(dayjs());
      }, MINUTE_MS);
      return () => clearInterval(interval);
    }
  }, [showUpdateText]);

  const handleAnimationIteration = () => {
    if (!isRefreshing) {
      setIsAnimating(false);
      setIsSettling(true);
    }
  };

  const handleSettleEnd = () => {
    setIsSettling(false);
    onStatusChange?.("idle");
  };

  void lastUpdateTime;
  void currentTime;

  return (
    <IconButton
      onClick={handleRefresh}
      variant="surface"
      color="gray"
      radius="large"
      {...props}
    >
      <RefreshIcon
        width={24}
        height={24}
        className={classNames({
          "[animation:refresh-spin_1.5s_linear_infinite]": isAnimating,
          "[animation:refresh-settle_600ms_ease-out_forwards]": isSettling,
        })}
        onAnimationIteration={handleAnimationIteration}
        onAnimationEnd={handleSettleEnd}
      />
    </IconButton>
  );
};
