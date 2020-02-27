var validator = require('validator');
var storage = require('../storage/arango/arango_storage');

module.exports = async function validateRegistration(reg) {
    if (!reg.password || reg.password.length < 3) {
        return { error: 'Password must have at least 3 characters' };
    }

    if (reg.password !== reg.confirm) {
        return { error: 'Passwords does not match' };
    }

    if (!reg.name || reg.name.length < 6) {
        return { error: 'Username must have at least 6 characters' };
    }

    if (!reg.mail || !validator.isEmail(reg.mail)) {
        return { error: 'Email is required' };
    }

    var existing = await storage.users.getBy('name', reg.name);
    if (existing) {
        return { error: 'User name conflict' };
    }

    existing = await storage.users.getBy('mail', reg.mail);
    if (existing) {
        return { error: 'Email conflict' };
    }

    return { ok: true };
}