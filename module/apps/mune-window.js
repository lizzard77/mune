import * as actions from "../actions.js";

export class MuneWindow extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "mune",
            template: "modules/mune/templates/apps/mune.hbs",
            popOut: false,
        });
    }

    async _renderInner(...args) {
        const result = super._renderInner(...args);

        return result;
    }

    getData() {
        const data = mergeObject(super.getData(), {
            info: {},
        });

        const muneData = game.settings.get("mune", "data");
        data.info.interventionPoints = {
            total: muneData.interventionPoints ?? 0,
        };

        return data;
    }

    setPosition({left, top, width, height, scale} = {}) {
        const el = this.element[0];
        const currentPosition = this.position;

        width = el.offsetWidth;
        height = el.offsetHeight;

        // Update left
        {
            const tarL = Number.isFinite(left) ? left : (window.innerWidth - width) / 2;
            const maxL = Math.max(window.innerWidth - width, 0);
            currentPosition.left = left = Math.clamped(tarL, 0, maxL);
            el.style.left = left+"px";
        }

        // Update top
        {
            const tarT = Number.isFinite(top) ? top : (window.innerHeight - height) / 2;
            const maxT = Math.max(window.innerHeight - height, 0);
            currentPosition.top = top = Math.clamped(tarT, 0, maxT);
            el.style.top = currentPosition.top+"px";
        }

        return currentPosition;
    }

    activateListeners(html) {
        // Make window draggable despite not being a popout
        const drag = new Draggable(this, html);
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

        // Actions
        html.find(".rolls button.oracle").click((event) => { this._rollDialog(event, { name: game.i18n.localize("MUNE.Oracle.Name"), fn: actions.oracle }); });
        html.find(".rolls button.intervention").click((event) => { this._rollDialog(event, { name: game.i18n.localize("MUNE.Intervention.Name"), fn: actions.intervention }); });
        html.find(".rolls button.portent").click(this._rollPortent.bind(this));
        html.find(".rolls button.npc-interaction").click((event) => { this._rollDialog(event, { name: game.i18n.localize("MUNE.NPCInteraction.Name"), fn: actions.npcInteraction }); });
        html.find(".rolls button.twene").click((event) => { this._rollDialog(event, { name: game.i18n.localize("MUNE.TWENE.Name"), fn: actions.twene }); });
        
        // Info editing
        html.find(".intervention-controls a").click(this._interventionControls.bind(this));
    }

    _interventionControls(event) {
        event.preventDefault();
        const a = event.currentTarget;

        if (a.classList.contains("add")) {
            return actions.addInterventionPoints(1);
        }
        else if (a.classList.contains("subtract")) {
            return actions.addInterventionPoints(-1);
        }
    }

    _rollDialog(event, options) {
        event.preventDefault();

        new Dialog({
            title: game.i18n.localize(`MUNE: ${options.name || "Unknown"}`),
            content: `<input class="flavor" type="text" placeholder="${game.i18n.localize("MUNE.Reason")}" />`,
            buttons: {
                advantage: {
                    label: game.i18n.localize("MUNE.KeepHighest"),
                    callback: (html) => {
                        options.fn({ advantage: true, flavor: html.find(".flavor").val() })
                    },
                },
                normal: {
                    label: game.i18n.localize("MUNE.Roll"),
                    callback: (html) => {
                        options.fn({ flavor: html.find(".flavor").val() })
                    },
                },
                disadvantage: {
                    label: game.i18n.localize("MUNE.KeepLowest"),
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

    _rollIntervention(event) {
        event.preventDefault();

        const options = {};
        if (game.keyboard.isDown("Shift")) options.advantage = true;
        else if (game.keyboard.isDown("Control")) options.disadvantage = true;

        return actions.intervention(options);
    }

    _rollPortent(event) {
        event.preventDefault();

        new Dialog({
            title: game.i18n.localize(`MUNE: ${game.i18n.localize("MUNE.Portent.Name")}`),
            content: `<p>${game.i18n.localize("MUNE.Dialog.HowManyWords.Info")}</p>`,
            buttons: {
                "1": {
                    label: "1",
                    callback: (html) => {
                        actions.portent({ wordCount: 1 });
                    },
                },
                "2": {
                    label: "2",
                    callback: (html) => {
                        actions.portent({ wordCount: 2 });
                    },
                },
                "3": {
                    label: "3",
                    callback: (html) => {
                        actions.portent({ wordCount: 3 });
                    },
                },
                "4": {
                    label: "4",
                    callback: (html) => {
                        actions.portent({ wordCount: 4 });
                    },
                },
                "5": {
                    label: "5",
                    callback: (html) => {
                        actions.portent({ wordCount: 5 });
                    },
                }
            },
            default: "2",
        }).render(true);
    }

    _rollNPCInteraction(event) {
        event.preventDefault();

        const options = {};
        if (game.keyboard.isDown("Shift")) options.advantage = true;
        else if (game.keyboard.isDown("Control")) options.disadvantage = true;

        return actions.npcInteraction(options);
    }

    _rollTWENE(event) {
        event.preventDefault();

        const options = {};
        if (game.keyboard.isDown("Shift")) options.advantage = true;
        else if (game.keyboard.isDown("Control")) options.disadvantage = true;

        return actions.twene(options);
    }
}