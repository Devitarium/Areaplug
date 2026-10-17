 // Filter State
  let currentFilters = {
    search: '',
    campus: 'all',
    location: 'all',
    specificLocation: 'all',
    category: 'all',
    delivery: false,
    store: false
  };
/// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
 
  // Specific location options per general location
  const specificLocationMap = {
    'School Road': ['Transformer', 'Awo', 'Intafleck', 'Gate'],
    'Falex Road': ['Falex Junction', 'Bus Stop 1', 'Bus Stop 2'],
    'Irare': ['Bus Stop 1', 'Bus Stop 2'],
    'Old Education': ['Old Edu Junction', 'Bus Stop 1', 'Bus Stop 2'],
    'Estate': ['Bus Stop 1', 'Bus Stop 2']
  };
 
 
 
  // DOM Elements
  const searchInput = document.getElementById('business-search');
  const campusDropdownItems = document.querySelectorAll('#campus-dropdown .dropdown-item');
  const locationDropdownItems = document.querySelectorAll('#location-dropdown .dropdown-item');
  const categoryDropdownItems = document.querySelectorAll('#category-dropdown .dropdown-item');
  const specificLocationDropdown = document.getElementById('specific-location-dropdown');
  const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
  const mobileFilterModal = document.getElementById('mobile-filter-modal');
  const closeModalButton = document.querySelector('.close-modal');
  const applyMobileFiltersButton = document.getElementById('apply-mobile-filters');
  const mobileCampusSelect = document.getElementById('mobile-campus');
  const mobileLocationSelect = document.getElementById('mobile-location');
  const mobileSpecificLocationSelect = document.getElementById('mobile-specific-location');
  const mobileCategorySelect = document.getElementById('mobile-category');
  const deliveryToggle = document.getElementById('delivery-toggle');
  const storeToggle = document.getElementById('store-toggle');
  const mobileDeliveryToggle = document.getElementById('mobile-delivery-toggle');
  const mobileStoreToggle = document.getElementById('mobile-store-toggle');
 
  // Initialize dropdowns
  function setupDropdown(items, filterType) {
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentFilters[filterType] = item.dataset.value;
        filterbusinesses();
      });
    });
  }
 
  // Setup desktop dropdowns
  setupDropdown(campusDropdownItems, 'campus');
  setupDropdown(categoryDropdownItems, 'category');
 
  // Location dropdown — also updates specific location options
  locationDropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      locationDropdownItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentFilters.location = item.dataset.value;
      currentFilters.specificLocation = 'all'; // reset specific location
      updateSpecificLocationDropdown(item.dataset.value);
      filterbusinesses();
    });
  });
 
  // Update specific location desktop dropdown
  function updateSpecificLocationDropdown(selectedLocation) {
    specificLocationDropdown.innerHTML = '<div class="dropdown-item active" data-value="all">All Areas</div>';
    const spots = specificLocationMap[selectedLocation] || [];
    spots.forEach(spot => {
      const div = document.createElement('div');
      div.className = 'dropdown-item';
      div.dataset.value = spot;
      div.textContent = spot;
      div.addEventListener('click', () => {
        specificLocationDropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        div.classList.add('active');
        currentFilters.specificLocation = spot;
        filterbusinesses();
      });
      specificLocationDropdown.appendChild(div);
    });
  }
 
  // Update specific location mobile dropdown
  function updateMobileSpecificLocationDropdown(selectedLocation) {
    mobileSpecificLocationSelect.innerHTML = '<option value="all">All Areas</option>';
    const spots = specificLocationMap[selectedLocation] || [];
    spots.forEach(spot => {
      const option = document.createElement('option');
      option.value = spot;
      option.textContent = spot;
      mobileSpecificLocationSelect.appendChild(option);
    });
  }
 
  // Mobile location change updates specific location options
  mobileLocationSelect.addEventListener('change', () => {
    updateMobileSpecificLocationDropdown(mobileLocationSelect.value);
  });
 
  // Search
  searchInput.addEventListener('input', (e) => {
    currentFilters.search = e.target.value.toLowerCase();
    filterbusinesses();
  });
 
  // Click to toggle dropdowns (stay open on click)
  document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.querySelector('.dropdown-content').classList.toggle('active');
    });
  });
 
  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-content').forEach(menu => {
      menu.classList.remove('active');
    });
  });
 
  // Delivery toggle
  deliveryToggle.addEventListener('click', () => {
    const isActive = deliveryToggle.dataset.active === 'true';
    deliveryToggle.dataset.active = !isActive;
    deliveryToggle.classList.toggle('toggle-active', !isActive);
    currentFilters.delivery = !isActive;
    filterbusinesses();
  });
 
  // Store toggle
  storeToggle.addEventListener('click', () => {
    const isActive = storeToggle.dataset.active === 'true';
    storeToggle.dataset.active = !isActive;
    storeToggle.classList.toggle('toggle-active', !isActive);
    currentFilters.store = !isActive;
    filterbusinesses();
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
    currentFilters.specificLocation = mobileSpecificLocationSelect.value;
    currentFilters.category = mobileCategorySelect.value;
    currentFilters.delivery = mobileDeliveryToggle.checked;
    currentFilters.store = mobileStoreToggle.checked;
    filterbusinesses();
    closeModal();
  });
 
  // Back to Top Button
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
 
  // Display businesses on load
  displaybusinesses();
  document.getElementById('reset-filters').addEventListener('click', () => {
  // Reset filter state
  currentFilters = {
    search: '',
    campus: 'all',
    location: 'all',
    specificLocation: 'all',
    category: 'all',
    delivery: false,
    store: false
  };

  // Reset search input
  document.getElementById('business-search').value = '';

  // Reset desktop dropdown active states
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.value === 'all');
  });

  // Reset toggle buttons
  deliveryToggle.dataset.active = 'false';
  deliveryToggle.classList.remove('toggle-active');
  storeToggle.dataset.active = 'false';
  storeToggle.classList.remove('toggle-active');

  // Reset mobile selects
  mobileCampusSelect.value = 'all';
  mobileLocationSelect.value = 'all';
  mobileSpecificLocationSelect.value = 'all';
  mobileCategorySelect.value = 'all';
  mobileDeliveryToggle.checked = false;
  mobileStoreToggle.checked = false;

  filterbusinesses();
});
 document.getElementById('reset-filters-mobile').addEventListener('click', () => {
  currentFilters = {
    search: '',
    campus: 'all',
    location: 'all',
    specificLocation: 'all',
    category: 'all',
    delivery: false,
    store: false
  };

  document.getElementById('business-search').value = '';
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.value === 'all');
  });
  deliveryToggle.dataset.active = 'false';
  deliveryToggle.classList.remove('toggle-active');
  storeToggle.dataset.active = 'false';
  storeToggle.classList.remove('toggle-active');
  mobileCampusSelect.value = 'all';
  mobileLocationSelect.value = 'all';
  mobileSpecificLocationSelect.value = 'all';
  mobileCategorySelect.value = 'all';
  mobileDeliveryToggle.checked = false;
  mobileStoreToggle.checked = false;

  filterbusinesses();
});
document.getElementById('modal-close-btn').addEventListener('click', closeBusinessModal);
document.getElementById('business-modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('business-modal-overlay')) closeBusinessModal();
});
});

