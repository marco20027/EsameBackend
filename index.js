
const fastify = require('fastify')({ logger: true })


// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
fastify.register(require('@fastify/mysql'), {
  connectionString:'mysql://root@localhost/esame'
})

fastify.get('/utenti', function(req, reply) {
  fastify.mysql.query(
    'SELECT * FROM utenti ', [req.params.id],
    function onResult (err, result) {
      reply.send(err || result)
    }  
  )
})
fastify.get('/utenti/:id', function(req, reply){
  fastify.mysql.query(
    'SELECT ID FROM utenti WHERE ID = 1', [req.params.id],
    function onResult(err, result){
      reply.send(err || result)
    }
  )
})
// metodo post da modificare
fastify.post('/utenti/add', function(req,rep){
  fastify.mysql.query(
    'INSERT INTO utenti (utente) VALUES (utente)',[req.body.utente],
    function onResult(err, result){
      rep.send(err || result)
      console.log(req)
    }
  )
})
fastify.put('/utenti', function(req, rep){
  fastify.mysql.query(
    'UPDATE utenti SET utente = test, WHERE ID= 2', [rep.body.utente],
    function onResult(err, result){
      rep.send(err || result)
      console.log(result)
    }
  )
})

fastify.listen({ port: 3000 }, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})