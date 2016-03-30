DOCENTE = 'docente'
ALUMNO = 'alumno'
TIPOS_DE_AUTOR = [DOCENTE, ALUMNO]
PREGUNTA = 'pregunta'
RESPUESTA = 'respuesta'
TIPOS_DE_MAIL = [PREGUNTA, RESPUESTA]

const MAILS_URL = 'http://localhost:3000/mails'
MAILS_GET = desde => ({ url: MAILS_URL, method: 'GET', qs: {desde: desde} })
MAILS_PUT = req => ({ url: MAILS_URL, method: 'PUT', json: req })

const RESPUESTAS_EMPEZADAS_URL = 'http://localhost:3000/respuestasEmpezadas'
RESPUESTAS_EMPEZADAS_GET = desde => ({url: RESPUESTAS_EMPEZADAS_URL, method: 'GET', qs:{desde: desde} })
RESPUESTAS_EMPEZADAS_POST = req => ({url: RESPUESTAS_EMPEZADAS_URL, method: 'POST', json: req })

// ESTRUCTURA
//
// {
// 	autor: {
// 		tipo: DOCENTE | ALUMNO,
// 		nombre: String
// 	},
// 	contenido: {
// 		tipo: PREGUNTA | RESPUESTA,
// 		cuerpo: String,
//		pregunta: Int?
// 	},
//	respondida: Boolean?
// }