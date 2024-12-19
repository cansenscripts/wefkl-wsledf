const {
    PermissionsBitField,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
} = require("discord.js");
const fs = require('fs');
const path = require('path');

// Ruta al archivo de configuración de tickets
const configFilePath = path.join(__dirname, '..', 'ticketConfig.json');

// ID de la categoría 'Dudas'
const categoryID = '1314440348163903518';

module.exports = {
    customId: "ticket-dudas",

    async execute(interaction, client) {
        // Evitar responder más de una vez
        if (interaction.replied || interaction.deferred) return;

        const existingChannel = interaction.guild.channels.cache.find(
            c => c.topic === `Ticket de ${interaction.user.id}`
        );

        if (existingChannel) {
            const linkRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Ticket")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${existingChannel.id}`)
            );

            const embed2 = new EmbedBuilder()
                .setDescription(`❌ **Ocurrió un error**\nNo puedes tener dos tickets abiertos\n\n📧 **Categoría abierta:**\n\`\`Dudas\`\``)
                .setColor('White')
                .setTimestamp()

            return interaction.reply({
                embeds: [embed2],
                components: [linkRow],
                ephemeral: true,
            });
        }

        // Crear un modal para capturar la duda del usuario
        const modal = new ModalBuilder()
            .setCustomId("ticket-dudas-modal")
            .setTitle("Crear un ticket - Dudas");

        const input = new TextInputBuilder()
            .setCustomId("user-duda")
            .setLabel("¿Cuál es tu duda?")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Escribe aquí tu duda...")
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);

        // Escuchar la interacción del modal
        const filter = (i) => i.customId === "ticket-dudas-modal" && i.user.id === interaction.user.id;
        try {
            const submitted = await interaction.awaitModalSubmit({ filter, time: 60000 });

            // Obtener la duda del usuario
            const userDuda = submitted.fields.getTextInputValue("user-duda");

            // Mensaje inicial de "procesando solicitud"
            await submitted.deferReply({ ephemeral: true });

            const processingEmbed = {
                title: "⏳ Procesando solicitud",
                description: "Estamos creando tu ticket. Por favor espera un momento...",
                color: 0xffff00, // Amarillo
            };

            await submitted.editReply({
                embeds: [processingEmbed],
            });

            // Esperar 3 segundos antes de crear el canal y editar el mensaje
            setTimeout(async () => {
                // Cargar la configuración desde el archivo JSON
                let staffRoles = [];
                try {
                    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
                    staffRoles = config.roles || [];
                } catch (error) {
                    console.error('Error reading ticket config:', error);
                }

                if (!staffRoles || staffRoles.length === 0) {
                    return submitted.editReply({
                        content: "El sistema de tickets está mal configurado.",
                        embeds: [],
                    });
                }

                // Obtener la categoría "Dudas"
                const category = interaction.guild.channels.cache.get(categoryID);
                if (!category) {
                    return submitted.editReply({
                        content: "No se encontró la categoría. Contacta un staff",
                        embeds: [],
                    });
                }

                // Crear el canal de ticket dentro de la categoría "Dudas"
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    topic: `Ticket de ${interaction.user.id}`,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages,
                                PermissionsBitField.Flags.AttachFiles,
                            ],
                        },
                        ...staffRoles.map(roleId => ({
                            id: roleId,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages,
                            ],
                        })),
                    ],
                });

                // Mensaje dentro del canal del ticket
                const embedcreate = new EmbedBuilder()
                    .setTitle('**SISTEMA DE TICKETS**')
                    .setDescription(`👋 **Bienvenid@ ${interaction.user}**\nPor favor espera que un staff atienda tu ticket\n\n⁉️ **Duda:**\n\`\`${userDuda}\`\``)
                    .setColor('White')
                    .setTimestamp()

                const closeRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("close-ticket")
                        .setLabel("🗑️ Cerrar")
                        .setStyle(ButtonStyle.Secondary)
                );

                await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embedcreate], components: [closeRow] });

                // Mensaje final con enlace
                const embedcreatetic = new EmbedBuilder()
                    .setTitle('**SISTEMA DE TICKETS**')
                    .setDescription(`✅ **Ticket creado**\nTu ticket fue creado exitosamente, clickea el botón para ir`)
                    .setColor('White')
                    .setTimestamp()

                const linkRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Ir al Canal")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel.id}`)
                );

                // Editar el mensaje inicial con el enlace
                await submitted.editReply({
                    embeds: [embedcreatetic],
                    components: [linkRow],
                });
            }, 3000); // Retraso de 3 segundos
        } catch (error) {
            console.error("Error waiting for modal submission:", error);
            return interaction.followUp({
                content: "No ingresaste tu duda a tiempo. Por favor, intenta de nuevo.",
                ephemeral: true,
            });
        }
    },
};
