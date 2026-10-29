(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var toggleLabel = document.getElementById('theme-label');
  var greeting = document.getElementById('greeting');
  var subject = document.getElementById('subject');
  var greetings = document.querySelectorAll('.greeting');

  // The visible label names the action, not the current state, so the button
  // stays self-explanatory without an extra aria-label.
  function applyTheme(theme) {
    var dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    toggleLabel.textContent = dark ? 'Light mode' : 'Dark mode';
  }

  function currentTheme() {
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  applyTheme(currentTheme());

  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem('hello-theme', next);
    } catch (error) {
      // Storage can be blocked; the theme still changes for this visit.
    }
  });

  greetings.forEach(function (button) {
    button.addEventListener('click', function () {
      greeting.textContent = button.dataset.greeting;
      greeting.lang = button.lang;
      subject.textContent = button.dataset.subject;
      subject.lang = button.lang;
      greetings.forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === button));
      });
    });
  });
})();
