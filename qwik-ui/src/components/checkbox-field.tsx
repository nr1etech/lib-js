import {component$} from '@builder.io/qwik';
import type {PropsOf} from '@builder.io/qwik';

export interface CheckboxFieldProps extends PropsOf<'input'> {
  label: string;
  error?: string;
}

export const CheckboxField = component$((props: CheckboxFieldProps) => {
  const {label, error, id, class: className, ...inputProps} = props;

  return (
    <div class="fieldset">
      <label class="label" for={id}>
        <input
          type="checkbox"
          id={id}
          class={`checkbox ${error ? 'checkbox-error' : ''} ${className ?? ''}`}
          {...inputProps}
        />
        {label}
      </label>
      {error && <div class="text-error mt-1 text-xs">{error}</div>}
    </div>
  );
});
