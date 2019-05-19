import Link from 'next/link';
import React from 'react';

import {
    ButtonBase, Card, CardContent, createStyles, Theme, Typography,
    withStyles, WithStyles
} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
    item: {
        width: 500,
        height: 350,
        padding: theme.spacing.unit,
        margin: theme.spacing.unit,
    },
    itemHeader: {
        height: 108,
        overflow: "hidden",
        padding: `${theme.spacing.unit}px ${2 * theme.spacing.unit}px`,
    },
    itemContent: {
        height: 156,
        display: "flex",
        flexDirection: "column",
        padding: `${theme.spacing.unit}px ${2 * theme.spacing.unit}px`,
        overflow: "hidden",
    },
    itemAuthor: {
        height: 16,
        display: "flex",
        alignItems: 'center',
        padding: `0px ${2 * theme.spacing.unit}px`
    },
    date: {
        marginLeft: theme.spacing.unit
    },
    itemsTags: {
        height: 56,
        display:"flex",
        flexWrap: "wrap",
        alignItems:'flex-start',
        padding: `${theme.spacing.unit}px ${2 * theme.spacing.unit}px`,
        paddingLeft: theme.spacing.unit
    },
    tag:{
        marginLeft: theme.spacing.unit
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
            profile_picture: string | null
        }
        summary: string | null
        post_tags: Array<{ tag: string }>
        created_at: any
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
                            <Typography variant="h6" component="h1">
                                {this.props.data.title}
                            </Typography>
                        </ButtonBase>
                    </Link>
                </div>
                <div className={this.props.classes.itemAuthor}>
                    <Typography color="secondary" >
                        {this.props.data.author.handle}
                    </Typography>
                    <Typography color="textSecondary" variant="caption" className={classes.date}>
                        {(new Date(this.props.data.created_at)).toDateString().substr(4)}
                    </Typography>
                </div>
                <CardContent className={classes.itemContent}>
                    <Typography variant="body1" >
                        {this.props.data.summary}
                    </Typography>
                </CardContent>
                <div className={classes.itemsTags}>
                    {this.props.data.post_tags.map(t => (
                        <Link href={`/?tags=${t.tag}`} passHref key={t.tag}>
                            <Typography variant="subtitle2" color="textSecondary" component="a" className={classes.tag}>
                                {t.tag}
                            </Typography>
                        </Link>
                    ))}
                </div>
            </Card>
        )
    }
}

export default withStyles(styles)(PostCard)