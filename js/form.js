// Pricing configuration
const pricingConfig = {
  bronze: 5000,
  silver: 10000,
  gold: 20000,
  platinum: 50000
};
 
// DOM elements
let selectedPlan = null;
let selectedPrice = 0;
let selectedMonths = 1;
 
// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
  initializePricingCards();
  initializeDurationSelector();
  initializeLocationHandler();
  initializeSchoolHandler();
  initializeFormSubmission();
});
 
// Initialize pricing cards selection
function initializePricingCards() {
  const pricingCards = document.querySelectorAll('.pricing-card');
  
  pricingCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('select-plan-btn')) return;
      
      pricingCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      selectedPlan = card.dataset.plan;
      selectedPrice = parseInt(card.dataset.price);
      
      document.querySelector('.duration-section').style.display = 'block';
      updatePriceSummary();
    });
  });
}
 
// Initialize duration selector
function initializeDurationSelector() {
  const monthsSelect = document.getElementById('months');
  
  monthsSelect.addEventListener('change', function() {
    selectedMonths = parseInt(this.value);
    updatePriceSummary();
  });
  
  document.querySelector('.proceed-btn').addEventListener('click', function() {
    if (!selectedPlan) {
      alert('Please select a plan first');
      return;
    }

    document.querySelector('.pricing-section').style.display = 'none';
    document.getElementById('onboarding-choice').style.display = 'block';

    document.getElementById('selectedPlan').value = selectedPlan;
    document.getElementById('selectedMonths').value = selectedMonths;
    document.getElementById('finalAmount').value = calculateTotal();
  });
}
 
// Update price summary in duration section
function updatePriceSummary() {
  const basePriceElement = document.getElementById('base-price');
  const discountContainer = document.getElementById('discount-container');
  const discountAmountElement = document.getElementById('discount-amount');
  const totalPriceElement = document.getElementById('total-price');
  
  const basePrice = selectedPrice * selectedMonths;
  let discount = 0;
  
  if (selectedMonths === 12) {
    discount = basePrice * 0.4;
  }
  
  const totalPrice = basePrice - discount;
  
  basePriceElement.textContent = `₦${basePrice.toLocaleString()}`;
  
  if (discount > 0) {
    discountContainer.style.display = 'block';
    discountAmountElement.textContent = `-₦${discount.toLocaleString()}`;
  } else {
    discountContainer.style.display = 'none';
  }
  
  totalPriceElement.textContent = `₦${totalPrice.toLocaleString()}`;
}
 
// Calculate total amount
function calculateTotal() {
  const basePrice = selectedPrice * selectedMonths;
  
  if (selectedMonths === 12) {
    return basePrice * 0.6;
  }
  
  return basePrice;
}
 
// Update payment summary in form
function updatePaymentSummary() {
  document.getElementById('summary-plan').textContent = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
  document.getElementById('summary-months').textContent = `${selectedMonths} month${selectedMonths !== 1 ? 's' : ''}`;
  document.getElementById('summary-amount').textContent = `₦${calculateTotal().toLocaleString()}`;
}
 
// Initialize school handler
function initializeSchoolHandler() {
  const schoolSelect = document.getElementById('school');
  if (schoolSelect) {
    schoolSelect.addEventListener('change', handleSchoolChange);
  }
}
 
function handleSchoolChange() {
  const campusSelect = document.getElementById('campus');
  if (!campusSelect) return;
  
  campusSelect.innerHTML = '<option value="">-- Select Campus --</option>';
  const school = document.getElementById('school').value;
  let campuses = [];
 
  if (school === 'FUOYE') {
    campuses = ['Main Campus', 'Ikole Campus', 'Ido Campus'];
  } else if (school === 'EKSU') {
    campuses = ['Main Campus'];
  }
 
  campuses.forEach(campus => {
    const option = document.createElement('option');
    option.value = campus;
    option.textContent = campus;
    campusSelect.appendChild(option);
  });
}
 
// Initialize location handler
function initializeLocationHandler() {
  const locationSelect = document.getElementById('location');
  if (locationSelect) {
    locationSelect.addEventListener('change', handleLocationChange);
  }
}
 
