const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dolar')
        .setDescription('Obtén el valor actual del dólar blue.'),

    async execute(interaction) {
        const apiKey = 'd4f1a2aefcb0a94656de94e8'; // Sustituye con tu clave API
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            if (data.result !== 'success') {
                return interaction.reply({
                    content: "❌ No se pudo obtener el valor del dólar. Intenta de nuevo más tarde.",
                    ephemeral: true
                });
            }

            const dolarOficial = data.conversion_rates.ARS; // Valor en pesos argentinos

            const embed = new EmbedBuilder()
                .setColor('White')
                .setTitle('💵 Precio del Dólar')
                .setDescription(`**Dólar Oficial:** $${dolarOficial.toFixed(2)}`)
                .setTimestamp()
                .setFooter({ text: 'Comando ejecutado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error("Error al obtener el valor del dólar:", error);
            return interaction.reply({
                content: "❌ No se pudo obtener el valor del dólar. Intenta de nuevo más tarde.",
                ephemeral: true
            });
        }
    }
};
