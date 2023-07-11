export const registerSettings = function() {
    // Intervention point cost
    game.settings.register("mune", "interventionCost", {
        name: "mune.Settings.InterventionCost.Name",
        hint: "mune.Settings.InterventionCost.Hint",
        scope: "world",
        config: true,
        type: Number,
        default: 3,
        onChange: () => {
            game.mune?.window?.render();
        },
    });

    // Window permission
    game.settings.register("mune", "windowPermission", {
        name: "mune.Settings.Permission.Name",
        hint: "mune.Settings.Permission.Hint",
        scope: "world",
        config: true,
        type: Number,
        default: 4,
		choices: {1: "Player", 2: "Trusted", 3: "Assistant", 4: "Game Master"},
		requiresReload: true
    });

    // Window permission
    game.settings.register("mune", "windowStyle", {
        name: "mune.Settings.Style.Name",
        hint: "mune.Settings.Style.Hint",
        scope: "world",
        config: true,
        type: Number,
        default: 1,
		choices: {1: "Floating Window", 2: "Regular Window", 3: "In Chat sidebar"},
		requiresReload: true
    });

    // Window position
    game.settings.register("mune", "windowPosition", {
        name: "windowPosition",
        hint: "The last position of MUNE's window.",
        scope: "client",
        config: false,
        type: Object,
        default: {
            left: 120,
            top: 60,
        },
    });

    // Internal Data
    game.settings.register("mune", "data", {
        name: "data",
        hint: "Stores MUNE data.",
        scope: "world",
        config: false,
        type: Object,
        default: {
            interventionPoints: 0,
        },
        onChange: () => {
            if (game.mune?.window) 
                game.mune.window.render();
            
            if (game.mune?.window?.renderSidebar) 
                game.mune.window.renderSidebar();
        },
    });
};
