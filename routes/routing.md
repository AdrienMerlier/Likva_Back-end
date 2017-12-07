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
| POST  | /api/teams      | Crée une team. |
| PUT  | /api/teams/:teamId      | Update une team. |
| PUT  | /api/users/:teamId/password      | Update un mot de passe d'équipe. 
| DELETE  | /api/teams/:teamId      | Efface une team de la DB, ainsi que tout ces memberships associés. |

### Routes "Propositions"

| Méthode   | Routes           | Résultats             |
| --------- |:----------------:| ---------------------|
| GET       | /api/teams/:teamId/proposition       | Renvoie l'ensemble des propositions d'une team donnée. |
| GET       | /api/teams/:teamId/proposition/:category     |   Renvoie les Renvoie l'ensemble des propositions d'une team donnée, pour une catégorie donnée |
| GET       | /api/teams/:teamId/proposition/:id     |   Renvoie une proposition donnée |
| POST  | /api/teams/:teamId/proposition      | Crée une proposition. |
| PUT  | /api/teams/:teamId/proposition/:id    | Update une proposition. |
| DELETE  | /api/teams/:teamId/proposition/:id      | Efface une proposition. 
