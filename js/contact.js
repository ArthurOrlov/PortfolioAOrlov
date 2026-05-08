const BOT_TOKEN = '8625213946:AAEWD2CTfBRGdRhe-H8oeI0OE-npaorWlnY';
const CHAT_ID = '564883448';

const form = document.getElementById('tgForm');
const statusDiv = document.getElementById('formStatus');

function maskName(value) {
  return value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');
}

function validateEmail(email) {
  return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email);
}

const nameInput = document.getElementById('name');
if (nameInput) {
  nameInput.addEventListener('input', (e) => {
    e.target.value = maskName(e.target.value);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = nameInput.value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  
  if (!name) {
    showStatus('Пожалуйста, укажите ваше имя', 'error');
    return;
  }
  if (!validateEmail(email)) {
    showStatus('Введите корректный email', 'error');
    return;
  }
  if (!message) {
    showStatus('Напишите сообщение', 'error');
    return;
  }
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Отправка...';
  
  const tgMessage = `📬 *Новое сообщение с портфолио*\n\n👤 *Имя:* ${name}\n📧 *Email:* ${email}\n💬 *Сообщение:*\n${message}`;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: tgMessage,
        parse_mode: 'Markdown'
      })
    });
    
    const data = await response.json();
    if (data.ok) {
      showStatus('✅ Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
      form.reset();

      document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
        field.dispatchEvent(new Event('input'));
      });
    } else {
      throw new Error(data.description || 'Ошибка отправки');
    }
  } catch (error) {
    console.error(error);
    showStatus('❌ Ошибка отправки. Попробуйте позже или напишите напрямую: example@mail.com', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

function showStatus(msg, type) {
  statusDiv.textContent = msg;
  statusDiv.className = `form-status ${type}`;
  setTimeout(() => {
    statusDiv.style.opacity = '0';
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'form-status';
      statusDiv.style.opacity = '';
    }, 300);
  }, 5000);
}