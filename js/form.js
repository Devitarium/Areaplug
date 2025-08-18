// 4. School/Campus Handling
  const schoolSelect = document.getElementById('school');
  if (schoolSelect) {
    schoolSelect.addEventListener('change', handleSchoolChange);
    handleSchoolChange(); // Initialize on load
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

  // 5. Business Form Submission
  const businessForm = document.getElementById("businessForm");
  if (businessForm) {
    businessForm.addEventListener("submit", handleFormSubmit);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const formData = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        business_link: document.getElementById("business_link").value,
        location: document.getElementById("location").value === "Other"
          ? document.getElementById("other-location").value
          : document.getElementById("location").value,
        delivery: document.querySelector('input[name="delivery"]:checked').value,
        tier: document.getElementById("tier").value,
        duration: document.getElementById("duration").value,
        school: document.getElementById("school")?.value || "",
        campus: document.getElementById("campus")?.value || ""
      };

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

      const { error: insertError } = await supabase.from("Businesses").insert([{
        ...formData,
        image_url: imageUrl
      }]);

      if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);

      alert("Business submitted successfully!");
      businessForm.reset();
      
    } catch (error) {
      console.error("Error in form submission:", error);
      alert(`Error: ${error.message}`);
    }
  }
