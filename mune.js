import { MuneWindow } from "./module/apps/mune-window.js";
import { registerSettings } from "./module/settings.js";
import * as actions from "./module/actions.js";

Hooks.once("init", () => {
    game.mune = {
        window: null,
        helpWindow: null,
        actions: Object.entries(actions).reduce((cur, o) => {
            cur[o[0]] = o[1];
            return cur;
        }, {}),
    };

    registerSettings();
});

Hooks.once("ready", () => {
    if (game.user.role < game.settings.get("mune", "windowPermission")) 
        return;

    const isSidebar = game.settings.get("mune", "windowStyle") === 3;
    if (isSidebar)
        return;
    
    const win = new MuneWindow();
    game.mune.window = win;
    const pos = game.settings.get("mune", "windowPosition");
    win.render(true, pos);
});

Hooks.on("renderChatLog", async function (chatLog, html, user) {
    if (game.user.role < game.settings.get("mune", "windowPermission")) 
        return;

    const isSidebar = game.settings.get("mune", "windowStyle") === 3;
    if (!isSidebar)
        return;
    
    const win = new MuneWindow();
    game.mune.window = win;
    game.mune.sidebar = html;
    game.mune.window.renderSidebar = async () => {
        game.mune.sidebar.find("#mune").remove();
        game.mune.sidebar.prepend(await renderTemplate("modules/mune/templates/apps/mune.hbs", game.mune.window.getData()));
        game.mune.window.activateListeners(game.mune.sidebar.find("#mune"));
    };

    game.mune.window.renderSidebar();
});
