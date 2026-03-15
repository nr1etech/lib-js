import {
  component$,
  useSignal,
  useVisibleTask$,
  type QRL,
} from '@builder.io/qwik';
import {MdiChevronDown, SpinnersBarsRotateFade} from '@nr1e/qwik-icons';

function capitalizeFirstLetter(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function themeToName(theme: string) {
  return theme.split('-').map(capitalizeFirstLetter).join(' ');
}

export const THEMES = [
  'auto',
  'light',
  'dark',
  'abyss',
  'acid',
  'aqua',
  'autumn',
  'black',
  'bumblebee',
  'business',
  'caramellatte',
  'cmyk',
  'coffee',
  'corporate',
  'cupcake',
  'cyberpunk',
  'dim',
  'dracula',
  'emerald',
  'fantasy',
  'forest',
  'garden',
  'halloween',
  'lemonade',
  'lofi',
  'luxury',
  'night',
  'nord',
  'pastel',
  'retro',
  'silk',
  'sunset',
  'synthwave',
  'valentine',
  'wireframe',
  'winter',
];

/**
 * Properties for ThemeSelector.
 */
export interface ThemeSelectorProps {
  /**
   * List of themes to show in the dropdown. Default is all themes.
   */
  themes?: string[];
  /**
   * Callback function that is called when the theme changes.
   */
  onValueChange$?: QRL<(theme: string) => void>;
}

/**
 * ThemeSelector drop down component. This will save theme selection to localStorage under 'theme'.
 */
export const ThemeSelector = component$((props?: ThemeSelectorProps) => {
  const currentTheme = useSignal<string | undefined>(undefined);
  const onValueChange = props?.onValueChange$;

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Read theme from localStorage on component mount
    const savedTheme = localStorage.getItem('theme');
    currentTheme.value = savedTheme ?? 'auto';
  });

  return (
    <div class="dropdown">
      <button role="button" tabIndex={0} class="btn m-1">
        {currentTheme.value !== undefined ? (
          themeToName(currentTheme.value)
        ) : (
          <SpinnersBarsRotateFade size={18} />
        )}
        <MdiChevronDown size={16} class="fill-current opacity-60" />
      </button>
      <div tabIndex={0} class="dropdown-content card bg-base-100 z-1 shadow-md">
        <div class="card-body rounded-box z-1">
          <div class="grid min-w-50 grid-cols-1 gap-2 p-2 sm:min-w-100 sm:grid-cols-2 lg:min-w-150 lg:grid-cols-3">
            {(props?.themes ?? THEMES).map((theme) => (
              <input
                key={theme}
                type="radio"
                name="theme-dropdown"
                class="theme-controller btn btn-sm btn-ghost justify-start"
                aria-label={themeToName(theme)}
                value={theme}
                checked={theme === (currentTheme.value ?? 'auto')}
                onChange$={() => {
                  currentTheme.value = theme;
                  if (theme === 'auto') {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.removeItem('theme');
                  } else {
                    localStorage.setItem('theme', theme);
                  }

                  // Notify parent component of change
                  if (onValueChange) {
                    onValueChange(theme);
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
