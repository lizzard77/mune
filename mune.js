import { MuneWindow } from "./module/apps/mune-window.js";
import { registerSettings } from "./module/settings.js";

Hooks.once("init", () => {
    game.mune = {
        window: null,
    };

    registerSettings();
});

Hooks.once("ready", () => {
    const win = new MuneWindow();
    game.mune.window = win;
    const pos = game.settings.get("mune", "windowPosition");
    win.render(true, pos);
});