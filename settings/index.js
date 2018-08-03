module.exports = {
    port: 6996,
    superSecret: '3dnTz4548Tyb4uWXpVucbyh3khuE42nDZS7QYDVZHh4xF9NrQLfXLA5MGJSAdUtR',
    masterPasswordHash: '$2a$10$UYE8uwEBJMz3KI4hJtPA7uFvCLlqlM.CXKrdTw.UbVhqdHFulTlAq',
    dbUri: 'mongodb://localhost/gmat-web',
    permission: {
        auth: '1',
        classrooms: '2',
        users: '1',
        questions: {
            GET: '2',
            PUT: '2',
            POST: '2',
            DELETE: '2'
        },
        questionpacks: {
            GET: '1',
            PUT: '2',
            POST: '2',
            DELETE: '2'
        },
        results: {
            GET: '1',
            PUT: '2',
            POST: '1',
            DELETE: '2'
        },
        students: {
            GET: '2',
            PUT: '2',
            POST: '2',
            DELETE: '2'
        },
        classrooms: {
            GET: '2',
            PUT: '2',
            POST: '2',
            DELETE: '2'
        },
    }
}
