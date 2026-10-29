// Handle form submission
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        guests: document.getElementById('guests').value,
        attendance: document.querySelector('input[name="attendance"]:checked').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString('ru-RU')
    };

    // Save to localStorage for now (you can replace with actual backend later)
    let responses = JSON.parse(localStorage.getItem('rsvpResponses') || '[]');
    responses.push(formData);
    localStorage.setItem('rsvpResponses', JSON.stringify(responses));

    // Show success message
    document.getElementById('rsvpForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';

    // Scroll to success message
    document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });

    console.log('RSVP submitted:', formData);
});

// Add sparkle effect on page load
window.addEventListener('load', function() {
    createSparkles();
});

function createSparkles() {
    const hero = document.querySelector('.hero');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 5px;
                height: 5px;
                background: white;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sparkle ${2 + Math.random() * 3}s ease-in-out infinite;
                opacity: 0;
            `;
            hero.appendChild(sparkle);
        }, i * 100);
    }
}

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);
