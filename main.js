function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulaire");
  const jaugesContainer = document.getElementById("jauges");
  const resultat = document.getElementById("resultat");

  const disclaimer = document.getElementById("disclaimer");
  const continuerBtn = document.getElementById("continuer");

  // Liste de prénoms sexy/glamour
  const prenomsSexy = [
    "Adriana","Alba","Alyssa","Ambre","Anya","Bella","Bianca","Brenda","Bettina",
    "Calypso","Carmen","Cassie","Chloé","Cleo","Dahlia","Dakota","Daisy","Delilah","Dita",
    "Electra","Elsa","Emilia","Esmée","Eva","Fatima","Fanny","Freya","Gaïa",
    "Giulia","Gloria","Hailey","Hanaé","Hazel","Heidi","Indira","Inès","Isis",
    "Ivana","Jade","Jasmine","Jenna","Juliet","Katia","Kenza","Kim","Kira","Lana",
    "Lilou","Lior","Lola","Lucia","Malika","Maya","Megan","Nahia",
    "Naomi","Naya","Nina","Noa","Océane","Ophélie","Oriana","Orlane","Paloma","Pénélope",
    "Perla","Quinn","Raïssa","Rita","Ruby","Roxane","Salma","Sasha","Savana",
    "Soraya","Talia","Talya","Tess","Tina","Uma","Ursula","Valentina","Vanessa","Vera",
    "Violette","Wanda","Wendy","Xéna","Yara","Yasmin","Zara","Zelda","Zoé"
  ];

  // Remplir dynamiquement la liste des prénoms
  const selectPrenom = document.getElementById("prenom");
  prenomsSexy.forEach(prenom => {
    const option = document.createElement("option");
    option.value = prenom;
    option.textContent = prenom;
    selectPrenom.appendChild(option);
  });

  // Génération des jauges
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
    input.value = 0; 
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

  // --- Gestion du formulaire ---
  form.addEventListener("submit", e => {
    e.preventDefault();
    const prenom = document.getElementById("prenom").value.trim();

    const values = {};
    jauges.forEach(j => {
      const input = form.elements[j.nom];
      values[j.nom] = parseInt(input.value, 10);
    });

    // 1. Filtrage des scénarios compatibles
    const compatibles = scenarios.filter(sc =>
      jauges.every(j => {
        const joueurValue = values[j.nom] + 1;
        const critere = sc[`min${capitalize(j.nom)}`] || 0;
        return joueurValue >= critere;
      })
    );

    // 2. Score de proximité
    const scored = compatibles.map(sc => {
      let distance = 0;
      jauges.forEach(j => {
        const joueurValue = values[j.nom] + 1;
        const scenarioValue = sc[`min${capitalize(j.nom)}`] || 0;
        distance += Math.abs(joueurValue - scenarioValue);
      });
      const weight = 1 / (1 + distance);
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
      return items[items.length - 1];
    }

    // 4. Affichage dans la modale
    const resultModal = document.getElementById("result-modal");
    const fermerResultatBtn = document.getElementById("fermer-resultat");

    fermerResultatBtn.addEventListener("click", () => {
      resultModal.style.display = "none";
    });

    if (scored.length === 0) {
      resultat.textContent = "Aucun scénario ne correspond à ce profil.";
    } else {
      afficherScenario(scored, prenom);
    }

    resultModal.style.display = "flex";
  });

  // --- Gestion disclaimer ---
  continuerBtn.addEventListener("click", () => {
    disclaimer.style.display = "none";
    form.style.display = "block";
  });
});
