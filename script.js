document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(function() {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1500);

    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    });

    // CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to booking link and section
            const sectionId = this.getAttribute('data-section');
            document.querySelector(`.nav-link[data-section="${sectionId}"]`).classList.add('active');
            document.getElementById(sectionId).classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    }

    // Booking form steps
    const formSteps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator .step');
    let currentStep = 1;

    // Initialize datepicker
    flatpickr(".datepicker", {
        minDate: "today",
        dateFormat: "Y-m-d",
        disable: [
            function(date) {
                // Disable Sundays
                return (date.getDay() === 0);
            }
        ]
    });

    // Next step button
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                changeStep(currentStep + 1);
            }
        });
    });

    // Previous step button
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            changeStep(currentStep - 1);
        });
    });

    // Step indicator click
    stepIndicators.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.getAttribute('data-step'));
            if (stepNumber < currentStep) {
                changeStep(stepNumber);
            }
        });
    });

    function changeStep(step) {
        // Hide current step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step-indicator .step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show new step
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        document.querySelector(`.step-indicator .step[data-step="${step}"]`).classList.add('active');
        
        currentStep = step;
        
        // Update order summary
        if (currentStep === 3) {
            updateOrderSummary();
        }
    }

    function validateStep(step) {
        let isValid = true;
        
        if (step === 1) {
            const selectedCut = document.querySelector('input[name="cutType"]:checked');
            if (!selectedCut) {
                alert('Please select a cut type');
                isValid = false;
            }
        } else if (step === 2) {
            const selectedStatus = document.querySelector('input[name="clientStatus"]:checked');
            if (!selectedStatus) {
                alert('Please select your client status');
                isValid = false;
            }
        }
        
        return isValid;
    }

    function updateOrderSummary() {
        const summaryContainer = document.getElementById('order-summary');
        const totalPriceElement = document.getElementById('total-price');
        const discountTextElement = document.getElementById('discount-text');
        
        // Get selected options
        const selectedCut = document.querySelector('input[name="cutType"]:checked');
        const selectedStatus = document.querySelector('input[name="clientStatus"]:checked');
        
        // Clear summary
        summaryContainer.innerHTML = '';
        
        if (selectedCut) {
            const cutName = selectedCut.value.split(' R')[0];
            const cutPrice = parseFloat(selectedCut.getAttribute('data-price'));
            
            // Add cut to summary
            const cutElement = document.createElement('div');
            cutElement.innerHTML = `<span>${cutName}</span><span>R${cutPrice.toFixed(2)}</span>`;
            summaryContainer.appendChild(cutElement);
            
            let totalPrice = cutPrice;
            let discount = 0;
            
            if (selectedStatus) {
                discount = parseFloat(selectedStatus.getAttribute('data-discount'));
                
                if (discount > 0) {
                    const discountAmount = (totalPrice * discount) / 100;
                    totalPrice -= discountAmount;
                    
                    const discountElement = document.createElement('div');
                    discountElement.innerHTML = `<span>Discount (${discount}%)</span><span>-R${discountAmount.toFixed(2)}</span>`;
                    summaryContainer.appendChild(discountElement);
                    
                    discountTextElement.textContent = `(Saved R${discountAmount.toFixed(2)})`;
                } else {
                    discountTextElement.textContent = '';
                }
            }
            
            totalPriceElement.textContent = totalPrice.toFixed(2);
        }
    }

    // Form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // In a real app, you would send this data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Your appointment has been booked successfully! We will contact you to confirm.');
            
            // Reset form
            this.reset();
            changeStep(1);
        });
    }

    // Watch for changes to update summary
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (currentStep === 3) {
                updateOrderSummary();
            }
        });
    });
});

// WhatsApp submission alternative
function submitViaWhatsApp() {
    const cutType = document.querySelector('input[name="cutType"]:checked').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const total = document.getElementById('total-price').textContent;
    
    const message = `New Booking:%0A%0A` +
                   `Name: ${name}%0A` +
                   `Phone: ${phone}%0A` +
                   `Service: ${cutType}%0A` +
                   `Date: ${date}%0A` +
                   `Total: R${total}`;
    
    window.open(`https://wa.me/27834878488?text=${message}`, '_blank');
}

// Update form submission to use WhatsApp
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    submitViaWhatsApp();
});