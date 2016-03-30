require('./commons.js')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const mails = []
const respuestasEmpezadas = []

app.get('/mails', (req, res) => {
	const desde = req.query.desde ? req.query.desde : 0
	res.status(200).send(mails.slice(desde))
})

app.put('/mails', (req, res) => {
	const autor = req.body.autor
	const contenido = req.body.contenido

	if(!autor) return res.status(400).send('falta el campo obligatorio "autor"')
	if(!autor.nombre) return res.status(400).send('falta el campo obligatorio "autor.nombre"')
	if(!autor.tipo) return res.status(400).send('falta el campo obligatorio "autor.tipo"')
	if(TIPOS_DE_AUTOR.indexOf(autor.tipo) < 0) return res.status(400).send('valor invalido en "autor.tipo"')
	if(!contenido) return res.status(400).send('falta el campo obligatorio "contenido"')
	if(!contenido.tipo) return res.status(400).send('falta el campo obligatorio "contenido.tipo"')
	if(TIPOS_DE_MAIL.indexOf(contenido.tipo) < 0) return res.status(400).send('valor invalido en "contenido.tipo"')
	if(!contenido.cuerpo) return res.status(400).send('falta el campo obligatorio "contenido.cuerpo"')
	if(contenido.tipo === RESPUESTA && !mails[contenido.pregunta]) return res.status(400).send('falta el campo obligatorio "contenido.pregunta" o no es un indice valido')
	if(contenido.tipo === RESPUESTA && mails[contenido.pregunta].respondida) return res.status(400).send('la pregunta ya fué respondida')
	if(autor.tipo === DOCENTE && contenido.tipo !== RESPUESTA) return res.status(400).send('los docentes sólo pueden responder preguntas')

	const mail = {autor: autor, contenido: contenido}

	console.log("RECIBIDO: " + JSON.stringify(mail))

	if(contenido.tipo === PREGUNTA) mail.respondida = false

	if(contenido.tipo === RESPUESTA) mails[mail.contenido.pregunta].respondida = true

	res.send({id: mails.push(mail) - 1})
})

app.get('/respuestasEmpezadas', (req, res) => {
	const desde = req.query.desde ? req.query.desde : 0

	res.status(200).send(respuestasEmpezadas.slice(desde))
})

app.post('/respuestasEmpezadas', (req, res) => {
	const idPregunta = req.body.idPregunta
	const docente = req.body.docente
	const pregunta = mails[idPregunta]

	console.log("VA A EMPEZAR: " + docente + ' > ' + JSON.stringify(pregunta) + '(' + idPregunta + ')')

	if(!pregunta) return res.status(400).send('la pregunta no existe')
	if(pregunta.respondida) return res.status(400).send('la pregunta ya fue respondida!')
	if(!docente) return res.status(400).send('falta el campo obligatorio "docente"')

	respuestasEmpezadas.push({pregunta: pregunta, docente: docente})

	res.sendStatus(200)
})

app.listen(3000)