import {
  Slot,
  component$,
  QRL,
  Signal,
  useSignal,
  useTask$,
} from '@builder.io/qwik';

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
}

/**
 * A standardized text input field meant to be used independently or with Qwik
 * Modular Forms.
 *
 * Be aware that the normalized value of the input from validation is reflected
 * back into the text field automatically on blur.
 */
export const TextField = component$((props: TextFieldProps) => {
  const value = useSignal<string | null | undefined>(
    typeof props.value === 'string' ? props.value : props.value?.value,
  );
  // Synchronize local value to props value
  useTask$(({track}) => {
    if (props.value && typeof props.value !== 'string') {
      track(() => value.value);
      if (value.value !== props.value?.value) {
        props.value.value = value.value;
      }
    }
  });
  // Synchronize props value to local value
  useTask$(({track}) => {
    if (props.value && typeof props.value !== 'string') {
      track(() => (props.value as Signal).value);
      if (props.value.value !== value.value) {
        value.value = props.value.value;
      }
    }
  });
  return (
    <div class="fieldset">
      {props.label && (
        <label class="label" {...(props.id && {for: props.id})}>
          <span class="label-text">{props.label}</span>
        </label>
      )}
      <label class={`input w-full ${props.error ? 'input-error' : ''}`}>
        <Slot name="left" />
        <input
          type={props.type || 'text'}
          {...(props.id && {id: props.id})}
          {...(props.name && {name: props.name})}
          required={props.required}
          aria-required={props.required}
          disabled={props.disabled}
          maxLength={props.maxLength}
          value={value.value}
          class="placeholder:opacity-50"
          placeholder={props.placeholder}
          onBlur$={props.onBlur$}
          onInput$={props.onInput$}
        />
        <Slot name="right" />
      </label>
      {props.error && <div class="text-error mt-1 text-xs">{props.error}</div>}
    </div>
  );
});
