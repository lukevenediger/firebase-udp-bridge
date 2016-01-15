'use strict';

function ResponseMessage(type, payload) {
    this.type = type;
    this.payload = payload;
}

module.exports = ResponseMessage;
