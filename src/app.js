const express = require('express')
const cors = require('cors')

const { v4: uuid } = require('uuid')
const { isUuid } = require('uuidv4')

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

function validateIdParam(request, response, next) {
	const { id } = request.params

	if ( !isUuid(id) )
		return response.status(400).json({ error: 'Invalid ID.' })

	return next()
}

function validateRepositoryExistence(request, response, next) {
	const { id } = request.params

	const repositoryIndex = repositories.findIndex( respository => respository.id === id )

	if ( !repositories[repositoryIndex] )
		return response.status(400).json({ error: 'Unexisting repository.' })

	return next()
}

app.use('/repositories/:id', validateIdParam, validateRepositoryExistence)

app.get('/repositories', (request, response) => {
	return response.json(repositories)
})

app.post('/repositories', (request, response) => {
	const { title, url, techs } = request.body

	const repository = { id: uuid(),title, url, techs, likes: 0 }

	repositories.push(repository)

	return response.json(repository)

})

app.put('/repositories/:id', (request, response) => {
	
	const { id } = request.params
	const { title, url, techs } = request.body

	const repositoryIndex = repositories.findIndex( respository => respository.id === id )

	repositories[repositoryIndex].title = title
	repositories[repositoryIndex].url = url
	repositories[repositoryIndex].techs = techs

	return response.json(repositories[repositoryIndex])

})

app.delete('/repositories/:id', (request, response) => {
	const { id } = request.params
		
	const repositoryIndex = repositories.findIndex( respository => respository.id === id )

	repositories.splice(repositoryIndex, 1)

	return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
	const { id } = request.params

	const repositoryIndex = repositories.findIndex( respository => respository.id === id )
	repositories[repositoryIndex].likes++

	return response.json(repositories[repositoryIndex])
})

module.exports = app
