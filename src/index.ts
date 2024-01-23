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
          name: "SETUP AND INSTALL",
          description: "",
          action: {
            type: "reactComponent",
            component: GraphPublishingWidget(extensionAPI),
          },
        },
        {
          id: "graphgator-generate",
          name: "STEP 1/3 : Generate Graph Update Log since Last Sync",
          description:
            "For our V1, Update Log is New, Modified and Renamed Pages since last Sync.",
          action: {
            type: "reactComponent",
            component: PageGenerationWidget(extensionAPI),
          },
        },
        {
          id: "graphgator-sync",
          name: "STEP 2/3 : Check out the New Pages. ",
          description:
            "Review, Edit and Annotate Update Log, and Storify it for yourself and people you share your Graph with. \
            You may also make modifications to your Graph's [[M/Index]]. \
            The latest Update Log is also found at the top of your [[M/Update Logs]] page.",
          action: {
            type: "reactComponent",
            component: EmptyComponent(),
          },
        },
        {
          id: "graphgator-sync",
          name: "STEP 3/3 : Save the current Graph State",
          description:
            "Done with your Update Log and Index page. Finally, save the graph in it's current state. \
            And go back to doing your work until next time.",
          action: {
            type: "reactComponent",
            component: GraphSyncWidget(extensionAPI),
          },
        },
      ],
    };
    extensionAPI.settings.panel.create(config);

    const initializeMetamindRoamToolbar = () => {
      const graphName = window.roamAlphaAPI.graph.name;
      if(extensionAPI.settings.get(`${graphName}_graphgator_initialized`)) {
        const graphDiv = metamindToolBar();
        checkToAddToolBar(graphDiv);
      }
    };
    initializeMetamindRoamToolbar();
  },
};


