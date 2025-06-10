import { exposeThemeContext } from "./theme/theme-context";
import { exposeWindowContext } from "./window/window-context";
import { exposeSidebarContext } from "./sidebar/sidebar-context";

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
  exposeSidebarContext();
}
