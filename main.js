window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulaire");
  const jaugesContainer = document.getElementById("jauges");
  const resultat = document.getElementById("resultat");

    // Liste de prénoms sexy/glamour
  const prenomsSexy = [
  "Adriana", "Alba", "Alyssa", "Ambre", "Anya", "Bella", "Bianca", "Brenda", "Bettina",
  "Calypso", "Carmen", "Cassie", "Chloé", "Cleo", "Dahlia", "Dakota", "Daisy", "Delilah", "Dita",
  "Electra", "Elsa", "Emilia", "Esmée", "Eva", "Fatima", "Fanny", "Freya", "Gaïa",
  "Giulia", "Gloria", "Hailey", "Hanaé", "Hazel", "Heidi", "Indira", "Inès", "Isis",
  "Ivana", "Jade", "Jasmine", "Jenna", "Juliet", "Katia", "Kenza", "Kim", "Kira", "Lana",
  "Lilou", "Lior", "Lola", "Lucia", "Malika", "Maya", "Megan", "Nahia",
  "Naomi", "Naya", "Nina", "Noa", "Océane", "Ophélie", "Oriana", "Orlane", "Paloma", "Pénélope",
  "Perla", "Quinn", "Raïssa", "Rita", "Ruby", "Roxane", "Salma", "Sasha", "Savana",
  "Soraya", "Talia", "Talya", "Tess", "Tina", "Uma", "Ursula", "Valentina", "Vanessa", "Vera",
  "Violette", "Wanda", "Wendy", "Xéna", "Yara", "Yasmin", "Zara", "Zelda", "Zoé"
];

  // Remplir dynamiquement la liste des prénoms
  const selectPrenom = document.getElementById("prenom");
  prenomsSexy.forEach(prenom => {
    const option = document.createElement("option");
    option.value = prenom;
    option.textContent = prenom;
    selectPrenom.appendChild(option);
  });

  jauges.forEach(jauge => {
    const container = document.createElement("div");
    container.classList.add("jauge");

    const label = document.createElement("label");
    label.htmlFor = jauge.nom;
    label.textContent = jauge.label;
    container.appendChild(label);

    const input = document.createElement("input");
    input.type = "range";
    input.min = 0;
    input.max = jauge.niveaux.length - 1;
    input.value = 0; // valeur par défaut au centre
    input.name = jauge.nom;
    input.id = jauge.nom;

    const niveauLabel = document.createElement("span");
    niveauLabel.classList.add("niveau-label");
    niveauLabel.textContent = jauge.niveaux[input.value];

    input.addEventListener("input", () => {
      niveauLabel.textContent = jauge.niveaux[input.value];
    });

    container.appendChild(input);
    container.appendChild(niveauLabel);
    jaugesContainer.appendChild(container);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const prenom = document.getElementById("prenom").value.trim();

    const values = {};
    jauges.forEach(j => {
      const input = form.elements[j.nom];
      values[j.nom] = parseInt(input.value, 10);
    });

    const compatibles = scenarios.filter(sc =>
      values.presentation + 1 >= sc.minPresentation &&
      values.caresses + 1 >= sc.minCaresses &&
      values.exploration + 1 >= sc.minExploration &&
      values.oral + 1 >= sc.minOral &&
      values.ejaculation + 1 >= sc.minEjaculation &&
      values.sperme + 1 >= sc.minSperme
    );

    if (compatibles.length === 0) {
      resultat.textContent = "Aucun scénario ne correspond à ce profil.";
    } else {
      const choix = compatibles[Math.floor(Math.random() * compatibles.length)];
      const pitchFinal = choix.pitch.replace(/{prenom}/gi, prenom);
      resultat.innerHTML = `<strong>${choix.nom}</strong><br><br>${pitchFinal}`;
    }
  });
});
