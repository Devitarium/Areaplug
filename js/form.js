// Pricing configuration
const pricingConfig = {
  bronze: 1000,
  silver: 2000,
  gold: 3000,
  platinum: 5000
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
  const selectButtons = document.querySelectorAll('.select-plan-btn');
  
  pricingCards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('select-plan-btn')) return;
      
      // Remove selected class from all cards
      pricingCards.forEach(c => c.classList.remove('selected'));
      
      // Add selected class to clicked card
      card.classList.add('selected');
      
      // Set selected plan
      selectedPlan = card.dataset.plan;
      selectedPrice = parseInt(card.dataset.price);
      
      // Show duration section
      document.querySelector('.duration-section').style.display = 'block';
      
      // Update price summary
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
  
  // Proceed button handler
  document.querySelector('.proceed-btn').addEventListener('click', function() {
    if (!selectedPlan) {
      alert('Please select a plan first');
      return;
    }
    
    // Hide pricing section, show form
    document.querySelector('.pricing-section').style.display = 'none';
    document.getElementById('businessForm').style.display = 'block';
    
    // Set hidden values
    document.getElementById('selectedPlan').value = selectedPlan;
    document.getElementById('selectedMonths').value = selectedMonths;
    document.getElementById('finalAmount').value = calculateTotal();
    
    // Update payment summary in form
    updatePaymentSummary();
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
  
  // Apply 40% discount for annual subscription
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
    return basePrice * 0.6; // 40% discount
  }
  
  return basePrice;
}

// Update payment summary in form
function updatePaymentSummary() {
  document.getElementById('summary-plan').textContent = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
  document.getElementById('summary-months').textContent = `${selectedMonths} month${selectedMonths !== 1 ? 's' : ''}`;
  document.getElementById('summary-amount').textContent = `₦${calculateTotal().toLocaleString()}`;
}

// Initialize location handler
function initializeLocationHandler() {
  const locationSelect = document.getElementById('location');
  const otherLocationContainer = document.getElementById('other-location-container');
  
  locationSelect.addEventListener('change', function() {
    if (this.value === 'Other') {
      otherLocationContainer.style.display = 'block';
    } else {
      otherLocationContainer.style.display = 'none';
    }
  });
}

// Initialize school handler
function initializeSchoolHandler() {
  const schoolSelect = document.getElementById('school');
  
  if (schoolSelect) {
    schoolSelect.addEventListener('change', handleSchoolChange);
    handleSchoolChange(); // Initialize on load
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

// Initialize form submission with payment
function initializeFormSubmission() {
  const businessForm = document.getElementById("businessForm");
  if (businessForm) {
    businessForm.addEventListener("submit", handleFormSubmitWithPayment);
  }
}

// Handle form submission with payment integration
async function handleFormSubmitWithPayment(e) {
  e.preventDefault();

  try {
    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      business_link: document.getElementById("business_link").value,
      location: document.getElementById("location").value === "Other"
        ? document.getElementById("other-location").value
        : document.getElementById("location").value,
      delivery: document.querySelector('input[name="delivery"]:checked').value,
      plan: document.getElementById("selectedPlan").value,
      months: document.getElementById("selectedMonths").value,
      amount: document.getElementById("finalAmount").value,
      school: document.getElementById("school")?.value || "",
      campus: document.getElementById("campus")?.value || ""
    };

    // Process payment with Paystack
    const paymentSuccess = await processPayment(formData);
    
    if (!paymentSuccess) {
      throw new Error("Payment failed. Please try again.");
    }

    // Upload image and save to Supabase
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

    // Save to Supabase
    const { error: insertError } = await supabase.from("Businesses").insert([{
      ...formData,
      image_url: imageUrl
    }]);

    if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);

    alert("Payment successful! Business submitted successfully.");
    window.location.reload();
    
  } catch (error) {
    console.error("Error in form submission:", error);
    alert(`Error: ${error.message}`);
  }
}

// Process payment with Paystack
async function processPayment(formData) {
  return new Promise((resolve) => {
    const amount = calculateTotal() * 100; // Convert to kobo
    const email = "customer@example.com"; // You should collect this from user
    
    // For demo purposes, we'll use a placeholder
    // In production, replace with actual Paystack implementation
    const handler = PaystackPop.setup({
      key: 'pk_test_your_public_key_here', // Replace with your public key
      email: email,
      amount: amount,
      currency: 'NGN',
      ref: 'AP' + Math.floor((Math.random() * 1000000000) + 1), // Generate a unique reference
      metadata: {
        custom_fields: [
          {
            display_name: "Business Name",
            variable_name: "business_name",
            value: formData.name
          }
        ]
      },
      callback: function(response) {
        // Payment successful
        resolve(true);
      },
      onClose: function() {
        // User closed the payment modal
        resolve(false);
      }
    });
    
    handler.openIframe();
  });
}

// For demo purposes, we'll simulate payment success
// In production, remove this and use the actual Paystack implementation
async function processPayment(formData) {
  return new Promise((resolve) => {
    // Simulate payment processing
    setTimeout(() => {
      const isSuccess = confirm("This is a demo. Click OK to simulate successful payment, or Cancel to simulate failed payment.");
      resolve(isSuccess);
    }, 1000);
  });
}