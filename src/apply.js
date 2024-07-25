(function() {
    emailjs.init("TSF6e95DHy7VEE-SC"); // 请替换为你的EmailJS用户ID
})();

const form = document.getElementById('application-form');
const inputs = form.querySelectorAll('input, textarea');
const positionButtons = document.querySelectorAll('.position-button');
const positionInput = document.getElementById('position');
const successOverlay = document.getElementById('success-overlay');
const closeSuccessBtn = document.getElementById('close-success');
const submitBtn = document.getElementById('submit-btn');

let lastSubmissionTime = 0;
const submissionCooldown = 300000; // 5 minutes in milliseconds

positionButtons.forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('selected');
        updatePositionInput();
    });
});

function updatePositionInput() {
    const selectedPositions = Array.from(positionButtons)
        .filter(btn => btn.classList.contains('selected'))
        .map(btn => btn.dataset.position);
    positionInput.value = selectedPositions.join(', ');
}

form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateForm() && !isSpamSubmission()) {
        // 收集表单数据
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 使用EmailJS发送邮件
        emailjs.send("service_bi65uud", "template_fu20xlc", {
            to_email: "admin@ghs.red",
            from_name: data.name,
            from_email: data.email,
            qq: data.qq,
            position: data.position,
            experience: data.experience,
            skills: data.skills || "未填写",
            motivation: data.motivation || "未填写",
            portfolio: data.portfolio || "未提供",
            age: data.age || "未提供"
        }).then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showSuccessMessage();
            updateLastSubmissionTime();
        }, function(error) {
            console.log('FAILED...', error);
            alert('抱歉，提交失败。请稍后再试或直接联系我们。');
        });
    }
});

function validateForm() {
    let isValid = true;
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, '此字段为必填项');
            isValid = false;
        } else {
            clearError(input);
        }
    });

    if (!positionInput.value) {
        showError(positionInput, '请选择至少一个描述');
        isValid = false;
    }

    const emailInput = document.getElementById('email');
    if (emailInput.value && !isValidEmail(emailInput.value)) {
        showError(emailInput, '请输入有效的电子邮箱地址');
        isValid = false;
    }


    return isValid;
}

function showError(input, message) {
    clearError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
}

function clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


function showSuccessMessage() {
    successOverlay.classList.add('show');
}

closeSuccessBtn.addEventListener('click', function() {
    successOverlay.classList.remove('show');
    form.reset();
    positionButtons.forEach(btn => btn.classList.remove('selected'));
    positionInput.value = '';
});

function isSpamSubmission() {
    const currentTime = Date.now();
    if (currentTime - lastSubmissionTime < submissionCooldown) {
        const remainingTime = Math.ceil((submissionCooldown - (currentTime - lastSubmissionTime)) / 1000);
        alert(`请等待 ${remainingTime} 秒后再次提交申请。`);
        return true;
    }
    return false;
}

function updateLastSubmissionTime() {
    lastSubmissionTime = Date.now();
    localStorage.setItem('lastSubmissionTime', lastSubmissionTime);
    updateSubmitButtonState();
}

function updateSubmitButtonState() {
    const currentTime = Date.now();
    const timeSinceLastSubmission = currentTime - lastSubmissionTime;
    if (timeSinceLastSubmission < submissionCooldown) {
        submitBtn.disabled = true;
        const remainingTime = Math.ceil((submissionCooldown - timeSinceLastSubmission) / 1000);
        submitBtn.textContent = `请等待 ${remainingTime} 秒`;
        setTimeout(updateSubmitButtonState, 1000);
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = '提交申请';
    }
}

// 页面加载时检查上次提交时间
window.addEventListener('load', function() {
    lastSubmissionTime = parseInt(localStorage.getItem('lastSubmissionTime') || '0');
    updateSubmitButtonState();
});

// 添加输入验证效果
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            showError(this, '此字段为必填项');
        } else if (this.id === 'email' && this.value && !isValidEmail(this.value)) {
            showError(this, '请输入有效的电子邮箱地址');
        } else {
            clearError(this);
        }
    });

    input.addEventListener('input', function() {
        clearError(this);
    });
});
