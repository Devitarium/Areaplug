// Initialize Supabase first


// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - checking elements:', {
    backToTop: document.getElementById('back-to-top'),
    categories: document.querySelectorAll('.category'),
    cards: document.querySelectorAll('.business-card')
  });

  // 1. Category Filtering
  const categories = document.querySelectorAll('.category');
  const cards = document.querySelectorAll('.business-card');
  
  if (categories.length && cards.length) {
    categories.forEach(button => {
      button.addEventListener('click', () => {
        categories.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.getAttribute('data-category');

        cards.forEach(card => {
          card.style.display = (category === 'all' || card.dataset.category === category) 
            ? 'block' 
            : 'none';
        });
      });
    });
  }

//    // Modal filter logic for mobile
//   const modal = document.getElementById('filterModal');
//   document.getElementById('openFilter').addEventListener('click', () => modal.classList.remove('hidden'));
//   document.getElementById('closeFilter').addEventListener('click', () => modal.classList.add('hidden'));
//   document.getElementById('applyFilter').addEventListener('click', () => {
//     const selected = document.getElementById('filterCategory').value;
//     cards.forEach(card => {
//       card.style.display = (selected === 'all' || card.dataset.category === selected) ? 'block' : 'none';
//     });
//     modal.classList.add('hidden');
//   });
//   const mobileBtn = document.getElementById("mobileFilterBtn");
// const modal = document.getElementById("filterModal");

// mobileBtn.addEventListener("click", () => {
//   modal.classList.toggle("active");
// });
// Filter State
let currentFilters = {
  search: '',
  campus: 'all',
  location: 'all',
  category: 'all'
};

// DOM Elements
const searchInput = document.getElementById('business-search');
const campusDropdownItems = document.querySelectorAll('#campus-dropdown .dropdown-item');
const locationDropdownItems = document.querySelectorAll('#location-dropdown .dropdown-item');
const categoryDropdownItems = document.querySelectorAll('#category-dropdown .dropdown-item');
const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
const mobileFilterModal = document.getElementById('mobile-filter-modal');
const closeModalButton = document.querySelector('.close-modal');
const applyMobileFiltersButton = document.getElementById('apply-mobile-filters');
const mobileCampusSelect = document.getElementById('mobile-campus');
const mobileLocationSelect = document.getElementById('mobile-location');
const mobileCategorySelect = document.getElementById('mobile-category');

// Initialize dropdowns
function setupDropdown(items, filterType) {
  items.forEach(item => {
    item.addEventListener('click', () => {
      // Update active state
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Update filter state
      currentFilters[filterType] = item.dataset.value;
      
      // Apply filters
      filterBusinesses();
    });
  });
}

// Setup desktop dropdowns
setupDropdown(campusDropdownItems, 'campus');
setupDropdown(locationDropdownItems, 'location');
setupDropdown(categoryDropdownItems, 'category');

// Search functionality
searchInput.addEventListener('input', (e) => {
  currentFilters.search = e.target.value.toLowerCase();
  filterBusinesses();
});

