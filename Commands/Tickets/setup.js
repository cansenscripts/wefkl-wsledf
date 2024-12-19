const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta al archivo donde guardamos la configuración
const configFilePath = path.join(__dirname, '..', '..', 'ticketConfig.json');

// El ID del rol exclusivo para configurar tickets (esto debe ser configurado previamente)
const adminRoleId = '1315542145796542474';  // Reemplaza esto con el ID real del rol exclusivo

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketsetup')
        .setDescription('Configura el sistema de tickets y los roles de staff.')
        .addRoleOption(option =>
            option.setName('staffrole1')
                .setDescription('Selecciona el primer rol que tendrá acceso a los tickets.')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('staffrole2')
                .setDescription('Selecciona el segundo rol que tendrá acceso a los tickets.')
                .setRequired(false)
        )
        .addRoleOption(option =>
            option.setName('staffrole3')
                .setDescription('Selecciona el tercer rol que tendrá acceso a los tickets.')
                .setRequired(false)
        ),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol exclusivo para configurar los tickets
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF** por lo tanto no puedes usar este comando",
                ephemeral: true
            });
        }

        const staffRole1 = interaction.options.getRole('staffrole1');
        const staffRole2 = interaction.options.getRole('staffrole2');
        const staffRole3 = interaction.options.getRole('staffrole3');

        // Verifica que al menos el primer rol de staff esté seleccionado
        if (!staffRole1) {
            return interaction.reply({ content: "Debe seleccionar al menos un rol de staff.", ephemeral: true });
        }

        // Crear la configuración de los tickets
        const ticketConfig = {
            roles: [
                staffRole1.id,
                staffRole2 ? staffRole2.id : null,
                staffRole3 ? staffRole3.id : null,
            ].filter(role => role !== null)  // Filtrar valores nulos
        };

        try {
            // Guardar configuración en archivo JSON
            fs.writeFileSync(configFilePath, JSON.stringify(ticketConfig, null, 4));

            // Crear los botones para las categorías de tickets
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket-compras')
                    .setLabel('💵 Compras')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('ticket-dudas')
                    .setLabel('❓ Dudas')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('ticket-partner')
                    .setLabel('⭐ Partner')
                    .setStyle(ButtonStyle.Primary)
            );

            const embed = new EmbedBuilder()
            .setTitle('**SISTEMA DE TICKETS**')
            .setDescription('⁉️ **¿Necesitas ayuda?**\nCrea un ticket en la sección que necesites y te intentaremos atender lo más antes posible.\n\n💵 **Compras**\nEn caso de querer adquirir un producto de la store clickea el botón.\n\n✈️ **Bienvenid@ a la store**')
            .setColor("White")
            .setTimestamp()

            // Enviar el mensaje con los botones
            await interaction.reply({
                content: 'Sistema de tickets configurado correctamente.',
                ephemeral: true
            });

            interaction.channel.send({ 
                embeds: [embed],
                components: [row], 
            });

        } catch (error) {
            console.error("Error al guardar la configuración de los tickets:", error);
            return interaction.reply({
                content: "Ocurrió un error al configurar el sistema de tickets.",
                ephemeral: true
            });
        }
    },
};
