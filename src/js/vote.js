Vue.filter('truncate', function (value, length) {
    if (value.length > 240)
        value = value.substring(0,length)+"...";
    return value

});

new Vue({
        el: '#my_votes',
        data:{
            current_votes: [
                {
                    title: "Modification de la loi travail",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend dui a " +
                    "laoreet lobortis. Etiam vitae eros id nulla ultricies pharetra sed a massa. Ut et pharetra " +
                    "sem, vitae molestie risus. Nulla lobortis maximus ex et fringilla. Suspendisse non sapien sit " +
                    "amet dolor posuere accumsan. Nullam fermentum enim non massa cursus, eu imperdiet ex porttitor. " +
                    "Duis ullamcorper ligula justo. Vivamus interdum metus lectus, et blandit nulla placerat et.\n" +
                    "\n" +
                    "Mauris quis augue sed lorem varius suscipit sed vel ante. Nullam et aliquet lacus. Nunc rutrum mi " +
                    "arcu, ac dictum libero tincidunt at. Class aptent taciti sociosqu ad litora torquent per conubia " +
                    "nostra, per inceptos himenaeos. Orci varius natoque penatibus et magnis dis parturient montes, " +
                    "nascetur ridiculus mus. Sed vel tortor sit amet purus blandit pharetra a vitae nibh. Nullam nec" +
                    "lobortis massa. Duis vehicula augue ipsum, sit amet hendrerit dolor rutrum nec. Morbi laoreet " +
                    "porttitor tortor, quis venenatis eros. Ut et nunc non tortor viverra volutpat a et diam. Donec " +
                    "sed augue ac nisi porta tincidunt eget at nunc. Mauris maximus vitae quam ac tincidunt. " +
                    "Suspendisse ac tortor enim. ",
                    update_time: 3600,
                    result:"Pour",
                },
                {
                    title: "Changer le régime alimentaire des étudiants",
                    description: "Pour accentuer la synergie porteuse, l'ambition est claire : piloter les " +
                    "expertises dès l'horizon 2020." + "Pour accentuer la crise des sous-traitances, il est porteur " +
                    "de coacher les focus client.",
                    update_time: 60,
                    result:"Abstention",
                },
                {
                    title: "Gestion de la crise salariale",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut eros magna. " +
                    "Pellentesque eget tempor mauris. Proin tincidunt blandit eleifend. Morbi convallis metus ipsum, " +
                    "non ornare turpis commodo non. Suspendisse vel porttitor nisl, quis accumsan turpis. Ut pharetra, " +
                    "urna ut auctor consectetur, ex augue rutrum erat, id interdum urna massa quis mi. Etiam mauris " +
                    "sem, accumsan ac ante quis, ultrices efficitur magna. Lorem ipsum dolor sit amet, consectetur " +
                    "adipiscing elit. In luctus leo ut ultrices vestibulum. Vivamus in condimentum lorem. Duis rutrum " +
                    "orci lectus, quis accumsan lectus lobortis nec. Mauris ut neque eget enim tempor tempor. Proin " +
                    "venenatis ligula at.",
                    update_time: 160,
                    result:"Non",
                }
            ],
            past_votes: [
                {
                    title: "Election des représentants du département",
                    description:
                    "Mauris quis augue sed lorem varius suscipit sed vel ante. Nullam et aliquet lacus. Nunc rutrum mi " +
                    "arcu, ac dictum libero tincidunt at. Class aptent taciti sociosqu ad litora torquent per conubia " +
                    "nostra, per inceptos himenaeos. Orci varius natoque penatibus et magnis dis parturient montes, " +
                    "nascetur ridiculus mus. Sed vel tortor sit amet purus blandit pharetra a vitae nibh. Nullam nec" +
                    "lobortis massa. Duis vehicula augue ipsum, sit amet hendrerit dolor rutrum nec. Morbi laoreet " +
                    "porttitor tortor, quis venenatis eros. Ut et nunc non tortor viverra volutpat a et diam. Donec " +
                    "sed augue ac nisi porta tincidunt eget at nunc. Mauris maximus vitae quam ac tincidunt. " +
                    "Suspendisse ac tortor enim. ",
                    update_time: 8000,
                    result:"Bernard Lhermite",
                },
                {
                    title: "Les OGM dans nos assiettes",
                    description: "En synergie avec la problématique motivationnelle, il est porteur de démarcher les " +
                    "sourcing framework.",
                    update_time: 4000,
                    result:"Anonyme",
                },
                {
                    title: "Modification de l'enveloppe budgétaire pour les subventions",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ut eros magna. " +
                    "Pellentesque eget tempor mauris. Proin tincidunt blandit eleifend. Morbi convallis metus ipsum, " +
                    "non ornare turpis commodo non. Suspendisse vel porttitor nisl, quis accumsan turpis. Ut pharetra, " +
                    "urna ut auctor consectetur, ex augue rutrum erat, id interdum urna massa quis mi. Etiam mauris " +
                    "sem, accumsan ac ante quis, ultrices efficitur magna. Lorem ipsum dolor sit amet, consectetur " +
                    "adipiscing elit. In luctus leo ut ultrices vestibulum. Vivamus in condimentum lorem. Duis rutrum " +
                    "orci lectus, quis accumsan lectus lobortis nec. Mauris ut neque eget enim tempor tempor. Proin " +
                    "venenatis ligula at.",
                    update_time: 5000,
                    result:"Blank",
                }
            ],
            current: true,

    },
    methods:{
        becomeCurrent: function () {
            this.current = true;
        },
        becomePast: function () {
            this.current = false;
        },
        resultVoteCls: function (result) {
            var positiveOption = ["pour", "oui"];
            var negativeOption = ["contre", "non"];
            var neutralOption = ["blank", "abstention", "anonyme"];
            var ret = "basic-result";
            positiveOption.forEach(function (option) {
                if (option === result.toLowerCase())
                    ret = "positive-result";
            });
            negativeOption.forEach(function (option) {
                if (option === result.toLowerCase())
                    ret = "negative-result";
            });
            neutralOption.forEach(function (option) {
                if (option === result.toLowerCase())
                    ret = "neutral-result";
            });
            console.log(ret);
            return ret;
        }
    }
})