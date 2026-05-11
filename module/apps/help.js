const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class MuneWindow_Help extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "mune-help",
        classes: ["mune-help"],
        window: {
            title: "mune.Info",
            resizable: true,
        },
        position: {
            width: 600,
            height: 500,
        },
    };

    static TABS = {
        primary: {
            initial: "oracle",
            tabs: [
                { id: "oracle", label: "mune.Oracle.Name" },
                { id: "intervention", label: "mune.Intervention.Name" },
                { id: "portent", label: "mune.Portent.Name" },
                { id: "npc-interaction", label: "mune.NPCInteraction.Name" },
                { id: "twene", label: "mune.TWENE.Name" },
            ],
        },
    };

    static PARTS = {
        main: { root: true, template: "modules/mune/templates/apps/help.hbs" },
    };

    async _prepareContext(options) {
        return {
            tabs: this._prepareTabs("primary"),
        };
    }
}
