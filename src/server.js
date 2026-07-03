import app from "./app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`
=====================================
🚀 PopFresh Backend Running
🌍 http://localhost:${PORT}
=====================================
`);
});