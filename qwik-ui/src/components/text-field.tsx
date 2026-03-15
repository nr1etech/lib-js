import {
  Slot,
  component$,
  type Component,
  type JSXChildren,
} from '@builder.io/qwik';
import type {PropsOf} from '@builder.io/qwik';
import type {IconProps} from '@nr1e/qwik-icons';

export interface TextFieldProps extends Omit<PropsOf<'input'>, 'children'> {
  label?: string;
  error?: string;
  icon?: Component<IconProps>;
  children?: JSXChildren;
}

export const TextField = component$((props: TextFieldProps) => {
  const {
    label,
    error,
    icon,
    id,
    class: className,
    children,
    ...inputProps
  } = props;

  return (
    <div class="fieldset">
      {label && (
        <label class="label" for={id}>
          <span class="label-text">{label}</span>
        </label>
      )}
      <label
        class={`input w-full ${error ? 'input-error' : ''} ${className ?? ''}`}
      >
        <Slot name="left" />
        {icon && <icon size={18} class="opacity-50" />}
        <input id={id} class="placeholder:opacity-50" {...inputProps} />
        <Slot name="right" />
      </label>
      {error && <div class="text-error mt-1 text-xs">{error}</div>}
    </div>
  );
});
