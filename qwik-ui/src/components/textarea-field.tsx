import {component$} from '@builder.io/qwik';
import type {PropsOf} from '@builder.io/qwik';

export interface TextareaFieldProps extends PropsOf<'textarea'> {
  label?: string;
  error?: string;
}

export const TextareaField = component$((props: TextareaFieldProps) => {
  const {label, error, id, class: className, ...textareaProps} = props;

  return (
    <div class="fieldset">
      {label && (
        <label class="label" for={id}>
          <span class="label-text">{label}</span>
        </label>
      )}

      <textarea
        id={id}
        class={`textarea ${error ? 'textarea-error' : ''} ${className ?? ''}`}
        {...textareaProps}
      />

      {error && <div class="text-error mt-1 text-xs">{error}</div>}
    </div>
  );
});
