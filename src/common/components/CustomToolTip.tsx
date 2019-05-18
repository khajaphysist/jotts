import { Tooltip, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { TooltipProps } from "@material-ui/core/Tooltip";
import React from "react";

const styles=createStyles({
    tooltip: {
        backgroundColor: 'transparent'
    },
    popper: {
        opacity: 1
    }
})
type StyleProps = WithStyles<typeof styles>

class CustomToolTip extends React.Component<TooltipProps&StyleProps>{
    render(){
        return <Tooltip {...this.props}/>
    }
}

export default withStyles(styles)(CustomToolTip)