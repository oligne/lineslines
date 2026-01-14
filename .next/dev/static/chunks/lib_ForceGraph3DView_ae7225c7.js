(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/ForceGraph3DView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ForceGraph3DView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// lib/ForceGraph3DView.js
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
// Import dynamique de 3d-force-graph
let ForceGraph3DLib = null;
function ForceGraph3DView({ users, me, onlineUsers }) {
    _s();
    const fgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ForceGraph3DView.useEffect": ()=>{
            console.log('ForceGraph3DView users:', users);
            let fg;
            let isMounted = true;
            if (!fgRef.current || !users.length) return;
            // Import dynamique du module et création du graphe
            __turbopack_context__.A("[project]/node_modules/3d-force-graph/dist/3d-force-graph.mjs [app-client] (ecmascript, async loader)").then({
                "ForceGraph3DView.useEffect": (mod)=>{
                    if (!isMounted) return;
                    ForceGraph3DLib = mod.default;
                    const nodes = users.map({
                        "ForceGraph3DView.useEffect.nodes": (u, i)=>({
                                id: u.id,
                                name: u.pseudo,
                                pseudo: u.pseudo,
                                isMe: me?.id === u.id,
                                isOnline: onlineUsers[u.id] || me?.id === u.id,
                                x: i === 0 ? 0 : 100,
                                y: 0,
                                z: 0
                            })
                    }["ForceGraph3DView.useEffect.nodes"]);
                    console.log('ForceGraph3DView nodes:', nodes);
                    fg = ForceGraph3DLib(fgRef.current).graphData({
                        nodes,
                        links: []
                    }).nodeThreeObject({
                        "ForceGraph3DView.useEffect": (node)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](20), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                                color: '#ff00ff'
                            }))
                    }["ForceGraph3DView.useEffect"]);
                }
            }["ForceGraph3DView.useEffect"]);
            // Clean up
            return ({
                "ForceGraph3DView.useEffect": ()=>{
                    isMounted = false;
                    if (fg && fg._destructor) fg._destructor();
                }
            })["ForceGraph3DView.useEffect"];
        }
    }["ForceGraph3DView.useEffect"], [
        users,
        me,
        onlineUsers
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: fgRef,
        style: {
            width: '100vw',
            height: '70vh',
            minHeight: 400
        }
    }, void 0, false, {
        fileName: "[project]/lib/ForceGraph3DView.js",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
_s(ForceGraph3DView, "2XlglJ1zstaR1WtRee3GT+PYUlE=");
_c = ForceGraph3DView;
var _c;
__turbopack_context__.k.register(_c, "ForceGraph3DView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/ForceGraph3DView.js [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/lib/ForceGraph3DView.js [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=lib_ForceGraph3DView_ae7225c7.js.map