import {component$, QRL} from '@builder.io/qwik';
import {ProcessingButton} from './processing-button';

export interface SubmitButtonProps {
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
   * Text to display on the button. Default is 'Submit'.
   */
  text?: string;
  /**
   * Whether the button is processing.
   */
  submitting?: boolean;
}

export const SubmitButton = component$((props: SubmitButtonProps) => {
  return (
    <ProcessingButton
      {...props}
      class={`btn-primary ${props.class ?? ''}`}
      text={props.text || 'Submit'}
      type="submit"
      processing={props.submitting}
    />
  );
});
