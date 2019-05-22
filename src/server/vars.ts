const APP_ENV_VARS = process.env.APP_ENV_VARS;

let vars: { [key: string]: string } = {};

const requiredvars = [
    "PRIVATE_KEY",
    "PUBLIC_KEY",
    "S3_ENDPOINT",
    "S3_BUCKENT_NAME",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "HASURA_ADMIN_SECRET",
    "GRAPHQL_ENDPOINT",
    "PG_CONNECTION_STRING",
    "ADMIN_EMAIL",
    "ADMIN_EMAIL_PASS"
] as const

if (!APP_ENV_VARS) {
    console.log("NO APP_ENV_VARS is defined")
    process.exit(1)
} else {
    try {
        vars = JSON.parse(APP_ENV_VARS);
        const missingvars = requiredvars.filter(key=>!vars[key])
        if(missingvars.length>0){
            console.log("MISSING: ", missingvars);
            process.exit(1)
        }
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export const {
    PRIVATE_KEY,
    PUBLIC_KEY,
    S3_ENDPOINT,
    S3_BUCKENT_NAME,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    HASURA_ADMIN_SECRET,
    GRAPHQL_ENDPOINT,
    PG_CONNECTION_STRING,
    ADMIN_EMAIL,
    ADMIN_EMAIL_PASS,
} = vars