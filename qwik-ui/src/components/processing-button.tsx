import {component$, isSignal, Signal, Slot, useSignal} from '@builder.io/qwik';
import {SpinnersBarsFade} from '@nr1e/qwik-icons';
import {Button, ButtonProps} from './button';

/**
 * Props for the ProcessingButton component. This class will replace the icon
 * with a rotating spinner when clicked.
 */
export interface ProcessingButtonProps extends ButtonProps {
  /**
   * Whether the button is processing.
   */
  processing?: boolean | Signal<boolean>;
}

/**
 * ProcessingButton component.
 */
export const ProcessingButton = component$((props: ProcessingButtonProps) => {
  // Always create internal signal, but only use it if no external signal is passed
  const internalProcessing = useSignal<boolean>(
    isSignal(props.processing)
      ? props.processing.value
      : (props.processing ?? false),
  );
  const processing = isSignal(props.processing)
    ? props.processing
    : internalProcessing;

  const onClick$ = props.onClick$;

  return (
    <Button
      {...props}
      class={`${props.processing || props.disabled ? 'disabled' : ''} ${props.class ?? ''}`}
      disabled={processing.value || props.disabled}
      onClick$={(e: Event) => {
        processing.value = true;
        if (onClick$) {
          const result = onClick$(e);
          if (result instanceof Promise) {
            result.finally(() => {
              processing.value = false;
            });
          }
        }
      }}
      icon={processing.value ? SpinnersBarsFade : props.icon}
      iconClass={processing.value ? 'animate-spin' : props.iconClass}
    >
      <Slot />
    </Button>
  );
});
