const query = async (query, variables) => await (await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query,
        variables
    })}
)).json()

const auth = async token => (await query(`
    query Authorize($token: String!) {
        authorize(token: $token)
    }
`, { token })).data.authorize;

module.exports = {
    query, auth
}