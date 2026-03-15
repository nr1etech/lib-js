import {component$} from '@builder.io/qwik';
import type {PropsOf} from '@builder.io/qwik';

export interface RadioFieldProps extends PropsOf<'input'> {
  label: string;
  error?: string;
}

export const RadioField = component$((props: RadioFieldProps) => {
  const {label, error, id, class: className, ...inputProps} = props;

  return (
    <div class="fieldset">
      <label class="label" for={id}>
        <input
          type="radio"
          id={id}
          class={`radio ${error ? 'radio-error' : ''} ${className ?? ''}`}
          {...inputProps}
        />
        {label}
      </label>
      {error && <div class="text-error mt-1 text-xs">{error}</div>}
    </div>
  );
});