// Mobile filter toggle
mobileFilterToggle.addEventListener('click', () => {
  mobileFilterModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

// Close modal
closeModalButton.addEventListener('click', closeModal);
mobileFilterModal.addEventListener('click', (e) => {
  if (e.target === mobileFilterModal) closeModal();
});

function closeModal() {
  mobileFilterModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Apply mobile filters
applyMobileFiltersButton.addEventListener('click', () => {
  currentFilters.campus = mobileCampusSelect.value;
  currentFilters.location = mobileLocationSelect.value;
  currentFilters.category = mobileCategorySelect.value;
  filterBusinesses();
  closeModal();
});

// Main filtering function
function filterBusinesses() {
  const businessCards = document.querySelectorAll('.business-card');
  
  businessCards.forEach(card => {
    const name = card.querySelector('.business-name').textContent.toLowerCase();
    const campus = card.dataset.campus || '';
    const location = card.querySelector('.location-text').textContent.toLowerCase();
    const category = card.dataset.category.toLowerCase();
    
    const matchesSearch = currentFilters.search === '' || 
      name.includes(currentFilters.search) || 
      card.querySelector('.business-desc').textContent.toLowerCase().includes(currentFilters.search);
    
    const matchesCampus = currentFilters.campus === 'all' || 
      campus.toLowerCase() === currentFilters.campus.toLowerCase();
    
    const matchesLocation = currentFilters.location === 'all' || 
      location.includes(currentFilters.location.toLowerCase());
    
    const matchesCategory = currentFilters.category === 'all' || 
      category === currentFilters.category.toLowerCase();
    
    if (matchesSearch && matchesCampus && matchesLocation && matchesCategory) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Update createBusinessCard function to include campus data attribute
function createBusinessCard(business) {
  const card = document.createElement('a');
  card.href = business.business_link || '#';
  card.className = 'business-card';
  card.dataset.category = business.category?.toLowerCase() || '';
  card.dataset.campus = business.campus || ''; // Add campus data attribute
  card.target = '_blank';

  // ... rest of your existing createBusinessCard code ...
}


  // 2. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    });

    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Location Handling
  const locationDropdown = document.getElementById("location");
  if (locationDropdown) {
    locationDropdown.addEventListener('change', checkOtherLocation);
    checkOtherLocation(); // Initialize on load
  }

  function checkOtherLocation() {
    const otherInputContainer = document.getElementById("other-location-container");
    if (otherInputContainer) {
      otherInputContainer.style.display = 
        document.getElementById("location").value === "Other" ? "block" : "none";
    }
  }

  
  // 6. Display Businesses
  displayBusinesses();
});

// Business Display Functions
async function displayBusinesses() {
  // 1. FIRST find the container with proper error handling
  const container = document.getElementById('businesses-container');
  
  if (!container) {
    console.error('CRITICAL ERROR: Could not find #businesses-container element');
    console.log('Available elements:', {
      backToTop: document.getElementById('back-to-top'),
      businessContainer: document.getElementById('businesses-container'),
      bodyChildren: document.body.children
    });
    return;
  }

  // 2. Show loading state
  container.innerHTML = '<p class="loading">Loading businesses...</p>';

  try {
    // 3. Fetch businesses from Supabase
    console.log('Starting to fetch businesses...');
    const { data: businesses, error } = await supabase
      .from('Businesses')
      .select('*')
      .order('created_at', { ascending: true }); // Oldest first

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`Successfully fetched ${businesses?.length || 0} businesses`);

    // 4. Handle empty state
    if (!businesses?.length) {
      container.innerHTML = '<p class="no-businesses">No businesses found</p>';
      return;
    }

    // 5. Sort businesses by tier (Platinum first) then by age
    const tierPriority = {
      'platinum': 1,
      'gold': 2,
      'silver': 3,
      'standard': 4
    };

    const sortedBusinesses = [...businesses].sort((a, b) => {
      const tierA = tierPriority[a.tier.toLowerCase()] || 4;
      const tierB = tierPriority[b.tier.toLowerCase()] || 4;
      return tierA - tierB;
    });

    // 6. Clear container and display businesses
    container.innerHTML = ''; // Clear loading message
    
    sortedBusinesses.forEach(business => {
      container.appendChild(createBusinessCard(business));
    });

    console.log('Businesses displayed successfully');

  } catch (error) {
    console.error('Failed to load businesses:', error);
    
    // 7. Show user-friendly error message
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>⚠️ Could not load businesses</p>
          <small>${error.message}</small>
        </div>
      `;
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, starting business display...');
  displayBusinesses();
});

function createBusinessCard(business) {
  const card = document.createElement('a');
  card.href = business.business_link || '#';
  card.className = 'business-card';
  card.dataset.category = business.category?.toLowerCase() || '';
  card.target = '_blank';

  // Convert boolean delivery to the expected string format
  const showDeliveryIcon = business.delivery === true || business.delivery === 'Yes';

  card.innerHTML = `
    <img src="${business.image_url || 'https://placehold.co/300x300?text=Business+Image'}" 
         class="business-img" 
         alt="${business.name}">
    <div class="card-info">
      <h3 class="business-name">${business.name || 'Business Name'}</h3>
      <p class="business-desc">${business.description || ''}</p>
      <div class="location-row">
        <svg xmlns="http://www.w3.org/2000/svg" class="location-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span class="location-text">${business.location || 'Location not specified'}</span>
      </div>
      <div class="card-footer">
        <span class="category-badge">${business.category || 'General'}</span>
        ${showDeliveryIcon ? `
        <svg xmlns="http://www.w3.org/2000/svg" class="dilivery-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 8h-3V4H1v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-8.5l1.96 2.5H17V9.5h2.5zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>
        ` : ''}
      </div>
    </div>
  `;

  return card;
}