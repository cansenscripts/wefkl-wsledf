const {
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");
const fs = require('fs');
const path = require('path');

// Ruta al archivo de configuración de tickets
const configFilePath = path.join(__dirname, '..', 'ticketConfig.json');

module.exports = {
    customId: "close-ticket",
    async execute(interaction, client) {
        const channel = interaction.channel;

        // Cargar la configuración de roles de staff desde el archivo JSON
        let staffRoles = [];
        try {
            const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
            staffRoles = config.roles || [];
        } catch (error) {
            console.error('Error reading ticket config:', error);
        }

        // Verificar si el usuario tiene alguno de los roles de staff
        const userRoles = interaction.member.roles.cache;
        const hasStaffRole = staffRoles.some(roleId => userRoles.has(roleId));

        if (!hasStaffRole) {
            return interaction.reply({
                content: "You do not have permission to close this ticket.",
                ephemeral: true,
            });
        }

        // Crear un modal para capturar la razón del cierre
        const modal = new ModalBuilder()
            .setCustomId("close-ticket-modal")
            .setTitle("Razón para cerrar el ticket");

        const input = new TextInputBuilder()
            .setCustomId("close-reason")
            .setLabel("¿Cuál es la razón para cerrar este ticket?")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Escribe la razón aquí...")
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(actionRow);

        // Mostrar el modal al usuario
        await interaction.showModal(modal);

        // Escuchar la interacción del modal
        const filter = (i) => i.customId === "close-ticket-modal" && i.user.id === interaction.user.id;
        try {
            const submitted = await interaction.awaitModalSubmit({ filter, time: 60000 });

            // Obtener la razón del cierre
            const reason = submitted.fields.getTextInputValue("close-reason");

            // Crear el embed con la razón
            const closeEmbed = new EmbedBuilder()
                .setTitle("**SISTEMA DE TICKETS**")
                .setDescription(`🗑️ **Ticket cerrado**:\nRazon: \`\`${reason}\`\``)
                .setColor('White')
                .setTimestamp();

            // Enviar el mensaje con la razón de cierre al canal del ticket
            await channel.send({ embeds: [closeEmbed] });

            // Responder al usuario indicando que el ticket se está cerrando
            await submitted.deferReply({ ephemeral: true });
            await submitted.editReply({
                content: "El ticket se está cerrando, gracias por tu cooperación.",
                ephemeral: true,
            });

            // Esperar 10 segundos antes de borrar el canal
            setTimeout(async () => {
                try {
                    // Borrar el canal después de 10 segundos
                    await channel.delete();
                } catch (error) {
                    console.error(`Failed to delete channel: ${channel.id}`, error);
                }
            }, 10000); // 10 segundos

        } catch (error) {
            console.error("Error waiting for modal submission:", error);
            return interaction.followUp({
                content: "No ingresaste la razón a tiempo. Por favor, intenta de nuevo.",
                ephemeral: true,
            });
        }
    },
};
