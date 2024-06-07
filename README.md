# OpenAI Chat App Frontend (Vanilla JS)

This repository includes a simple webpage
that streams responses from a Chat App backend using [JSON lines](https://jsonlines.org/)
over a [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
using the [Microsoft AI Chat Protocol SDK](https://www.npmjs.com/package/@microsoft/ai-chat-protocol).

- [Opening the project](#opening-the-project)
- [Deployment](#deployment)
- [CI/CD pipeline](#cicd-pipeline)
- [Costs](#costs)
- [Local development](#local-development)

## Opening the project

This project has [Dev Container support](https://code.visualstudio.com/docs/devcontainers/containers), so it will be be setup automatically if you open it in Github Codespaces or in local VS Code with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

If you're not using one of those options for opening the project, then you'll need to:

1. Install Node
2. Install the [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd).

## Deployment

This repo is set up for deployment on Azure Static Web Apps using the configuration files in the `infra` folder.

1. Set the `endpoint`  variable in `chat.js` to the URI of your deployed backend. The backend must conform to the [Chat App Protocol](https://aka.ms/chatprotocol). One option is [openai-chat-app-quickstart](https://github.com/Azure-Samples/openai-chat-app-quickstart/).

2. Sign up for a [free Azure account](https://azure.microsoft.com/free/) and create an Azure Subscription.

3. Login to Azure:

    ```shell
    azd auth login
    ```

4. Provision and deploy all the resources:

    ```shell
    azd up
    ```

    It will prompt you to provide an `azd` environment name (like "chat-app") and select a subscription from your Azure account. Then it will provision the resources in your account and deploy the latest code. If you get an error or timeout with deployment, changing the location can help, as there may be availability constraints for the OpenAI resource.

5. When `azd` has finished deploying, you'll see an endpoint URI in the command output. Visit that URI, and you should see the chat app! 🎉
6. When you've made any changes to the app code, you can just run:

    ```shell
    azd deploy
    ```

### CI/CD pipeline

This project includes a Github workflow for deploying the resources to Azure
on every push to main. That workflow requires several Azure-related authentication secrets
to be stored as Github action secrets. To set that up, run:

```shell
azd pipeline config
```

### Costs

This app uses [Azure Static Web Apps free tier](https://azure.microsoft.com/pricing/details/app-service/static/), so it should not cost anything.

## Local development

1. This frontend needs to communicate with a backend that implements the [Chat App Protocol](https://aka.ms/chatprotocol),
    such as [openai-chat-app-quickstart](https://github.com/Azure-Samples/openai-chat-app-quickstart/).
    You can either set the endpoint in the URL via the `?endpoint=` query parameter,
    or in the `chat.js` file directly as the `endpoint` variable.

2. Install the dependencies:

    ```shell
    npm install
    ```

3. Start the local server:

    ```shell
    npm run start
    ```
