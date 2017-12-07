# Project Title

Ce projet constitue le back-end de notre plateforme de démocratie liquide, Likva.

## Getting Started

Vous trouverez ici une copie du projet prêt à être lancer sur votre machine, pour la tester sans problème. La base Mongo sera vide, il vous faudra donc suivre les instructions de la section déploiment. 

### Prerequisites

Il vous faudra installer [Docker](https://docs.docker.com/engine/installation/
) et [docker-compose](https://docs.docker.com/compose/install/
), pour pouvoir lancer le projet.

### Installing

Pour lancer le projet, rien de plus simple! Il vous suffit de lancer le docker-compose, avec la commande suivante.

```
docker-compose up
```

Cela lancera le serveur Node, et Mongo par la même occasion.

Vous pouvez par ailleurs lancer mongo à côté pour observer la database.

```
mongo
```


## Deployment

Pour pouvoir utiliser notre système, la première chose à faire est de créér un utilisateur. Une fois cela fait, vous pourrez créér votre équipe, vos propositions, vos catégories, et commencer à voter.

## Built With

* [Docker](https://www.docker.com/) - Notre technologie de container préféréé
* [NodeJS](https://nodejs.org/) - Notre super serveur, empowered by [Express](https://expressjs.com/)
* [Bcrypt NodeJS](https://www.npmjs.com/package/bcrypt-nodejs) - Notre hacheur de password

## Authors

* **[Adrien Merlier](https://github.com/AdrienMerlier)** - *Back-end*
* **[Leo Mouyna](https://github.com/LeoMouyna)** - *Back-end*
* **[Guillaume Bullier](https://github.com/gbullier)** - *Back-end*

See also the list of [contributors](https://github.com/AdrienMerlier/Likva_Back-end/contributors) who participated in this project.


## Acknowledgments

Soon to come, when the project is over!