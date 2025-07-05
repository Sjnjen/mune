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
            
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            window.scrollTo(0, 0);
        });
    });

    // CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            const sectionId = this.getAttribute('data-section');
            document.querySelector(`.nav-link[data-section="${sectionId}"]`).classList.add('active');
            document.getElementById(sectionId).classList.add('active');
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
                return (date.getDay() === 0); // Disable Sundays
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
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.step-indicator .step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        document.querySelector(`.step-indicator .step[data-step="${step}"]`).classList.add('active');
        currentStep = step;
        
        if (currentStep === 3) {
            updateOrderSummary();
        }
    }

    function validateStep(step) {
        if (step === 1 && !document.querySelector('input[name="cutType"]:checked')) {
            alert('Please select a cut type');
            return false;
        }
        if (step === 2 && !document.querySelector('input[name="clientStatus"]:checked')) {
            alert('Please select your client status');
            return false;
        }
        return true;
    }

    function updateOrderSummary() {
        const summaryContainer = document.getElementById('order-summary');
        const totalPriceElement = document.getElementById('total-price');
        const discountTextElement = document.getElementById('discount-text');
        
        summaryContainer.innerHTML = '';
        
        const selectedCut = document.querySelector('input[name="cutType"]:checked');
        if (selectedCut) {
            const cutName = selectedCut.value.split(' R')[0];
            const cutPrice = parseFloat(selectedCut.getAttribute('data-price'));
            
            const cutElement = document.createElement('div');
            cutElement.innerHTML = `<span>${cutName}</span><span>R${cutPrice.toFixed(2)}</span>`;
            summaryContainer.appendChild(cutElement);
            
            let totalPrice = cutPrice;
            let discount = 0;
            
            const selectedStatus = document.querySelector('input[name="clientStatus"]:checked');
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

    // WhatsApp Booking Function
    function submitViaWhatsApp() {
        const selectedCut = document.querySelector('input[name="cutType"]:checked');
        const selectedStatus = document.querySelector('input[name="clientStatus"]:checked');
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        
        if (!selectedCut || !name || !phone || !date) {
            alert('Please complete all required fields');
            return;
        }
        
        const cutType = selectedCut.value.split(' R')[0];
        const totalPrice = document.getElementById('total-price').textContent;
        const status = selectedStatus ? selectedStatus.value.split(' ')[0] : 'New Client';
        
        // Format WhatsApp message
        const message = `*NEW BARBER BOOKING*%0A%0A` +
                       `*Name:* ${name}%0A` +
                       `*Phone:* ${phone}%0A` +
                       `*Service:* ${cutType}%0A` +
                       `*Date:* ${date}%0A` +
                       `*Client Type:* ${status}%0A` +
                       `*Total Price:* R${totalPrice}%0A%0A` +
                       `_Booked via Mune De Barber Website_`;
        
        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/27818744472?text=${message}`, '_blank');
        
        // Optional: Reset form after submission
        setTimeout(() => {
            document.getElementById('booking-form').reset();
            changeStep(1);
        }, 1000);
    }

    // Form submission handler
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitViaWhatsApp();
        });
    }

    // Update summary when selections change
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (currentStep === 3) {
                updateOrderSummary();
            }
        });
    });
});
