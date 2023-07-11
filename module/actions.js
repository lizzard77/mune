export const oracle = async function(options = {}) {
    return generateActionResult("Oracle", 6, options);
};

export const intervention = async function(options = {}) {
    return generateActionResult("Intervention", 6, options);
};

export const npcInteraction = async function(options = {}) {
    return generateActionResult("NPCInteraction", 3, options);
};

export const twene = async function(options = {}) {
    return generateActionResult("TWENE", 10, options);
};

export const portent = async function(options = {}) {
    if (!options.wordCount) options.wordCount = 2;

    // Get tables
    const pack = game.packs.get("mune.mune");
    let promises = [];
    for (let n of ["Adjectives", "Nouns", "Verbs"]) {
        promises.push(pack.getDocuments({ name: n }));
    }
    const tables = (await Promise.all(promises)).map((arr) => {
        return arr[0];
    });

    // Roll words
    let words = [];
    for (let a = 0; a < options.wordCount; a++) {
        const table = tables[Math.floor(Math.random() * tables.length)];
        const result = (await table.draw({ displayChat: false })).results[0];
        words.push(result.data.text);
    }

    // Generate chat content
    const content = await renderTemplate("modules/mune/templates/chat/portent.hbs", {
        words: words,
        flavor: options.flavor,
    });

    return ChatMessage.create({
        user: game.user.id,
        content,
    });
};

const generateActionResult = async function(name, sides = 6, options = {}) {
    let formula = `1d${sides}`;
    if (options.advantage) formula = `2d${sides}kh`;
    else if (options.disadvantage) formula = `2d${sides}kl`;
    const roll = await new CONFIG.Dice.rolls[0](formula).evaluate({ async: true });

    // For Oracle: add intervention points
    if (name === "Oracle") {
        let addPoints = 0;
        for (let d of roll.dice[0].results) {
            if (d.result === sides) {
                addPoints++;
            }
        }

        if (addPoints) {
            addInterventionPoints(addPoints);
        }
    }

    // For Intervention: subtract intervention points
    if (name === "Intervention") {
        const subtract = game.settings.get("mune", "interventionCost") ?? 3;
        await addInterventionPoints(-subtract);
    }

    let label = game.i18n.localize(`mune.${name}.${roll.total}`);
    const keepLabel = options.advantage ? game.i18n.localize("mune.KeepHighest") : options.disadvantage ? game.i18n.localize("mune.KeepLowest") : undefined;

    const content = await renderTemplate("modules/mune/templates/chat/action.hbs", {
        title: game.i18n.localize(`mune.${name}.Name`),
        actionType: name.toLowerCase(),
        result: label,
        flavor: options.flavor,
        resultSuffix: keepLabel,
        roll: {
            json: escape(JSON.stringify(roll)),
            total: roll.total,
        },
    });

    return ChatMessage.create({
        user: game.user.id,
        content,
    });
};

export const addInterventionPoints = async function(value = 1) {
    const data = game.settings.get("mune", "data");
    const prevValue = data.interventionPoints ?? 0;
    const newValue = prevValue + value;
    return setInterventionPoints(newValue);
};

export const setInterventionPoints = async function(value = 0) {
    return game.settings.set("mune", "data", mergeObject(game.settings.get("mune", "data"), {
        interventionPoints: Math.max(0, value),
    }, { inplace: false }));
};
