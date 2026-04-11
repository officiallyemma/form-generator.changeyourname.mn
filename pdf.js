/// <reference types="grecaptcha" />
document.addEventListener('DOMContentLoaded', () => {
    document.fonts.ready.then(() => {
        document.body.classList.remove('loading');
    });
    fetch('/counter')
        .then(response => response.text())
        .then(data => {
        const counterCard = document.querySelector('.counter-card p');
        let fuzzedData = parseInt(data) + Math.floor(Math.random() * (3 + 3 + 1)) - 3; // add some fuzzing for privacy
        counterCard.textContent = `${fuzzedData} forms generated since 2025`;
    })
        .catch(error => {
        console.error('Error fetching counter:', error);
    });
});
// Pre-fill the date picker to get it to render properly on mobile
if (isMobile()) {
    document.getElementById('dateOfBirth').value = '1999-01-01';
}
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches;
}
// Handle download buttons
document.getElementById('submitNAM102').addEventListener('click', function (e) {
    submitWithCaptcha(e, '/NAM102_Application_for_Name_Change.pdf');
});
document.getElementById('submitNAM103').addEventListener('click', function (e) {
    submitWithCaptcha(e, '/NAM103_Criminal_History_Check_Release.pdf');
});
document.getElementById('submitNAM107').addEventListener('click', function (e) {
    submitWithCaptcha(e, '/NAM107_Proposed_Order_Granting_Name_Change.pdf');
});
// reCAPTCHA v3
function submitWithCaptcha(e, url) {
    e.preventDefault();
    // Get a token from reCAPTCHA
    grecaptcha.ready(function () {
        grecaptcha.execute('6LcgsXkrAAAAAOZ8g7jVWWZssZ6PUcfdltyyiiwy', { action: 'submit' }).then(function (token) {
            let form = document.getElementById('nameChangeForm');
            form.action = url;
            copyData();
            // Add the token to the form
            document.getElementById('g-recaptcha-response').value = token;
            form.submit();
        });
    });
}
// Copy data from material form to hidden form
function copyData() {
    const fields = [
        'currentFirstName',
        'currentMiddleName',
        'currentLastName',
        'newFirstName',
        'newMiddleName',
        'newLastName',
        'dateOfBirth',
        'race',
        'sexOnBirthRecords',
        'newSex',
        'address',
        'city',
        'state',
        'zip',
        'county',
        'phone',
        'email',
        'legallyBindingSignature'
    ];
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        const input = document.querySelector(`input[name="${field}"]`);
        if (input) {
            input.value = value;
        }
    });
}
function sexHelp() {
    alert('This is the sex marker on your birth certificate. It is not the SELF-DESIGNATED sex descriptor on your ID. This information will be used to update your information with the Social Security Administration (hopefully, post trump). If you are looking for a non-binary option, you should contact the MN Volunteer Lawyers Network as there is some risk weighing to be done.');
}
// Alert if user selects same sex for both fields
document.querySelector('#newSex').addEventListener('change', (e) => {
    if (e.target.value === document.querySelector('#sexOnBirthRecords').value) {
        alert('This form generator is for trans people looking to change their name AND gender marker on their birth certificate. If you are NOT looking to change your gender marker or update your birth certificate, you will need to edit these forms afterwards.');
    }
});
