
// Variables globales
let selectedTipPercent = 15;

// Gestion des onglets
function switchTab(tabName) {
    // Masquer tous les calculateurs
    document.querySelectorAll('.calculator').forEach(calc => {
        calc.classList.remove('active');
    });

    // Masquer tous les résultats
    document.querySelectorAll('.result').forEach(result => {
        result.classList.remove('show');
    });

    // Désactiver tous les onglets
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Activer l'onglet et le calculateur sélectionnés
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Calculateur de Pourboire
function selectTip(percent) {
    selectedTipPercent = percent;
    document.querySelectorAll('.tip-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    document.getElementById('custom-tip').value = '';
}

function calculerPourboire() {
    const montant = parseFloat(document.getElementById('montant').value);
    const customTip = parseFloat(document.getElementById('custom-tip').value);
    const personnes = parseInt(document.getElementById('personnes').value) || 1;

    if (isNaN(montant) || montant <= 0) {
        alert('Veuillez entrer un montant valide');
        return;
    }

    const tipPercent = customTip || selectedTipPercent;
    const pourboire = montant * (tipPercent / 100);
    const total = montant + pourboire;
    const parPersonne = total / personnes;

    document.getElementById('addition-value').textContent = montant.toFixed(2) + ' €';
    document.getElementById('tip-value').textContent = pourboire.toFixed(2) + ' € (' + tipPercent + '%)';
    document.getElementById('total-value').textContent = total.toFixed(2) + ' €';
    document.getElementById('per-person-value').textContent = parPersonne.toFixed(2) + ' €';
    document.getElementById('result-pourboire').classList.add('show');
}

// Calculateur IMC
function calculerIMC() {
    const poids = parseFloat(document.getElementById('poids').value);
    const tailleCm = parseFloat(document.getElementById('taille').value);

    if (isNaN(poids) || poids <= 0 || isNaN(tailleCm) || tailleCm <= 0) {
        alert('Veuillez entrer des valeurs valides');
        return;
    }

    const tailleM = tailleCm / 100;
    const imc = poids / (tailleM * tailleM);

    document.getElementById('imc-value').textContent = imc.toFixed(1);

    const categoryDiv = document.getElementById('imc-category');
    let category, categoryClass;

    if (imc < 18.5) {
        category = 'Insuffisance pondérale';
        categoryClass = 'imc-underweight';
    } else if (imc < 25) {
        category = 'Poids normal';
        categoryClass = 'imc-normal';
    } else if (imc < 30) {
        category = 'Surpoids';
        categoryClass = 'imc-overweight';
    } else {
        category = 'Obésité';
        categoryClass = 'imc-obese';
    }

    categoryDiv.textContent = category;
    categoryDiv.className = 'imc-category ' + categoryClass;
    document.getElementById('result-imc').classList.add('show');
}

// Convertisseur d'Unités
const unites = {
    longueur: {
        'mm': { nom: 'Millimètre', facteur: 0.001 },
        'cm': { nom: 'Centimètre', facteur: 0.01 },
        'm': { nom: 'Mètre', facteur: 1 },
        'km': { nom: 'Kilomètre', facteur: 1000 },
        'in': { nom: 'Pouce', facteur: 0.0254 },
        'ft': { nom: 'Pied', facteur: 0.3048 },
        'yd': { nom: 'Yard', facteur: 0.9144 },
        'mi': { nom: 'Mile', facteur: 1609.34 }
    },
    poids: {
        'mg': { nom: 'Milligramme', facteur: 0.000001 },
        'g': { nom: 'Gramme', facteur: 0.001 },
        'kg': { nom: 'Kilogramme', facteur: 1 },
        't': { nom: 'Tonne', facteur: 1000 },
        'oz': { nom: 'Once', facteur: 0.0283495 },
        'lb': { nom: 'Livre', facteur: 0.453592 }
    },
    temperature: {
        'C': { nom: 'Celsius' },
        'F': { nom: 'Fahrenheit' },
        'K': { nom: 'Kelvin' }
    },
    volume: {
        'ml': { nom: 'Millilitre', facteur: 0.001 },
        'cl': { nom: 'Centilitre', facteur: 0.01 },
        'l': { nom: 'Litre', facteur: 1 },
        'm3': { nom: 'Mètre cube', facteur: 1000 },
        'tsp': { nom: 'Cuillère à café', facteur: 0.00492892 },
        'tbsp': { nom: 'Cuillère à soupe', facteur: 0.0147868 },
        'cup': { nom: 'Tasse', facteur: 0.236588 },
        'gal': { nom: 'Gallon', facteur: 3.78541 }
    }
};

function updateUnits() {
    const type = document.getElementById('type-conversion').value;
    const uniteSource = document.getElementById('unite-source');
    const uniteCible = document.getElementById('unite-cible');

    uniteSource.innerHTML = '';
    uniteCible.innerHTML = '';

    for (let code in unites[type]) {
        const option1 = document.createElement('option');
        option1.value = code;
        option1.textContent = unites[type][code].nom;
        uniteSource.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = code;
        option2.textContent = unites[type][code].nom;
        uniteCible.appendChild(option2);
    }

    uniteCible.selectedIndex = 1;
    convertir();
}

function inverserUnites() {
    const uniteSource = document.getElementById('unite-source');
    const uniteCible = document.getElementById('unite-cible');
    const temp = uniteSource.value;
    uniteSource.value = uniteCible.value;
    uniteCible.value = temp;
    convertir();
}

function convertir() {
    const valeur = parseFloat(document.getElementById('valeur-source').value);
    const type = document.getElementById('type-conversion').value;
    const uniteSource = document.getElementById('unite-source').value;
    const uniteCible = document.getElementById('unite-cible').value;

    if (isNaN(valeur)) {
        document.getElementById('result-conversion').classList.remove('show');
        return;
    }

    let resultat;

    if (type === 'temperature') {
        resultat = convertirTemperature(valeur, uniteSource, uniteCible);
    } else {
        const facteurSource = unites[type][uniteSource].facteur;
        const facteurCible = unites[type][uniteCible].facteur;
        resultat = valeur * (facteurSource / facteurCible);
    }

    document.getElementById('valeur-cible').textContent = resultat.toFixed(4);
    document.getElementById('conversion-label').textContent =
        unites[type][uniteSource].nom + ' → ' + unites[type][uniteCible].nom;
    document.getElementById('result-conversion').classList.add('show');
}

function convertirTemperature(valeur, de, vers) {
    let celsius;

    // Convertir vers Celsius
    if (de === 'C') celsius = valeur;
    else if (de === 'F') celsius = (valeur - 32) * 5 / 9;
    else if (de === 'K') celsius = valeur - 273.15;

    // Convertir depuis Celsius vers l'unité cible
    if (vers === 'C') return celsius;
    else if (vers === 'F') return celsius * 9 / 5 + 32;
    else if (vers === 'K') return celsius + 273.15;
}

// Initialiser le convertisseur
updateUnits();
