module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/turso.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "turso",
    ()=>turso
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__ = __turbopack_context__.i("[externals]/@libsql/client [external] (@libsql/client, esm_import, [project]/node_modules/@libsql/client)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const turso = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$libsql$2f$client__$5b$external$5d$__$2840$libsql$2f$client$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$libsql$2f$client$29$__["createClient"])({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/users/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$turso$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/turso.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$turso$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$turso$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function GET() {
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$turso$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["turso"].execute('SELECT * FROM users ORDER BY id ASC');
        return Response.json(result.rows);
    } catch (e) {
        console.error('API GET /users error:', e);
        return new Response(JSON.stringify({
            error: e.message || e.toString()
        }), {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const uuid = body.uuid || null;
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
        // 1. Cherche par UUID
        if (uuid) {
            const existingByUuid = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$turso$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["turso"].execute({
                sql: 'SELECT * FROM users WHERE uuid = ?',
                args: [
                    uuid
                ]
            });
            if (existingByUuid.rows.length > 0) {
                return Response.json(existingByUuid.rows[0]);
            }
        }
        // 2. Sinon cherche par IP (pour compatibilité)
        const existingByIp = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$turso$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["turso"].execute({
            sql: 'SELECT * FROM users WHERE ip = ?',
            args: [
                ip
            ]
        });
        if (existingByIp.rows.length > 0) {
            return Response.json(existingByIp.rows[0]);
        }
        // 3. Sinon crée un nouvel utilisateur
        const userNum = Math.floor(1000 + Math.random() * 9000);
        const pseudo = `user${userNum}`;
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$turso$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["turso"].execute({
            sql: 'INSERT INTO users (pseudo, ip, uuid) VALUES (?, ?, ?) RETURNING *',
            args: [
                pseudo,
                ip,
                uuid
            ]
        });
        return Response.json(result.rows[0]);
    } catch (e) {
        console.error('API POST /users error:', e);
        return new Response(JSON.stringify({
            error: e.message || e.toString()
        }), {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9b5b8bb0._.js.map