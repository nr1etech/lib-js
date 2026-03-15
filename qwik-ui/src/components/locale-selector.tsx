import {
  component$,
  useSignal,
  useVisibleTask$,
  type QRL,
} from '@builder.io/qwik';
import {MdiChevronDown, SpinnersBarsRotateFade} from '@nr1e/qwik-icons';
import * as allMessages from '../paraglide/messages.js';
import {type Locale} from '../paraglide/runtime.js';

// Map full locale codes (en-US) to paraglide locale codes (en)
function toParaglideLocale(locale: string): Locale {
  const baseCode = locale.split('-')[0]?.toLowerCase();
  // Paraglide locales: "af","de","en","es","fr","nl"
  const validLocales = ['af', 'de', 'en', 'es', 'fr', 'nl'];
  if (validLocales.includes(baseCode)) {
    return baseCode as Locale;
  }
  return 'en' as Locale;
}

export function localeToName(locale: string, displayLocale?: Locale) {
  // Convert locale code to paraglide message key
  // Replace hyphens with underscores for paraglide compatibility (e.g., 'en-US' -> 'en_US')
  const messageKey = locale.replace(/-/g, '_');

  // Explicitly reference all messages to prevent tree-shaking
  const m = allMessages as any;

  if (
    messageKey in m &&
    typeof m[messageKey as keyof typeof m] === 'function'
  ) {
    // Pass the locale option to get the message in the desired language
    if (displayLocale) {
      return (
        m[messageKey as keyof typeof m] as (
          inputs: any,
          options: {locale: Locale},
        ) => string
      )({}, {locale: displayLocale});
    }
    return (m[messageKey as keyof typeof m] as () => string)();
  }

  return locale;
}

const LOCALES = [
  'auto',
  'af',
  'ar',
  'en',
  'en-GB',
  'en-US',
  'en-ZA',
  'es',
  'es-US',
  'fr',
  'fr-CA',
  'fr-FR',
];

export interface LocaleSelectorProps {
  locales?: string[];
  onValueChange$?: QRL<(locale: string) => void>;
}

export const LocaleSelector = component$((props?: LocaleSelectorProps) => {
  const currentLocale = useSignal<string | undefined>(undefined);
  const displayLocale = useSignal<Locale>('en' as Locale);
  const onValueChange = props?.onValueChange$;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Read locale from localStorage on component mount
    const savedLocale = localStorage.getItem('locale');
    currentLocale.value = savedLocale ?? 'auto';
    displayLocale.value = toParaglideLocale(savedLocale ?? 'auto');
  });

  return (
    <div class="dropdown">
      <button role="button" tabIndex={0} class="btn m-1">
        {currentLocale.value !== undefined ? (
          localeToName(currentLocale.value, displayLocale.value)
        ) : (
          <SpinnersBarsRotateFade size={18} />
        )}
        <MdiChevronDown size={16} class="fill-current opacity-60" />
      </button>
      <div tabIndex={0} class="dropdown-content card bg-base-100 z-1 shadow-md">
        <div class="card-body rounded-box z-1">
          <div class="grid min-w-50 grid-cols-1 gap-2 p-2 sm:min-w-100 sm:grid-cols-2 lg:min-w-150 lg:grid-cols-3">
            {(props?.locales ?? LOCALES).map((locale) => (
              <input
                key={locale}
                type="radio"
                name="locale-dropdown"
                class="btn btn-sm btn-ghost justify-start"
                aria-label={localeToName(locale, displayLocale.value)}
                value={locale}
                checked={locale === (currentLocale.value ?? 'auto')}
                onChange$={() => {
                  currentLocale.value = locale;
                  displayLocale.value = toParaglideLocale(locale);
                  if (locale === 'auto') {
                    localStorage.removeItem('locale');
                  } else {
                    localStorage.setItem('locale', locale);
                  }

                  // Notify parent component of change
                  if (onValueChange) {
                    onValueChange(locale);
                  }

                  // Close the dropdown by removing focus
                  const activeElement = document.activeElement as HTMLElement;
                  if (activeElement) {
                    activeElement.blur();
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
