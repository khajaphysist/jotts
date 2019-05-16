module.exports = {
    client: {
        service: {
            name: "hasura",
            url: "http://localhost:8080/v1/graphql",
            headers: {
                'x-hasura-admin-secret': 'khaja',
            }
        },
        includes: ["./src/**/*.ts", "./src/**/*.tsx"]
    }
};