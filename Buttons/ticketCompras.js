const {
    PermissionsBitField,
    ChannelType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

// Ruta al archivo de configuración de tickets
const configFilePath = path.join(__dirname, "..", "ticketConfig.json");

// ID de la categoría 'Dudas'
const categoryID = "1314440360331841618";

module.exports = {
    customId: "ticket-compras",

    async execute(interaction, client) {
        // Evitar responder más de una vez
        if (interaction.replied || interaction.deferred) return;

        const existingChannel = interaction.guild.channels.cache.find(
            (c) => c.topic === `Ticket for ${interaction.user.id}`
        );

        if (existingChannel) {
            const linkRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Ticket")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${existingChannel.id}`)
            );

            const embed2 = new EmbedBuilder()
                .setDescription(
                    `❌ **Ocurrió un error**\nNo puedes tener dos tickets abiertos\n\n📧 **Categoría abierta**\n\`\`Compras\`\``
                )
                .setColor("White")
                .setTimestamp();

            return interaction.reply({
                embeds: [embed2],
                components: [linkRow],
                ephemeral: true,
            });
        }

        // Mensaje inicial de "Procesando solicitud"
        await interaction.deferReply({ ephemeral: true });

        const processingEmbed = new EmbedBuilder()
            .setTitle("⏳ Procesando solicitud")
            .setDescription("Estamos creando tu ticket. Por favor espera un momento...")
            .setColor(0xffff00); // Amarillo

        await interaction.editReply({
            embeds: [processingEmbed],
        });

        // Simular un retraso de procesamiento
        setTimeout(async () => {
            // Cargar la configuración desde el archivo JSON
            let staffRoles = [];
            try {
                const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
                staffRoles = config.roles || [];
            } catch (error) {
                console.error("Error leyendo la configuración de tickets:", error);
            }

            if (!staffRoles || staffRoles.length === 0) {
                return interaction.editReply({
                    content: "El sistema de tickets no está configurado correctamente.",
                    embeds: [],
                });
            }

            // Obtener la categoría "Dudas"
            const category = interaction.guild.channels.cache.get(categoryID);
            if (!category) {
                return interaction.editReply({
                    content: "No se encontró la categoría. Por favor, contacta a un administrador.",
                    embeds: [],
                });
            }

            // Crear el canal de ticket dentro de la categoría "Dudas"
            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                topic: `Ticket for ${interaction.user.id}`,
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
                    ...staffRoles.map((roleId) => ({
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
            .setDescription(
                `👋 **Bienvenid@ ${interaction.user}**\nPor favor espera que un miembro del staff atienda tu ticket.\n\n💬 **Comentanos**\nIndica el producto y te responderán en breve.`
            )
            .setColor('White')
            .setTimestamp();

            const closeRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("close-ticket")
                    .setLabel("🗑️ Cerrar")
                    .setStyle(ButtonStyle.Secondary)
            );

            await channel.send({
                content: `<@${interaction.user.id}>`,
                embeds: [embedcreate],
                components: [closeRow],
            });

            // Mensaje final con enlace
            const embedcreatetic = new EmbedBuilder()
                .setTitle("**SISTEMA DE TICKETS**")
                .setDescription(
                    `✅ **Ticket creado**\nTu ticket fue creado exitosamente. Haz clic en el botón de abajo para ir al canal.`
                )
                .setColor("White")
                .setTimestamp();

            const linkRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Ir al Canal")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel.id}`)
            );

            // Editar el mensaje inicial con el enlace al canal
            await interaction.editReply({
                embeds: [embedcreatetic],
                components: [linkRow],
            });
        }, 3000); // Retraso de 3 segundos
    },
};
