/**
 * The theme domain.
 *
 * A visitor makes a *choice* (`ThemePreference`). The theme that is actually
 * *shown* (`isDark`) is derived from that choice and from what the operating
 * system currently prefers. Keeping the two apart is what lets "system" follow
 * the OS as it changes, for example when a laptop switches automatically
 * between light and dark during the day.
 *
 * The functions at the top are pure and know nothing about the browser. The
 * store at the bottom is a thin shell that connects them to `localStorage`,
 * `matchMedia` and Alpine.
 */

// What the visitor chose. `system` defers to the operating system.
export type ThemePreference = 'system' | 'light' | 'dark';

// The key under which an explicit choice is persisted. Absent means `system`.
export const THEME_STORAGE_KEY = 'theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark'];

/**
 * Turns anything read from storage into a valid preference. A missing,
 * corrupted or unrecognised value (including one written by an older version)
 * means the visitor has not chosen, so it falls back to `system`.
 */
export function parsePreference(raw: unknown): ThemePreference {
  return PREFERENCES.includes(raw as ThemePreference) ? (raw as ThemePreference) : 'system';
}

/**
 * The theme to show, given the visitor's choice and the system's current
 * setting.
 */
export function resolveIsDark(preference: ThemePreference, systemIsDark: boolean): boolean {
  switch (preference) {
    case 'dark':
      return true;
    case 'light':
      return false;
    default:
      return systemIsDark;
  }
}

/**
 * Storage can be unavailable (private browsing, blocked cookies, quota), so
 * every access is guarded. The theme still works for the current page; it just
 * is not remembered.
 */
function readPreference(): ThemePreference {
  try {
    return parsePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

function writePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    // Not remembered; see above.
  }
}

export default {
  /**
   * What the visitor chose.
   *
   * @type {ThemePreference}
   */
  preference: 'system' as ThemePreference,

  /**
   * Whether the operating system currently prefers dark. Tracked live so that
   * `system` follows it.
   *
   * @type {boolean}
   */
  systemIsDark: false,

  /**
   * Whether the application is in dark mode. Derived from `preference` and
   * `systemIsDark`; use `setPreference` or `toggle` to change it.
   *
   * @type {boolean}
   */
  isDark: false,

  /**
   * Initialises the store: restores the stored choice, reads the system
   * preference, and starts following changes to either.
   */
  init() {
    const query = window.matchMedia(DARK_QUERY);

    this.systemIsDark = query.matches;
    this.preference = readPreference();
    this.apply();

    // Follow the operating system. This only changes what is shown while the
    // preference is `system`. The optional call tolerates minimal `matchMedia`
    // implementations that cannot notify.
    query.addEventListener?.('change', (event: MediaQueryListEvent) => {
      this.systemIsDark = event.matches;
      this.apply();
    });

    // Keep other open tabs in step. A null key means storage was cleared.
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) {
        this.preference = parsePreference(event.newValue);
        this.apply();
      }
    });
  },

  /**
   * Recomputes `isDark` from the current choice and system preference.
   */
  apply() {
    this.isDark = resolveIsDark(this.preference, this.systemIsDark);
  },

  /**
   * Records the visitor's choice, remembers it, and updates what is shown.
   *
   * @param {ThemePreference} preference The choice to make.
   */
  setPreference(preference: ThemePreference) {
    this.preference = preference;
    writePreference(preference);
    this.apply();
  },

  /**
   * Switches to the opposite of what is currently shown, as an explicit
   * choice (so it is remembered and no longer follows the system).
   */
  toggle() {
    this.setPreference(this.isDark ? 'light' : 'dark');
  },
};
