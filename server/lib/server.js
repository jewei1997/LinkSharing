'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Starts the server at the given port
 */
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const link_preview_js_1 = require("link-preview-js");
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/api/object', (req, res) => {
    console.log(req.query);
    link_preview_js_1.getLinkPreview("https://tesla.com")
        .then((data) => console.log(data));
    res.send({
        data: 'object'
    });
});
app.listen(3006, () => {
    console.log(`Example API accessible on port 3006`);
});
//# sourceMappingURL=server.js.map