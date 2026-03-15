import {Component, component$, QRL, Slot} from '@builder.io/qwik';
import {IconProps} from '@nr1e/qwik-icons';

/**
 * Props for the Button component.
 */
export interface ButtonProps {
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
  onClick$?: QRL<(event: Event) => void | Promise<void>>;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Icon component to display next to the button text. You can alternatively use the `icon` slot.
   */
  icon?: Component<IconProps>;
  /**
   * Size of the icon in pixels if icon is provided in the props. Default is 18.
   */
  iconSize?: number;
  /**
   * CSS class to apply to the icon.
   */
  iconClass?: string;
  /**
   * Type of the button. Default is 'button'.
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Text to display on the button. Alternative to the `default` slot.
   */
  text?: string;
}

/**
 * Button component.
 */
export const Button = component$((props: ButtonProps) => {
  return (
    <button
      class={`btn props.disabled ? 'disabled' : ''} ${props.class ?? ''}`}
      disabled={props.disabled}
      id={props.id}
      type={props.type ?? 'button'}
      onClick$={!props.disabled && props.onClick$ ? props.onClick$ : undefined}
    >
      <>
        {props.icon ? (
          <span class={props.iconClass}>
            <props.icon size={props.iconSize ?? 18} />
          </span>
        ) : (
          <span class={props.iconClass} q:slot="icon"></span>
        )}
      </>
      {props.text ? props.text : <Slot />}
    </button>
  );
});
