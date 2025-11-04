function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulaire");
  const jaugesContainer = document.getElementById("jauges");
  const resultat = document.getElementById("resultat");

    // Liste de prénoms sexy/glamour
  const prenomsSexy = [
  "Adriana", "Alba", "Alyssa", "Ambre", "Anya", "Ariane", "Astrid",
  "Bella", "Bianca", "Brenda", "Bettina", "Brune",
  "Calypso", "Carmen", "Cassie", "Chloé", "Cleo", "Cléophée", "Cyria",
  "Dahlia", "Dakota", "Daisy", "Delilah", "Dita", "Daphné", "Dione",
  "Electra", "Elsa", "Emilia", "Esmée", "Eva", "Eden", "Elora", "Elyne",
  "Fatima", "Fanny", "Freya", "Gaïa", "Gala", "Gisèle",
  "Giulia", "Gloria", "Grace", "Hailey", "Hanaé", "Hazel", "Heidi", "Helena",
  "Indira", "Inès", "Isis", "Isaure",
  "Ivana", "Jade", "Jasmine", "Jenna", "Juliet", "June",
  "Katia", "Kenza", "Kim", "Kira", "Kyra", "Kaïa",
  "Lana", "Lilou", "Lior", "Lola", "Lucia", "Luz", "Lys",
  "Malika", "Maya", "Megan", "Mira", "Moïra", "Mylène",
  "Nahia", "Naomi", "Naya", "Nina", "Noa", "Nola", "Noor",
  "Océane", "Ophélie", "Oriana", "Orlane", "Ornella",
  "Paloma", "Pénélope", "Perla", "Phoebe", "Prune",
  "Quinn",
  "Raïssa", "Rita", "Ruby", "Roxane", "Romée", "Romy",
  "Salma", "Sasha", "Savana", "Sibyl", "Soline", "Sienna",
  "Soraya", "Talia", "Talya", "Tess", "Tina", "Thaïs", "Thea",
  "Uma", "Ursula", "Ulla",
  "Valentina", "Vanessa", "Vera", "Violette", "Viviane", "Vanya",
  "Wanda", "Wendy", "Willow",
  "Xéna", "Xylia",
  "Yara", "Yasmin", "Ysé",
  "Zara", "Zelda", "Zoé", "Zia", "Zina"
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

    // 1. On filtre les scénarios respectant toutes les contraintes (min <= valeur joueur + 1)
    const compatibles = scenarios.filter(sc =>
      jauges.every(j => {
        const joueurValue = values[j.nom] + 1; // +1 car les jauges commencent à 0
        const critere = sc[`min${capitalize(j.nom)}`] || 0;
        return joueurValue >= critere;
      })
    );

    // 2. On calcule un score de "proximité" pour chaque scénario compatible
    const scored = compatibles.map(sc => {
      let distance = 0;

      jauges.forEach(j => {
        const joueurValue = values[j.nom] + 1;
        const scenarioValue = sc[`min${capitalize(j.nom)}`] || 0;
        distance += Math.abs(joueurValue - scenarioValue);
      });

      const weight = 1 / (1 + distance); // moins la distance est grande, plus le poids est fort
      return { ...sc, weight };
    });

    // 3. Tirage pondéré
    function weightedRandomChoice(items) {
      const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
      let random = Math.random() * totalWeight;

      for (const item of items) {
        if (random < item.weight) return item;
        random -= item.weight;
      }
      return items[items.length - 1]; // fallback
    }

    // 4. Affichage
    // if (scored.length === 0) {
    //   resultat.textContent = "Aucun scénario ne correspond à ce profil.";
    // } else {
    //   const choix = weightedRandomChoice(scored);
    //   const pitchFinal = choix.pitch.replace(/{prenom}/gi, prenom);
    //   resultat.innerHTML = `<strong>[${choix.id}] ${choix.nom}</strong> (parmi ${scored.length} scénarios compatibles)<br><br>${pitchFinal}`;
    // }
    const resultModal = document.getElementById("result-modal");
    const resultatContent = document.getElementById("resultat-content");
    const fermerResultatBtn = document.getElementById("fermer-resultat");

    fermerResultatBtn.addEventListener("click", () => {
      resultModal.style.display = "none";
    });

    if (scored.length === 0) {
      resultatContent.innerHTML = "<p>Aucun scénario ne correspond à ce profil.</p>";
    } else {
      const choix = weightedRandomChoice(scored);
      const pitchFinal = choix.pitch.replace(/{prenom}/gi, prenom);
      resultatContent.innerHTML = `<strong>[${choix.id}] ${choix.nom}</strong> (parmi ${scored.length} scénarios compatibles)<br><br>${pitchFinal}`;
    }

    // Affiche la modale
    resultModal.style.display = "flex";

  });
});

window.addEventListener("DOMContentLoaded", () => {
  const disclaimer = document.getElementById("disclaimer");
  const continuerBtn = document.getElementById("continuer");
  const formulaire = document.getElementById("formulaire");

  continuerBtn.addEventListener("click", () => {
    disclaimer.style.display = "none";
    formulaire.style.display = "block";
  });

  // Le reste de ton code ici ↓
});

