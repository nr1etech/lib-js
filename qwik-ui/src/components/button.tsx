import {
  Slot,
  component$,
  type Component,
  type JSXChildren,
  type PropsOf,
} from '@builder.io/qwik';
import type {IconProps} from '@nr1e/qwik-icons';
import {SpinnersBarsFade} from '@nr1e/qwik-icons';

export interface ButtonProps extends Omit<PropsOf<'button'>, 'children'> {
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
   * Text to display on the button. Alternative to the `default` slot.
   */
  text?: string;
  /**
   * Whether the button is processing. This will replace the icon with a rotating spinner when true.
   */
  processing?: boolean;
  children?: JSXChildren;
}

/**
 * Button component.
 */
export const Button = component$((props: ButtonProps) => {
  const {
    icon,
    iconSize,
    iconClass,
    text,
    processing,
    disabled,
    type,
    onClick$,
    class: className,
    children,
    ...buttonProps
  } = props;

  const isDisabled = processing || disabled;

  return (
    <button
      class={`btn ${isDisabled ? 'disabled' : ''} ${className ?? ''}`}
      disabled={isDisabled}
      type={type ?? 'button'}
      onClick$={!isDisabled && onClick$ ? onClick$ : undefined}
      {...buttonProps}
    >
      {processing ? (
        <span class="animate-spin">
          <SpinnersBarsFade size={iconSize ?? 18} />
        </span>
      ) : props.icon ? (
        <span class={props.iconClass}>
          <props.icon size={iconSize ?? 18} />
        </span>
      ) : (
        <span class={props.iconClass} q:slot="icon"></span>
      )}
      {text ? text : <Slot />}
    </button>
  );
});
