// ==================== VARIABLES GLOBALES ====================
let selectedTipPercent = 15;
let calculationHistory = [];

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTheme();
    loadHistory();
    updateUnits();
    initRippleEffect();
});

// ==================== SYSTÈME DE PARTICULES ====================
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connect particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== DARK MODE ====================
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        showToast(newTheme === 'dark' ? '🌙 Mode sombre activé' : '☀️ Mode clair activé', 'success');
    });
}

// ==================== GESTION DES ONGLETS ====================
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
    event.target.closest('.tab').classList.add('active');
    
    // Charger l'historique si on est sur cet onglet
    if (tabName === 'historique') {
        displayHistory();
    }
}

// ==================== CALCULATEUR DE POURBOIRE ====================
function selectTip(percent) {
    selectedTipPercent = percent;
    document.querySelectorAll('.tip-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.closest('.tip-btn').classList.add('selected');
    document.getElementById('custom-tip').value = '';
}

function calculerPourboire() {
    const montant = parseFloat(document.getElementById('montant').value);
    const customTip = parseFloat(document.getElementById('custom-tip').value);
    const personnes = parseInt(document.getElementById('personnes').value) || 1;

    if (isNaN(montant) || montant <= 0) {
        showToast('⚠️ Veuillez entrer un montant valide', 'error');
        return;
    }

    const tipPercent = customTip || selectedTipPercent;
    const pourboire = montant * (tipPercent / 100);
    const total = montant + pourboire;
    const parPersonne = total / personnes;

    // Animation des valeurs
    animateValue('addition-value', 0, montant, 800, ' €');
    animateValue('tip-value', 0, pourboire, 800, ` € (${tipPercent}%)`);
    animateValue('total-value', 0, total, 1000, ' €');
    animateValue('per-person-value', 0, parPersonne, 800, ' €');

    // Animer le graphique donut
    const circle = document.getElementById('tip-circle');
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (tipPercent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    document.getElementById('tip-percent-display').textContent = Math.round(tipPercent) + '%';

    document.getElementById('result-pourboire').classList.add('show');
    
    showToast('✅ Calcul effectué avec succès', 'success');
}

// ==================== CALCULATEUR IMC ====================
function calculerIMC() {
    const poids = parseFloat(document.getElementById('poids').value);
    const tailleCm = parseFloat(document.getElementById('taille').value);

    if (isNaN(poids) || poids <= 0 || isNaN(tailleCm) || tailleCm <= 0) {
        showToast('⚠️ Veuillez entrer des valeurs valides', 'error');
        return;
    }

    const tailleM = tailleCm / 100;
    const imc = poids / (tailleM * tailleM);

    // Animation de la valeur
    animateValue('imc-value', 0, imc, 1000, '', 1);

    // Déterminer la catégorie
    const categoryDiv = document.getElementById('imc-category');
    const descriptionDiv = document.getElementById('imc-description');
    let category, categoryClass, description, angle;

    // Calcul de l'angle pour la jauge (-90° à 90° pour un demi-cercle)
    // IMC 15 = -90°, IMC 18.5 = -54°, IMC 25 = 0°, IMC 30 = 36°, IMC 40 = 90°
    let calculatedAngle;
    if (imc < 18.5) {
        // Zone insuffisance: -90° à -54°
        calculatedAngle = -90 + ((imc - 15) / (18.5 - 15)) * 36;
        category = '📉 Insuffisance pondérale';
        categoryClass = 'imc-underweight';
        description = 'Votre IMC est inférieur à la normale. Consultez un professionnel de santé.';
    } else if (imc < 25) {
        // Zone normale: -54° à 0°
        calculatedAngle = -54 + ((imc - 18.5) / (25 - 18.5)) * 54;
        category = '✅ Poids normal';
        categoryClass = 'imc-normal';
        description = 'Félicitations ! Votre IMC est dans la plage normale.';
    } else if (imc < 30) {
        // Zone surpoids: 0° à 36°
        calculatedAngle = 0 + ((imc - 25) / (30 - 25)) * 36;
        category = '⚠️ Surpoids';
        categoryClass = 'imc-overweight';
        description = 'Votre IMC indique un surpoids. Une activité physique régulière est recommandée.';
    } else {
        // Zone obésité: 36° à 90°
        calculatedAngle = 36 + Math.min(((imc - 30) / 10) * 54, 54);
        category = '🔴 Obésité';
        categoryClass = 'imc-obese';
        description = 'Votre IMC indique une obésité. Consultez un professionnel de santé.';
    }

    categoryDiv.textContent = category;
    categoryDiv.className = 'imc-category ' + categoryClass;
    descriptionDiv.textContent = description;

    // Animer l'aiguille de la jauge
    const needle = document.getElementById('imc-needle');
    needle.style.transform = `rotate(${calculatedAngle}deg)`;

    document.getElementById('result-imc').classList.add('show');
    
    showToast('✅ IMC calculé avec succès', 'success');
}

// ==================== CONVERTISSEUR D'UNITÉS ====================
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

    if (uniteCible.options.length > 1) {
        uniteCible.selectedIndex = 1;
    }
    convertir();
}

function inverserUnites() {
    const uniteSource = document.getElementById('unite-source');
    const uniteCible = document.getElementById('unite-cible');
    const valeurSource = document.getElementById('valeur-source');
    const valeurCible = document.getElementById('valeur-cible');
    
    // Inverser les unités
    const temp = uniteSource.value;
    uniteSource.value = uniteCible.value;
    uniteCible.value = temp;
    
    // Inverser les valeurs
    if (valeurSource.value) {
        valeurSource.value = valeurCible.textContent;
    }
    
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

    // Animation des valeurs
    document.getElementById('source-display').textContent = valeur.toFixed(2);
    animateValue('target-display', 0, resultat, 500, '', 2);
    animateValue('valeur-cible', 0, resultat, 800, '', 4);

    document.getElementById('conversion-label').textContent =
        unites[type][uniteSource].nom + ' → ' + unites[type][uniteCible].nom;
    document.getElementById('result-conversion').classList.add('show');
}

function convertirTemperature(valeur, de, vers) {
    let celsius;

    if (de === 'C') celsius = valeur;
    else if (de === 'F') celsius = (valeur - 32) * 5 / 9;
    else if (de === 'K') celsius = valeur - 273.15;

    if (vers === 'C') return celsius;
    else if (vers === 'F') return celsius * 9 / 5 + 32;
    else if (vers === 'K') return celsius + 273.15;
}

// ==================== ANIMATION DES VALEURS ====================
function animateValue(id, start, end, duration, suffix = '', decimals = 2) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(decimals) + suffix;
    }, 16);
}

