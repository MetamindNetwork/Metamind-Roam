import React from "react";
import { Button } from "@blueprintjs/core";
import renderToast from "roamjs-components/components/Toast";
import { initilizeGraph, postGraph } from "../utils";
import type { OnloadArgs } from "roamjs-components/types/native";
import { checkToAddToolBar, metamindToolBar } from "../metamindToolBar";

const GraphPublishingWidget =
  (extensionAPI: OnloadArgs["extensionAPI"]) => () => {
    const [tokenValue, setTokenValue] = React.useState("");
    const [tokenSwitch, setTokenSwitch] = React.useState(false);
    const [graphDescription, setGraphDescription] = React.useState("");

    React.useEffect(() => {
      const graphName = window.roamAlphaAPI.graph.name;
      const description = extensionAPI.settings.get(
        `${graphName}_graphDescription`
      );
      const descriptionString =
        typeof description === "string" ? JSON.parse(description) : "";
      const tokenSwitchValue = extensionAPI.settings.get(
        `${graphName}_graphgator_token`
      );
      const tokenSwitchString =
        typeof tokenSwitchValue === "boolean" ? tokenSwitchValue : false;
      setGraphDescription(descriptionString);
      setTokenSwitch(tokenSwitchString);
    }, []);

    const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTokenValue(event.target.value);
    };

    const handleDescriptionChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setGraphDescription(event.target.value);
    };

    const handleSync = async () => {
      const graphName = window.roamAlphaAPI.graph.name;
      let response = await initilizeGraph(tokenValue, graphDescription);
      if (response.status === 400) {
        renderToast({
          content: "Invalid Token! Please check your token again!",
          intent: "danger",
          id: "roam-js-graphgator",
        });
        return;
      } else if (response.status === 500) {
        renderToast({
          content: "Something went wrong! Please try again!",
          intent: "danger",
          id: "roam-js-graphgator",
        });
        return;
      } else {
        extensionAPI.settings.set(
          `${graphName}_graphDescription`,
          JSON.stringify(graphDescription)
        );
        extensionAPI.settings.set(`${graphName}_graphgator_initialized`, true);
        if (!tokenSwitch) {
          setTokenSwitch(true);
          extensionAPI.settings.set(`${graphName}_graphgator_token`, true);
        }
        const graphDiv = metamindToolBar();
        checkToAddToolBar(graphDiv);
        renderToast({
          content: `State saved, Graph Initialized! Good to go! 🚀
          Metamind : (Soon) Publish your Content as a Graph. Sign up in Plugin page!.`,
          intent: "primary",
          id: "roam-js-graphgator-index-page",
        });
      }
    };

    const showTokenInput = () => {
      const graphName = window.roamAlphaAPI.graph.name;
      extensionAPI.settings.set(`${graphName}_graphgator_token`, false);
      setTokenSwitch(false);
    };

    return (
      <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button
          text="Initialize Metamind Graph!"
          disabled={tokenSwitch}
          onClick={handleSync}
          style={{
            color: tokenSwitch ? "#374752" : "#FFFFFF",
            fontWeight: "bold",
          }}
        />
        {tokenSwitch ? (
          <Button
            text="Edit API Token Saved!"
            icon="edit"
            onClick={showTokenInput}
            style={{
              color: "#8BA2B2",
              fontWeight: "bold",
              borderRadius: "0.5rem",
              marginBottom: "0.5rem",
            }}
          />
        ) : (
          <input
            type="text"
            value={tokenValue}
            onChange={handleTokenChange}
            placeholder="API Token (Optional)"
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              marginBottom: "0.5rem",
            }}
          />
        )}
        <input
          type="text"
          value={graphDescription}
          onChange={handleDescriptionChange}
          placeholder="Graph Description (optional)"
          style={{
            padding: "0.5rem",
            borderRadius: "0.5rem",
            marginBottom: "0.5rem",
          }}
        />
        <div className="info-text">

        </div>
      </div>
      </>
    );
  };

export default GraphPublishingWidget;
