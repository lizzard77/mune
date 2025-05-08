import * as actions from "../actions.js";
import { MuneWindow_Help } from "./help.js";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class MuneWindow extends HandlebarsApplicationMixin(ApplicationV2) 
{
    static DEFAULT_OPTIONS = {
        id: "mune",
        title: "MUNE",
        minimizable: true,
        resizable: true,
        width: 500,
        height: 600,
        scrollY: [".mune-content"],
        actions: {
            oracle: MuneWindow.#onOracle,
            intervention: MuneWindow.#onIntervention,
            portent: MuneWindow.#onPortent,
            npcInteraction: MuneWindow.#onNPCInteraction,
            twene: MuneWindow.#onTWENE,
            interventionControl: MuneWindow.#onInterventionControl,
            help: MuneWindow.#onHelp
        }
    };

    static #onOracle(event) {
        event.preventDefault();
        const options = { name: game.i18n.localize("mune.Oracle.Name"), fn: actions.oracle };
        MuneWindow.#rollDialog(options);
    }

    static #onIntervention(event) {
        event.preventDefault();
        const options = { name: game.i18n.localize("mune.Intervention.Name"), fn: actions.intervention };
        MuneWindow.#rollDialog(options);
    }

    static #onPortent(event) {
        event.preventDefault();
        new Dialog({
            title: game.i18n.localize(`mune: ${game.i18n.localize("mune.Portent.Name")}`),
            content: `<input class="flavor" type="text" placeholder="${game.i18n.localize("mune.Reason")}"/><p>${game.i18n.localize("mune.Dialog.HowManyWords.Info")}</p>`,
            buttons: {
                "1": {
                    label: "1",
                    callback: (html) => {
                        actions.portent({ flavor: html.find(".flavor").val(), wordCount: 1 });
                    },
                },
                "2": {
                    label: "2",
                    callback: (html) => {
                        actions.portent({ flavor: html.find(".flavor").val(), wordCount: 2 });
                    },
                },
                "3": {
                    label: "3",
                    callback: (html) => {
                        actions.portent({ flavor: html.find(".flavor").val(), wordCount: 3 });
                    },
                },
                "4": {
                    label: "4",
                    callback: (html) => {
                        actions.portent({ flavor: html.find(".flavor").val(), wordCount: 4 });
                    },
                },
                "5": {
                    label: "5",
                    callback: (html) => {
                        actions.portent({ flavor: html.find(".flavor").val(), wordCount: 5 });
                    },
                }
            },
            default: "2",
            render: (html) => {
                html.find("input.flavor").focus();
            },
        }).render(true);
    }

    static #onNPCInteraction(event) {
        event.preventDefault();
        const options = { name: game.i18n.localize("mune.NPCInteraction.Name"), fn: actions.npcInteraction };
        MuneWindow.#rollDialog(options);
    }

    static #onTWENE(event) {
        event.preventDefault();
        const options = { name: game.i18n.localize("mune.TWENE.Name"), fn: actions.twene };
        MuneWindow.#rollDialog(options);
    }

    static #onInterventionControl(event) {
        event.preventDefault();
        const mode = event.target.dataset.mode;
        if (mode === "add") {
            return actions.addInterventionPoints(1);
        }
        else if (mode === "subtract") {
            return actions.addInterventionPoints(-1);
        }
    }

    static #onHelp(event) {
        event.preventDefault();
        let window = game.mune.helpWindow;

        if (window) {
            window.render(true);
            if (window.element[0]) {
                window.bringToTop();
            }
        }
        else {
            window = new MuneWindow_Help();
            window.render(true);
            game.mune.helpWindow = window;
        }
    }

    static #rollDialog(options) {
        new Dialog({
            title: `MUNE: ${options.name || "Unknown"}`,
            content: `<input class="flavor" type="text" placeholder="${game.i18n.localize("mune.Reason")}" />`,
            buttons: {
                advantage: {
                    label: game.i18n.localize("mune.KeepHighest"),
                    callback: (html) => {
                        options.fn({ advantage: true, flavor: html.find(".flavor").val() })
                    },
                },
                normal: {
                    label: game.i18n.localize("mune.Roll"),
                    callback: (html) => {
                        options.fn({ flavor: html.find(".flavor").val() })
                    },
                },
                disadvantage: {
                    label: game.i18n.localize("mune.KeepLowest"),
                    callback: (html) => {
                        options.fn({ disadvantage: true, flavor: html.find(".flavor").val() })
                    },
                },
            },
            default: "normal",
            render: (html) => {
                html.find("input.flavor").focus();
            },
        }).render(true);
    }

    static PARTS = {
        mune: {
            template: "modules/mune/templates/apps/mune.hbs"
        }
    };

    constructor(options={}) {
        super(options);
        //this.#updatePopOutState();
    }

    #updatePopOutState() {
        const isPopout = game.settings.get("mune", "windowStyle") === 2;
        //this.options.popOut = isPopout;
    }

    get popOut() 
    {
        return true; // game.settings.get("mune", "windowStyle") === 2;
    }

    get title()
    {
        return game.i18n.localize("mune.WindowTitle");
    }

    async _prepareContext(options={}) {
        const context = await super._prepareContext(options);
        const data = foundry.utils.mergeObject(context, {
            info: {},
        });

        const interventionPointCost = game.settings.get("mune", "interventionCost");
        const muneData = game.settings.get("mune", "data");
        data.info.interventionPoints = {
            total: muneData.interventionPoints ?? 0,
        };

        data.doIntervention = muneData.interventionPoints >= interventionPointCost;

        return data;
    }

    setPosition({left, top, width, height, scale} = {}) {
        super.setPosition({left, top, width, height, scale});
        const el = this.element;
        const currentPosition = this.position;

        width = el.offsetWidth;
        height = el.offsetHeight;

        if (!width || !height) return;

        // Update left
        {
            const tarL = Number.isFinite(left) ? left : (window.innerWidth - width) / 2;
            const maxL = Math.max(window.innerWidth - width, 0);
            currentPosition.left = left = Math.clamp(tarL, 0, maxL);
            el.style.left = left+"px";
        }

        // Update top
        {
            const tarT = Number.isFinite(top) ? top : (window.innerHeight - height) / 2;
            const maxT = Math.max(window.innerHeight - height, 0);
            currentPosition.top = top = Math.clamp(tarT, 0, maxT);
            el.style.top = currentPosition.top+"px";
        }

        return currentPosition;
    }

    _onRender(context, options) {
        const isPopout = game.settings.get("mune", "windowStyle") === 2;
        const isSidebar = game.settings.get("mune", "windowStyle") === 3;

        if (!isPopout && !isSidebar)
        {
            // Make window draggable despite not being a popout
            const drag = new Draggable(this, this.element);
            {
                const fn = drag._onDragMouseUp;
                drag._onDragMouseUp = function(event) {
                    fn.call(this, event);
                    game.settings.set("mune", "windowPosition", {
                        left: this.app.position.left,
                        top: this.app.position.top,
                    });
                }
            }
        }

        this.element.style.position = isPopout || isSidebar ? "inherit" : "fixed";
        if (isPopout)
            this.element.classList.add("popout");
        if (isSidebar)
        {
            this.element.classList.add("sidebar");
            this.element.style.flex = "0";
            this.element.style.marginTop = "1em";
            this.element.style.marginBottom = "1em";
        }
    }
}

