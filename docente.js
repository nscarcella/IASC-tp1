require('./commons.js')
const request = require('request')

const NOMBRE = process.argv[2] || 'Anónimo ' + Math.ceil(Math.random() * 1000)
const DELAY = process.argv[3] || 2000
const TIEMPO_DE_RESPUESTA = process.argv[4] || 2000

console.log('Ejecutando docente ' + NOMBRE + ' [' + DELAY + 'ms, ' + TIEMPO_DE_RESPUESTA + 'ms]')

var mailsLeidos = 0
var respuestasEmpezadasLeidas = 0

function respuesta(cuerpo, pregunta) {
	return { autor: { tipo: DOCENTE, nombre: NOMBRE }, contenido: { tipo: RESPUESTA, cuerpo: cuerpo, pregunta: pregunta } }
}

function run() {
	setTimeout( () => {
		
		request(MAILS_GET(mailsLeidos), (error, response, body) => {
			if(error) return console.log("Hubo un error obteniendo los mails!: " + error)
			
			mails = JSON.parse(body)
			mailsLeidos += mails.length
			console.log("NUEVOS MAILS RECIBIDOS: " + mails.length)
			for(mail of mails)
				console.log('[' + mail.contenido.tipo + '] ' + mail.autor.nombre + ' > ' + mail.contenido.cuerpo)
		})

		request(RESPUESTAS_EMPEZADAS_GET(respuestasEmpezadasLeidas),(error, response, body) => {
			if(error) return console.log("Hubo un error obteniendo las empezadas de respuesta!: " + error)

			respuestasEmpezadas = JSON.parse(body)
			respuestasEmpezadasLeidas += respuestasEmpezadas.length
			console.log("NUEVAS RESPUESTAS EMPEZADAS: " + respuestasEmpezadas.length)
			for(respuestaEmpezada of respuestasEmpezadas)
				console.log(respuestaEmpezada.docente + ': ' + respuestaEmpezada.pregunta.autor.nombre + ' > ' + respuestaEmpezada.pregunta.contenido.cuerpo)
		})

		request(MAILS_GET(), (error, response, body) => {
			if(error) return console.log("Hubo un error obteniendo los mails!: " + error)
			
			mails = JSON.parse(body)
			const pregunta = mails.find(mail => mail.contenido.tipo === PREGUNTA && !mail.respondida)

			if(pregunta){
				console.log("PIENSA RESPONDER:")
				console.log('[' + pregunta.contenido.tipo + '] ' + pregunta.autor.nombre + ' > ' + pregunta.contenido.cuerpo + '(' + mails.indexOf(pregunta) + ')')

				request(RESPUESTAS_EMPEZADAS_POST({docente: NOMBRE, idPregunta: mails.indexOf(pregunta)}),(error, response, body) => {
					if(error) return console.log("Hubo un error avisando que empezó una respuesta!: " + error)
				})

				setTimeout(() => {
					console.log("TERMINO DE ESCRIBIR RESPUESTA!")
					const r = respuesta('respuesta de ' + NOMBRE + ' a ' + pregunta.contenido.cuerpo, mails.indexOf(pregunta))
					request(MAILS_PUT(r), (error, response, body) => {
						if(error) return console.log("Hubo un error mandando una respuesta!: " + error)
						console.log("RESPONDIDO:")
						console.log('[' + r.contenido.tipo + '] ' + pregunta.autor.nombre + ' > ' + pregunta.contenido.cuerpo)
					})
				}, TIEMPO_DE_RESPUESTA)
			}
		})		

		run()
	}, DELAY)
}
run()
