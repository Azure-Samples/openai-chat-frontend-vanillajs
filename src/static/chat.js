const messages = []
const form = document.getElementById("chat-form");
const messageInput = document.getElementById("message");
const targetContainer = document.getElementById("messages");
const userTemplate = document.querySelector('#message-template-user');
const assistantTemplate = document.querySelector('#message-template-assistant');
const converter = new showdown.Converter();

const urlParams = new URLSearchParams(window.location.search);
const endpoint = urlParams.get('endpoint');
if (!endpoint) {
    console.warn("Please configure the ?endpoint parameter in the URL");
}

const client = new ChatProtocol.AIChatProtocolClient(endpoint);

form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const messageContent = messageInput.value;

    const userTemplateClone = userTemplate.content.cloneNode(true);
    userTemplateClone.querySelector(".message-content").innerText = messageContent;
    targetContainer.appendChild(userTemplateClone);

    const assistantTemplateClone = assistantTemplate.content.cloneNode(true);
    let messageDiv = assistantTemplateClone.querySelector(".message-content");
    targetContainer.appendChild(assistantTemplateClone);

    messages.push({
        "role": "user",
        "content": messageContent
    });

    const result = await client.getStreamedCompletion(messages);

    let answer = "";
    for await (const response of result) {
        if (!response.delta) {
            continue;
        }
        if (response.delta.content) {
            // Clear out the DIV if its the first answer chunk we've received
            if (answer == "") {
                messageDiv.innerHTML = "";
            }
            answer += response.delta.content;
            messageDiv.innerHTML = converter.makeHtml(answer);
            messageDiv.scrollIntoView();
        }
        if (response.error) {
            messageDiv.innerHTML = "Error: " + response.error;
        }
    }

    messageInput.value = "";
});