const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const adminRoleId = '1315542145796542474'; // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crearembed')
        .setDescription('Crea un embed completamente personalizado.')
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('Título del embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Descripción del embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color del borde del embed en formato hexadecimal (ejemplo: #FF0000)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('autor')
                .setDescription('Nombre del autor del embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('autoricon')
                .setDescription('URL de la imagen del autor')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('imagen')
                .setDescription('URL de una imagen que se mostrará en el embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('Texto del pie de página del embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footericon')
                .setDescription('URL de la imagen del pie de página')
                .setRequired(false)),

    async execute(interaction) {
        // Verificar si el usuario tiene el rol adecuado
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            return interaction.reply({
                content: "🛑 No perteneces al sistema de **STAFF**, por lo tanto no puedes usar este comando.",
                ephemeral: true
            });
        }

        // Obtener las opciones proporcionadas por el usuario
        const title = interaction.options.getString('titulo');
        const description = interaction.options.getString('descripcion');
        const color = interaction.options.getString('color') || '#0000FF'; // Predeterminado azul si no se da uno
        const authorName = interaction.options.getString('autor');
        const authorIcon = interaction.options.getString('autoricon');
        const image = interaction.options.getString('imagen');
        const footerText = interaction.options.getString('footer');
        const footerIcon = interaction.options.getString('footericon');

        // Crear el embed personalizado
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp();

        // Agregar autor si se proporciona
        if (authorName) {
            embed.setAuthor({
                name: authorName,
                iconURL: authorIcon || null
            });
        }

        // Agregar imagen si se proporciona
        if (image) {
            embed.setImage(image);
        }

        // Agregar pie de página si se proporciona
        if (footerText) {
            embed.setFooter({
                text: footerText,
                iconURL: footerIcon || null
            });
        }

        // Enviar el embed como respuesta
        await interaction.reply({
           content: 'Enviado',
           ephemeral: true
        });
        
        await interaction.channel.send({
            embeds: [embed]
        });
        
    }
};
