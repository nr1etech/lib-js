import {
  $,
  component$,
  QRL,
  Signal,
  Slot,
  useOnDocument,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import {MdiClose, Spinners6DotsRotate} from '@nr1e/qwik-icons';
import {AlertError} from './alert-error';
import {AlertInfo} from './alert-info';
import {AlertWarning} from './alert-warning';
import {AlertSuccess} from './alert-success';

export interface DialogProps {
  id?: string;
  open: Signal<boolean>;
  showCloseIcon?: boolean;
  class?: string;
  modalBoxClass?: string;
  title?: string;
  errorMessage?: string;
  infoMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  onClose$?: QRL<(e: HTMLDialogElement) => void>;
  onPostClose$?: QRL<(e: HTMLDialogElement) => void>;
  onOpen$?: QRL<(e: HTMLDialogElement) => void>;
  onPostOpen$?: QRL<(e: HTMLDialogElement) => void>;
  loading?: Signal<boolean>;
}

export const Dialog = component$((props: DialogProps) => {
  const internalOpen = useSignal(props.open.value);
  const dialog = useSignal<HTMLDialogElement>();
  useTask$(async ({track}) => {
    track(() => props.open.value);
    if (!props.open.value && internalOpen.value) {
      if (props.onClose$ && dialog.value) {
        await props.onClose$(dialog.value);
      }
      internalOpen.value = false;
      if (props.onPostClose$ && dialog.value) {
        await props.onPostClose$(dialog.value);
      }
    }
    if (props.open.value && !internalOpen.value) {
      if (props.onOpen$ && dialog.value) {
        await props.onOpen$(dialog.value);
      }
      internalOpen.value = true;
      // Scroll to top when dialog opens
      if (dialog.value) {
        dialog.value.scrollTop = 0;
      }
      if (props.onPostOpen$ && dialog.value) {
        await props.onPostOpen$(dialog.value);
      }
    }
  });
  // Close dialog on escape key press
  useOnDocument(
    'keydown',
    $((event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        props.open.value = false;
      }
    }),
  );
  return (
    <dialog
      ref={dialog}
      class={`modal ${props.class}`}
      id={props.id}
      open={internalOpen.value}
    >
      <div class={`modal-box ${props.modalBoxClass ?? ''}`}>
        {props.showCloseIcon && (
          <button
            class="btn btn-sm btn-circle btn-ghost absolute top-1 right-1 z-50"
            onClick$={() => {
              props.open.value = false;
            }}
          >
            <MdiClose size={24} />
          </button>
        )}
        <Slot name="title">
          {props.title && (
            <div class="text-lg font-bold">{props.title}</div>
          )}
        </Slot>
        <div class="py-4">
          {props.loading && props.loading.value && (
            <div class="flex justify-center p-20">
              <div class="opacity-20">
                <Spinners6DotsRotate size={64} />
              </div>
            </div>
          )}
          {(!props.loading || !props.loading.value) && (
            <>
              <Slot />
              {props.errorMessage ||
              props.infoMessage ||
              props.successMessage ||
              props.warningMessage ? (
                <div class="mt-3 space-y-2">
                  {props.infoMessage && (
                    <AlertInfo message={props.infoMessage} />
                  )}
                  {props.warningMessage && (
                    <AlertWarning message={props.warningMessage} />
                  )}
                  {props.errorMessage && (
                    <AlertError message={props.errorMessage} />
                  )}
                  {props.successMessage && (
                    <AlertSuccess message={props.successMessage} />
                  )}
                </div>
              ) : (
                ''
              )}
            </>
          )}
        </div>
        <div class="modal-action mt-2 items-center">
          <Slot name="action" />
        </div>
      </div>
    </dialog>
  );
});
