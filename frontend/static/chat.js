const messages = []
const form = document.getElementById("chat-form");
const messageInput = document.getElementById("message");
const targetContainer = document.getElementById("messages");
const userTemplate = document.querySelector('#message-template-user');
const assistantTemplate = document.querySelector('#message-template-assistant');
const converter = new showdown.Converter();
const urlParams = new URLSearchParams(window.location.search);
/*
const endpoint = urlParams.get('endpoint');
if (!endpoint) {  
    console.warn("Please configure the ?endpoint parameter in the URL");  
}
    */
const addNewMessage = async (messages) => {
    if (!messages || messages.length === 0) return console.log("No messages in client!");
    const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ messages: messages }),
    });
    console.log("Result in client: ", res);
    return res;
}


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
    
    const onMessage = (msg) => {
        console.log("Message: ", msg);
    }

    const response = await addNewMessage(messages);

    messageDiv.scrollIntoView();

    let total = "";
        const reader = response.body.getReader();
        reader.closed.then(() => {
            console.log("reader closed");
          });
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            console.log("Not done...")
            const decodedValue = decoder.decode(value);
            try {
                const json = JSON.parse(decodedValue);
                total += json.answer ? json.answer : json.llmoutput.content || "Something went wrong...";
                messageDiv.innerHTML = converter.makeHtml(total);
                messageDiv.scrollIntoView();
            } catch (err) {
                console.log("Something went wrong while parsing LLM response!");
            }
        }
        if (response.error) {
            messageDiv.innerHTML = "Error: " + result.error;
        }
    messageInput.value = "";
});