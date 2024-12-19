const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const adminRoleId = '1315542145796542474';  // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuevoproducto')
        .setDescription('Crea un nuevo producto con un embed personalizable.')
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('El título del producto')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('La descripción del producto')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL del botón del producto')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal donde se enviará el producto')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        // Obtener las opciones proporcionadas por el usuario
        const titulo = interaction.options.getString('titulo');
        const descripcion = interaction.options.getString('descripcion');
        const url = interaction.options.getString('url');
        const canal = interaction.options.getChannel('canal');

        // Crear el embed con la información proporcionada
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')  // Color blanco
            .setTitle(titulo)
            .setDescription(descripcion)
            .setTimestamp()
            .setFooter({ text: 'CansenStore', iconURL: interaction.user.avatarURL() });

        // Crear el botón con la URL proporcionada
        const button = new ButtonBuilder()
            .setLabel('Ver Producto')
            .setStyle(ButtonStyle.Link)
            .setURL(url);

        // Enviar el embed y el botón al canal especificado
        const channel = await interaction.client.channels.fetch(canal.id);
        
        await channel.send({
            embeds: [embed],
            components: [{
                type: 1,  // Tipo de componente (fila de botones)
                components: [button]  // Botón que contiene el enlace
            }]
        });

        // Responder al usuario que el producto fue enviado
        return interaction.reply({
            content: `✅ El producto ha sido enviado al canal ${canal}.`,
            ephemeral: true
        });
    }
};
