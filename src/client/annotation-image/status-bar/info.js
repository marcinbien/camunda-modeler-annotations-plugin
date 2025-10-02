import React, { Fragment, PureComponent } from "camunda-modeler-plugin-helpers/react";
import { Fill } from "camunda-modeler-plugin-helpers/components";

let applicationState = {
    activeFile: null,
};

export const getActiveBpmnDiagramFilePath = () => {
    if (!applicationState?.activeFile) {
        return null;
    }
    return applicationState?.activeFile;
}

export default class Info extends PureComponent {
    constructor(props) {
        console.log("Info props", props);
        super(props);
        this.state = {
            path: '',
        }
    }

    componentDidMount() {
        const { subscribe } = this.props;

        subscribe("app.activeTabChanged", (tab) => {
            applicationState.activeFile = tab?.activeTab?.file?.path ?? null;
            console.log("Info activeTabChanged", tab);

            this.setState({ path: tab?.activeTab?.file?.path ?? '' });
        });

        subscribe("tab.saved", (wd) => {
            applicationState.activeFile = wd?.tab?.file?.path ?? null;
            console.log("Info tab.saved", wd);
        });
    }

    render() {
        return <Fragment>
            <Fill slot="status-bar__app" group="9_info">
                <div>Annotations plugin v0.0.1</div>
            </Fill>
        </Fragment>

    }
}