# Routing in Likva

Ce fichier a pour but d'expliquer l'ensemble des routes disponible sur notre API, et comment y accéder.

## Authentification

Avant de tester nos routes, il faudra vous identifier auprès de l'application. Pour cela, connectez vous à Likva avec votre compte, et un token vous sera remis.

## Les routes REST

### Routes "Users"

| Méthode   | Routes           | Résultats             |
| --------- |:----------------:| ---------------------|
| GET       | /api/users       | Renvoie l'ensemble des utilisateurs, mais ne sera surement pas utilisé. |
| GET       | /api/users/:id     |   Renvoie les données d'un utilisateur particulier |
| POST  | /api/users      | Crée un utilisateur. |
| PUT  | /api/users/:id      | Update un utilisateur. |
| PUT  | /api/users/:id      | Update un mot de passe. |
| DELETE  | /api/users/:id      | Efface un utilisateur de la DB. |

### Routes "Teams"

| Méthode   | Routes           | Résultats             |
| --------- |:----------------:| ---------------------|
| GET       | /api/teams       | Renvoie l'ensemble des teams, mais ne sera surement pas utilisé. |
| GET       | /api/teams/:teamId     |   Renvoie les données d'une team particuliere |
| GET  | /api/teams/:teamId/delegates      | Retourne une liste de teamUsers délégués. |
| GET  | /api/teams/:teamId/categories/:categoryName/delegate      | Retourne le délégué actuelle et une liste de teamUsers délégués. |
| POST  | /api/teams      | Crée une team. |
| POST  | /api/teams/:teamId/categories      | Crée une catégorie dans une team donnée. |
| POST  | /api/teams/:teamId/join      | Enregistre un nouvel utilisateur sans droits. |
| POST  | /api/teams/:teamId/categories/:categoryId      | Ajoute ou update un délégué pour une catégorie donnée. |
| POST  | /api/teams/:teamId/admin/addUser      | Enregistre un nouvel utilisateur par l'administrateur. |
| PUT  | /api/teams/:teamId      | Update une team. |
| PUT  | /api/users/:teamId/password      | Update un mot de passe d'équipe. 
| DELETE  | /api/teams/:teamId      | Efface une team de la DB, ainsi que tout ces memberships associés. |

### Routes "Propositions"

| Méthode   | Routes           | Résultats             |
| --------- |:----------------:| ---------------------|
| GET       | /api/teams/:teamId/propositions       | Renvoie l'ensemble des propositions d'une team donnée. |
| GET       | /api/teams/:teamId/propositions/:category     |   Renvoie les Renvoie l'ensemble des propositions d'une team donnée, pour une catégorie donnée |
| GET       | /api/teams/:teamId/propositions/:propId     |   Renvoie une proposition donnée |
| GET       | /api/teams/:teamId/propositions/:email     |   Renvoie l'ensemble des propositions pour un auteur donné
| GET       | /api/teams/:teamId/propositions/findDelegations     |   Renvoie l'ensemble des délégués possibles
| GET       | /api/teams/:teamId/propositions/:propId/delegateCategory     |   Delègue automatiquement par catégorie à  la fin d'une catégorie
| GET       | /api/teams/:teamId/propositions/:propId/delegateCategory     |   Fait le calcul de passage de proposition.
| GET       | /api/teams/:teamId/propositions/:propId/results     |  If first time, calculate the results, otherwise return the results |
| POST  | /api/teams/:teamId/propositions      | Crée une proposition. |
| PUT  | /api/teams/:teamId/propositions/:propId    | Update une proposition. |
| DELETE  | /api/teams/:teamId/propositions/:propId      | Efface une proposition. 

### Routes "Emargements"
| Méthode   | Routes           | Résultats             |
| --------- |:----------------:| ---------------------|
| GET       | /api/teams/:teamId/propositions/:propId/votes       | Renvoie l'ensemble des votes pour une proposition donnée..|
| POST       | /api/teams/:teamId/propositions/:propId/votes     |   Vérifie que l'utilisateur a le droit de voter, l'émarge et inscrit son vote via le controleur Vote. |


### Routes "Votes"

| Méthode   | Routes           | Résultats             |
| --------- |:----------------:| ---------------------|
| GET       | /api/teams/:teamId/proposition/:propId/votes       | Renvoie la liste des gens qui ont emargé pour une proposition donnée.|
