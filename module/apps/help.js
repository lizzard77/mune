export class MuneWindow_Help extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "mune-help",
            title: game.i18n.localize("mune.Info"),
            template: "modules/mune/templates/apps/help.hbs",
            width: 360,
            height: 480,
            tabs: [{navSelector: ".tabs", contentSelector: ".content", initial: "oracle"}],
        });
    }

    getData() {
        return super.getData();
    }
}
