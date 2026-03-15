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

export function timeZoneToName(timezone: string, displayLocale?: Locale) {
  const messageKey = `tz_${timezone.replace(/\//g, '_')}`;
  const m = allMessages as any;
  if (messageKey in m && typeof m[messageKey] === 'function') {
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
  // Fallback: format timezone string
  if (timezone === 'auto') {
    return 'Auto (Browser)';
  }
  const parts = timezone.split('/');
  if (parts.length === 2) {
    return `${parts[0]}/${parts[1].replace(/_/g, ' ')}`;
  }
  return timezone.replace(/_/g, ' ');
}

const TIMEZONES = [
  'auto',
  // US & Canada
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Phoenix',
  'America/Toronto',
  'America/Vancouver',
  // Latin America
  'America/Mexico_City',
  'America/Bogota',
  'America/Lima',
  'America/Santiago',
  'America/Buenos_Aires',
  'America/Sao_Paulo',
  // Europe
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Brussels',
  'Europe/Vienna',
  'Europe/Stockholm',
  'Europe/Warsaw',
  'Europe/Athens',
  'Europe/Moscow',
  'Europe/Istanbul',
  // Asia
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Hong_Kong',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Bangkok',
  'Asia/Jakarta',
  'Asia/Manila',
  // Africa
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'Africa/Nairobi',
  // Australia & Pacific
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Perth',
  'Pacific/Auckland',
  'Pacific/Fiji',
  // Other
  'UTC',
];

export interface TimeZoneSelectorProps {
  timeZones?: string[];
  onValueChange$?: QRL<(timezone: string) => void>;
}

export const TimeZoneSelector = component$((props?: TimeZoneSelectorProps) => {
  const currentTimeZone = useSignal<string | undefined>(undefined);
  const displayLocale = useSignal<Locale>('en' as Locale);
  const onValueChange = props?.onValueChange$;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Read timezone from localStorage on component mount
    const savedTimeZone = localStorage.getItem('timezone');
    currentTimeZone.value = savedTimeZone ?? 'auto';
    const savedLocale = localStorage.getItem('locale');
    displayLocale.value = toParaglideLocale(savedLocale ?? 'en');
  });

  return (
    <div class="dropdown">
      <button role="button" tabIndex={0} class="btn m-1">
        {currentTimeZone.value !== undefined ? (
          timeZoneToName(currentTimeZone.value, displayLocale.value)
        ) : (
          <SpinnersBarsRotateFade size={18} />
        )}
        <MdiChevronDown size={16} class="fill-current opacity-60" />
      </button>
      <div tabIndex={0} class="dropdown-content card bg-base-100 z-1 shadow-md">
        <div class="card-body rounded-box z-1">
          <div class="grid min-w-50 grid-cols-1 gap-2 p-2 sm:min-w-100 sm:grid-cols-2 lg:min-w-150 lg:grid-cols-3">
            {(props?.timeZones ?? TIMEZONES).map((timezone) => (
              <input
                key={timezone}
                type="radio"
                name="timezone-dropdown"
                class="btn btn-sm btn-ghost justify-start"
                aria-label={timeZoneToName(timezone, displayLocale.value)}
                value={timezone}
                checked={timezone === (currentTimeZone.value ?? 'auto')}
                onChange$={() => {
                  currentTimeZone.value = timezone;
                  if (timezone === 'auto') {
                    localStorage.removeItem('timezone');
                  } else {
                    localStorage.setItem('timezone', timezone);
                  }

                  // Notify parent component of change
                  if (onValueChange) {
                    onValueChange(timezone);
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
