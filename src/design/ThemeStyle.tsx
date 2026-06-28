import { buildThemeCss } from './css-variables';

const themeCss = buildThemeCss();

export function ThemeStyle() {
  return <style id="design-tokens" dangerouslySetInnerHTML={{ __html: themeCss }} />;
}
