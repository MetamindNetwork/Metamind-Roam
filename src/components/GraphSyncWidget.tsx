import React from "react";
import { Button } from "@blueprintjs/core";
import renderToast from "roamjs-components/components/Toast";
import { postGraph } from "../utils";
import type { OnloadArgs } from "roamjs-components/types/native";

const GraphSyncWidget = (extensionAPI: OnloadArgs["extensionAPI"]) => () => {
    const [tokenSwitch, setTokenSwitch] = React.useState(false);
    const [graphDescription, setGraphDescription] = React.useState("");

    React.useEffect(() => {
        const graphName = window.roamAlphaAPI.graph.name;
        const description = extensionAPI.settings.get(`${graphName}_graphDescription`);
        const descriptionString = (typeof description === 'string') ? JSON.parse(description) : "";
        const tokenSwitchValue = extensionAPI.settings.get(`${graphName}_graphgator_token`);
        const tokenSwitchString = (typeof tokenSwitchValue === 'boolean') ? tokenSwitchValue : false;
        setGraphDescription(descriptionString);
        setTokenSwitch(tokenSwitchString);
    }, []);

    const handleSync = async () => {
        const graphName = window.roamAlphaAPI.graph.name;
        extensionAPI.settings.set(`${graphName}_graphDescription`, JSON.stringify(graphDescription));
        const res = await postGraph('', graphDescription);
        if (res.status === 400) {
            renderToast({
                content: "Invalid Token! Please check your token again!",
                intent: "danger",
                id: "roam-js-graphgator"
            });
            return;
        } else if (res.status === 500) {
            renderToast({
                content: "Something went wrong! Please try again!",
                intent: "danger",
                id: "roam-js-graphgator"
            });
            return;
        } else {
            renderToast({
                content: "Your graph is getting synced! Please wait for sometime!",
                intent: "primary",
                id: "roam-js-graphgator"
            });
        };
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
                text="Save Graph State"
                disabled={!tokenSwitch}
                onClick={handleSync}
                style={{
                    color: tokenSwitch ? "#FFFFFF" : "#374752",
                    fontWeight: "bold"
                }}
            />
            <div style={{ padding: "2rem", display: "flex", flexDirection: "row" }}>
                <input
                    type="checkbox"
                    checked={false}
                    disabled={true}
                    style={{ padding: "0.5rem" }}
                />
                <label style={{ paddingLeft: "0.5rem", fontWeight: "bold" }}>
                    Publish to the Metamind App (Coming Soon!)
                </label>
            </div>
        </div>
    );
}

export default GraphSyncWidget;
