import { MuneWindow } from "./module/apps/mune-window.js";
import { registerSettings } from "./module/settings.js";
import * as actions from "./module/actions.js";

Hooks.once("init", () => {
    game.mune = {
        window: null,
        helpWindow: null,
        actions: { ...actions },
    };

    registerSettings();
});

Hooks.once("ready", () => {
    if (game.user.role < game.settings.get("mune", "windowPermission")) return;

    const position = game.settings.get("mune", "windowPosition");
    const win = new MuneWindow({ position });
    game.mune.window = win;
    win.render({ force: true });
});
