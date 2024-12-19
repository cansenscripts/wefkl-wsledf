const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(member) {

    const fontPath = path.join(__dirname, '..', 'Fuentes', 'Whyte-Bold.ttf');  // Cambia 'mi-fuente-personalizada.ttf' a tu archivo de fuente
    registerFont(fontPath, { family: 'MiFuente' });  // Registra la fuente
    
    // Nombre de usuario para la prueba
    const username = member.user.username; // Usamos el nombre de usuario real del usuario que ejecutó el comando

    // Crear un canvas para la imagen de bienvenida
    const canvas = createCanvas(700, 250); // Tamaño de la imagen
    const ctx = canvas.getContext('2d');

    // Fondo de la imagen
    ctx.fillStyle = '#1c1b1b'; // Color de fondo actualizado
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto de bienvenida usando la fuente personalizada
    ctx.fillStyle = '#FFFFFF'; // Color de texto
    ctx.font = '40px "MiFuente"'; // Usa la fuente registrada
    ctx.fillText('cansenstore.', 50, 100);

    // Texto con el nombre de usuario
    ctx.font = '30px "MiFuente"'; // Usa la fuente registrada
    ctx.fillText(`¡Bienvenid@ ${username}! 🎉`, 50, 150);

    // Obtener el avatar del usuario que ejecutó el comando
    const avatar =  await loadImage(member.user.displayAvatarURL({size: 1024, extension: "png"}))

    // Calcular las coordenadas y el tamaño para dibujar el avatar dentro de un círculo con borde
    const avatarX = canvas.width - 180;
    const avatarY = 50;
    const avatarSize = 128;
    const borderWidth = 10;  // Grosor del borde

    // Dibujar el borde circular
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + borderWidth, 0, Math.PI * 2);
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = '#ffff'; // Color del borde
    ctx.stroke();

    // Dibujar el avatar dentro del círculo
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.clip(); // Hace que el avatar sea circular
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize); // Dibuja el avatar dentro del círculo

    // Agregar el texto "Cansenstore" debajo del avatar
    ctx.restore(); // Asegura que el clip no afecte el texto
    ctx.fillStyle = '#FFFFFF'; // Color de texto
    ctx.font = '20px "MiFuente"'; // Fuente más pequeña para el texto
    const textWidth = ctx.measureText('Cansenstore').width;
    const textX = avatarX + (avatarSize / 2) - (textWidth / 2); // Centrar el texto debajo del avatar
    const textY = avatarY + avatarSize + 20; // Posicionar el texto debajo del avatar
    ctx.fillText('Cansenstore', textX, textY); // Escribir el texto

    // Guardar la imagen como un archivo
    const filePath = './test_welcome_image.png';
    const buffer = canvas.toBuffer();
    fs.writeFileSync(filePath, buffer);

    // Obtener la cantidad de miembros
    const memberCount = member.guild.memberCount;

    // Crear un embed con el mensaje de bienvenida
    const welcomeEmbed = new EmbedBuilder()
        .setColor('White') // Color de fondo para el embed
        .setTitle('¡Bienvenido/a al servidor!')
        .setDescription(`¡Hola ${member.user}! 🎉\nTe damos la bienvenida a nuestra comunidad.\n\nAhora somos **${memberCount} miembros** en total. ¡Nos alegra tenerte con nosotros!`)
        .setImage('attachment://test_welcome_image.png') // Usar la imagen generada como imagen principal del embed
        .setFooter({ text: `¡Esperamos que disfrutes tu estancia!`, iconURL: member.guild.iconURL() })
        .setTimestamp();

    // Enviar la imagen y el embed
    const attachment = new AttachmentBuilder(filePath, { name: 'test_welcome_image.png' });

    const channel = member.guild.channels.cache.get("1315536513940848660")

    await channel.send({ embeds: [welcomeEmbed], files: [attachment] });

    // Eliminar el archivo de imagen después de enviarlo (opcional)
    fs.unlinkSync(filePath);

  },
};
