const Hashids = require('hashids/cjs');

const hashids = new Hashids('Vs13fgasd', 5);
const hashEncodeId = (id) => hashids.encode(id);
const hashDecodeId = (hash) => hashids.decode(hash)[0];

module.exports = {hashEncodeId, hashDecodeId};