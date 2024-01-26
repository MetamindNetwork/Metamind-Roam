import PageGenerationWidget from "./components/PageGenerationWidget";
import GraphPublishingWidget from "./components/GraphPublishingWidget";
import GraphSyncWidget from "./components/GraphSyncWidget";
import EmptyComponent from "./components/EmptyComponent";
import { metamindToolBar, checkToAddToolBar } from "./metamindToolBar";

export default {
  onload: ({ extensionAPI }: { extensionAPI: any }) => {
    const config = {
      tabTitle: "Metamind Roam",
      settings: [
        {
          id: "graphgator-setup",
          name: "",
          description: "",
          action: {
            type: "reactComponent",
            component: GraphPublishingWidget(extensionAPI),
          },
        },
        {
          id: "graphgator-sync",
          name: "",
          description: "",
          action: {
            type: "reactComponent",
            component: EmptyComponent(),
          },
        },
      ],
    };
    extensionAPI.settings.panel.create(config);

    const initializeMetamindRoamToolbar = () => {
      const graphName = window.roamAlphaAPI.graph.name;
      if (
        extensionAPI.settings.get(`${graphName}_graphgator_initialized`) &&
        document.querySelector("#metamind-roam-topbar") === null
      ) {
        const graphDiv = metamindToolBar();
        checkToAddToolBar(graphDiv);
      }
    };
    initializeMetamindRoamToolbar();
  },
};