// ==================== HISTORIQUE ====================
function loadHistory() {
    const saved = localStorage.getItem('calculationHistory');
    if (saved) {
        calculationHistory = JSON.parse(saved);
    }
}

function saveHistory() {
    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
}

function saveCalculation(type) {
    let calculation = {
        type: type,
        date: new Date().toLocaleString('fr-FR'),
        timestamp: Date.now()
    };

    if (type === 'pourboire') {
        calculation.data = {
            montant: document.getElementById('montant').value,
            pourboire: document.getElementById('tip-value').textContent,
            total: document.getElementById('total-value').textContent,
            personnes: document.getElementById('personnes').value
        };
    } else if (type === 'imc') {
        calculation.data = {
            poids: document.getElementById('poids').value,
            taille: document.getElementById('taille').value,
            imc: document.getElementById('imc-value').textContent,
            categorie: document.getElementById('imc-category').textContent
        };
    } else if (type === 'conversion') {
        calculation.data = {
            valeur: document.getElementById('valeur-source').value,
            resultat: document.getElementById('valeur-cible').textContent,
            conversion: document.getElementById('conversion-label').textContent
        };
    }

    calculationHistory.unshift(calculation);
    
    // Limiter à 20 entrées
    if (calculationHistory.length > 20) {
        calculationHistory = calculationHistory.slice(0, 20);
    }
    
    saveHistory();
    showToast('💾 Calcul sauvegardé dans l\'historique', 'success');
}

function displayHistory() {
    const historyList = document.getElementById('history-list');
    
    if (calculationHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>Aucun calcul enregistré</p>
                <small>Vos calculs sauvegardés apparaîtront ici</small>
            </div>
        `;
        return;
    }

    historyList.innerHTML = '';
    
    calculationHistory.forEach((calc, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        let icon = '';
        let details = '';
        
        if (calc.type === 'pourboire') {
            icon = '💰';
            details = `
                <strong>Montant:</strong> ${calc.data.montant}€<br>
                <strong>Pourboire:</strong> ${calc.data.pourboire}<br>
                <strong>Total:</strong> ${calc.data.total}<br>
                <strong>Personnes:</strong> ${calc.data.personnes}
            `;
        } else if (calc.type === 'imc') {
            icon = '⚖️';
            details = `
                <strong>Poids:</strong> ${calc.data.poids}kg<br>
                <strong>Taille:</strong> ${calc.data.taille}cm<br>
                <strong>IMC:</strong> ${calc.data.imc}<br>
                <strong>Catégorie:</strong> ${calc.data.categorie}
            `;
        } else if (calc.type === 'conversion') {
            icon = '🔄';
            details = `
                <strong>Valeur:</strong> ${calc.data.valeur}<br>
                <strong>Résultat:</strong> ${calc.data.resultat}<br>
                <strong>Conversion:</strong> ${calc.data.conversion}
            `;
        }
        
        item.innerHTML = `
            <div class="history-header">
                <div class="history-type">${icon} ${calc.type.charAt(0).toUpperCase() + calc.type.slice(1)}</div>
                <div class="history-date">${calc.date}</div>
            </div>
            <div class="history-details">${details}</div>
            <button class="history-delete" onclick="deleteHistoryItem(${index})">🗑️ Supprimer</button>
        `;
        
        historyList.appendChild(item);
    });
}

function deleteHistoryItem(index) {
    calculationHistory.splice(index, 1);
    saveHistory();
    displayHistory();
    showToast('🗑️ Calcul supprimé', 'success');
}

function clearHistory() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
        calculationHistory = [];
        saveHistory();
        displayHistory();
        showToast('🗑️ Historique effacé', 'success');
    }
}

// ==================== NOTIFICATIONS TOAST ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✓' : '⚠';
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== RIPPLE EFFECT ====================
function initRippleEffect() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-ripple]');
        if (!target) return;
        
        const ripple = document.createElement('span');
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// ==================== EASTER EGG ====================
let clickCount = 0;
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.glitch');
    if (title) {
        title.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                showToast('🎉 Easter Egg! Vous avez trouvé le secret!', 'success');
                document.body.style.animation = 'rainbow 2s linear';
                clickCount = 0;
            }
        });
    }
});
