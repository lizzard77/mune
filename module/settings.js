export const registerSettings = function() {
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
            if (game.mune?.window) {
                game.mune.window.render();
            }
        },
    });
};