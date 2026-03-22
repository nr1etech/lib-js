import {component$, Slot} from '@builder.io/qwik';
import type {PropsOf} from '@builder.io/qwik';

export interface SelectFieldProps extends Omit<PropsOf<'select'>, 'children'> {
  label?: string;
  error?: string;
  placeholder?: string;
  options?: Record<string, string> | string[];
}

export const SelectField = component$((props: SelectFieldProps) => {
  const {label, error, id, class: className, ...selectProps} = props;

  // Convert options to a normalized format
  const optionsEntries = Array.isArray(props.options)
    ? props.options.map((opt) => [opt, opt] as [string, string])
    : Object.entries(props.options ?? {});

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
        {props.placeholder && (
          <option disabled={true} selected={!props.value || props.value === ''}>
            {props.placeholder}
          </option>
        )}
        {optionsEntries.map(([k, v]) => (
          <option key={k} value={v} selected={v === props.value}>
            {k}
          </option>
        ))}
        <Slot />
      </select>

      {error && <div class="text-error mt-1 text-xs">{error}</div>}
    </div>
  );
});
