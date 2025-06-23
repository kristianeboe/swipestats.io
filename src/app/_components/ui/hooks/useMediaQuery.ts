// TODO replace with something more modern / robust, and check that dialogs work as expected
// key is to do the intial check before the useEffect runs, and just use useeffect to listen for changes
import * as React from "react";

export function useMediaQuery(query: string) {
  // Compute the initial value on the very first render. This guarantees that
  // components relying on this hook (e.g. `ResponsiveDialog`) pick the correct
  // layout immediately, instead of rendering a "mobile" layout first and then
  // flickering to the desktop layout once the `useEffect` runs.
  const [value, setValue] = React.useState(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.matchMedia !== "undefined"
    ) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia === "undefined"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const onChange = (event: MediaQueryListEvent) => {
      setValue(event.matches);
    };

    // Add the listener and set the current value in case it changed between
    // the initial render and this effect running.
    mediaQuery.addEventListener("change", onChange);
    setValue(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [query]);

  return value;
}
