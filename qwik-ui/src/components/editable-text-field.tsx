import {component$, useSignal, type QRL} from '@builder.io/qwik';
import {Link} from '@builder.io/qwik-city';
import {MdiCheck, MdiClose, MdiPencilOutline} from '@nr1e/qwik-icons';
import {TextField} from './text-field';

export interface EditableTextFieldProps {
  /**
   * The name of the field, used as the input name attribute.
   */
  fieldName: string;
  /**
   * The display value shown when not in edit mode.
   */
  value?: string | null;
  /**
   * The raw value pre-populated in the input when entering edit mode.
   * Defaults to `value` if not provided.
   */
  rawValue?: string | null;
  /**
   * When true and `href` is provided, the value is rendered as a link in view mode.
   */
  isLink?: boolean;
  /**
   * The URL used when `isLink` is true.
   */
  href?: string;
  /**
   * Placeholder text shown when the value is empty.
   */
  placeholder?: string;
  /**
   * Label displayed above the text field in edit mode.
   */
  label?: string;
  /**
   * Validation error message shown in edit mode.
   */
  error?: string;
  /**
   * Additional CSS classes applied to the outer container.
   */
  class?: string;
  /**
   * Callback invoked when the user saves the edited value. Throw to signal a
   * save failure — the error message will be shown and edit mode will remain open.
   */
  onSave$: QRL<(value: string) => void | Promise<void>>;
}

/**
 * An inline-editable text field. Shows the current value in view mode and
 * switches to a TextField input when the user clicks the pencil icon.
 */
export const EditableTextField = component$((props: EditableTextFieldProps) => {
  const {
    fieldName,
    value,
    rawValue,
    isLink,
    href,
    placeholder,
    label,
    error,
    class: className,
    onSave$,
  } = props;

  const isEditing = useSignal(false);
  const editValue = useSignal(rawValue ?? value ?? '');
  const localError = useSignal('');

  const displayError = localError.value || (error ?? '');

  return (
    <div class={`flex items-center gap-2 ${className ?? ''}`}>
      {isEditing.value ? (
        <>
          <TextField
            name={fieldName}
            value={editValue.value}
            label={label}
            placeholder={placeholder}
            error={displayError}
            class="flex-1"
            onInput$={(e) => {
              editValue.value = (e.target as HTMLInputElement).value;
            }}
          />
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onClick$={async () => {
              localError.value = '';
              try {
                await onSave$(editValue.value);
                isEditing.value = false;
              } catch (err) {
                localError.value =
                  err instanceof Error ? err.message : 'An error occurred';
              }
            }}
          >
            <MdiCheck size={18} />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onClick$={() => {
              editValue.value = rawValue ?? value ?? '';
              localError.value = '';
              isEditing.value = false;
            }}
          >
            <MdiClose size={18} />
          </button>
        </>
      ) : (
        <>
          {isLink && href ? (
            <Link href={href}>{value ?? placeholder ?? ''}</Link>
          ) : (
            <span>{value ?? placeholder ?? ''}</span>
          )}
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            onClick$={() => {
              editValue.value = rawValue ?? value ?? '';
              localError.value = '';
              isEditing.value = true;
            }}
          >
            <MdiPencilOutline size={18} />
          </button>
        </>
      )}
    </div>
  );
});