// Main filtering function
function filterbusinesses() {
  const businessCards = document.querySelectorAll('.business-card');
  let visibleCount = 0;

  businessCards.forEach(card => {
    const name = card.querySelector('.business-name').textContent.toLowerCase();
    const campus = card.dataset.campus || '';
    const location = (card.dataset.location || '').toLowerCase();
    const specificLocation = (card.dataset.specificLocation || '').toLowerCase();
    const category = card.dataset.category.toLowerCase();
    const hasDelivery = card.dataset.delivery === 'yes';
    const hasStore = card.dataset.store === 'yes';

    const matchesSearch = currentFilters.search === '' ||
      name.includes(currentFilters.search) ||
      card.querySelector('.business-desc').textContent.toLowerCase().includes(currentFilters.search);
    const matchesCampus = currentFilters.campus === 'all' || campus.toLowerCase() === currentFilters.campus.toLowerCase();
    const matchesLocation = currentFilters.location === 'all' || location === currentFilters.location.toLowerCase();
    const matchesSpecificLocation = currentFilters.specificLocation === 'all' || specificLocation === currentFilters.specificLocation.toLowerCase();
    const matchesCategory = currentFilters.category === 'all' || category === currentFilters.category.toLowerCase();
    const matchesDelivery = !currentFilters.delivery || hasDelivery;
    const matchesStore = !currentFilters.store || hasStore;

    const visible = matchesSearch && matchesCampus && matchesLocation && matchesSpecificLocation && matchesCategory && matchesDelivery && matchesStore;
    card.style.display = visible ? 'block' : 'none';
    if (visible) visibleCount++;
  });

  // Show or hide no results message
  let noResults = document.getElementById('no-results-message');
  if (!noResults) {
    noResults = document.createElement('p');
    noResults.id = 'no-results-message';
    noResults.textContent = 'No businesses match your filters.';
    noResults.style.textAlign = 'center';
    noResults.style.padding = '2rem';
    document.getElementById('businesses-container').appendChild(noResults);
  }
  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}
 
