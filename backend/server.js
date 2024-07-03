// backend/server.js  
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');  
  
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from .env
dotenv.config();
  
// Middleware to serve static files from the frontend directory  
app.use(express.static(path.join(__dirname, '../frontend')));  
  
// Example API endpoint  
app.get('/api', (req, res) => {  
    res.json({ message: 'API is running' });  
});
// Chat Protocol Route  
app.post('/api/chat', express.json(), async (req, res) => {
    if (!req.body.messages || req.body.messages.length === 0) return console.log("No messages are passed!");
    const messages = req.body.messages;
    const response = await  newAddMessage(messages);
    return res.json(response);
});
  
// Serve frontend index.html for any other requests  
app.get('*', (req, res) => {  
    res.sendFile(path.join(__dirname, '../frontend/index.html'));  
});  
  
// Start the server  
app.listen(port, () => {  
    console.log(`Server is running on http://localhost:${port}`);  
});
const newAddMessage = async (messages) => {
    // Request data goes here
// The example below assumes JSON formatting which may be updated
// depending on the format your endpoint expects.
// More information can be found here:
// https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script
const requestBody = {
    question: messages
} ;
const requestHeaders = new Headers({
    //"Content-Type" : "text/event-stream"
    "Content-Type": "text/event-stream",
});
// Replace this with the primary/secondary key, AMLToken, or Microsoft Entra ID token for the endpoint
const apiKey = process.env.API_KEY;
if (!apiKey)
{
	console.error("A key should be provided to invoke the endpoint");
}
requestHeaders.append("Authorization", "Bearer " + apiKey)
// This header will force the request to go to a specific deployment.
// Remove this line to have the request observe the endpoint traffic rules
requestHeaders.append("azureml-model-deployment", "delegationsordningar-4o-a");
const url = "https://delegationsordningar-4o.swedencentral.inference.ml.azure.com/score";
try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: requestHeaders,
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const body = response.body;
    const reader = body.getReader();
    let finished = false;
    const stream = new ReadableStream({
      start(controller) {
        async function pump() {
          const { done, value } = await reader.read();
          if (done) {
            finished = true;
            controller.close();
            return;
          }
          controller.enqueue(value);
          pump();
        }
        pump();
      },
    });
    const finalResponse = new Response(stream, {  
      headers: { "Content-Type": "application/json", "Content-Length": "255" }  
    });
  
    const resText = await finalResponse.text();
    const res = JSON.parse(resText);
  
    console.log("Res timestamp in server:", Date.now());  
    console.log("Res in server:", res);
      // Return an object containing both the Response and the finished flag  
      return res;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}