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
import Layout from '../common/components/Layout';
import { BaseMRSelect } from '../common/components/MaterialReactSelect';
import { CookieUser } from '../common/types';
import { User } from '../common/utils/agent';
import { loggedInUser, withUser } from '../common/utils/loginStateProvider';

const countries = ["Afghanistan", "Akrotiri", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ashmore and Cartier Islands", "Australia", "Austria", "Azerbaijan", "Bahamas, The", "Bahrain", "Bangladesh", "Barbados", "Bassas da India", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Cook Islands", "Coral Sea Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dhekelia", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europa Island", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia, The", "Gaza Strip", "Georgia", "Germany", "Ghana", "Gibraltar", "Glorioso Islands", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jersey", "Jordan", "Juan de Nova Island", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "Navassa Island", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paracel Islands", "Paraguay", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Spratly Islands", "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tromelin Island", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Wake Island", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"]

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flex: 1
    },
    sidebar: {
        width: 250,
        margin: 2 * theme.spacing.unit
    },
    main: {
        padding: 2 * theme.spacing.unit,
        flex: 1,
        maxWidth: 600,
    },
    profileRoot: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 250,
    },
    passwordRoot: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 200,
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
                                    <div>
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
                                    </div>
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