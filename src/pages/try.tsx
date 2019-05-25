import Layout from "../common/components/Layout";
import React from "react";
import dynamic from 'next/dynamic';
import { EditorValue,createMessageValue } from "../common/components/JottsEditor";
const JottsEditor = dynamic(() => import('../common/components/JottsEditor'), { ssr: false })

interface State {
    value: EditorValue
}

export default class TryPage extends React.Component<{}, State>{
    constructor(props: {}) {
        super(props);
        this.state = { value: createMessageValue("Start Jotting...") }
    }
    render() {
        return (
            <Layout>
                <div style={{minWidth:600, maxWidth:900}}>
                    <JottsEditor
                        value={this.state.value}
                        onChange={({ value }) => {
                            this.setState({ value })
                        }}
                    />
                </div>
            </Layout>
        )
    }
}