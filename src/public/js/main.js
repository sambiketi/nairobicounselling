// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('bookingModal');
  const bookBtn = document.querySelector('.book-now');
  const closeBtn = document.querySelector('.close');

  if (bookBtn) {
    bookBtn.addEventListener('click', function() {
      modal.style.display = 'block';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

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
          alert('Booking successful! Check your WhatsApp for confirmation.');
          if (result.data.whatsappLink) {
            window.open(result.data.whatsappLink, '_blank');
          }
          modal.style.display = 'none';
          form.reset();
        } else {
          alert('Booking failed: ' + result.error);
        }
      } catch (error) {
        alert('An error occurred. Please try again.');
      }
    });
  }
});
