const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta al archivo de configuración
const configPath = path.join(__dirname, '..','..', 'verifyConfig.json');

const adminRoleId = '1315542145796542474'; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifysetup')
        .setDescription('Configura el sistema de verificación')
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('El rol que se otorgará al verificar')
                .setRequired(true)
        ),
    async execute(interaction) {

        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF** por lo tanto no puedes usar este comando",
                ephemeral: true
            });
        }

        const role = interaction.options.getRole('rol');

        // Crear el embed
        const embed = new EmbedBuilder()
            .setTitle('**SISTEMA DE VERIFICACION**')
            .setDescription('👋 **Bienvend@**\nClickea el boton para verificarte y acceder al resto de canales')
            .setColor('White')
            .setTimestamp()

        // Crear el botón
        const button = new ButtonBuilder()
            .setCustomId('verify_button')
            .setLabel('Verificar')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        // Enviar el mensaje con el embed y el botón
        await interaction.reply({ content: '¡Panel de verificación configurado!', ephemeral: true });
        await interaction.channel.send({ embeds: [embed], components: [row] });

        // Leer y actualizar la configuración
        let config = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        config[interaction.guildId] = role.id;

        // Guardar la configuración actualizada
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

        interaction.followUp({ content: '¡El rol de verificación ha sido configurado correctamente!', ephemeral: true });
    }
};
