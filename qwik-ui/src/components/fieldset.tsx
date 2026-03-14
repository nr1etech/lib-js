import {Slot, component$} from '@builder.io/qwik';

export interface FieldsetProps {
  legend?: string;
}

export const Fieldset = component$((props: FieldsetProps) => {
  return (
    <fieldset class="fieldset border-base-content/40 rounded-md border pr-4 pb-4 pl-4">
      {props.legend && <legend class="fieldset-legend">{props.legend}</legend>}
      <Slot />
    </fieldset>
  );
});
