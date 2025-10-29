// init-mongo.js

db = db.getSiblingDB('quotevote-dev'); 

db.createUser({
    user: 'localdev',
    pwd: 'password',
    roles: [
        { role: 'readWrite', db: 'quotevote-dev' },
        { role: 'dbAdmin', db: 'quotevote-dev' },
        { role: 'userAdmin', db: 'quotevote-dev' }
    ]
})

print("Database and user created successfuilly!")