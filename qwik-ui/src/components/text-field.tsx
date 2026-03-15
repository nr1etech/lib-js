import {Slot, component$, QRL, Signal, Component} from '@builder.io/qwik';
import {IconProps} from '@nr1e/qwik-icons';

/**
 * The type of the input field.
 */
export type TextFieldType =
  | 'text'
  | 'date'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'password';

/**
 * Properties for the TextField component.
 */
export interface TextFieldProps {
  id?: string;
  type?: TextFieldType;
  label?: string;
  name?: string;
  value?: string | null | Signal<string | null | undefined>;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  /**
   * Called when the input loses focus.
   */
  onBlur$?: QRL<(event: FocusEvent, element: HTMLInputElement) => void>;
  /**
   * Called when the input value changes.
   */
  onInput$?: QRL<(event: InputEvent, element: HTMLInputElement) => void>;
  icon?: Component<IconProps>;
}

/**
 * A standardized text input field meant to be used independently or with Qwik
 * Modular Forms.
 */
export const TextField = component$((props: TextFieldProps) => {
  // Extract only what's needed for onInput$ to avoid serializing the entire props
  const value = props.value;
  const onInputHandler = props.onInput$;

  return (
    <div class="fieldset">
      {props.label && (
        <label class="label" {...(props.id && {for: props.id})}>
          <span class="label-text">{props.label}</span>
        </label>
      )}
      <label class={`input w-full ${props.error ? 'input-error' : ''}`}>
        <Slot name="left" />
        {props.icon && <props.icon size={18} class="opacity-50" />}
        <input
          type={props.type || 'text'}
          {...(props.id && {id: props.id})}
          {...(props.name && {name: props.name})}
          required={props.required}
          aria-required={props.required}
          disabled={props.disabled}
          maxLength={props.maxLength}
          value={
            typeof props.value === 'string' ? props.value : props.value?.value
          }
          class="placeholder:opacity-50"
          placeholder={props.placeholder}
          onBlur$={props.onBlur$}
          onInput$={(event, element) => {
            if (value && typeof value !== 'string') {
              value.value = element.value;
            }
            if (onInputHandler) {
              onInputHandler(event, element);
            }
          }}
        />
        <Slot name="right" />
      </label>
      {props.error && <div class="text-error mt-1 text-xs">{props.error}</div>}
    </div>
  );
});
