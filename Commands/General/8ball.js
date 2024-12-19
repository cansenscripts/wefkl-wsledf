const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Hazle una pregunta a la bola 8 y obtén una respuesta.")
        .addStringOption(option =>
            option.setName('question')
                .setDescription('La pregunta que deseas hacerle a la bola 8')
                .setRequired(true)),
    async execute(interaction) {
        // Obtener la pregunta del usuario
        const userQuestion = interaction.options.getString('question');

        // Respuestas posibles de la bola 8
        const responses = [
            "Sí.",
            "No.",
            "Tal vez.",
            "Es difícil decirlo.",
            "Probablemente no.",
            "Definitivamente sí.",
            "No cuentes con ello.",
            "Sí, pero mejor no lo hagas.",
            "No lo sé, inténtalo de nuevo.",
            "La respuesta está en las estrellas..."
        ];

        // Seleccionar una respuesta aleatoria
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Responder al usuario con la respuesta aleatoria
        await interaction.reply(`${userQuestion} \nRespuesta de la Bola 8: ${randomResponse}`);
    },
};
