import {
  Slot,
  component$,
  QRL,
  Signal,
  useSignal,
  useTask$,
  $,
} from '@builder.io/qwik';
import * as v from 'valibot';

export interface TextFieldProps {
  id?: string;
  label?: string;
  name?: string;
  value?: string | null | Signal<string | null | undefined>;
  placeholder?: string;
  error?: string | Signal<string | undefined>;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean | Signal<boolean>;
  onBlur$?: QRL<
    (
      event: FocusEvent,
      value: string,
      error: Signal<string | undefined>,
    ) => void
  >;
  onInput$?: QRL<
    (
      event: InputEvent,
      value: string,
      error: Signal<string | undefined>,
    ) => void
  >;
  onEvent$?: QRL<
    (
      type: 'blur' | 'input',
      event: FocusEvent | InputEvent,
      value: string,
      error: Signal<string | undefined>,
    ) => void
  >;
  validate$?: QRL<(value: string | null | undefined) => string | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema$?: QRL<() => v.BaseSchema<any, any, any>>;
  valid?: Signal<undefined | boolean>;
  /**
   * Increment the value of this signal to reset the input to its original value.
   */
  triggerReset?: Signal<number>;
  /**
   * Increment the value of this signal to force validation to execute.
   */
  triggerValidation?: Signal<number>;
}

export const TextField = component$((props: TextFieldProps) => {
  const error = useSignal<string | undefined>(
    typeof props.error === 'string' ? props.error : props.error?.value,
  );
  const value = useSignal<string | null | undefined>(
    typeof props.value === 'string' ? props.value : props.value?.value,
  );
  const originalValue =
    typeof props.value === 'string' ? props.value : props.value?.value;
  const disabled = useSignal<boolean>(false);
  if (props.disabled) {
    if (typeof props.disabled === 'boolean') {
      disabled.value = props.disabled;
    } else {
      disabled.value = props.disabled.value;
    }
  }
  // Touched is set to true when the user has blurred the input at least once.
  const touched = useSignal<boolean>(false);

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
  // Watch the reset trigger and reset the field to its original value.
  useTask$(async ({track}) => {
    if (props.triggerReset) {
      track(() => props.triggerReset?.value);
      value.value = originalValue;
      error.value = undefined;
      touched.value = false;
    }
  });

  const validate = $(async () => {
    if (props.schema$) {
      const schema = await props.schema$();
      const result = v.safeParse(schema, value.value);
      if (!result.success) {
        if (result.issues.length > 0) {
          if (props.valid) {
            props.valid.value = false;
          }
          error.value = (result.issues[0] as v.BaseIssue<unknown>).message;
          return;
        } else {
          if (props.valid) {
            props.valid.value = false;
          }
          error.value = 'Invalid value';
          return;
        }
      }
    }
    if (props.validate$) {
      const result = await props.validate$(value.value);
      if (result) {
        if (props.valid) {
          props.valid.value = false;
        }
        error.value = result;
        return;
      }
    }
    if (props.valid) {
      props.valid.value = true;
      error.value = undefined;
    }
  });

  // Watch the validation trigger and force validation to execute.
  useTask$(async ({track}) => {
    if (props.triggerValidation) {
      track(() => props.triggerValidation?.value);
      touched.value = true;
      await validate();
    }
  });

  return (
    <div class="fieldset">
      {props.label && (
        <label class="label" {...(props.id && {for: props.id})}>
          <span class="label-text">{props.label}</span>
        </label>
      )}
      <label
        class={`input w-full ${error.value && touched.value ? 'input-error' : ''}`}
      >
        <Slot name="left" />
        <input
          type="text"
          {...(props.id && {id: props.id})}
          {...(props.name && {name: props.name})}
          required={props.required}
          aria-required={props.required}
          disabled={disabled.value}
          maxLength={props.maxLength}
          value={value.value}
          class="placeholder:opacity-50"
          placeholder={props.placeholder}
          onBlur$={async (e) => {
            const target = e.target as HTMLInputElement;
            touched.value = true;
            value.value = target.value;
            await validate();
            if (props.onBlur$) {
              props.onBlur$(e, target.value, error);
            }
            if (props.onEvent$) {
              props.onEvent$('blur', e, target.value, error);
            }
          }}
          onInput$={async (e) => {
            const target = e.target as HTMLInputElement;
            value.value = target.value;
            await validate();
            if (props.onInput$) {
              props.onInput$(e, target.value, error);
            }
            if (props.onEvent$) {
              props.onEvent$('input', e, target.value, error);
            }
          }}
        />
        <Slot name="right" />
      </label>
      {error.value && touched.value && (
        <div class="text-error mt-1 text-xs">{error.value}</div>
      )}
    </div>
  );
});
