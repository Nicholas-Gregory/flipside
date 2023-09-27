const query = async (query, variables) => await (await fetch('/api', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('flipside.authToken')}`
    },
    body: JSON.stringify({
        query,
        variables
    })}
)).json()

module.exports = {
    query
}