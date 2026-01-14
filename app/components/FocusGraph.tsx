"use client"

import {useEffect, useRef, useState} from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";

function FocusGraph({data, userIp}) {
    const fgRef = useRef<ForceGraphMethods>(null);
    const [graphData, setGraphData] = useState({nodes: [], links: []});
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [caretVisible, setCaretVisible] = useState(true);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [selectedNode, setSelectedNode] = useState(null);
    // Keywords state local pour édition (pour ton node)
    const [keywordEdit, setKeywordEdit] = useState("");

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
        const label = isEditing ? editValue : (node.label || node.pseudo || node.id);
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
        keywords.forEach((kw, i) => {
            ctx.fillStyle = isMe ? "#e22" : "#444";
            ctx.fillText(`#${kw}`, x, y);
            // Croix de suppression si c'est moi (affichage visuel seulement)
            if (isMe) {
                ctx.save();
                ctx.strokeStyle = "#e22";
                ctx.lineWidth = 3;
                const crossX = x + ctx.measureText(`#${kw}`).width + 18;
                const crossY = y - 12;
                ctx.beginPath();
                ctx.moveTo(crossX, crossY);
                ctx.lineTo(crossX + 16, crossY + 24);
                ctx.moveTo(crossX + 16, crossY);
                ctx.lineTo(crossX, crossY + 24);
                ctx.stroke();
                ctx.restore();
            }
            x += ctx.measureText(`#${kw}`).width + (isMe ? 50 : 36);
        });
        // Champ d'ajout si c'est moi et <3 keywords (affichage visuel seulement)
        if (isMe && keywords.length < 3) {
            ctx.fillStyle = "#aaa";
            ctx.fillText("+ mot-clé", x, y);
        }
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({map: texture});
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(22, 7, 1);
        return sprite;
    }

    function handleNodeClick(node) {
        setSelectedNode(node);
        if (node.id === myNodeId) {
            setEditingId(node.id);
            setEditValue(node.label || node.pseudo || node.id);
            setKeywordEdit("");
        } else {
            setEditingId(null);
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
        return node.keywords || [];
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

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'auto' }}>
                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    nodeAutoColorBy="group"
                    onNodeClick={handleNodeClick}
                    nodeThreeObject={nodeThreeObject}
                    backgroundColor="rgba(0,0,0,0)"
                    width={dimensions.width}
                    height={dimensions.height}
                />
            </div>
            {/* Ajoute le popup d'édition sous le pseudo */}
            {selectedNode && (
                <div
                    className="profile-popup"
                    style={{
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
                        alignItems: 'flex-start',
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 26 }}>/user/{selectedNode.label || selectedNode.pseudo || selectedNode.id}</div>
                    <div style={{ marginBottom: 8, fontSize: 20 }}>
                        <span style={{ fontWeight: 600, fontSize: 20, marginRight: 10 }}>mots-clés :</span>
                        {getKeywords(selectedNode).map((kw, i) => (
                            <span key={i} style={{
                                display: 'inline-block',
                                background: '#eee',
                                color: '#111',
                                borderRadius: 8,
                                padding: '4px 16px',
                                marginRight: 10,
                                marginBottom: 2,
                                fontSize: 20,
                                fontWeight: 600,
                                cursor: selectedNode.id === myNodeId ? 'pointer' : 'default'
                            }}
                            onClick={selectedNode.id === myNodeId ? () => handleKeywordRemove(i) : undefined}
                            >{kw}</span>
                        ))}
                        {selectedNode.id === myNodeId && getKeywords(selectedNode).length < 3 && (
                            <>
                                <input
                                    value={keywordEdit}
                                    onChange={e => setKeywordEdit(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleKeywordAdd(); }}
                                    style={{
                                        fontFamily: 'Menlo',
                                        fontSize: 20,
                                        border: 'none',
                                        outline: 'none',
                                        background: 'none',
                                        borderBottom: '2px solid #111',
                                        marginLeft: 8,
                                        width: 90
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
        </>
    );
}

export default FocusGraph;
