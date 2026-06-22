import {component$, useSignal, type QRL} from '@builder.io/qwik';
import {Link} from '@builder.io/qwik-city';
import {MdiCheck, MdiClose, MdiPencilOutline} from '@nr1e/qwik-icons';

export interface EditableSelectFieldProps {
  /**
   * The name of the field, used as the select name attribute.
   */
  fieldName: string;
  /**
   * The display label shown when not in edit mode.
   */
  value?: string | null;
  /**
   * The raw option value (key in `selectOptions`) pre-selected when entering
   * edit mode. Defaults to an empty string if not provided.
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
   * Placeholder text shown when the value is empty in view mode.
   */
  placeholder?: string;
  /**
   * A map of option values to their display labels, e.g. `{active: 'Active', inactive: 'Inactive'}`.
   */
  selectOptions: Record<string, string>;
  /**
   * Label displayed above the select in edit mode.
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
   * Callback invoked when the user saves the selected value. Throw to signal a
   * save failure — the error message will be shown and edit mode will remain open.
   */
  onSave$: QRL<(value: string) => void | Promise<void>>;
}

/**
 * An inline-editable select field. Shows the current label in view mode and
 * switches to a select dropdown when the user clicks the pencil icon.
 */
export const EditableSelectField = component$(
  (props: EditableSelectFieldProps) => {
    const {
      fieldName,
      value,
      rawValue,
      isLink,
      href,
      placeholder,
      selectOptions,
      label,
      error,
      class: className,
      onSave$,
    } = props;

    const isEditing = useSignal(false);
    const editValue = useSignal(rawValue ?? '');
    const localError = useSignal('');

    const displayError = localError.value || (error ?? '');

    return (
      <div class={`flex items-center gap-2 ${className ?? ''}`}>
        {isEditing.value ? (
          <div class="fieldset flex-1">
            {label && (
              <label class="label" for={fieldName}>
                <span class="label-text">{label}</span>
              </label>
            )}
            <div class="flex items-center gap-2">
              <select
                id={fieldName}
                name={fieldName}
                class={`select w-full ${displayError ? 'select-error' : ''}`}
                value={editValue.value}
                onChange$={(e) => {
                  editValue.value = (e.target as HTMLSelectElement).value;
                }}
              >
                {Object.entries(selectOptions).map(([val, optLabel]) => (
                  <option key={val} value={val}>
                    {optLabel}
                  </option>
                ))}
              </select>
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
                  editValue.value = rawValue ?? '';
                  localError.value = '';
                  isEditing.value = false;
                }}
              >
                <MdiClose size={18} />
              </button>
            </div>
            {displayError && (
              <div class="text-error mt-1 text-xs">{displayError}</div>
            )}
          </div>
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
                editValue.value = rawValue ?? '';
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
  },
);
