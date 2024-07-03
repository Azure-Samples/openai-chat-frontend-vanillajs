// Request data goes here
// The example below assumes JSON formatting which may be updated
// depending on the format your endpoint expects.
// More information can be found here:
// https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script
const requestBody = {
    question: "Tell me a joke man!"
} ;

const requestHeaders = new Headers({"Content-Type" : "application/json"});

// Replace this with the primary/secondary key, AMLToken, or Microsoft Entra ID token for the endpoint
const apiKey = "y9O38G1G3euKo2xyEMOEELbBtuG2qYCh";
if (!apiKey)
{
	throw new Exception("A key should be provided to invoke the endpoint");
}
requestHeaders.append("Authorization", "Bearer " + apiKey)

// This header will force the request to go to a specific deployment.
// Remove this line to have the request observe the endpoint traffic rules
requestHeaders.append("azureml-model-deployment", "delegationsordningar-4o-a");

const url = "https://delegationsordningar-4o.swedencentral.inference.ml.azure.com/score";

fetch(url, {
  method: "POST",
  body: JSON.stringify(requestBody),
  headers: requestHeaders
})
	.then((response) => {
	if (response.ok) {
		return response.body.text;
	} else {
		// Print the headers - they include the request ID and the timestamp, which are useful for debugging the failure
		console.debug(...response.headers);
		console.debug(response.body)
		throw new Error("Request failed with status code" + response.status);
	}
	})
	.then((json) => console.log(json))
	.catch((error) => {
		console.error(error)
	});
