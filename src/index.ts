import { ExtensionContext } from "@foxglove/extension";

import { initJoyPanel } from "./components/JoyPanel";

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "Joystick", initPanel: initJoyPanel });
}
