import {component$, QRL, Signal, Slot} from '@builder.io/qwik';
import {MdiRefresh} from '@nr1e/qwik-icons';
import {ProcessingButton} from './processing-button';

export interface RefreshButtonProps {
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
   * Type of the button. Default is 'button'.
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Text to display on the button. Default is 'Refresh'.
   */
  text?: string;
  /**
   * Whether the button is processing.
   */
  refreshing?: boolean | Signal<boolean>;
  /**
   * Size of the icon in pixels if icon is provided in the props. Default is 18.
   */
  iconSize?: number;
}

export const RefreshButton = component$((props: RefreshButtonProps) => {
  return (
    <ProcessingButton
      {...props}
      class={`btn-primary ${props.class ?? ''}`}
      text={props.text || 'Refresh'}
      icon={MdiRefresh}
      processing={props.refreshing}
    />
  );
});
