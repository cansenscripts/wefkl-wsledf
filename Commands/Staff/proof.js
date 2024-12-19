const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const adminRoleId = '1315542145796542474';  // ID del rol de administrador

module.exports = {
    data: new SlashCommandBuilder()
        .setName('proof')
        .setDescription('Genera un comprobante de compra')
        .addStringOption(option => 
            option.setName('producto')
                .setDescription('Nombre del producto')
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName('comprador')
                .setDescription('Usuario que compró el producto')
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName('vendedor')
                .setDescription('Usuario que vendió el producto')
                .setRequired(true)
        )
        .addAttachmentOption(option => 
            option.setName('foto')
                .setDescription('Foto del producto')
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
        const producto = interaction.options.getString('producto');
        const comprador = interaction.options.getUser('comprador');
        const vendedor = interaction.options.getUser('vendedor');
        const foto = interaction.options.getAttachment('foto');

        // Crear el embed con la información proporcionada
        const embed = new EmbedBuilder()
            .setColor('#ffffff')
            .setTitle('📸 PROOF')
            .addFields(
                { name: 'Producto', value: producto, inline: false },
                { name: 'Comprador', value: `${comprador.username}`, inline: false },
                { name: 'Vendedor', value: `${vendedor.username}`, inline: false }
            )
            .setImage(foto.url)  // La foto del producto
            .setTimestamp()
            .setFooter({ text: 'Generado por el sistema de comprobantes', iconURL: interaction.user.avatarURL() });

        // Obtener el canal donde se debe enviar el embed
        const channel = await interaction.client.channels.fetch('1315536995954720880');

        // Enviar el embed al canal específico
        channel.send({ embeds: [embed] });

        // Responder al usuario que el comprobante fue enviado
        return interaction.reply({
            content: "✅ El comprobante de compra ha sido enviado al canal especificado.",
            ephemeral: true
        });
    }
};
