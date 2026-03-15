import {component$, Slot} from '@builder.io/qwik';
import type {PropsOf} from '@builder.io/qwik';

export interface SelectFieldProps extends Omit<PropsOf<'select'>, 'children'> {
  label?: string;
  error?: string;
}

export const SelectField = component$((props: SelectFieldProps) => {
  const {label, error, id, class: className, ...selectProps} = props;

  return (
    <div class="fieldset">
      {label && (
        <label class="label" for={id}>
          <span class="label-text">{label}</span>
        </label>
      )}

      <select
        id={id}
        class={`select ${error ? 'select-error' : ''} ${className ?? ''}`}
        {...selectProps}
      >
        <Slot />
      </select>

      {error && <div class="text-error mt-1 text-xs">{error}</div>}
    </div>
  );
});
