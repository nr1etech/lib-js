import {
  component$,
  QRL,
  Signal,
  Slot,
  useSignal,
  useTask$,
} from '@builder.io/qwik';

export interface SelectFieldProps {
  id?: string;
  label?: string;
  name?: string;
  value?: string | null | Signal<string | null | undefined>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange$?: QRL<(event: Event, element: HTMLSelectElement) => void>;
  onBlur$?: QRL<(event: FocusEvent, element: HTMLSelectElement) => void>;
}

export const SelectField = component$((props: SelectFieldProps) => {
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
      <select
        {...(props.name && {name: props.name})}
        {...(props.id && {id: props.id})}
        required={props.required}
        aria-required={props.required}
        disabled={props.disabled}
        class={`select ${props.error ? 'select-error' : ''}`}
        onChange$={props.onChange$}
        onBlur$={props.onBlur$}
      >
        <Slot />
      </select>
      {props.error && <div class="text-error mt-1 text-xs">{props.error}</div>}
    </div>
  );
});
