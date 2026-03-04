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

/**
 * The type of the input field.
 */
export type TextFieldType =
  | 'text'
  | 'date'
  | 'email'
  | 'number'
  | 'tel'
  | 'url';

/**
 * The result of validating a form input.
 */
export type TextFieldValidationResult = {
  /**
   * True if validation was successful. False if validation failed.
   */
  success: boolean;
  /**
   * The error message if validation failed.
   */
  error?: string;
  /**
   * The normalized value of the input after successful validation.
   */
  output: string | null | undefined;
};

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
  error?: string | Signal<string | undefined>;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean | Signal<boolean>;
  /**
   * Called when the input loses focus.
   */
  onBlur$?: QRL<
    (
      event: FocusEvent,
      value: string,
      error: Signal<string | undefined>,
    ) => void
  >;
  /**
   * Called when the input value changes.
   */
  onInput$?: QRL<
    (
      event: InputEvent,
      value: string,
      error: Signal<string | undefined>,
    ) => void
  >;
  /**
   * Called on blur or input events
   */
  onEvent$?: QRL<
    (
      type: 'blur' | 'input',
      event: FocusEvent | InputEvent,
      value: string,
      error: Signal<string | undefined>,
    ) => void
  >;
  /**
   * Validates the form input. This is called on input and blur events.
   */
  validate$?: QRL<
    (value: string | null | undefined) => TextFieldValidationResult
  >;
  /**
   * Called to validate the form input. This is called on input and blur events
   * and is an alternative to the validate$ prop.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema$?: QRL<() => v.BaseSchema<any, any, any>>;
  /**
   * An optional signal that indicates whether the input is valid.
   */
  valid?: Signal<undefined | boolean>;
  /**
   * Increment the value of this signal to reset the input to its original value.
   */
  triggerReset?: Signal<number>;
  /**
   * Increment the value of this signal to force validation to execute. Be
   * aware that this will also cause the input to be touched, which will
   * display the error message if one exists.
   */
  triggerValidation?: Signal<number>;
}

/**
 * A standardized text input field meant to be used independently or with Qwik
 * Modular Forms.
 *
 * Be aware that the normalized value of the input from validation is reflected
 * back into the text field automatically on blur.
 */
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
  const originalTriggerResetValue = props.triggerReset?.value;
  const originalTriggerValidationValue = props.triggerValidation?.value;

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
      if (originalTriggerResetValue !== props.triggerReset.value) {
        value.value = originalValue;
        error.value = undefined;
        touched.value = false;
      }
    }
  });

  const validate = $(async () => {
    // Validate using valibot if a schema was provided.
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
      // Store the normalized value of the input from valibot validation.
      if (value.value !== result.output) {
        value.value = result.output;
      }
    }
    // Validate using the validate$ prop if provided.
    if (props.validate$) {
      const result = await props.validate$(value.value);
      if (!result.success) {
        if (props.valid) {
          props.valid.value = false;
        }
        error.value = result.error;
        return;
      }
      // Store the normalized value of the input from the validate$ prop.
      if (value.value !== result.output) {
        value.value = result.output;
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
      if (props.triggerValidation.value !== originalTriggerValidationValue) {
        touched.value = true;
        await validate();
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
      <label
        class={`input w-full ${error.value && touched.value ? 'input-error' : ''}`}
      >
        <Slot name="left" />
        <input
          type={props.type || 'text'}
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
            // Reflect the normalized value of the input back into the text field on blur.
            target.value = value.value ?? '';
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
