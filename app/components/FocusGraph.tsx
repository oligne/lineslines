"use client"

import {useEffect, useRef, useState} from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";

function FocusGraph({data, userIp, onUserNodeClick}) {
    const fgRef = useRef<ForceGraphMethods>(null);
    const [graphData, setGraphData] = useState({nodes: [], links: []});
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [caretVisible, setCaretVisible] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [selectedNode, setSelectedNode] = useState(null);
    // Keywords state local pour édition (pour ton node)
    const [keywordEdit, setKeywordEdit] = useState("");
    // Fenêtre de personnalisation en bas à droite pour son propre point
    const [showCustomize, setShowCustomize] = useState(false);

    // Resize listener pour canvas plein écran
    useEffect(() => {
        function handleResize() {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Trouver l'id du node de l'utilisateur courant
    const myNodeId = graphData.nodes.find(n => n.ip === userIp)?.id;

    // Pas de position forcée : on laisse 3D ForceGraph placer les nodes
    useEffect(() => {
        try {
            let parsed = JSON.parse(data);
            setGraphData(parsed);
        } catch {
            setGraphData({nodes: [], links: []});
        }
    }, [data]);

    // Toujours cadrer tous les points à l'écran après chaque changement de graphData
    useEffect(() => {
        if (fgRef.current) {
            fgRef.current.zoomToFit(0, 10); // padding réduit à 10px
        }
    }, [graphData]);

    // Ajuste la force selon le nombre de nodes (encore plus dense)
    useEffect(() => {
        if (!fgRef.current) return;
        const n = graphData.nodes.length || 1;

        // Distance caméra dynamique, zoom plus fort si peu de points
        const z = Math.max(-100, Math.min(200, n * 25));
        fgRef.current.cameraPosition({ x: 0, y: 0, z }, { x: 0, y: 0, z: 0 }, 0);


        // Force dynamique, répulsion très faible
        const charge = fgRef.current.d3Force('charge');
        if (charge) charge.strength(-Math.max(2, 8 - n));
        const collide = fgRef.current.d3Force('collide');
        if (collide) {
            collide.strength(1);
            collide.radius(Math.max(2, 8 - n));
        }
    }, [graphData]);

    // Caret clignotant : toggle toutes les 300ms, sans toucher au graph
    useEffect(() => {
        const interval = setInterval(() => {
            setCaretVisible(v => !v);
        }, 300);
        return () => clearInterval(interval);
    }, []);

    // Fermer le profil si on clique dans le vide
    useEffect(() => {
        function handleClick(e) {
            // Si le clic n'est pas dans le profil ni sur un node
            if (!e.target.closest('.profile-popup')) setSelectedNode(null);
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

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
        const label = isEditing ? editValue : (node.label || node.pseudo || node.id);
        ctx.font = `bold ${fontSize}px Menlo, monospace`;
        let textWidth = ctx.measureText(`/user/${label}`).width;
        while (textWidth > 410 && fontSize > 24) { // 410px max for text, min font 24px
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
        let y = 120;
        const maxKeywordsWidth = 410;
        // Affichage des mots-clés séparés par des virgules, retour à la ligne si trop long
        keywords.forEach((kw, i) => {
            const kwText = `#${kw}${i < keywords.length - 1 ? ',' : ''}`;
            const kwWidth = ctx.measureText(kwText).width;
            if (x + kwWidth > 90 + maxKeywordsWidth) {
                x = 90;
                y += 36; // saute une ligne
            }
            ctx.fillStyle = isMe ? "#e22" : "#444";
            ctx.fillText(kwText, x, y);
            // Croix de suppression si c'est moi (affichage visuel seulement)
            if (isMe) {
                ctx.save();
                ctx.strokeStyle = "#e22";
                ctx.lineWidth = 3;
                const crossX = x + kwWidth + 18;
                const crossY = y - 12;
                ctx.beginPath();
                ctx.moveTo(crossX, crossY);
                ctx.lineTo(crossX + 16, crossY + 24);
                ctx.moveTo(crossX + 16, crossY);
                ctx.lineTo(crossX, crossY + 24);
                ctx.stroke();
                ctx.restore();
            }
            x += kwWidth + (isMe ? 50 : 36);
        });
        // Champ d'ajout si c'est moi et <3 keywords (affichage visuel seulement)
        if (isMe && keywords.length < 3) {
            if (x + ctx.measureText("+ mot-clé").width > 90 + maxKeywordsWidth) {
                x = 90;
                y += 36;
            }
            ctx.fillStyle = "#aaa";
            ctx.fillText("+ mot-clé", x, y);
        }
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({map: texture});
        material.transparent = true;
        material.alphaTest = 0.05;
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(22, 7, 1);
        sprite.center.set(40/520, 0.60); // centre du cercle, vertical ajusté
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
    useEffect(() => {
        if (!editingId || !fgRef.current) return;
        function onKeyDown(e) {
            if (e.key === "Enter") handleInputBlurOrEnter();
            else if (e.key === "Escape") setEditingId(null);
            else if (e.key.length === 1) setEditValue(v => v + e.key);
            else if (e.key === "Backspace") setEditValue(v => v.slice(0, -1));
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [editingId, editValue]);

    async function handleInputBlurOrEnter() {
        if (editingId !== null) {
            // Save to API
            try {
                await fetch(`/api/users/${editingId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ pseudo: editValue }),
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (e) {
                // Optionally handle error
            }
            setGraphData(gd => ({
                ...gd,
                nodes: gd.nodes.map(n => n.id === editingId ? {...n, label: editValue} : n)
            }));
            setEditingId(null);
        }
    }

    // Keywords helpers
    function getKeywords(node) {
        if (!node) return [];
        if (Array.isArray(node.keywords)) return node.keywords;
        if (typeof node.keywords === 'string') return node.keywords.split(',').map(k => k.trim()).filter(Boolean);
        return [];
    }
    async function handleKeywordAdd() {
        if (!keywordEdit.trim() || !selectedNode) return;
        const newKeywords = [...(getKeywords(selectedNode)), keywordEdit.trim()].slice(0, 3);
        try {
            await fetch(`/api/users/${selectedNode.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ keywords: newKeywords }),
                headers: { 'Content-Type': 'application/json' },
            });
        } catch {}
        setGraphData(gd => ({
            ...gd,
            nodes: gd.nodes.map(n =>
                n.id === selectedNode.id
                    ? { ...n, keywords: newKeywords }
                    : n
            )
        }));
        setKeywordEdit("");
    }
    async function handleKeywordRemove(idx) {
        if (!selectedNode) return;
        const newKeywords = (getKeywords(selectedNode) || []).filter((_, i) => i !== idx);
        try {
            await fetch(`/api/users/${selectedNode.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ keywords: newKeywords }),
                headers: { 'Content-Type': 'application/json' },
            });
        } catch {}
        setGraphData(gd => ({
            ...gd,
            nodes: gd.nodes.map(n =>
                n.id === selectedNode.id
                    ? { ...n, keywords: newKeywords }
                    : n
            )
        }));
    }

    // Ajoute ces deux fonctions dans le composant :
    function handleKeywordAddCustom() {
        const meNode = graphData.nodes.find(n => n.id === myNodeId);
        if (!keywordEdit.trim() || !meNode) return;
        const newKeywords = [...(getKeywords(meNode)), keywordEdit.trim()].slice(0, 3);
        fetch(`/api/users/${myNodeId}`, {
            method: 'PATCH',
            body: JSON.stringify({ keywords: newKeywords }),
            headers: { 'Content-Type': 'application/json' },
        }).then(() => {
            setGraphData(gd => ({
                ...gd,
                nodes: gd.nodes.map(n => n.id === myNodeId ? { ...n, keywords: newKeywords } : n)
            }));
            setKeywordEdit("");
        });
    }
    function handleKeywordRemoveCustom(idx) {
        const meNode = graphData.nodes.find(n => n.id === myNodeId);
        if (!meNode) return;
        const newKeywords = (getKeywords(meNode) || []).filter((_, i) => i !== idx);
        fetch(`/api/users/${myNodeId}`, {
            method: 'PATCH',
            body: JSON.stringify({ keywords: newKeywords }),
            headers: { 'Content-Type': 'application/json' },
        }).then(() => {
            setGraphData(gd => ({
                ...gd,
                nodes: gd.nodes.map(n => n.id === myNodeId ? { ...n, keywords: newKeywords } : n)
            }));
        });
    }

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'auto' }}>
                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    nodeAutoColorBy="group"
                    onNodeClick={handleNodeClick}
                    nodeThreeObject={nodeThreeObject}
                    linkColor={() => '#111'}
                    linkOpacity={0.95}
                    linkWidth={0.1}
                    backgroundColor="rgba(0,0,0,0)"
                    width={dimensions.width}
                    height={dimensions.height}
                />
            </div>
            {/* Popup classique pour les autres nodes uniquement */}
            {selectedNode && (
                <div
                    className="profile-popup"
                    style={{
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
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 24 }}>/user/{selectedNode.label || selectedNode.pseudo || selectedNode.id}</div>
                    <div style={{ marginBottom: 30, fontSize: 18, width: '100%' }}>
                        <span style={{ fontWeight: 600, fontSize: 18, marginRight: 10 }}>mots-clés :</span>
                        {getKeywords(selectedNode).map((kw, i) => (
                            <span key={i} style={{
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
                                boxSizing: 'border-box',
                            }}
                            onClick={selectedNode.id === myNodeId ? () => handleKeywordRemove(i) : undefined}
                            >{kw}{i < getKeywords(selectedNode).length - 1 ? ',' : ''}</span>
                        ))}
                        {selectedNode.id === myNodeId && getKeywords(selectedNode).length < 3 && (
                            <>
                                <input
                                    value={keywordEdit}
                                    onChange={e => setKeywordEdit(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleKeywordAdd(); }}
                                    style={{
                                        fontFamily: 'Menlo',
                                        fontSize: 18,
                                        border: 'none',
                                        outline: 'none',
                                        background: 'none',
                                        borderBottom: '2px solid #111',
                                        marginLeft: 8,
                                        width: 90,
                                        boxSizing: 'border-box',
                                    }}
                                    maxLength={16}
                                    placeholder="+ keyword"
                                />
                                {caretVisible && <span style={{ borderLeft: '2.5px solid #111', height: 24, marginLeft: -2 }} />}
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* Bouton rond noir (photo profil) en bas à droite, toujours visible si c'est moi */}
            {myNodeId && (
                <button
                    onClick={() => setShowCustomize(v => !v)}
                    style={{
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
                    }}
                    title="Personnaliser mon point"
                >
                    {/* Smiley ou icône profil */}
                    <span style={{ color: '#fff', fontSize: 20, fontFamily: 'Menlo' }}>😶‍🌫️</span>
                </button>
            )}
            {/* Fenêtre profil perso, décalée à gauche du rond noir */}
            {showCustomize && (
                <div
                    className="customize-popup"
                    style={{
                        position: 'fixed',
                        right: 90,
                        bottom: 32,
                        width: 320,
                        minWidth: 320,
                        maxWidth: 320,
                        minHeight: 120,
                        background: 'rgba(255,255,255,0.98)',
                        borderRadius: 16,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        zIndex: 1099,
                        padding: '28px 24px',
                        fontFamily: 'Menlo, monospace',
                        fontSize: 20,
                        color: '#111',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        boxSizing: 'border-box',
                        gap: 0
                    }}
                >
                    {/* Ligne pseudo */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, width: '100%' }}>
                        <span style={{ fontWeight: 700, fontSize: 20, marginRight: 0 }}>&gt; USER/</span>
                        <input
                            value={editValue}
                            onChange={e => {
                                setEditValue(e.target.value);
                                if (editingId !== null) {
                                    setGraphData(gd => ({
                                        ...gd,
                                        nodes: gd.nodes.map(n => n.id === editingId ? { ...n, label: e.target.value } : n)
                                    }));
                                }
                            }}
                            onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); }}
                            style={{
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
                                boxSizing: 'border-box',
                            }}
                            maxLength={24}
                        />
                        {caretVisible && <span style={{ borderLeft: '2px solid #111', height: 20, marginLeft: -2 }} />}
                    </div>
                    {/* Mots-clés avec caret, style sobre et compact */}
                    <div style={{ width: '100%', marginBottom: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0 }}>
                        {getKeywords({ id: myNodeId, ...graphData.nodes.find(n => n.id === myNodeId) }).map((kw, i, arr) => (
                            <span key={i} style={{
                                color: '#888',
                                fontSize: 16,
                                fontWeight: 600,
                                marginRight: i < arr.length - 1 ? 2 : 0,
                                cursor: 'pointer',
                                borderBottom: '1.5px solid #eee',
                                marginBottom: 2,
                                padding: '0 2px',
                                boxSizing: 'border-box',
                            }}
                            onClick={() => handleKeywordRemoveCustom(i)}
                            >{kw}{i < arr.length - 1 ? ',' : ''}</span>
                        ))}
                        {getKeywords({ id: myNodeId, ...graphData.nodes.find(n => n.id === myNodeId) }).length < 3 && (
                            <>
                                <input
                                    value={keywordEdit}
                                    onChange={e => setKeywordEdit(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleKeywordAddCustom(); }}
                                    style={{
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
                                        boxSizing: 'border-box',
                                    }}
                                    maxLength={16}
                                    placeholder="+ mot-clé"
                                />
                                {caretVisible && <span style={{ borderLeft: '1.5px solid #bbb', height: 14, marginLeft: -2 }} />}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default FocusGraph;
