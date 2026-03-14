import {component$, QRL, Slot} from '@builder.io/qwik';
import {SpinnersBarsRotateFade} from '@nr1e/qwik-icons';

export interface SubmitButtonProps {
  class?: string;
  onClick$?: QRL<(event: Event) => void>;
  id?: string;
  disabled?: boolean;
  submitting?: boolean;
}

export const SubmitButton = component$((props: SubmitButtonProps) => {
  return (
    <button
      class={`btn btn-primary ${props.submitting || props.disabled ? 'disabled' : ''} `}
      onClick$={props.onClick$}
      id={props.id}
      type="submit"
    >
      <span q:slot="icon"></span>
      {props.submitting && (
        <span class="animate-spin">
          <SpinnersBarsRotateFade size={18} />
        </span>
      )}
      <Slot />
    </button>
  );
});
