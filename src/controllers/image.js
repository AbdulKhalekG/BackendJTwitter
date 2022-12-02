const cloud = require('../cloud/upload')
const sharp = require('sharp')
const {Pool} = require('pg');
const config = {
    connectionString: process.env.DATABASE_URL,
    max:500,
    min:100,
    ssl:{rejectUnauthorized:false}
};

const pool = new Pool(config);

exports.image = async (req,res) => {

    const{contenido, username, fecha, hora} = req.body

    try{
        const result = await cloud.uploader.upload(req.file.path, {
            public_id: `${new Date().getTime()}_post`, crop: 'fill'
    })
    console.log('url: ' + result.url + ', contenido: ' + contenido + 'username: ' + username + 'fecha: ' + fecha + 'hora: ' + hora)
    const resultdb = await pool.query('INSERT INTO post(url, contenido, username, fecha, hora, id_imagen, imagen) VALUES($1,$2,$3,$4,$5,$6,$7)', [result.url, contenido, username, fecha, hora, id_imagen, imagen])
    console.log('exito')
    res.json('exito')

} catch(error){

    res.status(500).json({success: false, message: 'la foto no carga'})
    console.log('error de la imagen', error.message)
}

}