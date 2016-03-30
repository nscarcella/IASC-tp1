require('./commons.js')
const request = require('request')

const NOMBRE = process.argv[2] || 'Anónimo ' + Math.ceil(Math.random() * 1000)
const DELAY = process.argv[3] || 2000

console.log('Ejecutando alumno ' + NOMBRE + ' [' + DELAY + 'ms]')

var mailsLeidos = 0
var preguntasHechas = 0

function pregunta(cuerpo) {
	return { autor: { tipo: ALUMNO, nombre: NOMBRE }, contenido: { tipo: PREGUNTA, cuerpo: cuerpo } }
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


		request(MAILS_PUT(pregunta('pregunta ' + (preguntasHechas + 1) + ' de ' + NOMBRE)), (error, response, body) => {
			if(error) return console.log("Hubo un error mandando una pregunta!: " + error)
			
			preguntasHechas++
		})

		run()
	}, DELAY)
}
run()