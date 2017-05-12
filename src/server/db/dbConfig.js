// const dbConfig = {
// 	user: 'dashmaster', //env var: PGUSER
// 	database: 'master', //env var: PGDATABASE
// 	password: 'QTw-uff-rR9-kK7', //env var: PGPASSWORD
// 	host: 'dashnvirginia.clvp3oigvorf.us-east-1.rds.amazonaws.com', // Server hosting the postgres database
// 	port: 5432, //env var: PGPORT
// 	idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
// 	ssl: true
// }

const dbConfig = {
	user: 'sadgvcctkeiexm', //env var: PGUSER
	database: 'd6kn3jvcvpl4pa', //env var: PGDATABASE
	password: 'f8d3fd4aa6b78cedd97ceb50edfffe8aca4bbf32204321d5764c92628b575e44', //env var: PGPASSWORD
	host: 'ec2-23-21-220-23.compute-1.amazonaws.com', // Server hosting the postgres database
	port: 5432, //env var: PGPORT
	idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
	ssl: true
}

export default dbConfig