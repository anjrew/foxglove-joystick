import { FormGroup, FormControlLabel, Switch } from "@mui/material";
import React from "react";

import { PanelConfig } from "../../config";
import { Joy } from "../../types";
import { GamepadView } from "../GamepadView/GamepadView";
import { SimpleButtonView } from "../SimpleButtonView";

export function JoyPanelView({
  config,
  joy,
  kbEnabled,
  handleKbSwitch,
  interactiveCb,
}: {
  readonly config: PanelConfig;
  readonly joy: Joy | undefined;
  readonly kbEnabled: boolean;
  readonly handleKbSwitch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly interactiveCb: (interactiveJoy: Joy) => void;
}): JSX.Element {
  return (
    <div>
      {config.dataSource === "keyboard" ? (
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={kbEnabled} onChange={handleKbSwitch} />}
            label="Enable Keyboard"
          />
        </FormGroup>
      ) : null}
      {config.displayMode === "auto" ? <SimpleButtonView joy={joy} /> : null}
      {config.displayMode === "custom" ? (
        <GamepadView joy={joy} cbInteractChange={interactiveCb} layoutName={config.layoutName} />
      ) : null}
    </div>
  );
}
