exports.DATABASE_URL = process.env.DATABASE_URL
    // ||
    //                    global.DATABASE_URL ||
    //                   'mongodb://localhost/plyDb';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                       global.TEST_DATABASE_URL ||
                      'mongodb://localhost/test-plyDb';
exports.SESSION_DATABASE_URL = process.env.SESSION_DATABASE_URL
    // ||
    //                    global.SESSION_DATABASE_URL ||
    //                   'mongodb://localhost/plySessions';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
