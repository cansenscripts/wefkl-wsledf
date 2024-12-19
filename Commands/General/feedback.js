const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const vipRole = '1315542219641327628'; // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Valora nuestra tienda.')
        .addStringOption(option =>
            option.setName('producto')
                .setDescription('Nombre del producto')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('opinion')
                .setDescription('Opina del producto')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('estrellas')
                .setDescription('Valora del 1/10')
                .setRequired(true)
                .addChoices(
                    { name: '1', value: '1' },
                    { name: '2', value: '2' },
                    { name: '3', value: '3' },
                    { name: '4', value: '4' },
                    { name: '5', value: '5' },
                    { name: '6', value: '6' },
                    { name: '7', value: '7' },
                    { name: '8', value: '8' },
                    { name: '9', value: '9' },
                    { name: '10', value: '10' }
                )
        ),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(vipRole)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **COMPRADORES**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        const allowedChannelId = '1315536977503850507';
        
        // Verificar si el comando se usa en el canal permitido
        if (interaction.channel.id !== allowedChannelId) {
            return interaction.reply({
                content: "Este comando solo se puede usar en el canal de feedback.",
                ephemeral: true,
            });
        }

        const producto = interaction.options.getString('producto');
        const opinion = interaction.options.getString('opinion');
        const estrellas = interaction.options.getString('estrellas');

        const embed = new EmbedBuilder()
        .setTitle('**SISTEMA DE FEEDBACK**')
        .setDescription(`✨ **¡Nuevo Feedback!**\n${interaction.user} dio una reseña de la store\n\n🛒 **Producto**: \`\`\`${producto}\`\`\`\n\n📋 **Opinion**: \`\`\`${opinion}\`\`\`\n\n✨ **Estrellas**: \`\`\`${estrellas}\`\`\``)
        .setColor('White')
        .setTimestamp()

        await interaction.reply({ content: 'Feedback enviado', ephemeral: true })
        const suggestionMessage = await interaction.channel.send({
            embeds: [embed],
        });

    },
};
