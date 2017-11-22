conn = new Mongo();
db = conn.getDB("likva");

db.createRole(
	{
  		role: "observator",
  		privileges: [
		    { ressource: {db: "likva", collection: "users"}, actions:["find", "update"]},
    		{ ressource: {db: "likva", collection: "votes&signatures"}, actions:["find"]},
    		{ ressource: {db: "likva", collection: "group&categories&propositions&comments"}, actions: ["find"]}
  		]
	}
);

//Team Admin
db.createRole({role: 'likva', privileges: [{resource: {db:'likva', collection:'users'}, actions:['find','update','insert','remove']}, {resource: {db:'likva', collection:'votes&signatures'}, actions:['find']}, {resource: {db:'likva', collection:'group&categories&propositions&comments'}, actions:['find','update','insert','remove']}], roles: []})

//Proposer
db.createRole({role: 'proposer', privileges: [{resource: {db:'likva', collection:'users'}, actions:['find','update']}, {resource: {db:'likva', collection:'votes&signatures'}, actions:['find']}, {resource: {db:'likva', collection:'group&categories&propositions&comments'}, actions:['find','update','insert','remove']}], roles: []})

//Voter
db.createRole({role: 'voter', privileges: [{resource: {db:'likva', collection:'users'}, actions:['find','update']}, {resource: {db:'likva', collection:'votes&signatures'}, actions:['find', 'insert']}, {resource: {db:'likva', collection:'group&categories&propositions&comments'}, actions:['find','insert']}], roles: []})

//Commentator
db.createRole({role: 'commentator', privileges: [{resource: {db:'likva', collection:'users'}, actions:['find','update']}, {resource: {db:'likva', collection:'votes&signatures'}, actions:['find']}, {resource: {db:'likva', collection:'group&categories&propositions&comments'}, actions:['find','insert']}], roles: []})

//Observator
db.createRole({role: 'observator', privileges: [{resource: {db:'likva', collection:'users'}, actions:['find','update']}, {resource: {db:'likva', collection:'votes&signatures'}, actions:['find']}, {resource: {db:'likva', collection:'group&categories&propositions&comments'}, actions:['find']}], roles: []})



