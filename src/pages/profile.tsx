import { ApolloClient, gql } from 'apollo-boost';
import React from 'react';
import { Mutation, withApollo } from 'react-apollo';

import {
    Button, createStyles, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Theme,
    withStyles, WithStyles
} from '@material-ui/core';
import { Person, Security } from '@material-ui/icons';

import { GetUserProfile, GetUserProfileVariables } from '../common/apollo-types/GetUserProfile';
import {
    UpdateUserProfile, UpdateUserProfileVariables
} from '../common/apollo-types/UpdateUserProfile';
import SelectImage from '../common/components/apollo/SelectImage';
import { countries } from '../common/components/Constants';
import Layout from '../common/components/Layout';
import { BaseMRSelect } from '../common/components/MaterialReactSelect';
import { CookieUser } from '../common/types';
import { User } from '../common/utils/agent';
import { loggedInUser, withUser } from '../common/utils/loginStateProvider';

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flex: 1
    },
    sidebar: {
        width: 250
    },
    main: {
        padding: 2 * theme.spacing.unit,
        flex: 1,
        maxWidth: 600
    },
    profileRoot: {
        display: 'flex',
        flexDirection: 'column'
    },
    passwordRoot: {
        display: 'flex',
        flexDirection: 'column'
    }
})
type StyleProps = WithStyles<typeof styles>

type Props = StyleProps & { client: ApolloClient<any>, user?: CookieUser }
interface State {
    selectedTab: 'personal_details' | 'change_password',
    profile: {
        name: string,
        country: string | undefined,
        profilePicture: string | null
    },
    passwords: {
        oldPassword: string,
        newPassword: string,
        confirmPassword: string
    }
}

const countryOptions = countries.map(c => ({ label: c, value: c }));

const emptyProfile = { country: undefined, name: '', profilePicture: '' };
const emptyPasswords = { confirmPassword: '', newPassword: '', oldPassword: '' }

class ProfilePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            selectedTab: 'personal_details',
            profile: emptyProfile,
            passwords: emptyPasswords
        }
    }
    render() {
        const { classes, user } = this.props
        const { selectedTab, profile, passwords } = this.state
        return user ? (
            <Layout>
                <div className={classes.root}>
                    <List className={classes.sidebar} component="nav">
                        <ListItem button
                            onClick={() => this.setState({ ...this.state, selectedTab: 'personal_details' })}
                            selected={selectedTab === 'personal_details'}
                        >
                            <ListItemIcon>
                                <Person />
                            </ListItemIcon>
                            <ListItemText>
                                Personal Details
                            </ListItemText>
                        </ListItem>
                        <ListItem button
                            onClick={() => this.setState({ ...this.state, selectedTab: 'change_password', passwords: emptyPasswords })}
                            selected={selectedTab === 'change_password'}
                        >
                            <ListItemIcon>
                                <Security />
                            </ListItemIcon>
                            <ListItemText>
                                Password
                            </ListItemText>
                        </ListItem>
                    </List>
                    <Paper className={classes.main}>
                        {
                            selectedTab === 'personal_details' ?
                                <div className={classes.profileRoot}>
                                    <TextField
                                        label="Name"
                                        value={profile.name}
                                        onChange={e => this.setState({ ...this.state, profile: { ...profile, name: e.target.value } })} />
                                    <BaseMRSelect
                                        defaultOptions={countryOptions}
                                        isMulti={false}
                                        value={profile.country ? [{ label: profile.country, value: profile.country }] : []}
                                        onChange={(v) => {
                                            this.setState({ ...this.state, profile: { ...profile, country: v[0].value } })
                                        }}
                                        placeholder="Select country"
                                        label="Country"
                                    />
                                    <SelectImage
                                        user={user}
                                        value={profile.profilePicture}
                                        onChange={imgId => this.setState({ ...this.state, profile: { ...profile, profilePicture: imgId } })}
                                        label="Profile Picture"
                                    />
                                    <Mutation<UpdateUserProfile, UpdateUserProfileVariables> mutation={updateUserProfile}>
                                        {(updateUserProfile) => (
                                            <Button color="primary" onClick={() => {
                                                updateUserProfile({ variables: { ...profile, userId: user.id } })
                                            }}
                                            >
                                                Save
                                            </Button>
                                        )}
                                    </Mutation>
                                </div>
                                :
                                <div className={classes.passwordRoot}>
                                    <TextField label="Old Password"
                                        type='password'
                                        value={passwords.oldPassword}
                                        onChange={e => this.setState({ ...this.state, passwords: { ...passwords, oldPassword: e.target.value } })}
                                    />
                                    <TextField label="New Password"
                                        type='password'
                                        value={passwords.newPassword}
                                        onChange={e => this.setState({ ...this.state, passwords: { ...passwords, newPassword: e.target.value } })}
                                    />
                                    <TextField label="Confirm New Password"
                                        type='password'
                                        value={passwords.confirmPassword}
                                        onChange={e => this.setState({ ...this.state, passwords: { ...passwords, confirmPassword: e.target.value } })}
                                    />
                                    <Button color="primary"
                                        onClick={() => {
                                            const { oldPassword, newPassword, confirmPassword } = passwords
                                            if (confirmPassword !== newPassword) {
                                                return window.alert("Passwords do not match")
                                            }
                                            User.changePassword(oldPassword, newPassword)
                                                .then(window.alert)
                                                .catch(e => window.alert(`Failed: ${e}`))
                                        }}
                                    >Save</Button>
                                </div>
                        }
                    </Paper>
                </div>
            </Layout>
        ) : null
    }
    componentDidMount() {
        const user = loggedInUser()
        if (!user) return;
        const { client } = this.props
        client.query<GetUserProfile, GetUserProfileVariables>({
            query: getUserProfileQuery,
            variables: { userId: user.id }
        }).then(res => {
            const u = res.data.jotts_user_by_pk;
            if (u) {
                this.setState({ ...this.state, profile: { name: u.name ? u.name : '', country: u.country ? u.country : '', profilePicture: u.profile_picture ? u.profile_picture : '' } })
            }
        })
    }
}

export default withUser(withApollo(withStyles(styles)(ProfilePage)))

const getUserProfileQuery = gql`
query GetUserProfile($userId: uuid!){
    jotts_user_by_pk(id: $userId) {
        id
        name
        country
        profile_picture
    }
}
`

const updateUserProfile = gql`
mutation UpdateUserProfile($userId: uuid!, $name: String, $country: String, $profilePicture: String){
    update_jotts_user(where: {id:{_eq: $userId}}, _set: {country: $country, name: $name, profile_picture: $profilePicture}) {
        affected_rows
        returning {
            id
            name
            country
            profile_picture
        }
    }
}
`