import { useEffect, useState } from 'react';

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [onlineSince, setOnlineSince] = useState<Date | undefined>();

  useEffect(() => {
    if (isOnline) setOnlineSince(new Date());

    function onlineHandler() {
      setIsOnline(true);
      setOnlineSince(new Date());
    }

    function offlineHandler() {
      setIsOnline(false);
      setOnlineSince(undefined);
    }

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);

  return { isOnline, onlineSince };
}
