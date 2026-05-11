import * as actions from "../actions.js";
import { MuneWindow_Help } from "./help.js";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

export class MuneWindow extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "mune",
        classes: ["mune"],
        window: {
            title: "MUNE",
            resizable: false,
        },
        position: {
            width: "auto",
            height: "auto",
        },
        actions: {
            oracle: MuneWindow.#onOracle,
            intervention: MuneWindow.#onIntervention,
            portent: MuneWindow.#onPortent,
            npcInteraction: MuneWindow.#onNpcInteraction,
            twene: MuneWindow.#onTwene,
            interventionAdd: MuneWindow.#onInterventionAdd,
            interventionSubtract: MuneWindow.#onInterventionSubtract,
            help: MuneWindow.#onHelp,
        },
    };

    static PARTS = {
        main: { root: true, template: "modules/mune/templates/apps/mune.hbs" },
    };

    #savePosition = foundry.utils.debounce(() => {
        const { top, left } = this.position;
        if (!Number.isFinite(top) || !Number.isFinite(left)) return;
        game.settings.set("mune", "windowPosition", { top, left });
    }, 500);

    async _prepareContext(options) {
        const muneData = game.settings.get("mune", "data");
        const interventionCost = game.settings.get("mune", "interventionCost");
        const interventionPoints = muneData.interventionPoints ?? 0;
        return {
            interventionPoints,
            doIntervention: interventionPoints >= interventionCost,
        };
    }

    _onPosition(position) {
        this.#savePosition();
    }

    static #onOracle(event, target) {
        return this.#actionDialog({ name: game.i18n.localize("mune.Oracle.Name"), fn: actions.oracle });
    }

    static #onIntervention(event, target) {
        return this.#actionDialog({ name: game.i18n.localize("mune.Intervention.Name"), fn: actions.intervention });
    }

    static #onNpcInteraction(event, target) {
        return this.#actionDialog({ name: game.i18n.localize("mune.NPCInteraction.Name"), fn: actions.npcInteraction });
    }

    static #onTwene(event, target) {
        return this.#actionDialog({ name: game.i18n.localize("mune.TWENE.Name"), fn: actions.twene });
    }

    static #onInterventionAdd(event, target) {
        return actions.addInterventionPoints(1);
    }

    static #onInterventionSubtract(event, target) {
        return actions.addInterventionPoints(-1);
    }

    static async #onHelp(event, target) {
        let win = game.mune.helpWindow;
        if (win?.rendered) {
            win.bringToFront();
            return;
        }
        win = new MuneWindow_Help();
        game.mune.helpWindow = win;
        await win.render({ force: true });
    }

    async #actionDialog({ name, fn }) {
        const reason = game.i18n.localize("mune.Reason");
        const result = await DialogV2.wait({
            window: { title: `MUNE: ${name}` },
            content: `<input type="text" name="flavor" placeholder="${reason}" autofocus />`,
            buttons: [
                {
                    action: "advantage",
                    label: game.i18n.localize("mune.KeepHighest"),
                    callback: (event, button) => ({ advantage: true, flavor: button.form.elements.flavor.value }),
                },
                {
                    action: "normal",
                    label: game.i18n.localize("mune.Roll"),
                    default: true,
                    callback: (event, button) => ({ flavor: button.form.elements.flavor.value }),
                },
                {
                    action: "disadvantage",
                    label: game.i18n.localize("mune.KeepLowest"),
                    callback: (event, button) => ({ disadvantage: true, flavor: button.form.elements.flavor.value }),
                },
            ],
            rejectClose: false,
        });
        if (result) await fn(result);
    }

    static async #onPortent(event, target) {
        const reason = game.i18n.localize("mune.Reason");
        const info = game.i18n.localize("mune.Dialog.HowManyWords.Info");
        const result = await DialogV2.wait({
            window: { title: `MUNE: ${game.i18n.localize("mune.Portent.Name")}` },
            content: `<input type="text" name="flavor" placeholder="${reason}" autofocus /><p>${info}</p>`,
            buttons: [1, 2, 3, 4, 5].map(n => ({
                action: String(n),
                label: String(n),
                default: n === 2,
                callback: (event, button) => ({ wordCount: n, flavor: button.form.elements.flavor.value }),
            })),
            rejectClose: false,
        });
        if (result) await actions.portent(result);
    }
}
