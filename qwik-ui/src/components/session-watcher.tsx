import {
  $,
  component$,
  QRL,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import {Button} from './button';
import {Dialog} from './dialog';
import {Timer} from './timer';

export interface SessionWatcherProps {
  /**
   * The session expiry date/time. Accepts a date string, Date object, null, or undefined.
   * When null or undefined, no timers are set.
   */
  dateTime?: string | Date | null;
  /**
   * Number of minutes before the expiry time to show the warning dialog.
   * Defaults to 5.
   */
  warnMinutes?: number;
  /**
   * Callback invoked when the user clicks "Extend Session".
   * The parent is responsible for updating dateTime to the new expiry.
   */
  onExtendSelected$?: QRL<() => void>;
  /**
   * Callback invoked when the session has expired (either from the timer or if the
   * warning dialog is still open when the expiry time is reached).
   */
  onExpired$?: QRL<() => void>;
}

/**
 * Session watcher component that monitors a session expiry time and presents
 * a countdown warning dialog before the session expires.
 *
 * Uses the Timer component internally and shows a Dialog with a live countdown
 * and an "Extend Session" option when the warn threshold is reached.
 */
export const SessionWatcher = component$((props: SessionWatcherProps) => {
  const dialogOpen = useSignal(false);
  const countdownSeconds = useSignal(0);

  // Decrement the countdown every second while the warning dialog is visible.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({track, cleanup}) => {
    track(() => dialogOpen.value);
    if (dialogOpen.value) {
      const id = setInterval(() => {
        if (countdownSeconds.value > 0) {
          countdownSeconds.value--;
        } else {
          clearInterval(id);
        }
      }, 1000);
      cleanup(() => clearInterval(id));
    }
  });

  const handleWarn = $(() => {
    if (!props.dateTime) return;
    const targetTime = new Date(props.dateTime).getTime();
    const remaining = Math.max(
      0,
      Math.floor((targetTime - Date.now()) / 1000),
    );
    countdownSeconds.value = remaining;
    dialogOpen.value = true;
  });

  const handleExpired = $(async () => {
    dialogOpen.value = false;
    if (props.onExpired$) {
      await props.onExpired$();
    }
  });

  const minutes = Math.floor(countdownSeconds.value / 60);
  const seconds = String(countdownSeconds.value % 60).padStart(2, '0');

  return (
    <>
      <Timer
        dateTime={props.dateTime}
        warnMinutes={props.warnMinutes}
        onWarn$={handleWarn}
        onExpired$={handleExpired}
      />
      <Dialog
        open={dialogOpen}
        title="Session Expiring Soon"
        showCloseIcon={false}
      >
        <div class="space-y-2">
          <p>
            Your session will expire in{' '}
            <span class="font-semibold">
              {minutes}:{seconds}
            </span>
            .
          </p>
          <p>Would you like to extend your session?</p>
        </div>
        <div q:slot="action">
          <Button
            text="Extend Session"
            class="btn-primary"
            onClick$={async () => {
              dialogOpen.value = false;
              if (props.onExtendSelected$) {
                await props.onExtendSelected$();
              }
            }}
          />
        </div>
      </Dialog>
    </>
  );
});
