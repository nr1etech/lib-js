import {component$, useSignal, useVisibleTask$} from '@builder.io/qwik';

function formatDateTime(
  date?: string | Date,
  timeZone?: string,
  locale?: string,
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale ?? 'en-US', {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(dateObj);
}

export interface FormatDateTimeProps {
  timeZone?: string | null;
  locale?: string | null;
  date: Date | string | null;
}

export const FormatDateTime = component$((props: FormatDateTimeProps) => {
  const date = useSignal<string | null>(null);

  if (!props.date) return null;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (props.date) {
      let timeZone: string | null | undefined = props.timeZone;
      if (!props.timeZone) {
        timeZone = localStorage.getItem('timezone');
        if (!timeZone || timeZone === 'auto') {
          timeZone = null;
        }
      }
      date.value = formatDateTime(
        props.date,
        timeZone ?? undefined,
        props.locale ?? undefined,
      );
    }
  });

  return <>{date.value}</>;
});
