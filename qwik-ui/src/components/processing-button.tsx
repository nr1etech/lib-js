import {
  component$,
  isSignal,
  Signal,
  Slot,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import {SpinnersBarsFade} from '@nr1e/qwik-icons';
import {Button, ButtonProps} from './button';

/**
 * Props for the ProcessingButton component. This class will replace the icon
 * with a rotating spinner when the button is processing. It will also
 * automatically set processing to true when the button is clicked. It does
 * not set processing to false when the button is clicked.
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
  const externalProcessing = isSignal(props.processing)
    ? props.processing
    : undefined;
  const internalProcessing = useSignal<boolean>(
    isSignal(props.processing)
      ? props.processing.value
      : (props.processing ?? false),
  );
  const onClick$ = props.onClick$;
  // Synchronize props value to local value
  useTask$(({track}) => {
    if (externalProcessing) {
      track(() => externalProcessing.value);
      if (externalProcessing.value !== internalProcessing.value) {
        internalProcessing.value = externalProcessing.value;
      }
    }
  });
  // Synchronize local value to props value
  useTask$(({track}) => {
    if (externalProcessing) {
      track(() => internalProcessing.value);
      if (externalProcessing.value !== internalProcessing.value) {
        externalProcessing.value = internalProcessing.value;
      }
    }
  });
  return (
    <Button
      {...props}
      class={`${props.processing || props.disabled ? 'disabled' : ''} ${props.class ?? ''}`}
      disabled={internalProcessing.value || props.disabled}
      onClick$={(e: Event) => {
        internalProcessing.value = true;
        if (onClick$) {
          onClick$(e);
        }
      }}
      icon={internalProcessing.value ? SpinnersBarsFade : props.icon}
      iconClass={internalProcessing.value ? 'animate-spin' : props.iconClass}
    >
      <Slot />
    </Button>
  );
});
