in the meantime

db.createRole(
	{
  		role: "proposer",
  		privileges: [
			{ ressource: {db: "likva", collection: "users"}, actions:["find", "update"]},
		    { ressource: {db: "likva", collection: "votes&signatures"}, actions:["find"]},
		    { ressource: {db: "likva", collection: "group&categories&propositions&comments"}, actions: ["find", "insert",
		      "remove", "update"]}
  		]
	}
);

db.createRole(
	{
  		role: "voter",
  		privileges: [
		   { ressource: {db: "likva", collection: "users"}, actions:["find", "update"]},
    	   { ressource: {db: "likva", collection: "votes&signatures"}, actions:["find", "insert"]},
    	   { ressource: {db: "likva", collection: "group&categories&propositions&comments"}, actions: ["find", "insert"]}
  		]
	}
);

db.createRole(
	{
  		role: "commentator",
  		privileges: [
		    { ressource: {db: "likva", collection: "users"}, actions:["find", "update"]},
    		{ ressource: {db: "likva", collection: "votes&signatures"}, actions:["find"]},
    		{ ressource: {db: "likva", collection: "group&categories&propositions&comments"}, actions: ["find", "insert"]}
  		]
	}
);

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