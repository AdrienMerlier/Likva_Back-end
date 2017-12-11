# Models

Ce fichier regroupe l'ensemble des modèles de données, ainsi que la signification de leurs variables.

## User

```
var userModelSchema = new Schema({
	_id: String, //Un ID unique pour l'objet
	name : String, //Le prénom de l'utilisateur
	surname : String, //Le nom de famille de l'utilisateur
	username : String, // Un username, ou pseudo (pas identifiant), qui par défaut est name.surname  
	password : String, //Le password hashé
	email : String, //L'email, critère identifiant
  	teams: { //Va permettre de passer au token les informations nécessaires pour connaitre les droits utilisateurs sur ses équipes
  		{
  			slug: req.body.teamName, //Nom de l'équipe en question
            admin: true, //Admin on non dans cette équipe
            proposer: true, //Peut proposer ou non
            role: "Voter" //Rôle de l'utilisateur dans l'équipe ("Voter"/"Commentor"/"Observer")
  		}
  	}
});
```

## Team

```
var teamModelSchema = new Schema({
	_id: String, //ID unique pour l'équipe
	slug : String, //Nom de l'équipe, identifiant
	displayName: String, //Nom public de l'équipe, qui peut être customiser par un admin
	type: String, //Le type d'équipe (Syndicat, ONG, parti politique, ...)
	password : String, //Password hashé
	categories: [[]] // Un array de catégories
});
```

## TeamUser

```
var teamUserModelSchema = new Schema({
	_id: String, //ID unique pour l'utilisateur
	slug: String, //Nom de l'équipe en question
	email : String, //Email, identifiant
	admin : Boolean, //Est admin ou non
	proposer : Boolean, //Peut proposer ou non
	status : String, //Rôle de l'utilisateur dans l'équipe ("Voter"/"Commentor"/"Observer")
	delegable: Boolean, //Peut être délégué ou non
	description: String, //La description de l'utilisateur dans l'équipe
	delegation : {
  			category: String, //Le nom de la catégorie en question
  			delegate: String //Le délégué pour cette catégorie
  		}
});
```

Ce modèle sera celui que la base interrogera pour vérifier que l'utilisateur a bien le droit de voter, de déléguer à une personne donnée, de faire des propositions, de créer une catégorie, etc.

## Proposition

```
var propositionModelSchema = new Schema({
	_id: String, //Un ID unique pour la proposition
	slug: String, //Le nom de l'équipe en question
	category: String, //Le nom de la catégorie en question, si nécessaire
	title : String, //Le titre de la proposition
	author: String, //L'auteur de la proposition
	authorLink: String, //Le lien vers l'auteur de la proposition
	summary : String, //Le résumé de la proposition
	description : String, //La description de la situation
	proposition : String, //La proposition de changement
	consequences : String, //Les conséquences du vote
	document1 : String, //Un URL de ressource
	document2 : String, //Un URL de ressource
	document3 : String, //Un URL de ressource
	document4 : String, //Un URL de ressource
	document5 : String, //Un URL de ressource
	information: String, //Les informations sur le vote
	quorum : [Number], //Le % de votants nécessaire pour considérer le vote validé 
	type: String, //Le type de vote pour calculer les résultats
	date : Date //La date de fin de vote
	results: [[]], //L'ensemble des votes, compilé dans un array
	verdict: String //Le résultat final du vote, marqué "ongoing" tant qu'on ne demande pas les résultats
});
```

## Vote

```
var voteModelSchema = new Schema({
	_id: String, //Un ID unique pour la proposition
	slug : String, //Le nom de l'équipe de la proposition
	propId : String, //L'ID de la proposition votée
	voter: String, //Le nom du votant, "" si user.delegable=false
	delegation : Boolean, //Est ce que le vote est une délégation ou non
	content: String, //Le contenu du vote "Yes"/"No"/Nom du délégué
	weight: Number //Poids du vote, 1 par défaut, augmente de 1 par vote délégué
});
```

## Emargement

```
var emargementModelSchema = new Schema({
	_id: String, //Un ID unique pour l'émargement
	slug : String, //Le nom de l'équipe de la proposition
	propId : String, //L'ID de la proposition votée
	email: String, //Le id du votant
});
```

