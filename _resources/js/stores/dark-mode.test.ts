import DarkModeStore, {
  THEME_STORAGE_KEY,
  parsePreference,
  resolveIsDark,
} from '@/stores/dark-mode';

import type { Mock } from 'vitest';

import type { ThemePreference } from '@/stores/dark-mode';

/**
 * Builds a fake MediaQueryList. `emit` simulates the operating system changing
 * its preference, by invoking whichever listener the store registered.
 */
function fakeQuery(matches: boolean) {
  const addEventListener = vi.fn();
  return {
    query: { matches, addEventListener },
    emit(next: boolean) {
      const [, listener] = addEventListener.mock.calls[0];
      listener({ matches: next });
    },
  };
}

describe('darkMode', () => {
  let mockMatchMedia: Mock;

  beforeEach(() => {
    // The store persists its choice, so every test starts from a clean slate.
    window.localStorage.clear();
    DarkModeStore.preference = 'system';
    DarkModeStore.systemIsDark = false;
    DarkModeStore.isDark = false;

    // Mock window.matchMedia
    mockMatchMedia = vi.fn();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should have isDark set to false by default', () => {
      expect(DarkModeStore.isDark).toBe(false);
    });

    it('should default to following the system', () => {
      expect(DarkModeStore.preference).toBe('system');
    });
  });

  describe('init', () => {
    it('should set isDark to true when system prefers dark mode', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
      });

      DarkModeStore.init();

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should set isDark to false when system prefers light mode', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
      });

      DarkModeStore.init();

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(DarkModeStore.isDark).toBe(false);
    });

    it('should override existing isDark state when initialising', () => {
      DarkModeStore.isDark = true;

      mockMatchMedia.mockReturnValue({
        matches: false,
      });

      DarkModeStore.init();

      expect(DarkModeStore.isDark).toBe(false);
    });
  });

  describe('toggle', () => {
    it('should switch isDark from false to true', () => {
      DarkModeStore.isDark = false;

      DarkModeStore.toggle();

      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should switch isDark from true to false', () => {
      DarkModeStore.isDark = true;

      DarkModeStore.toggle();

      expect(DarkModeStore.isDark).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      DarkModeStore.isDark = false;

      DarkModeStore.toggle();
      expect(DarkModeStore.isDark).toBe(true);

      DarkModeStore.toggle();
      expect(DarkModeStore.isDark).toBe(false);

      DarkModeStore.toggle();
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should work independently of system preference', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
      });

      DarkModeStore.init();
      expect(DarkModeStore.isDark).toBe(true);

      DarkModeStore.toggle();
      expect(DarkModeStore.isDark).toBe(false);

      DarkModeStore.toggle();
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should record the result as an explicit, remembered choice', () => {
      mockMatchMedia.mockReturnValue(fakeQuery(true).query);
      DarkModeStore.init();

      DarkModeStore.toggle();

      expect(DarkModeStore.preference).toBe('light');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    });
  });

  describe('parsePreference', () => {
    it.each<ThemePreference>(['system', 'light', 'dark'])('should accept %s', (value) => {
      expect(parsePreference(value)).toBe(value);
    });

    it.each([null, undefined, '', 'Dark', 'auto', 'true', 1, {}])(
      'should treat %p as no choice',
      (value) => {
        expect(parsePreference(value)).toBe('system');
      },
    );
  });

  describe('resolveIsDark', () => {
    it.each<[ThemePreference, boolean, boolean]>([
      ['dark', false, true],
      ['dark', true, true],
      ['light', false, false],
      ['light', true, false],
      ['system', false, false],
      ['system', true, true],
    ])('preference %s with system dark=%s should show dark=%s', (preference, system, expected) => {
      expect(resolveIsDark(preference, system)).toBe(expected);
    });
  });

  describe('persistence', () => {
    it('should restore a stored dark choice over a light system', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      mockMatchMedia.mockReturnValue(fakeQuery(false).query);

      DarkModeStore.init();

      expect(DarkModeStore.preference).toBe('dark');
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should restore a stored light choice over a dark system', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
      mockMatchMedia.mockReturnValue(fakeQuery(true).query);

      DarkModeStore.init();

      expect(DarkModeStore.preference).toBe('light');
      expect(DarkModeStore.isDark).toBe(false);
    });

    it('should ignore an unrecognised stored value and follow the system', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'sepia');
      mockMatchMedia.mockReturnValue(fakeQuery(true).query);

      DarkModeStore.init();

      expect(DarkModeStore.preference).toBe('system');
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should store an explicit choice', () => {
      mockMatchMedia.mockReturnValue(fakeQuery(false).query);
      DarkModeStore.init();

      DarkModeStore.setPreference('dark');

      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should forget the stored choice when returning to system', () => {
      mockMatchMedia.mockReturnValue(fakeQuery(true).query);
      DarkModeStore.init();
      DarkModeStore.setPreference('light');

      DarkModeStore.setPreference('system');

      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should survive a reload', () => {
      mockMatchMedia.mockReturnValue(fakeQuery(false).query);
      DarkModeStore.init();
      DarkModeStore.setPreference('dark');

      // A reload loses in-memory state but keeps storage.
      DarkModeStore.preference = 'system';
      DarkModeStore.isDark = false;
      DarkModeStore.init();

      expect(DarkModeStore.preference).toBe('dark');
      expect(DarkModeStore.isDark).toBe(true);
    });
  });

  describe('following the system', () => {
    it('should follow the system in both directions while set to system', () => {
      const system = fakeQuery(false);
      mockMatchMedia.mockReturnValue(system.query);
      DarkModeStore.init();
      expect(DarkModeStore.isDark).toBe(false);

      system.emit(true);
      expect(DarkModeStore.isDark).toBe(true);

      system.emit(false);
      expect(DarkModeStore.isDark).toBe(false);
    });

    it('should ignore system changes once a choice has been made', () => {
      const system = fakeQuery(false);
      mockMatchMedia.mockReturnValue(system.query);
      DarkModeStore.init();
      DarkModeStore.setPreference('light');

      system.emit(true);

      expect(DarkModeStore.isDark).toBe(false);
    });

    it('should adopt the current system state when returning to system', () => {
      const system = fakeQuery(false);
      mockMatchMedia.mockReturnValue(system.query);
      DarkModeStore.init();
      DarkModeStore.setPreference('light');
      system.emit(true);

      DarkModeStore.setPreference('system');

      expect(DarkModeStore.isDark).toBe(true);
    });
  });

  describe('other tabs', () => {
    beforeEach(() => {
      mockMatchMedia.mockReturnValue(fakeQuery(false).query);
      DarkModeStore.init();
    });

    const storageEvent = (key: string | null, newValue: string | null) =>
      window.dispatchEvent(new StorageEvent('storage', { key, newValue }));

    it('should apply a choice made in another tab', () => {
      storageEvent(THEME_STORAGE_KEY, 'dark');

      expect(DarkModeStore.preference).toBe('dark');
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should return to system when another tab clears the choice', () => {
      DarkModeStore.setPreference('dark');

      storageEvent(THEME_STORAGE_KEY, null);

      expect(DarkModeStore.preference).toBe('system');
      expect(DarkModeStore.isDark).toBe(false);
    });

    it('should return to system when storage is cleared entirely', () => {
      DarkModeStore.setPreference('dark');

      storageEvent(null, null);

      expect(DarkModeStore.preference).toBe('system');
    });

    it('should ignore unrelated keys', () => {
      DarkModeStore.setPreference('dark');

      storageEvent('something-else', 'light');

      expect(DarkModeStore.preference).toBe('dark');
    });
  });

  describe('when storage is unavailable', () => {
    it('should still initialise and follow the system', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
      });
      mockMatchMedia.mockReturnValue(fakeQuery(true).query);

      expect(() => DarkModeStore.init()).not.toThrow();

      expect(DarkModeStore.preference).toBe('system');
      expect(DarkModeStore.isDark).toBe(true);
    });

    it('should still change theme for the current page', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });
      mockMatchMedia.mockReturnValue(fakeQuery(false).query);
      DarkModeStore.init();

      expect(() => DarkModeStore.setPreference('dark')).not.toThrow();

      expect(DarkModeStore.isDark).toBe(true);
    });
  });
});
