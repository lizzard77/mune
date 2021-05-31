import { MuneWindow } from "./module/apps/mune-window.js";
import { registerSettings } from "./module/settings.js";
import * as actions from "./module/actions.js";

Hooks.once("init", () => {
    game.mune = {
        window: null,
        actions: Object.entries(actions).reduce((cur, o) => {
            cur[o[0]] = o[1];
            return cur;
        }, {}),
    };

    registerSettings();
});

Hooks.once("ready", () => {
    const win = new MuneWindow();
    game.mune.window = win;
    const pos = game.settings.get("mune", "windowPosition");
    win.render(true, pos);
});