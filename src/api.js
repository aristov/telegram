const client = { send : () => {} }

function getRemoteFile(params) {
    return client.send(Object.assign({ '@type' : this.name }, params))
}
