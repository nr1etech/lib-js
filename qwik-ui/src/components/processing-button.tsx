import {component$, Slot} from '@builder.io/qwik';
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
  processing?: boolean;
}

/**
 * ProcessingButton component.
 */
export const ProcessingButton = component$((props: ProcessingButtonProps) => {
  return (
    <Button
      {...props}
      class={`${props.processing || props.disabled ? 'disabled' : ''} ${props.class ?? ''}`}
      disabled={props.processing || props.disabled}
      icon={props.processing ? SpinnersBarsFade : props.icon}
      iconClass={props.processing ? 'animate-spin' : props.iconClass}
    >
      <Slot />
    </Button>
  );
});
