import {component$, QRL} from '@builder.io/qwik';
import {Button} from './button';

export interface CancelButtonProps {
  /**
   * ID of the button.
   */
  id?: string;
  /**
   * CSS class to apply to the button.
   */
  class?: string;
  /**
   * Callback function to be called when the button is clicked.
   */
  onClick$?: QRL<(event: Event) => void>;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Text to display on the button. Default is 'Cancel'.
   */
  text?: string;
  /**
   * Size of the icon in pixels if icon is provided in the props. Default is 18.
   */
  iconSize?: number;
}

export const CancelButton = component$((props: CancelButtonProps) => {
  return <Button {...props} text={props.text || 'Cancel'}></Button>;
});
