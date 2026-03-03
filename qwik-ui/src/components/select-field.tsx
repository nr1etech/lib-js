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
  error?: string | Signal<string | undefined>;
  required?: boolean;
  disabled?: boolean | Signal<boolean>;
  onChange$?: QRL<
    (event: Event, value: string, error: Signal<string | undefined>) => void
  >;
  onBlur$?: QRL<
    (
      event: FocusEvent,
      value: string,
      error: Signal<string | undefined>,
    ) => void
  >;
  onEvent$?: QRL<
    (
      type: 'blur' | 'change',
      event: Event,
      value: string,
      error: Signal<string | undefined>,
    ) => void
  >;
}

export const SelectField = component$((props: SelectFieldProps) => {
  const error = useSignal<string | undefined>(
    typeof props.error === 'string' ? props.error : props.error?.value,
  );
  const value = useSignal<string | null | undefined>(
    typeof props.value === 'string' ? props.value : props.value?.value,
  );
  const disabled = useSignal<boolean>(false);
  if (props.disabled) {
    if (typeof props.disabled === 'boolean') {
      disabled.value = props.disabled;
    } else {
      disabled.value = props.disabled.value;
    }
  }
  // Synchronize local error to props.error
  useTask$(({track}) => {
    if (props.error && typeof props.error !== 'string') {
      track(() => error.value);
      if (error.value !== props.error?.value) {
        props.error.value = error.value;
      }
    }
  });
  // Synchronize props.error to local error
  useTask$(({track}) => {
    if (props.error && typeof props.error !== 'string') {
      track(() => (props.error as Signal).value);
      if (props.error && error.value !== props.error.value) {
        error.value = props.error.value;
      }
    }
  });
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
      if (props.value && error.value !== props.value.value) {
        value.value = props.value.value;
      }
    }
  });
  // Synchronize local disabled to props disabled
  useTask$(({track}) => {
    if (props.disabled && typeof props.disabled !== 'boolean') {
      track(() => disabled.value);
      if (disabled.value !== props.disabled?.value) {
        props.disabled.value = disabled.value;
      }
    }
  });
  // Synchronize props disabled to local disabled
  useTask$(({track}) => {
    if (props.disabled && typeof props.disabled !== 'boolean') {
      track(() => (props.disabled as Signal).value);
      if (props.disabled && disabled.value !== props.disabled.value) {
        disabled.value = props.disabled.value;
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
        disabled={disabled.value}
        class={`select ${error.value ? 'select-error' : ''}`}
        onChange$={(e) => {
          const target = e.target as HTMLSelectElement;
          if (props.onChange$) {
            props.onChange$(e, target.value, error);
          }
          if (props.onEvent$) {
            props.onEvent$('change', e, target.value, error);
          }
          if (props.value && typeof props.value !== 'string') {
            value.value = target.value;
          }
        }}
        onBlur$={(e) => {
          const target = e.target as HTMLSelectElement;
          if (props.onBlur$) {
            props.onBlur$(e, target.value, error);
          }
          if (props.onEvent$) {
            props.onEvent$('blur', e, target.value, error);
          }
          if (props.value && typeof props.value !== 'string') {
            value.value = target.value;
          }
        }}
      >
        <Slot />
      </select>
      {error.value && <div class="text-error mt-1 text-xs">{error.value}</div>}
    </div>
  );
});
