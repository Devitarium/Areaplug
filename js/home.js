// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.mobile-menu-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

async function loadPreview() {
      const track = document.getElementById('preview-track');
      const ctaCard = document.getElementById('preview-cta');

      try {
        const { data: businesses, error } = await supabase
          .from('businesses')
          .select('name, category, image_url, tier')
          .eq('is_active', true)
          .limit(6);

        if (error || !businesses?.length) return;

        const tierPriority = { platinum: 1, gold: 2, silver: 3, bronze: 4 };
        const sorted = [...businesses].sort((a, b) =>
          (tierPriority[(a.tier||'').toLowerCase()] || 4) - (tierPriority[(b.tier||'').toLowerCase()] || 4)
        );

        sorted.forEach(b => {
          const card = document.createElement('a');
          card.href = 'index.html';
          card.className = 'preview-card';
          card.innerHTML = `
            <img src="${b.image_url || 'https://placehold.co/220x130?text=Business'}" alt="${b.name}">
            <div class="preview-card-info">
              <div class="preview-card-name">${b.name || 'Business'}</div>
              <div class="preview-card-cat">${b.category || 'General'}</div>
            </div>
          `;
          track.insertBefore(card, ctaCard);
        });

        ctaCard.style.display = 'flex';
        ctaCard.onclick = () => window.location.href = 'fuoye.html';
      } catch(e) {
        console.error('Preview load failed:', e);
      }
    }

    loadPreview();

 