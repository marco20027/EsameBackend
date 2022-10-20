const CryptoJS = require("crypto-js");
const fastify = require('fastify')({ logger: true });

fastify.register(require('@fastify/mysql'), {
    connectionString: 'mysql://root@localhost/esame'
})

fastify.register(require('@fastify/jwt'), {
    secret:'supersecret'
})

const setup = async () => {
    await fastify.register(require("@fastify/cors"), {
        origin: "*"
    })
}
setup();

fastify.route({
    method: 'GET',
    url: '/consulenza',

    onRequest:async function (req, reply) {
        try {
            await req.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    },
    handler: function (req, reply) {
        console.log(req.user)
        fastify.mysql.query(
            'SELECT * FROM consulenza ',[req.params.id],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    }
})

fastify.route({
    method: 'POST',
    url: '/consulenza',

    onRequest: async function (req, reply) {
        try {
            await req.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    },

    handler: function (req, reply) {
        const prenotazione = {
            email: req.body.email,
            consulenza : req.body.consulenza,
            teefono: req.body.telefono
        }
        console.log(req.user)
        fastify.mysql.query(
            'INSERT INTO consulenza SET ? ', [prenotazione],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    }
})


fastify.get('/user', function (req, reply) {
    fastify.mysql.query(
        'SELECT * FROM user ',/* [req.params.id],*/
        function onResult(err, result) {
            reply.send(err || result)
        }
    )
});

fastify.post('/login', function (req, reply) {
    try {
        const { body: { email, password } } = req;
        const sha1_password = String(CryptoJS.SHA1(password));
        console.log(sha1_password)

 fastify.mysql.query(
     'SELECT * FROM user where email=? AND password=? ', [email, sha1_password],
     function onResult(err, result) {
                console.log(err)
                if (result.length > 0) {
                    const token = fastify.jwt.sign({ id: result[0].id})
                    reply.send({token})
                } else {
                    reply.code(401).send({success: false, message: "Unauthorized access"})
                }
            }
        )
    } catch (err) {

    }
});
fastify.route({
    method: 'POST',
    url: '/registrazione',

    onRequest: async function (req, reply) {
        try {
            await req.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    },

    handler: function (req, reply) {
        const registrazione = {
            email: req.body.email,
            password : req.body.password,
            confermaPassword: req.body.confermaPassword
        }
        console.log(req.user)
        fastify.mysql.query(
            'INSERT INTO registrazione SET ? ', [registrazione],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    }
})




const startServer = async () => {
    try {
        await fastify.listen(3001);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

startServer();
