const { readdirSync } = require("fs");
const path = require("path");

function loadButtons(client) {
    const buttonsPath = path.join(__dirname, "../Buttons");
    const buttonFiles = readdirSync(buttonsPath).filter(file => file.endsWith(".js"));

    for (const file of buttonFiles) {
        const button = require(path.join(buttonsPath, file));
        if ("customId" in button && "execute" in button) {
            client.buttons.set(button.customId, button);
            console.log(`Loaded button: ${button.customId}`);
        } else {
            console.warn(`Skipped loading invalid button at ${file}`);
        }
    }
}

module.exports = { loadButtons };
