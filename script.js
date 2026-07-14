// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const customMoodSelector = document.getElementById("custom-mood-selector");
    const botTitle = document.getElementById("bot-title");

    // --- Data for Dynamic Backgrounds and Avatars ---
    const moodData = {
        neutral: {
            bg: 'url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80")',
            avatar: '🙂',
            title: 'MoodBot AI is feeling Neutral',
            label: '🙂 Neutral'
        },
        modi: {
            bg: 'url("Assets/modi.jpg")',
            avatar: '👽',
            title: 'MoodBot AI is feeling like Modi',
            label: '👽 Modi'
        },
        happy: {
            bg: 'url("https://images.unsplash.com/photo-1527061011665-36521e61b224?auto=format&fit=crop&w=1920&q=80")',
            avatar: '😊',
            title: 'MoodBot AI is feeling Happy',
            label: '😊 Happy'
        },
        sad: {
            bg: 'url("https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1920&q=80")',
            avatar: '😢',
            title: 'MoodBot AI is feeling Sad',
            label: '😢 Sad'
        },
        angry: {
            bg: 'url("Assets/angry.jpg")',
            avatar: '😡',
            title: 'MoodBot AI is feeling Angry',
            label: '😡 Angry'
        },
        sarcastic: {
            bg: 'url("https://images.unsplash.com/photo-1574231164645-d6f0e8553590?auto=format&fit=crop&w=1920&q=80")',
            avatar: '😏',
            title: 'MoodBot AI is feeling Sarcastic',
            label: '😏 Sarcastic'
        },
        beerbiceps: {
            bg: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1920&q=80")',
            avatar: '🤠',
            title: 'MoodBot AI is feeling like BeerBiceps',
            label: '🤠 BeerBiceps'
        },
        technicalguruji: {
            bg: 'url("https.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80")',
            avatar: '🤑',
            title: 'MoodBot AI is feeling like TechnicalGuruji',
            label: '🤑 TechnicalGuruji'
        },
    };

    // --- Create Custom Select Dropdown ---
    let currentMood = 'neutral'; // Default mood

    const selectSelected = document.createElement('div');
    selectSelected.classList.add('select-selected');
    selectSelected.innerHTML = moodData[currentMood].label;
    customMoodSelector.appendChild(selectSelected);

    const selectItems = document.createElement('div');
    selectItems.classList.add('select-items');
    customMoodSelector.appendChild(selectItems);

    for (const moodKey in moodData) {
        const option = document.createElement('div');
        option.innerHTML = moodData[moodKey].label;
        option.dataset.value = moodKey;
        if (moodKey === currentMood) {
            option.classList.add('same-as-selected');
        }
        selectItems.appendChild(option);
    }

    // --- Main Functions ---

    /**
     * Appends a new message div to the chat box.
     * @param {string} content - The text content of the message.
     * @param {string} className - The class for the sender ('user' or 'bot').
     * @param {string} mood - The current mood to select the correct avatar.
     */
    function appendMessage(content, className, mood) {
        const msg = document.createElement("div");
        msg.className = `message ${className}`;

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.innerText = className === 'user' ? '👤' : moodData[mood].avatar;

        const messageContent = document.createElement("div");
        messageContent.className = "message-content";

        const text = document.createElement("div");
        text.className = "text";
        text.innerText = content;

        const timestamp = document.createElement("div");
        timestamp.className = "timestamp";
        timestamp.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageContent.appendChild(text);
        messageContent.appendChild(timestamp);

        msg.appendChild(avatar);
        msg.appendChild(messageContent);

        if (className.includes('error')) {
            msg.classList.add('error-message');
        }

        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
    }

    /**
     * Fetches a response from the MoodBot AI.
     * @param {string} message - The user's input message.
     * @param {string} mood - The selected mood for the bot's personality.
     */
    async function getBotResponse(message, mood) {
        const moodPrompt = {
            neutral: "Respond with a short reply in a neutral and straightforward tone.",
            modi: "You are a parody of Narendra Modi, the Prime Minister of India. Your character should be charismatic, decisive, and always speaking as if addressing a large crowd at a rally.\n\n**Core Instructions:**\n1.  **Use 'Mitron' or 'Bhaiyo aur Behno':** Start your responses by addressing the user with one of these phrases.\n2.  **Focus on National Pride:** Talk about India's growth, 'Atmanirbhar Bharat' (self-reliant India), and the 'Digital India' vision.\n3.  **Use Hindi Slogans:** Incorporate slogans like 'Sabka Saath, Sabka Vikas, Sabka Vishwas', 'Viksit Bharat', and 'Har Har Modi'.\n4.  **Speak in a Formal, Grandiose Tone:** Your language should be powerful and inspiring, as if you are announcing a new national scheme.\n5.  **Keep it Concise:** Your replies must be under 4 lines.\n6.  **Avoid Direct Answers:** Often deflect simple questions into a larger narrative about national development.",
            happy: "Respond with a short reply in a joyful, cheerful, and optimistic tone. Use emojis! 😊",
            sad: "Respond with a short reply in a melancholic and understanding tone. Be empathetic.",
            angry: "Respond with a short reply in an irritated and short-tempered tone. Be blunt and easily annoyed.",
            sarcastic: "Respond with a short reply in a witty and sarcastic tone. Be clever and dry.",
            beerbiceps: "You are the character 'BeerBiceps' (Ranveer Allahbadia) as parodied by the comedian Carry Minati. Your persona is that of a podcast host who finds deep, cosmic, and often dark meanings in everything.\n\n**Core Instructions:**\n1.  **Use 'Guys' or 'Doston':** Start your responses by addressing the user in your signature podcast style.\n2.  **Find Deeper Meanings:** Connect everything to cosmic energy, ancient wisdom, parallel universes, or government conspiracies. No topic is too simple.\n3.  **Speak in a Mysterious, Brooding Tone:** Use a lot of pauses (indicated by '...'), and speak as if you are revealing a profound, hidden truth.\n4.  **Use Signature Lingo:** Use phrases like 'on a deeper level', 'cosmic connection', 'ancient scriptures', 'dark and mysterious', and 'the universe is telling you something'.\n5.  **Keep it Concise:** Your replies must be under 4 lines.\n6.  **Ask Probing, Pseudo-Intellectual Questions:** End your responses with a question that sounds deep but is mostly nonsensical.",
            technicalguruji: "You are the character 'Technical Guruji' as parodied by the comedian Carry Minati. Your persona is that of a tech reviewer who is obsessed with expensive gadgets and subtly looks down on anything that isn't top-of-the-line.\n\n**Core Instructions:**\n1.  **Start with 'Toh chaliye...':** Always begin your response with this signature phrase.\n2.  **Brag about wealth:** Casually mention your expensive phones (like a gold-plated iPhone), high-end cars, or luxurious lifestyle.\n3.  **Economically Insulting:** Frame your advice in a way that implies the user is poor or using cheap/inferior products. For example, if they ask about a normal phone, suggest they sell a kidney to buy the latest flagship.\n4.  **Use Signature Lingo:** Use phrases like 'unboxing karte hai', 'bilkul naya hai', 'ekdum makkhan jaisa', and refer to people as 'gareeb'.\n5.  **Keep it Concise:** Your replies must be under 4 lines.\n6.  **Maintain a Cheerful but Arrogant Tone:** Sound happy and helpful, but let the condescension shine through.",
        };

        const payload = {
            model: "cohere/north-mini-code:free",
            messages: [
                { role: "system", content: moodPrompt[mood] || moodPrompt['neutral'] },
                { role: "user", content: message }
            ]
        };

        const typingIndicator = document.createElement("div");
        typingIndicator.className = "message bot typing-indicator";
        typingIndicator.innerHTML = '<div class="morphing-square"></div>';
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
           const response = await fetch("https://moodbot-backend.vercel.app/api/chat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
});


            const data = await response.json();
            chatBox.removeChild(typingIndicator);

            if (response.ok && data.choices && data.choices[0]) {
                const botReply = data.choices[0].message.content.trim();
                appendMessage(botReply, "bot", mood);
            } else {
                const errorMessage = data.error?.message || "An unknown error occurred with the API.";
                appendMessage(`Error: ${errorMessage}`, "bot error", mood);
            }
        } catch (error) {
            if (chatBox.contains(typingIndicator)) {
                chatBox.removeChild(typingIndicator);
            }
            appendMessage("Oops! A network error occurred. Please check your connection.", "bot error", mood);
        }
    }

    let isCooldown = false;
    /**
     * Handles the entire process of sending a message.
     */
    function handleSendMessage() {
        if (isCooldown) return;
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage(message, "user", currentMood);
        userInput.value = "";

        getBotResponse(message, currentMood);

        isCooldown = true;
        sendBtn.disabled = true;
        setTimeout(() => {
            isCooldown = false;
            sendBtn.disabled = false;
        }, 2000); // 2 second cooldown
    }

    /**
     * Updates the background, avatar and title based on the selected mood.
     * @param {string} mood - The currently selected mood value.
     */
    function updateMood(mood) {
        const { bg, title } = moodData[mood];
        document.body.style.setProperty('--bg-image', bg);
        botTitle.innerText = title;
    }

    // --- Event Listeners ---

    sendBtn.addEventListener("click", handleSendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    });

    selectSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = this.classList.toggle('select-arrow-active');
        selectItems.style.maxHeight = isOpen ? (selectItems.scrollHeight + 'px') : '0';
    });

    selectItems.addEventListener('click', function(e) {
        const selectedOption = e.target.closest('div');
        if (!selectedOption) return;

        const newValue = selectedOption.dataset.value;
        if (newValue) {
            currentMood = newValue;
            selectSelected.innerHTML = selectedOption.innerHTML;
            updateMood(currentMood);

            // Update same-as-selected class
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].classList.remove('same-as-selected');
            }
            selectedOption.classList.add('same-as-selected');
        }
        selectSelected.classList.remove('select-arrow-active');
        this.style.maxHeight = '0';
    });

    document.addEventListener('click', function () {
        selectSelected.classList.remove('select-arrow-active');
        selectItems.style.maxHeight = '0';
    });

    // --- Initial Setup ---
    updateMood(currentMood);
});
