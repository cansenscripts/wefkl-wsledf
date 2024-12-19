module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) {
                return interaction.reply({
                    content: "Error en el boton!",
                    ephemeral: true,
                });
            }

            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.error(`Error executing button: ${interaction.customId}`, error);
                await interaction.reply({
                    content: "Ocurrio un error.",
                    ephemeral: true,
                });
            }
        }

        // Aquí también puedes manejar otros tipos de interacciones como comandos de slash
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({
                    content: "Comando no encontrado!",
                    ephemeral: true,
                });
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(`Error executing command: ${interaction.commandName}`, error);
                await interaction.reply({
                    content: "Ocurrio un error.",
                    ephemeral: true,
                });
            }
        }
    },
};
