# foxglove-joystick

This is an extension for [Foxglove Studio](https://github.com/foxglove/studio) that adds functionality for working with joysticks. It receives joystick data from a variety of inputs, and offers various ways to display it.

## Overview

There are four main operating modes/input sources/use cases:

| Mode | Functionality | Intended use case |
| ----- | ------ | ------ |
| Subscribe Mode | Subscribes to an existing ROS `Joy` topic | Monitoring a robot that is being teleoperated, or replaying a log and reviewing operator actions |
| Gamepad Mode | Receives input from a locally-connected gamepad (and publishes it to a ROS `Joy` topic) | Live control of a robot using a gamepad connected to any Foxglove-supported device |
| Keyboard Mode | Converts local keystrokes into `Joy` messages (for publishing) | Bench-testing a configuration that is primarily designed to use a gamepad but does not currently have one connected |
| Interactive Display Mode | Makes the displayed indicators clickable/touchable (for publishing) | Controlling a robot from a touchscreen device |

![Panel Overview Screenshot](https://github.com/joshnewans/foxglove-joystick/blob/main/docs/screenshot1.png?raw=true)

## Installation

### Foxglove Studio Extension Marketplace

In the Foxglove Studio Desktop app, use the Extension Marketplace (Profile menu in top-right -> Extensions) to find and install the Joystick panel.

### Releases

Download the latest `.foxe` release [here](https://github.com/joshnewans/foxglove-joystick/releases/latest) and drag-and-drop it onto the window of Foxglove Studio (Desktop or Web).

### Compile from source

With Node and Foxglove installed

- `npm install` to install dependencies
- `npm run local-install` to build and install for a local copy of the Foxglove Studio Desktop App
- `npm run package` to package it up into a `.foxe` file

### Snap Users

Right now it seems that this panel will **not** work with the `snap` version of Foxglove Studio. Snaps do not allow joystick input by default and I am looking into what is required to use it (possibly the Foxglove team enabling the `joystick` interface).

### Steam Deck Users

Please follow [this guide](docs/steamdeck.md).

## Mapping

Different controllers (and in some cases the same controller on different platforms) will have the buttons/axes arranged in a different order.

Some more complex examples of this are D-Pads (sometimes register as two axes, sometimes four buttons) and triggers (sometimes register as axes + buttons, sometimes buttons with a variable value, unsupported by `Joy`).

You can select the Gamepad to Joy transformation that works in the panel options. The Gamepad to Joy transformations are stored in the [mappings](src/mappings/gamepadJoyTransforms.ts) file.

To create a new mapping, you can use the [Gamepad Tester](https://gamepad-tester.com/) to see the order of the buttons and axes on your controller. Then add a the new mapping logic to the [mappings](src/mappings/gamepadJoyTransforms.ts) 

Also note that the HTML gamepad API seems to have the axes reversed compared to what typically comes out of the `joy` drivers, so the panel flips those values back automatically.

## Layouts

Currently consist of a `.json` to determine button locations and an entry in `GamepadBackground.tsx` for the background. 

To add a new mapping, create a new .json mapping file in the [mappings](src/mappings) and be sure to update the `GamepadLayoutMappingKey` with the id `gamepadLayoutMappings` object with the new mapping so the panel options are also updated.

## Planned functionality/improvements

- **Source modes**
  - [x] Source Mode 1 (Subscriber)
  - [x] Source Mode 2 (Gamepad)
    - [ ] Option for a custom mapping from gamepad to `Joy` (e.g. GP 6-> Joy 8)
    - [ ] Dead-zones, inversion, scaling, etc.
  - [x] Source Mode 3 (Keyboard)
  - [x] Source Mode 4 (Interactive)
- **Display modes**
  - [x] Simple Auto-Generated Display
    - [ ] Better identification of axes
  - [x] Gamepad visual mimic
    - [ ] Different options for the image
    - [ ] Different options for mapping joy buttons to image buttons
    - [x] Options for axes to be sticks, d-pads, triggers, or more
    - [ ] General improved customisability

## Contributions

Thanks to [rgov](https://github.com/rgov) for creating [this repo](https://github.com/ARMADAMarineRobotics/studio-extension-gamepad) which I originally worked on this project from before rewriting it mostly from scratch (but have retained [useGamepads.ts](src/hooks/useGamepad.ts)).