function handleLocationChange() {
  const specificLocationSelect = document.getElementById('specific_location');
  if (!specificLocationSelect) return;
 
  specificLocationSelect.innerHTML = '<option value="">-- Select Specific Location --</option>';
  const location = document.getElementById('location').value;
  let specificLocations = [];
 
  if (location === 'School Road') {
    specificLocations = ['Transformer', 'Awo', 'Intafleck', 'Gate'];
  } else if (location === 'Old Education') {
    specificLocations = ['Old Edu Junction', 'Bus Stop 1', 'Bus Stop 2'];
  } else if (location === 'Falex Road') {
    specificLocations = ['Falex Junction', 'Bus Stop 1', 'Bus Stop 2'];
  } else if (location === 'Irare') {
    specificLocations = ['Bus Stop 1', 'Bus Stop 2'];
  } else if (location === 'Estate') {
    specificLocations = ['Bus Stop 1', 'Bus Stop 2'];
  }
 
  if (specificLocations.length > 0) {
    specificLocationSelect.disabled = false;
    specificLocations.forEach(spot => {
      const option = document.createElement('option');
      option.value = spot;
      option.textContent = spot;
      specificLocationSelect.appendChild(option);
    });
  } else {
    specificLocationSelect.disabled = true;
  }
}
 
// Initialize form submission with payment
function initializeFormSubmission() {
  const businessForm = document.getElementById("businessForm");
  if (businessForm) {
    businessForm.addEventListener("submit", handleFormSubmitWithPayment);
  }
}
function calculateEndDate(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + parseInt(months));
  return date.toISOString().split('T')[0];
}
 
// Handle form submission with payment integration
async function handleFormSubmitWithPayment(e) {
  e.preventDefault();
 
  try {
    const formData = {
      name: document.getElementById("name").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      business_link: document.getElementById("business_link").value,
      location: document.getElementById("location").value,
      specific_location: document.getElementById("specific_location").value,
      delivery: document.querySelector('input[name="delivery"]:checked').value,
      store: document.querySelector('input[name="store"]:checked').value,
      tier: document.getElementById("selectedPlan").value,
      months: document.getElementById("selectedMonths").value,
      amount: document.getElementById("finalAmount").value,
      school: document.getElementById("school")?.value || "",
      campus: document.getElementById("campus")?.value || "",
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      products: document.getElementById("products").value,
      end_date: calculateEndDate(selectedMonths),
    };
 
    const paymentSuccess = await processPayment(formData);
    
    if (!paymentSuccess) {
      throw new Error("Payment failed. Please try again.");
    }
 
    let imageUrl = null;
    const imageFile = document.getElementById("image").files[0];
 
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${formData.name.replace(/\s+/g, "_")}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
 
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
 
      const { data: { publicUrl } } = supabase.storage
        .from('business-images')
        .getPublicUrl(fileName);
 
      imageUrl = publicUrl;
    }
 
    const { error: insertError } = await supabase.from("businesses").insert([{
      ...formData,
      image_url: imageUrl
    }]);
 
    if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);
 
    alert("Payment successful! Business submitted successfully.");
    window.location.href = 'plug.html';
    
  } catch (error) {
    console.error("Error in form submission:", error);
    alert(`Error: ${error.message}`);
  }
}
 // Self serve — go to normal form
document.getElementById('self-serve-btn').addEventListener('click', function() {
  document.getElementById('onboarding-choice').style.display = 'none';
  document.getElementById('businessForm').style.display = 'block';
  updatePaymentSummary();
});

// Assisted — show lead capture form
document.getElementById('assisted-btn').addEventListener('click', function() {
  document.getElementById('onboarding-choice').style.display = 'none';
  document.getElementById('assisted-form').style.display = 'block';
  document.getElementById('lead-plan-display').textContent = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
  document.getElementById('lead-months-display').textContent = `${selectedMonths} month${selectedMonths !== 1 ? 's' : ''}`;
});

// Submit lead
document.getElementById('submit-lead-btn').addEventListener('click', async function() {
  const phone = document.getElementById('lead-phone').value.trim();

  if (!phone) {
    alert('Please enter your WhatsApp number');
    return;
  }

  const { error } = await supabase.from('leads').insert([{
    phone: phone,
    plan: selectedPlan,
    months: String(selectedMonths)
  }]);

  if (error) {
    alert('Something went wrong. Please try again.');
    console.error(error);
    return;
  }

  document.getElementById('lead-phone').style.display = 'none';
  document.getElementById('submit-lead-btn').style.display = 'none';
  document.getElementById('lead-success').style.display = 'block';
});
// Process payment with Paystack
async function processPayment(formData) {
  return new Promise((resolve) => {
    const handler = PaystackPop.setup({
      key: 'pk_live_f592ba3f2d2dccd4fba5527c74a64bb3135f8c80',
      email: formData.email,
      amount: calculateTotal() * 100,
      currency: 'NGN',
      ref: 'AP' + Date.now() + Math.floor(Math.random() * 1000),
      metadata: {
        custom_fields: [
          {
            display_name: "Business Name",
            variable_name: "business_name",
            value: formData.name
          }
        ]
      },
      label: 'AreaPlug',
      callback: function(response) {
        resolve(true);
      },
      onClose: function() {
        resolve(false);
      }
    });

    handler.openIframe();
  });
}