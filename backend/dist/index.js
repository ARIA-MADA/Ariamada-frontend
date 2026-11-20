import app from "./app.js";
import { assertConfig, config } from "./config.js";
const problems = assertConfig();
if (problems.length > 0) {
    console.error("❌ Configuration invalide :\n - " + problems.join("\n - "));
    if (config.isProd)
        process.exit(1);
}
app.listen(config.port, () => {
    console.log(`✦ API ARIA → http://localhost:${config.port}/api/health`);
});
//# sourceMappingURL=index.js.map