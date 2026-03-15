import {
  component$,
  QRL,
  useSignal,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';

export interface TimerProps {
  /**
   * The target expiry date/time. Accepts a date string, Date object, null, or undefined.
   * When null or undefined, no timers are set.
   */
  dateTime?: string | Date | null;
  /**
   * Number of minutes before the expiry time to trigger the onWarn$ callback.
   * Defaults to 5.
   */
  warnMinutes?: number;
  /**
   * Callback triggered when the warn threshold is reached (i.e., warnMinutes before expiry).
   */
  onWarn$?: QRL<() => void>;
  /**
   * Callback triggered when the dateTime has been reached (i.e., the session has expired).
   */
  onExpired$?: QRL<() => void>;
}

/**
 * Headless timer component that fires callbacks when a warn threshold or expiry time is reached.
 * Renders nothing — it is purely a behaviour component.
 * Properly cleans up the internal interval when the component is destroyed or dateTime changes.
 */
export const Timer = component$((props: TimerProps) => {
  const warnFired = useSignal(false);
  const expiredFired = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({track, cleanup}) => {
    track(() => props.dateTime);

    // Reset flags whenever dateTime changes so callbacks can re-fire for a new session.
    warnFired.value = false;
    expiredFired.value = false;

    if (!props.dateTime) return;

    const targetTime = new Date(props.dateTime).getTime();
    if (isNaN(targetTime)) return;

    const warnMs = (props.warnMinutes ?? 5) * 60 * 1000;

    let localWarnFired = false;
    let localExpiredFired = false;

    const check = () => {
      const remaining = targetTime - Date.now();

      if (!localExpiredFired && remaining <= 0) {
        localExpiredFired = true;
        expiredFired.value = true;
        return;
      }

      if (!localWarnFired && remaining > 0 && remaining <= warnMs) {
        localWarnFired = true;
        warnFired.value = true;
      }
    };

    check();

    const id = setInterval(check, 1000);
    cleanup(() => clearInterval(id));
  });

  // Bridge signal changes to QRL callbacks (runs on both server and client,
  // but signals are only mutated on the client so callbacks only fire there).
  useTask$(async ({track}) => {
    track(() => warnFired.value);
    if (warnFired.value && props.onWarn$) {
      await props.onWarn$();
    }
  });

  useTask$(async ({track}) => {
    track(() => expiredFired.value);
    if (expiredFired.value && props.onExpired$) {
      await props.onExpired$();
    }
  });

  return <></>;
});