// Fetch and display businesses from Supabase
async function displaybusinesses() {
  const container = document.getElementById('businesses-container');
 
  if (!container) {
    console.error('CRITICAL ERROR: Could not find #businesses-container element');
    return;
  }
 
  container.innerHTML = '<p class="loading">Loading businesses...</p>';
 
  try {
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
 
    if (error) throw new Error(`Supabase error: ${error.message}`);
 
    if (!businesses?.length) {
      container.innerHTML = '<p class="no-businesses">No businesses found</p>';
      return;
    }
 
    const tierPriority = {
      'platinum': 1,
      'gold': 2,
      'silver': 3,
      'bronze': 4
    };
 
    const sortedbusinesses = [...businesses].sort((a, b) => {
      const tierA = tierPriority[(a.tier || '').toLowerCase()] || 4;
      const tierB = tierPriority[(b.tier || '').toLowerCase()] || 4;
      return tierA - tierB;
    });
 
    container.innerHTML = '';
    sortedbusinesses.forEach(business => {
      container.appendChild(createBusinessCard(business));
    });
 
  } catch (error) {
    console.error('Failed to load businesses:', error);
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
 
// Create a business card element
function createBusinessCard(business) {
  const card = document.createElement('a');
  card.className = 'business-card';
  card.href = '#';
  card.addEventListener('click', (e) => {
    e.preventDefault();
    openBusinessModal(business);
});
 
  // Data attributes for filtering
  card.dataset.category = (business.category || '').toLowerCase();
  card.dataset.campus = business.campus || '';
  card.dataset.location = (business.location || '').toLowerCase();
  card.dataset.specificLocation = (business.specific_location || '').toLowerCase();
  card.dataset.delivery = (business.delivery === true || business.delivery === 'Yes') ? 'yes' : 'no';
  card.dataset.store = (business.store === true || business.store === 'Yes') ? 'yes' : 'no';
 
  const showDeliveryIcon = card.dataset.delivery === 'yes';
  const showStoreIcon = card.dataset.store === 'yes';


 
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
        <span class="location-text">${business.location || 'Location not specified'}${business.specific_location ? ' — ' + business.specific_location : ''}</span>
      </div>
      <div class="card-footer">
        <span class="category-badge">${business.category || 'General'}</span>
        ${showStoreIcon ? `
        <svg xmlns="http://www.w3.org/2000/svg" class="store-icon" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M21 7l-2-4H5L3 7v2c0 1.1.9 2 2 2v9h14v-9c1.1 0 2-.9 2-2V7zM5 5h14l1 2H4l1-2zm12 14h-3v-5H10v5H7v-8h10v8z"/>
        </svg>` : ''}
        ${showDeliveryIcon ? `
        <svg xmlns="http://www.w3.org/2000/svg" class="delivery-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 8h-3V4H1v13h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-8.5l1.96 2.5H17V9.5h2.5zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>` : ''}
      </div>
    </div>
  `;
 
  return card;
}
function openBusinessModal(business) {
  document.getElementById('modal-img').src = business.image_url || 'https://placehold.co/300x300?text=Business+Image';
  document.getElementById('modal-name').textContent = business.name || 'Business Name';
  document.getElementById('modal-visit-btn').href = business.business_link || '#';

  // Build products list
  const productsList = document.getElementById('modal-products-list');
  productsList.innerHTML = '';
  const products = (business.products || '').split(',');
  products.forEach(product => {
    const trimmed = product.trim();
    if (trimmed) {
      const li = document.createElement('li');
      li.textContent = trimmed;
      productsList.appendChild(li);
    }
  });

  // Track visit button click
  const visitBtn = document.getElementById('modal-visit-btn');
  visitBtn.onclick = (e) => {
  e.preventDefault();
  const url = business.business_link || '#';

  // Open immediately — don't wait for Supabase
  window.open(url, '_blank');
 
  // Track click in background without blocking navigation
  supabase
    .from('businesses')
    .update({ clicks: (business.clicks || 0) + 1 })
    .eq('id', business.id);
};
  document.querySelector('.business-modal').addEventListener('click', (e) => {
  e.stopPropagation();
});
  document.getElementById('business-modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeBusinessModal() {
  document.getElementById('business-modal-overlay').classList.remove('active');
  document.body.style.overflow = 'auto';
}

 