import {component$, QRL, Signal, useSignal, useTask$} from '@builder.io/qwik';

export interface CheckboxFieldProps {
  id?: string;
  label: string;
  name?: string;
  checked?: boolean | Signal<boolean>;
  error?: string;
  onClick$?: QRL<(event: Event) => void>;
}

export const CheckboxField = component$((props: CheckboxFieldProps) => {
  const checked = useSignal<boolean>(
    typeof props.checked === 'boolean'
      ? props.checked
      : (props.checked?.value ?? false),
  );
  useTask$(({track}) => {
    if (props.checked && typeof props.checked !== 'boolean') {
      track(() => checked.value);
      if (checked.value !== props.checked?.value) {
        props.checked.value = checked.value;
      }
    }
  });
  useTask$(({track}) => {
    if (props.checked && typeof props.checked !== 'boolean') {
      track(() => (props.checked as Signal).value);
      if (props.checked && checked.value !== props.checked.value) {
        checked.value = props.checked.value;
      }
    }
  });
  return (
    <div class="fieldset">
      <label class="label" {...(props.id && {for: props.id})}>
        <input
          type="checkbox"
          {...(props.name && {name: props.name})}
          {...(props.id && {id: props.id})}
          checked={checked.value}
          class={`checkbox ${props.error ? 'checkbox-error' : ''}`}
          onClick$={props.onClick$}
        />
        {props.label}
      </label>
      {props.error && <div class="text-error mt-1 text-xs">{props.error}</div>}
    </div>
  );
});
