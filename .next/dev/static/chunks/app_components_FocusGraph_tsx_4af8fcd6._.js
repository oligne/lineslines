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
function FocusGraph({ data, userIp, onUserNodeClick }) {
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
    // Fenêtre de personnalisation en bas à droite pour son propre point
    const [showCustomize, setShowCustomize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
        // Fond transparent (pas de fillRect blanc)
        // ctx.fillStyle = "rgba(255,255,255,1)"; // supprimé
        // ctx.fillRect(0, 0, canvas.width, canvas.height); // supprimé
        // Décalage horizontal pour aligner le point avec le lien
        const decal = 20;
        ctx.beginPath();
        ctx.arc(40, 60, 28, 0, 2 * Math.PI); // cercle centré
        ctx.fillStyle = isMe ? "#e22" : "#111";
        ctx.shadowColor = '#888';
        ctx.shadowBlur = 8;
        ctx.fill();
        // --- PSEUDO: font size auto-fit ---
        let fontSize = 54;
        const label = isEditing ? editValue : node.label || node.pseudo || node.id;
        ctx.font = `bold ${fontSize}px Menlo, monospace`;
        let textWidth = ctx.measureText(`/user/${label}`).width;
        while(textWidth > 410 && fontSize > 24){
            fontSize -= 2;
            ctx.font = `bold ${fontSize}px Menlo, monospace`;
            textWidth = ctx.measureText(`/user/${label}`).width;
        }
        ctx.fillStyle = "#111";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`/user/${label}`, 90, 64);
        // Caret clignotant noir UNIQUEMENT sur le node courant (toujours)
        if (isMe && caretVisible) {
            const caretTextWidth = ctx.measureText(`/user/${label}`).width;
            ctx.fillStyle = '#111';
            ctx.fillRect(90 + caretTextWidth + 6, 35, 4, 58);
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
        material.transparent = true;
        material.alphaTest = 0.05;
        const sprite = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sprite"](material);
        sprite.scale.set(22, 7, 1);
        sprite.center.set(40 / 520, 0.60); // centre du cercle, vertical ajusté
        return sprite;
    }
    function handleNodeClick(node) {
        if (node.ip === userIp) {
            setEditingId(node.id);
            setEditValue(node.label || node.pseudo || node.id);
            setSelectedNode(null); // Masque le popup classique
            setKeywordEdit("");
            setShowCustomize(true); // Affiche la fenêtre profil perso
        } else {
            setEditingId(null);
            setSelectedNode(null);
            setShowCustomize(false);
            if (onUserNodeClick) onUserNodeClick(node);
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
                    linkColor: ()=>'#111',
                    linkOpacity: 0.95,
                    linkWidth: 0.1,
                    backgroundColor: "rgba(0,0,0,0)",
                    width: dimensions.width,
                    height: dimensions.height
                }, void 0, false, {
                    fileName: "[project]/app/components/FocusGraph.tsx",
                    lineNumber: 264,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FocusGraph.tsx",
                lineNumber: 263,
                columnNumber: 13
            }, this),
            selectedNode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "profile-popup",
                style: {
                    position: 'fixed',
                    top: 30,
                    left: 12,
                    width: 320,
                    minWidth: 320,
                    maxWidth: 320,
                    minHeight: 120,
                    background: 'rgba(255,255,255,0.98)',
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    zIndex: 1001,
                    padding: '28px 24px',
                    fontFamily: 'Menlo, monospace',
                    fontSize: 20,
                    color: '#111',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    boxSizing: 'border-box',
                    gap: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 700,
                            marginBottom: 12,
                            fontSize: 24
                        },
                        children: [
                            "/user/",
                            selectedNode.label || selectedNode.pseudo || selectedNode.id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FocusGraph.tsx",
                        lineNumber: 305,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 30,
                            fontSize: 18,
                            width: '100%'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600,
                                    fontSize: 18,
                                    marginRight: 10
                                },
                                children: "mots-clés :"
                            }, void 0, false, {
                                fileName: "[project]/app/components/FocusGraph.tsx",
                                lineNumber: 307,
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
                                        fontSize: 18,
                                        fontWeight: 600,
                                        cursor: selectedNode.id === myNodeId ? 'pointer' : 'default',
                                        boxSizing: 'border-box'
                                    },
                                    onClick: selectedNode.id === myNodeId ? ()=>handleKeywordRemove(i) : undefined,
                                    children: [
                                        kw,
                                        i < getKeywords(selectedNode).length - 1 ? ',' : ''
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/components/FocusGraph.tsx",
                                    lineNumber: 309,
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
                                            fontSize: 18,
                                            border: 'none',
                                            outline: 'none',
                                            background: 'none',
                                            borderBottom: '2px solid #111',
                                            marginLeft: 8,
                                            width: 90,
                                            boxSizing: 'border-box'
                                        },
                                        maxLength: 16,
                                        placeholder: "+ keyword"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/FocusGraph.tsx",
                                        lineNumber: 327,
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
                                        lineNumber: 345,
                                        columnNumber: 50
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FocusGraph.tsx",
                        lineNumber: 306,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FocusGraph.tsx",
                lineNumber: 280,
                columnNumber: 17
            }, this),
            myNodeId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowCustomize((v)=>!v),
                style: {
                    position: 'fixed',
                    right: 24,
                    bottom: 24,
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: '#111',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    zIndex: 1100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0
                },
                title: "Personnaliser mon point",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        color: '#fff',
                        fontSize: 20,
                        fontFamily: 'Menlo'
                    },
                    children: "😶‍🌫️"
                }, void 0, false, {
                    fileName: "[project]/app/components/FocusGraph.tsx",
                    lineNumber: 375,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/FocusGraph.tsx",
                lineNumber: 353,
                columnNumber: 17
            }, this),
            showCustomize && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "customize-popup",
                style: {
                    position: 'fixed',
                    right: 90,
                    bottom: 32,
                    width: 258,
                    minHeight: 200,
                    background: 'rgba(255,255,255,0.98)',
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    zIndex: 1099,
                    padding: '28px 24px',
                    fontFamily: 'Menlo, monospace',
                    fontSize: 10,
                    color: '#111',
                    //display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    boxSizing: 'border-box',
                    gap: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 8,
                            width: '100%'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 700,
                                    fontSize: 20,
                                    marginRight: 8
                                },
                                children: "> USER/"
                            }, void 0, false, {
                                fileName: "[project]/app/components/FocusGraph.tsx",
                                lineNumber: 405,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: editValue,
                                onChange: (e)=>{
                                    setEditValue(e.target.value);
                                    if (editingId !== null) {
                                        setGraphData((gd)=>({
                                                ...gd,
                                                nodes: gd.nodes.map((n)=>n.id === editingId ? {
                                                        ...n,
                                                        label: e.target.value
                                                    } : n)
                                            }));
                                    }
                                },
                                onKeyDown: (e)=>{
                                    if (e.key === 'Enter') handleInputBlurOrEnter();
                                },
                                style: {
                                    fontFamily: 'Menlo',
                                    fontWeight: 600,
                                    fontSize: 20,
                                    border: 'none',
                                    outline: 'none',
                                    background: 'none',
                                    borderBottom: '2px solid #111',
                                    color: '#111',
                                    width: 110,
                                    marginRight: 2,
                                    padding: 0,
                                    lineHeight: 1.1,
                                    boxSizing: 'border-box'
                                },
                                maxLength: 24
                            }, void 0, false, {
                                fileName: "[project]/app/components/FocusGraph.tsx",
                                lineNumber: 406,
                                columnNumber: 25
                            }, this),
                            caretVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    borderLeft: '2px solid #111',
                                    height: 20,
                                    marginLeft: -2
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/FocusGraph.tsx",
                                lineNumber: 435,
                                columnNumber: 42
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FocusGraph.tsx",
                        lineNumber: 404,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '100%',
                            marginBottom: 2,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 0
                        },
                        children: [
                            getKeywords({
                                id: myNodeId,
                                ...graphData.nodes.find((n)=>n.id === myNodeId)
                            }).map((kw, i, arr)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#888',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        marginRight: i < arr.length - 1 ? 2 : 0,
                                        cursor: 'pointer',
                                        borderBottom: '1.5px solid #eee',
                                        marginBottom: 2,
                                        padding: '0 2px',
                                        boxSizing: 'border-box'
                                    },
                                    onClick: ()=>handleKeywordRemove(i),
                                    children: [
                                        kw,
                                        i < arr.length - 1 ? ',' : ''
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/components/FocusGraph.tsx",
                                    lineNumber: 440,
                                    columnNumber: 29
                                }, this)),
                            getKeywords({
                                id: myNodeId,
                                ...graphData.nodes.find((n)=>n.id === myNodeId)
                            }).length < 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: keywordEdit,
                                        onChange: (e)=>setKeywordEdit(e.target.value),
                                        onKeyDown: (e)=>{
                                            if (e.key === 'Enter') handleKeywordAdd();
                                        },
                                        style: {
                                            fontFamily: 'Menlo',
                                            fontSize: 16,
                                            border: 'none',
                                            outline: 'none',
                                            background: 'none',
                                            borderBottom: '1.5px solid #bbb',
                                            color: '#bbb',
                                            width: 80,
                                            marginLeft: 2,
                                            padding: 0,
                                            marginBottom: 2,
                                            boxSizing: 'border-box'
                                        },
                                        maxLength: 16,
                                        placeholder: "+ mot-clé"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/FocusGraph.tsx",
                                        lineNumber: 456,
                                        columnNumber: 33
                                    }, this),
                                    caretVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            borderLeft: '1.5px solid #bbb',
                                            height: 14,
                                            marginLeft: -2
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/FocusGraph.tsx",
                                        lineNumber: 477,
                                        columnNumber: 50
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/FocusGraph.tsx",
                        lineNumber: 438,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/FocusGraph.tsx",
                lineNumber: 380,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true);
}
_s(FocusGraph, "71cQWD+wXqVOtJZojjKJems3tsY=");
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