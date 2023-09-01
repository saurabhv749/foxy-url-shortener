// Wrap your code in a function to prevent polluting the global scope
function setupRegistrationForm() {
  const registerForm = document.getElementById("register-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const alertBox = document.getElementById("message");
  let timeout;

  // Define a function to handle the form submission
  async function handleSubmit(e) {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      // Make a request to the registration endpoint
      const response = await fetch("/spoof/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { success, message } = await response.json();

        // Update the message and show the alert box
        alertBox.innerText = message;
        alertBox.parentElement.classList.add("visible");

        // Clear the previous timeout if exists
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        // Set a timeout to hide the alert box and potentially redirect
        timeout = setTimeout(() => {
          alertBox.parentElement.classList.remove("visible");
          if (success) {
            window.location.href = "/spoof/login";
          }
        }, 2000);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  // Attach the submit event handler to the form
  registerForm.addEventListener("submit", handleSubmit);
}

// Call the setup function when the DOM is ready
document.addEventListener("DOMContentLoaded", setupRegistrationForm);
