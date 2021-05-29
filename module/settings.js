export const registerSettings = function() {
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
};