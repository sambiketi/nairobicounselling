// Main JavaScript file for Nairobi Counseling Center

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('bookingModal');
  const bookBtn = document.querySelector('.book-now');
  const closeBtn = document.querySelector('.close');

  // Global functions for modal
  window.openBooking = function() {
    if (modal) modal.style.display = 'flex';
  };
  window.closeBooking = function() {
    if (modal) modal.style.display = 'none';
  };

  // Open booking modal
  if (bookBtn) {
    bookBtn.addEventListener('click', function() {
      if (modal) modal.style.display = 'flex';
    });
  }

  // Close booking modal
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      if (modal) modal.style.display = 'none';
    });
  }

  // Close on outside click
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      if (modal) modal.style.display = 'none';
    }
  });

  // Load services for booking dropdown
  async function loadServices() {
    try {
      const response = await fetch('/api/services/active');
      const result = await response.json();
      if (result.success) {
        const select = document.getElementById('serviceSelect');
        if (!select) return;
        select.innerHTML = '<option value="">Select a service</option>';
        result.data.forEach(service => {
          const option = document.createElement('option');
          option.value = service.id;
          option.textContent = service.name;
          select.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  }
  loadServices();

  // Handle booking form submission
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Check if service is selected
      if (!data.serviceId) {
        alert('Please select a service');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Booking...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (result.success) {
          alert('✅ Session booked successfully! We will contact you shortly.');
          if (result.data.whatsappLink) {
            window.open(result.data.whatsappLink, '_blank');
          }
          if (modal) modal.style.display = 'none';
          form.reset();
        } else {
          alert('❌ Booking failed: ' + result.error);
        }
      } catch (error) {
        alert('❌ An error occurred. Please try again or call us directly.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
