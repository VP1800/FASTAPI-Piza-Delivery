document.addEventListener("DOMContentLoaded", function () {
    const chatbot = document.getElementById("chatbot");
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotClose = document.getElementById("chatbotClose");
    const chatbotSend = document.getElementById("chatbotSend");
    const chatbotInput = document.getElementById("chatbotInput");
    const chatbotContent = document.getElementById("chatbotContent");

    // Toggle chatbot visibility
    chatbotToggle.addEventListener("click", () => {
        chatbot.style.display = chatbot.style.display === "block" ? "none" : "block";
    });

    // Close chatbot
    chatbotClose.addEventListener("click", () => {
        chatbot.style.display = "none";
    });

    // Send message
    chatbotSend.addEventListener("click", () => {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            const userMessageElement = document.createElement("p");
            userMessageElement.textContent = `You: ${userMessage}`;
            chatbotContent.appendChild(userMessageElement);
            chatbotInput.value = "";

            // Auto-scroll to the bottom
            chatbotContent.scrollTop = chatbotContent.scrollHeight;

            // Mock chatbot response
            const botMessageElement = document.createElement("p");
            botMessageElement.textContent = "Chatbot: I'm here to help!";
            botMessageElement.style.color = "#007bff";
            chatbotContent.appendChild(botMessageElement);

            // Auto-scroll to the bottom
            chatbotContent.scrollTop = chatbotContent.scrollHeight;
        }
    });
});
