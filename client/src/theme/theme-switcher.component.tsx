import { FC, ReactElement, useEffect } from 'react';

import { useLocalStorage } from '@astrosat/react-utils';

import { MoonIcon } from './moon-icon.component';
import { SunIcon } from './sun-icon.component';
import { DARK, DARK_LABEL, LIGHT, LIGHT_LABEL, THEME_KEY } from './theme.constants';

interface Props {
  /** Not used. Uses document root classList, or overrides with local storage. */
  className?: string;
}

export const ThemeSwitcher: FC<Props> = ({ className }): ReactElement => {
  const [theme, setTheme] = useLocalStorage(THEME_KEY, DARK);

  const label = theme === DARK ? LIGHT_LABEL : DARK_LABEL;

  useEffect(() => {
    if (window === undefined) {
      return;
    }
    const root = window.document.documentElement;
    root.classList.remove(theme === DARK ? LIGHT : DARK);
    root.classList.add(theme);
  }, [theme]);

  return (
    <button
      aria-label={label}
      className={`btn-primary btn-circle btn transition-transform ease-in-out hover:bg-accent hover:text-accent focus:outline-none focus-visible:outline-accent ${className}`}
      title={label}
      onClick={() => setTheme(theme === DARK ? LIGHT : DARK)}
    >
      {theme === DARK ? <MoonIcon className="h-7 w-7" /> : <SunIcon className="h-7 w-7" />}
    </button>
  );
};
