import Link from 'next/link';
import React from 'react';

import {
  Button, ButtonBase, Card, CardActions, CardContent, createStyles, Theme, Typography, withStyles,
  WithStyles
} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    item: {
        width: "300px",
        height: "450px",
        padding: theme.spacing.unit,
        margin: theme.spacing.unit,
        display: "flex",
        flexDirection: "column"
    },
    itemHeader: {
        height: "80px",
        padding: `${theme.spacing.unit}px ${2 * theme.spacing.unit}px`
    },
    itemContent: {
        height: "240px",
        display: "flex",
        flexDirection: "column",
        padding: `${theme.spacing.unit}px ${2 * theme.spacing.unit}px`
    },
    itemActions: {
        flex: 1
    },
    itemAuthor: {
        height: "24px",
        display: "flex",
        padding: `0px ${2 * theme.spacing.unit}px`
    },
    itemAuthorName: {
        flex: 1
    },
    itemAuthorHandle: {
        flex: 1
    },
    itemsTags: {
        height: "48px",
        padding: `0px ${2 * theme.spacing.unit}px`
    }
})

type StyleProps = WithStyles<typeof styles>

interface ComponentProps {
    data: {
        id: string
        slug: string
        title: string
        author: {
            name: string | null
            handle: string
        }
        content: string | null
        tags: Array<{ tag: string }>
    }
}

type Props = StyleProps & ComponentProps;

interface State {
    raised: boolean
}

class PostCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { raised: false }
    }
    render() {
        const { classes } = this.props;
        return (
            <Card className={this.props.classes.item} key={this.props.data.id}
                onMouseEnter={() => this.setState({ raised: true })} onMouseLeave={() => this.setState({ raised: false })}
                raised={this.state.raised}>
                <div className={classes.itemHeader}>
                    <Link href={"/post?slug=" + this.props.data.slug} as={"/post/" + this.props.data.slug} passHref>
                        <ButtonBase style={{ textAlign: 'start' }}>
                            <Typography variant="h6">
                                {this.props.data.title.substr(0, 40)}
                            </Typography>
                        </ButtonBase>
                    </Link>
                </div>
                <div className={this.props.classes.itemAuthor}>
                    <Typography color="secondary" className={this.props.classes.itemAuthorName}>
                        {this.props.data.author.name ? this.props.data.author.name.substr(0, 15) : ''}
                    </Typography>
                    <Typography color="textSecondary" className={this.props.classes.itemAuthorHandle}>
                        @{this.props.data.author.handle.substr(0, 15)}
                    </Typography>
                </div>
                <CardContent className={classes.itemContent}>
                    <Typography variant="body1" >
                        {this.props.data.content ? this.props.data.content.substr(0, 200) : ''}
                    </Typography>
                </CardContent>
                <div className={classes.itemsTags}>
                    <Typography variant="subtitle2" color="textSecondary">
                        {this.props.data.tags.map(t => t.tag).join(", ")}
                    </Typography>
                </div>
                <CardActions className={classes.itemActions}>
                    <Button>Like</Button>
                    <Button>Save</Button>
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(PostCard)