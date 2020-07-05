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
const cors = require('cors');
const app = express_1.default();
app.use(cors());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/link-preview', (req, res) => {
    console.log("request received for req = ", req);
    //@ts-ignore
    const linkPromises = req.query.links.map(link => {
        return link_preview_js_1.getLinkPreview(link);
    });
    Promise.all(linkPromises)
        .then(data => {
        console.log("resulting data to return = ", data);
        res.send(data);
    });
});
app.listen(3006, () => {
    console.log(`Example API accessible on port 3006`);
});
//# sourceMappingURL=server.js.map