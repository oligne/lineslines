(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/FocusGraph.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$force$2d$graph$2d$3d$2f$dist$2f$react$2d$force$2d$graph$2d$3d$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-force-graph-3d/dist/react-force-graph-3d.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function FocusGraph({ data, userIp }) {
    _s();
    const fgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [graphData, setGraphData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nodes: [],
        links: []
    });
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editValue, setEditValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [caretVisible, setCaretVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [dimensions, setDimensions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        width: 800,
        height: 600
    });
    const [selectedNode, setSelectedNode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Keywords state local pour édition (pour ton node)
    const [keywordEdit, setKeywordEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Resize listener pour canvas plein écran
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FocusGraph.useEffect": ()=>{
            function handleResize() {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }
            handleResize();
            window.addEventListener('resize', handleResize);
            return ({
                "FocusGraph.useEffect": ()=>window.removeEventListener('resize', handleResize)
            })["FocusGraph.useEffect"];
        }
    }["FocusGraph.useEffect"], []);
    // Trouver l'id du node de l'utilisateur courant
    const myNodeId = graphData.nodes.find((n)=>n.ip === userIp)?.id;
    // Pas de position forcée : on laisse 3D ForceGraph placer les nodes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FocusGraph.useEffect": ()=>{
            try {
                let parsed = JSON.parse(data);
                setGraphData(parsed);
            } catch  {
                setGraphData({
                    nodes: [],
                    links: []
                });
            }
        }
    }["FocusGraph.useEffect"], [
        data
    ]);
    // Toujours cadrer tous les points à l'écran après chaque changement de graphData
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FocusGraph.useEffect": ()=>{
            if (fgRef.current) {
                fgRef.current.zoomToFit(0, 10); // padding réduit à 10px
            }
        }
    }["FocusGraph.useEffect"], [
        graphData
    ]);
    // Ajuste la force selon le nombre de nodes (encore plus dense)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FocusGraph.useEffect": ()=>{
            if (!fgRef.current) return;
            const n = graphData.nodes.length || 1;
            // Distance caméra dynamique, zoom plus fort si peu de points
            const z = Math.max(-100, Math.min(200, n * 25));
            fgRef.current.cameraPosition({
                x: 0,
                y: 0,
                z
            }, {
                x: 0,
                y: 0,
                z: 0
            }, 0);
            // Force dynamique, répulsion très faible
            const charge = fgRef.current.d3Force('charge');
            if (charge) charge.strength(-Math.max(2, 8 - n));
            const collide = fgRef.current.d3Force('collide');
            if (collide) {
                collide.strength(1);
                collide.radius(Math.max(2, 8 - n));
            }
        }
    }["FocusGraph.useEffect"], [
        graphData
    ]);
    // Caret clignotant : toggle toutes les 300ms, sans toucher au graph
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FocusGraph.useEffect": ()=>{
            const interval = setInterval({
                "FocusGraph.useEffect.interval": ()=>{
                    setCaretVisible({
                        "FocusGraph.useEffect.interval": (v)=>!v
                    }["FocusGraph.useEffect.interval"]);
                }
            }["FocusGraph.useEffect.interval"], 300);
            return ({
                "FocusGraph.useEffect": ()=>clearInterval(interval)
            })["FocusGraph.useEffect"];
        }
    }["FocusGraph.useEffect"], []);
    // Fermer le profil si on clique dans le vide
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FocusGraph.useEffect": ()=>{
            function handleClick(e) {
                // Si le clic n'est pas dans le profil ni sur un node
                if (!e.target.closest('.profile-popup')) setSelectedNode(null);
            }
            window.addEventListener('mousedown', handleClick);
            return ({
                "FocusGraph.useEffect": ()=>window.removeEventListener('mousedown', handleClick)
            })["FocusGraph.useEffect"];
        }
    }["FocusGraph.useEffect"], []);
    // Custom node: point + nom gros + caret clignotant noir UNIQUEMENT sur le node courant (toujours, même hors édition)
    function nodeThreeObject(node) {
        const isMe = node.id === myNodeId;
        const isEditing = editingId === node.id;
        const canvas = document.createElement("canvas");
        canvas.width = 520;
        canvas.height = 160;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(40, 60, 28, 0, 2 * Math.PI);
        ctx.fillStyle = isMe ? "#e22" : "#111";
        ctx.shadowColor = '#888';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.font = "bold 54px Menlo, monospace";
        ctx.fillStyle = "#111";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const label = isEditing ? editValue : node.label || node.pseudo || node.id;
        ctx.fillText(`/user/${label}`, 90, 64);
        // Caret clignotant noir UNIQUEMENT sur le node courant (toujours)
        if (isMe && caretVisible) {
            const textWidth = ctx.measureText(`/user/${label}`).width;
            ctx.fillStyle = '#111';
            ctx.fillRect(90 + textWidth + 6, 35, 4, 58);
        }
        // Affiche/édite les mots-clés sous le pseudo (grosse ligne)
        const keywords = node.keywords || [];
        ctx.font = "32px Menlo, monospace";
        let x = 90;
        const y = 120;
        // Affichage des mots-clés séparés par des virgules
        keywords.forEach((kw, i)=>{
            ctx.fillStyle = isMe ? "#e22" : "#444";
            ctx.fillText(`#${kw}${i < keywords.length - 1 ? ',' : ''}`, x, y);
            // Croix de suppression si c'est moi (affichage visuel seulement)
            if (isMe) {
                ctx.save();
                ctx.strokeStyle = "#e22";
                ctx.lineWidth = 3;
                const crossX = x + ctx.measureText(`#${kw}${i < keywords.length - 1 ? ',' : ''}`).width + 18;
                const crossY = y - 12;
                ctx.beginPath();
                ctx.moveTo(crossX, crossY);
                ctx.lineTo(crossX + 16, crossY + 24);
                ctx.moveTo(crossX + 16, crossY);
                ctx.lineTo(crossX, crossY + 24);
                ctx.stroke();
                ctx.restore();
            }
            x += ctx.measureText(`#${kw}${i < keywords.length - 1 ? ',' : ''}`).width + (isMe ? 50 : 36);
        });
        // Champ d'ajout si c'est moi et <3 keywords (affichage visuel seulement)
        if (isMe && keywords.length < 3) {
            ctx.fillStyle = "#aaa";
            ctx.fillText("+ mot-clé", x, y);
        }
        const texture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](canvas);
        const material = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SpriteMaterial"]({
            map: texture
        });
        const sprite = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sprite"](material);
        sprite.scale.set(22, 7, 1);
        return sprite;
    }
    function handleNodeClick(node) {
        if (node.id === myNodeId) {
            setEditingId(node.id);
            setEditValue(node.label || node.pseudo || node.id);
            setSelectedNode(null); // Pas de popup pour soi
            setKeywordEdit("");
        } else {
            setSelectedNode(node); // Popup pour les autres
            setEditingId(null);
        }
    }
    // Edition du pseudo sur clic (uniquement sur son node)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FocusGraph.useEffect": ()=>{
            if (!editingId || !fgRef.current) return;
            function onKeyDown(e) {
                if (e.key === "Enter") handleInputBlurOrEnter();
                else if (e.key === "Escape") setEditingId(null);
                else if (e.key.length === 1) setEditValue({
                    "FocusGraph.useEffect.onKeyDown": (v)=>v + e.key
                }["FocusGraph.useEffect.onKeyDown"]);
                else if (e.key === "Backspace") setEditValue({
                    "FocusGraph.useEffect.onKeyDown": (v)=>v.slice(0, -1)
                }["FocusGraph.useEffect.onKeyDown"]);
            }
            window.addEventListener("keydown", onKeyDown);
            return ({
                "FocusGraph.useEffect": ()=>window.removeEventListener("keydown", onKeyDown)
            })["FocusGraph.useEffect"];
        }
    }["FocusGraph.useEffect"], [
        editingId,
        editValue
    ]);
    async function handleInputBlurOrEnter() {
        if (editingId !== null) {
            // Save to API
            try {
                await fetch(`/api/users/${editingId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        pseudo: editValue
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (e) {
            // Optionally handle error
            }
            setGraphData((gd)=>({
                    ...gd,
                    nodes: gd.nodes.map((n)=>n.id === editingId ? {
                            ...n,
                            label: editValue
                        } : n)
                }));
            setEditingId(null);
        }
    }
    // Keywords helpers
    function getKeywords(node) {
        return node.keywords || [];
    }
    async function handleKeywordAdd() {
        if (!keywordEdit.trim() || !selectedNode) return;
        const newKeywords = [
            ...getKeywords(selectedNode),
            keywordEdit.trim()
        ].slice(0, 3);
        try {
            await fetch(`/api/users/${selectedNode.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    keywords: newKeywords
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch  {}
        setGraphData((gd)=>({
                ...gd,
                nodes: gd.nodes.map((n)=>n.id === selectedNode.id ? {
                        ...n,
                        keywords: newKeywords
                    } : n)
            }));
        setKeywordEdit("");
    }
    async function handleKeywordRemove(idx) {
        if (!selectedNode) return;
        const newKeywords = (getKeywords(selectedNode) || []).filter((_, i)=>i !== idx);
        try {
            await fetch(`/api/users/${selectedNode.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    keywords: newKeywords
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch  {}
        setGraphData((gd)=>({
                ...gd,
                nodes: gd.nodes.map((n)=>n.id === selectedNode.id ? {
                        ...n,
                        keywords: newKeywords
                    } : n)
            }));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$force$2d$graph$2d$3d$2f$dist$2f$react$2d$force$2d$graph$2d$3d$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    ref: fgRef,
                    graphData: graphData,
                    nodeAutoColorBy: "group",
                    onNodeClick: handleNodeClick,
                    nodeThreeObject: nodeThreeObject,
                    backgroundColor: "rgba(0,0,0,0)",
                    width: dimensions.width,
                    height: dimensions.height
                }, void 0, false, {
                    fileName: "[project]/app/components/FocusGraph.tsx",
                    lineNumber: 243,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FocusGraph.tsx",
                lineNumber: 242,
                columnNumber: 13
            }, this),
            selectedNode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "profile-popup",
                style: {
                    position: 'fixed',
                    left: 16,
                    bottom: 16,
                    width: 320,
                    minHeight: 120,
                    background: 'rgba(255,255,255,0.98)',
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    zIndex: 1001,
                    padding: '28px 24px',
                    fontFamily: 'Menlo, monospace',
                    fontSize: 22,
                    color: '#111',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 700,
                            marginBottom: 12,
                            fontSize: 26
                        },
                        children: [
                            "/user/",
                            selectedNode.label || selectedNode.pseudo || selectedNode.id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FocusGraph.tsx",
                        lineNumber: 277,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 8,
                            fontSize: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600,
                                    fontSize: 20,
                                    marginRight: 10
                                },
                                children: "mots-clés :"
                            }, void 0, false, {
                                fileName: "[project]/app/components/FocusGraph.tsx",
                                lineNumber: 279,
                                columnNumber: 25
                            }, this),
                            getKeywords(selectedNode).map((kw, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        display: 'inline-block',
                                        background: '#eee',
                                        color: '#111',
                                        borderRadius: 8,
                                        padding: '4px 16px',
                                        marginRight: i < getKeywords(selectedNode).length - 1 ? 2 : 10,
                                        marginBottom: 2,
                                        fontSize: 20,
                                        fontWeight: 600,
                                        cursor: selectedNode.id === myNodeId ? 'pointer' : 'default'
                                    },
                                    onClick: selectedNode.id === myNodeId ? ()=>handleKeywordRemove(i) : undefined,
                                    children: [
                                        kw,
                                        i < getKeywords(selectedNode).length - 1 ? ',' : ''
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/components/FocusGraph.tsx",
                                    lineNumber: 281,
                                    columnNumber: 29
                                }, this)),
                            selectedNode.id === myNodeId && getKeywords(selectedNode).length < 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: keywordEdit,
                                        onChange: (e)=>setKeywordEdit(e.target.value),
                                        onKeyDown: (e)=>{
                                            if (e.key === 'Enter') handleKeywordAdd();
                                        },
                                        style: {
                                            fontFamily: 'Menlo',
                                            fontSize: 20,
                                            border: 'none',
                                            outline: 'none',
                                            background: 'none',
                                            borderBottom: '2px solid #111',
                                            marginLeft: 8,
                                            width: 90
                                        },
                                        maxLength: 16,
                                        placeholder: "+ keyword"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/FocusGraph.tsx",
                                        lineNumber: 298,
                                        columnNumber: 33
                                    }, this),
                                    caretVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            borderLeft: '2.5px solid #111',
                                            height: 24,
                                            marginLeft: -2
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/FocusGraph.tsx",
                                        lineNumber: 315,
                                        columnNumber: 50
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FocusGraph.tsx",
                        lineNumber: 278,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FocusGraph.tsx",
                lineNumber: 256,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true);
}
_s(FocusGraph, "18jV7uuu4B/WDnFDkoJapqMmRY4=");
_c = FocusGraph;
const __TURBOPACK__default__export__ = FocusGraph;
var _c;
__turbopack_context__.k.register(_c, "FocusGraph");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/FocusGraph.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/components/FocusGraph.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=app_components_FocusGraph_tsx_4af8fcd6._.js.map