"use client"

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";
import personaliserIcon from '../assets/icons/personaliser.png';
import eye1 from '../assets/face/eyes/eye1.png';
import eye2 from '../assets/face/eyes/eye2.png';
import eye3 from '../assets/face/eyes/eye3.png';
import eye4 from '../assets/face/eyes/eye4.png';
import eye5 from '../assets/face/eyes/eye5.png';
import mouth1 from '../assets/face/mouse/mouse1.png';
import mouth2 from '../assets/face/mouse/mouse2.png';
import mouth3 from '../assets/face/mouse/mouse3.png';
import mouth4 from '../assets/face/mouse/mouse4.png';
import mouth5 from '../assets/face/mouse/mouse5.png';
// Ajoute une image "pas d'œil" et "pas de bouche" (index 0 = rien)
import eyeNone from '../assets/face/eyes/none.png';
import mouthNone from '../assets/face/mouse/none.png';

// Chargement dynamique compatible Next.js/TypeScript
const eyesImages = [eyeNone, eye1, eye2, eye3, eye4, eye5];
const mouthImages = [mouthNone, mouth1, mouth2, mouth3, mouth4, mouth5];

function FocusGraph({data, userIp, onUserNodeClick, onGraphUpdate}) {
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
    // Supprime l'état showMiniCustomize et la palette
    // Ajoute l'état pour la personnalisation
    const [custom, setCustom] = useState({ eye: 0, mouth: 0, eye_x: 0, eye_y: 0, mouth_x: 0, mouth_y: 0, eye_scale: 1, mouth_scale: 1 });
    const [customDraft, setCustomDraft] = useState({ eye: 0, mouth: 0, eye_x: 0, eye_y: 0, mouth_x: 0, mouth_y: 0, eye_scale: 1, mouth_scale: 1 });
    const [showMiniCustomize, setShowMiniCustomize] = useState(false);
    // Ajoute l'état pour la sélection de la partie à déplacer
    const [selectedPart, setSelectedPart] = useState('eye');
    const [faceSize, setFaceSize] = useState(120); // taille du visage (min 60, max 120)

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
        if (charge) charge.strength(-Math.max(3, 5 - n));
        const collide = fgRef.current.d3Force('collide');
        if (collide) {
            collide.strength(1.2);
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
            // Ne ferme le profil que si clic hors .profile-popup ET hors .mini-customize-popup ET hors .customize-arrow-btn (flèches et labels)
            if (
                !e.target.closest('.profile-popup') &&
                !e.target.closest('.mini-customize-popup') &&
                !e.target.closest('.customize-arrow-btn')
            ) {
                setSelectedNode(null);
                setShowCustomize(false);
                setShowMiniCustomize(false);
            }
        }
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    // Charge la personnalisation au montage ou changement de myNodeId
    useEffect(() => {
        if (!myNodeId) return;
        fetch(`/api/customizations?user_id=${myNodeId}`)
            .then(r => r.json())
            .then(data => {
                const c = {
                    eye: data.eye || 0,
                    mouth: data.mouth || 0,
                    eye_x: data.eye_x || 0,
                    eye_y: data.eye_y || 0,
                    mouth_x: data.mouth_x || 0,
                    mouth_y: data.mouth_y || 0,
                    eye_scale: data.eye_scale || 1,
                    mouth_scale: data.mouth_scale || 1
                };
                setCustom(c);
                setCustomDraft(c);
            });
    }, [myNodeId]);

    // Custom node: point + nom gros + caret clignotant noir UNIQUEMENT sur le node courant (toujours, même hors édition)
    function nodeThreeObject(node) {
        // Récupère les données de customisation du node
        const eye = node.eye ?? 0;
        const mouth = node.mouth ?? 0;
        const eye_x = node.eye_x ?? 0;
        const eye_y = node.eye_y ?? 0;
        const mouth_x = node.mouth_x ?? 0;
        const mouth_y = node.mouth_y ?? 0;
        const eye_scale = node.eye_scale ?? 1;
        const mouth_scale = node.mouth_scale ?? 1;
        const isMe = node.id === myNodeId;
        const isEditing = editingId === node.id;
        // --- Nouvelle logique : tout basé sur faceSize pour correspondre à CustomFace ---
        const faceSize = 120;
        const canvas = document.createElement("canvas");
        canvas.width = 700;
        canvas.height = 160;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // --- Cercle de fond noir pur, sans ombre ni contour, centré comme dans CustomFace ---
        ctx.save();
        ctx.beginPath();
        ctx.arc(faceSize / 2, faceSize / 2, faceSize / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.restore();
        // --- Yeux ---
        const eyeIdx = typeof eye === 'number' && eye > 0 && eye < eyesImages.length ? eye : 0;
        const mouthIdx = typeof mouth === 'number' && mouth > 0 && mouth < mouthImages.length ? mouth : 0;
        const eyeX = typeof eye_x === 'number' ? eye_x : 0;
        const eyeY = typeof eye_y === 'number' ? eye_y : 0;
        const mouthX = typeof mouth_x === 'number' ? mouth_x : 0;
        const mouthY = typeof mouth_y === 'number' ? mouth_y : 0;
        const eyeScale = typeof eye_scale === 'number' ? eye_scale : 1;
        const mouthScale = typeof mouth_scale === 'number' ? mouth_scale : 1;
        // --- Image cache global pour éviter de recharger à chaque frame ---
        const imgCache = (window as any)._faceImgCache = (window as any)._faceImgCache || {};
        function getCachedImg(src) {
            if (!src) return null;
            if (!imgCache[src]) {
                const img = new window.Image();
                img.src = src;
                imgCache[src] = img;
            }
            return imgCache[src];
        }
        function drawImgCached(imgSrc, dx, dy, dw, dh) {
            return new Promise<void>(resolve => {
                const img = getCachedImg(imgSrc);
                if (!img) return resolve(undefined);
                if (img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, dx, dy, dw, dh);
                    resolve(undefined);
                } else {
                    img.onload = () => {
                        ctx.drawImage(img, dx, dy, dw, dh);
                        resolve(undefined);
                    };
                    img.onerror = () => resolve(undefined);
                }
            });
        }
        // --- Positionnement identique à CustomFace ---
        const eyeDrawX = faceSize * 0.3 + eyeX;
        const eyeDrawY = faceSize * 0.37 + eyeY;
        const eyeDrawW = faceSize * 0.4 * eyeScale;
        const eyeDrawH = faceSize * 0.18 * eyeScale;
        const mouthDrawX = faceSize * 0.3 + mouthX;
        const mouthDrawY = faceSize * 0.67 + mouthY;
        const mouthDrawW = faceSize * 0.4 * mouthScale;
        const mouthDrawH = faceSize * 0.18 * mouthScale;
        const promises = [];
        if (eyeIdx !== 0 && eyesImages[eyeIdx]?.src) {
            promises.push(drawImgCached(
                eyesImages[eyeIdx].src,
                eyeDrawX,
                eyeDrawY,
                eyeDrawW,
                eyeDrawH
            ));
        }
        if (mouthIdx !== 0 && mouthImages[mouthIdx]?.src) {
            promises.push(drawImgCached(
                mouthImages[mouthIdx].src,
                mouthDrawX,
                mouthDrawY,
                mouthDrawW,
                mouthDrawH
            ));
        }
        // --- PSEUDO: font size auto-fit, décalé à droite du visage ---
        let fontSize = 54;
        const label = isEditing ? editValue : (node.label || node.pseudo || node.id);
        ctx.font = `bold ${fontSize}px Menlo, monospace`;
        let textWidth = ctx.measureText(`/user/${label}`).width;
        while (textWidth > 590 && fontSize > 24) {
            fontSize -= 2;
            ctx.font = `bold ${fontSize}px Menlo, monospace`;
            textWidth = ctx.measureText(`/user/${label}`).width;
        }
        ctx.fillStyle = "#111";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`/user/${label}`, faceSize + 30, faceSize / 2);
        // Caret clignotant noir UNIQUEMENT sur le node courant (toujours)
        if (isMe && caretVisible) {
            const caretTextWidth = ctx.measureText(`/user/${label}`).width;
            ctx.fillStyle = '#111';
            ctx.fillRect(faceSize + 30 + caretTextWidth + 6, faceSize / 2 - 29, 4, 58);
        }
        // Affiche/édite les mots-clés sous le pseudo (grosse ligne)
        const keywords = node.keywords || [];
        ctx.font = "32px Menlo, monospace";
        let x = faceSize + 30;
        const y = faceSize / 2 + 56;
        keywords.forEach((kw, i) => {
            const kwText = `#${kw}${i < keywords.length - 1 ? ',' : ''}`;
            ctx.fillStyle = isMe ? "#e22" : "#444";
            ctx.fillText(kwText, x, y);
            x += ctx.measureText(kwText).width + (isMe ? 50 : 36);
        });
        // --- Prépare la texture et le sprite ---
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({map: texture});
        material.transparent = true;
        material.alphaTest = 0.05;
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(18, 4.5, 1); // taille intermédiaire pour un point bien visible
        sprite.center.set((faceSize/2)/canvas.width, (faceSize/2)/canvas.height);
        if (promises.length > 0) {
            Promise.all(promises).then(() => {
                texture.needsUpdate = true;
                if (sprite && sprite.material) {
                    sprite.material.needsUpdate = true;
                }
                // SUPPRIMÉ : ne jamais faire setGraphData ici !
            });
        }
        return sprite;
    }

    function handleNodeClick(node) {
        if (node.ip === userIp) {
            setEditingId(node.id);
            setEditValue(node.label || node.pseudo || node.id);
            setKeywordEdit("");
            setShowCustomize(true); // Affiche la fenêtre profil perso
            // setSelectedNode(null); // NE PAS fermer la popup profil perso
        } else {
            setEditingId(null);
            setSelectedNode(node); // Affiche la popup de l'autre user
            // NE PAS fermer la fenêtre profil perso !
            // setShowCustomize(false); // <-- supprimé pour garder la fenêtre profil ouverte
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
            try {
                await fetch(`/api/users/${editingId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ pseudo: editValue }),
                    headers: { 'Content-Type': 'application/json' },
                });
                if (onGraphUpdate) onGraphUpdate();
            } catch (e) {}
            setGraphData(gd => ({
                ...gd,
                nodes: gd.nodes.map(n => n.id === editingId ? {...n, label: editValue} : n)
            }));
            // --- Correction: synchronise selectedNode si c'est moi ---
            if (editingId === myNodeId) {
                setSelectedNode(prev => prev ? { ...prev, label: editValue } : prev);
            }
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
            if (onGraphUpdate) onGraphUpdate();
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
            if (onGraphUpdate) onGraphUpdate();
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
        setEditingId(null);
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
            setSelectedNode(prev => prev && prev.id === myNodeId ? { ...prev, keywords: newKeywords } : prev);
            setKeywordEdit("");
            if (onGraphUpdate) onGraphUpdate();
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
            setSelectedNode(prev => prev && prev.id === myNodeId ? { ...prev, keywords: newKeywords } : prev);
            if (onGraphUpdate) onGraphUpdate();
        });
    }

    // Ouvre la fenêtre de personnalisation depuis le profil
    function openCustomize() {
        // Recharge à chaque ouverture pour garantir la synchro avec Turso
        fetch(`/api/customizations?user_id=${myNodeId}`)
            .then(r => r.json())
            .then(data => {
                const c = {
                    eye: data.eye || 0,
                    mouth: data.mouth || 0,
                    eye_x: data.eye_x || 0,
                    eye_y: data.eye_y || 0,
                    mouth_x: data.mouth_x || 0,
                    mouth_y: data.mouth_y || 0,
                    eye_scale: data.eye_scale || 1,
                    mouth_scale: data.mouth_scale || 1
                };
                setCustom(c);
                setCustomDraft(c);
                setShowMiniCustomize(true);
            });
    }
    // Ferme sans enregistrer
    function closeCustomize() {
        setShowMiniCustomize(false);
    }
    // Enregistre la personnalisation
    function saveCustomize() {
        // Force les valeurs x/y à être des entiers
        setCustom(customDraft); // met à jour l'état principal
        const payload = {
            user_id: String(Math.round(myNodeId)),
            eye: customDraft.eye ?? 0,
            eye_x: Math.round(customDraft.eye_x ?? 0),
            eye_y: Math.round(customDraft.eye_y ?? 0),
            eye_scale: customDraft.eye_scale ?? 1, // bien envoyer la nouvelle scale
            mouth: customDraft.mouth ?? 0,
            mouth_x: Math.round(customDraft.mouth_x ?? 0),
            mouth_y: Math.round(customDraft.mouth_y ?? 0),
            mouth_scale: customDraft.mouth_scale ?? 1 // bien envoyer la nouvelle scale
        };
        fetch('/api/customizations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(async r => {
            await r.text();
            fetch(`/api/customizations?user_id=${myNodeId}`)
                .then(r => r.json())
                .then(data => {
                    const c = {
                        eye: data.eye ?? customDraft.eye,
                        mouth: data.mouth ?? customDraft.mouth,
                        eye_x: data.eye_x ?? customDraft.eye_x,
                        eye_y: data.eye_y ?? customDraft.eye_y,
                        mouth_x: data.mouth_x ?? customDraft.mouth_x,
                        mouth_y: data.mouth_y ?? customDraft.mouth_y,
                        eye_scale: data.eye_scale ?? customDraft.eye_scale, // priorité à la valeur reçue
                        mouth_scale: data.mouth_scale ?? customDraft.mouth_scale // priorité à la valeur reçue
                    };
                    setCustom(c); // met à jour le cercle en bas à droite
                    setCustomDraft(c); // met à jour la fenêtre de personnalisation
                });
        });
    }

    // Déplacement limité dans le cercle (max rayon 24px)
    function movePart(part, dx, dy) {
        setCustomDraft(prev => {
            let x = (prev[part + '_x'] || 0) + dx;
            let y = (prev[part + '_y'] || 0) + dy;
            // Limite au cercle de rayon 24px
            const r = Math.sqrt(x*x + y*y);
            if (r > 24) {
                x = (x / r) * 24;
                y = (y / r) * 24;
            }
            return { ...prev, [part + '_x']: x, [part + '_y']: y };
        });
    }

    // Change l’esthétique localement (draft)
    function handleChangeCustom(type, dir) {
        setCustomDraft(prev => {
            let max = type === 'eye' ? eyesImages.length : mouthImages.length;
            let next = ((prev[type] || 0) + dir + max) % max;
            return { ...prev, [type]: next };
        });
    }

    // Composant visage personnalisé
    function CustomFace({ eye, mouth, eye_x, eye_y, mouth_x, mouth_y, eye_scale, mouth_scale, size = 120 }) {
        // Sécurise les index et les valeurs
        const eyeIdx = typeof eye === 'number' && eye > 0 && eye < eyesImages.length ? eye : 0;
        const mouthIdx = typeof mouth === 'number' && mouth > 0 && mouth < mouthImages.length ? mouth : 0;
        const eyeX = typeof eye_x === 'number' ? eye_x : 0;
        const eyeY = typeof eye_y === 'number' ? eye_y : 0;
        const mouthX = typeof mouth_x === 'number' ? mouth_x : 0;
        const mouthY = typeof mouth_y === 'number' ? mouth_y : 0;
        const eyeScale = typeof eye_scale === 'number' ? eye_scale : 1;
        const mouthScale = typeof mouth_scale === 'number' ? mouth_scale : 1;
        return (
            <div style={{ position: 'relative', width: size, height: size, margin: 0, flexShrink: 0, transition: 'width 0.1s, height 0.1s' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: '50%', background: '#111', boxShadow: '0 2px 8px #8888', border: '2px solid #fff', zIndex: 1, transition: 'width 0.1s, height 0.1s' }} />
                {/* Eyes */}
                {eyeIdx !== 0 && eyesImages[eyeIdx]?.src ? (
                    <img src={eyesImages[eyeIdx].src} alt="eye" style={{ position: 'absolute', left: size * 0.3 + eyeX, top: size * 0.37 + eyeY, width: size * 0.4 * eyeScale, height: size * 0.18 * eyeScale, zIndex: 2, transition: 'left 0.1s, top 0.1s, width 0.1s, height 0.1s' }} />
                ) : eyeIdx !== 0 ? (
                    <div style={{position:'absolute',left:size*0.3,top:size*0.37,width:size*0.4,height:size*0.18,zIndex:2,background:'#e22',color:'#fff',fontWeight:900,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>?</div>
                ) : null}
                {/* Mouth */}
                {mouthIdx !== 0 && mouthImages[mouthIdx]?.src ? (
                    <img src={mouthImages[mouthIdx].src} alt="mouth" style={{ position: 'absolute', left: size * 0.3 + mouthX, top: size * 0.67 + mouthY, width: size * 0.4 * mouthScale, height: size * 0.18 * mouthScale, zIndex: 3, transition: 'left 0.1s, top 0.1s, width 0.1s, height 0.1s' }} />
                ) : mouthIdx !== 0 ? (
                    <div style={{position:'absolute',left:size*0.3,top:size*0.67,width:size*0.4,height:size*0.18,zIndex:3,background:'#e22',color:'#fff',fontWeight:900,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>?</div>
                ) : null}
            </div>
        );
    }

    // Fusionne la customisation dans le node courant avant le rendu du graph, mais seulement quand custom/myNodeId/graphData changent
    const mergedGraphData = useMemo(() => {
        // Force tous les ids à string pour nodes et links
        const nodes = graphData.nodes.map(n =>
            n.id === myNodeId
                ? { ...n, ...custom, id: String(n.id), fx: 0, fy: 0, fz: 0 } // force le node courant au centre
                : { ...n, id: String(n.id) }
        );
        const links = (graphData.links || []).map((l) => ({
            ...l,
            source: String(l.source),
            target: String(l.target)
        }));
        return {
            ...graphData,
            nodes,
            links
        };
    }, [graphData, custom, myNodeId]);

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'auto' }}>
                <ForceGraph3D
                    ref={fgRef}
                    graphData={mergedGraphData}
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
            {selectedNode && selectedNode.id !== myNodeId && (
                <div
                    className="profile-popup"
                    style={{
                        position: 'fixed',
                        top: 50, // décale de 20px vers le bas
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
                                cursor: 'default',
                                boxSizing: 'border-box',
                            }}
                            >{kw}{i < getKeywords(selectedNode).length - 1 ? ',' : ''}</span>
                        ))}
                    </div>
                </div>
            )}
            {/* Bouton rond noir (photo profil) en bas à droite, toujours visible si c'est moi */}
            {myNodeId && (
                <button
                    onClick={() => {
                        setSelectedNode(graphData.nodes.find(n => n.id === myNodeId));
                        setShowCustomize(true);
                    }}
                    style={{
                        position: 'fixed',
                        right: 24,
                        bottom: 24,
                        width: faceSize, // identique à la bulle de personnalisation
                        height: faceSize,
                        borderRadius: '50%',
                        background: 'transparent', // pour laisser CustomFace gérer le fond
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                        zIndex: 1100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                    }}
                    title="Profil perso"
                >
                    <CustomFace {...custom} size={faceSize} />
                </button>
            )}
            {/* Popup profil perso (avec bouton personnaliser) */}
            {showCustomize && myNodeId && selectedNode && selectedNode.id === myNodeId && (
                <div
                    className="profile-popup"
                    style={{
                        position: 'fixed',
                        right: 90,
                        bottom: 32,
                        width: 400,
                        minHeight: 240,
                        background: 'rgba(255,255,255,0.98)',
                        borderRadius: 16,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        zIndex: 1099,
                        padding: '36px 32px 24px 32px',
                        fontFamily: 'Menlo, monospace',
                        fontSize: 20,
                        color: '#111',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        boxSizing: 'border-box',
                        gap: 0,
                        justifyContent: 'flex-end',
                    }}
                >
                    {/* Pseudo éditable avec caret fin */}
                    <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 24, letterSpacing: 1, minHeight: 32, display: 'flex', alignItems: 'center' }}>
                        {editingId === myNodeId ? (
                            <input
                                autoFocus
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={handleInputBlurOrEnter}
                                onKeyDown={e => { if (e.key === 'Enter') handleInputBlurOrEnter(); if (e.key === 'Escape') setEditingId(null); }}
                                style={{
                                    fontWeight: 700,
                                    fontSize: 24,
                                    fontFamily: 'Menlo, monospace',
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    color: '#111',
                                    width: 220,
                                    padding: 0,
                                    margin: 0,
                                    letterSpacing: 1
                                }}
                            />
                        ) : (
                            <span
                                style={{ cursor: 'pointer', userSelect: 'text' }}
                                onClick={() => { setEditingId(myNodeId); setEditValue(selectedNode.label || selectedNode.pseudo || selectedNode.id); }}
                            >
                                /user/{selectedNode.label || selectedNode.pseudo || selectedNode.id}
                            </span>
                        )}
                        {/* Caret fin */}
                        {caretVisible && (
                            <span style={{display:'inline-block',width:4,height:22,background:'#111',marginLeft:4,verticalAlign:'middle',borderRadius:2,transition:'background 0.2s'}}></span>
                        )}
                    </div>
                    {/* Keywords éditables */}
                    <div style={{ marginBottom: 30, fontSize: 18, width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', minHeight: 36 }}>
                        <span style={{ fontWeight: 600, fontSize: 18, marginRight: 10 }}>mots-clés :</span>
                        {getKeywords(selectedNode).map((kw, i) => (
                            <span key={i} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                background: '#eee',
                                color: '#111',
                                borderRadius: 8,
                                padding: '4px 12px',
                                marginRight: 6,
                                marginBottom: 2,
                                fontSize: 18,
                                fontWeight: 600,
                                cursor: 'default',
                                boxSizing: 'border-box',
                                position: 'relative'
                            }}>
                                {kw}
                                <button onClick={() => handleKeywordRemoveCustom(i)} style={{
                                    marginLeft: 6,
                                    background: 'none',
                                    border: 'none',
                                    color: '#e22',
                                    fontWeight: 900,
                                    fontSize: 18,
                                    cursor: 'pointer',
                                    lineHeight: 1,
                                    padding: 0
                                }} title="Supprimer">×</button>
                                {i < getKeywords(selectedNode).length - 1 ? <span style={{marginLeft:2}}>,</span> : null}
                            </span>
                        ))}
                        {/* Ajout mot-clé */}
                        {getKeywords(selectedNode).length < 3 && (
                            <input
                                value={keywordEdit}
                                onChange={e => setKeywordEdit(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleKeywordAddCustom(); if (e.key === 'Escape') setKeywordEdit(''); }}
                                placeholder="ajouter..."
                                style={{
                                    fontSize: 18,
                                    fontFamily: 'Menlo, monospace',
                                    border: 'none',
                                    outline: 'none',
                                    background: 'transparent',
                                    color: '#111',
                                    width: 90,
                                    marginLeft: 6,
                                    marginBottom: 2
                                }}
                            />
                        )}
                        {caretVisible && <span style={{display:'inline-block',width:4,height:16,background:'#111',marginLeft:2,verticalAlign:'middle',borderRadius:2,transition:'background 0.2s'}}></span>}
                    </div>
                    <button
                        onClick={openCustomize}
                        style={{
                            marginTop: 18,
                            background: '#fff',
                            border: '1.5px solid #bbb',
                            borderRadius: 10,
                            padding: '7px 18px 7px 14px',
                            cursor: 'pointer',
                            fontFamily: 'Menlo',
                            fontWeight: 700,
                            fontSize: 16,
                            color: '#111',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                            transition: 'background 0.15s, color 0.15s',
                        }}
                    >
                        <img src={personaliserIcon.src} alt="personnaliser" style={{ width: 22, height: 22, marginRight: 6, filter: 'drop-shadow(0 1px 1px #111)' }} />
                        personnaliser mon point
                    </button>
                </div>
            )}
            {/* Fenêtre minimaliste de personnalisation à droite de la popup profil perso */}
            {showMiniCustomize && myNodeId && (
                <div className="mini-customize-popup" style={{
                    position: 'fixed',
                    right: 'calc(90px + 400px + 16px)',
                    bottom: 32,
                    width: 370,
                    height: 340, // augmenté pour laisser la place au bouton
                    background: '#fff',
                    borderRadius: 22,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                    zIndex: 1102,
                    padding: '24px 28px 18px 28px',
                    fontFamily: 'Menlo, monospace',
                    fontSize: 17,
                    color: '#111',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    boxSizing: 'border-box',
                    gap: 0,
                    transition: 'right 0.2s',
                    overflow: 'hidden',
                    justifyContent: 'space-between', // bouton toujours en bas
                }}>
                    {/* Croix de fermeture */}
                    <button onClick={closeCustomize} style={{position:'absolute',top:10,right:10,fontSize:28,background:'none',border:'none',color:'#222',cursor:'pointer',zIndex:10}} title="fermer">×</button>
                    <div style={{display:'flex',flexDirection:'row',alignItems:'flex-start',gap:0, width:'100%'}}>
                        {/* Bonhomme à gauche */}
                        <CustomFace {...customDraft} size={faceSize} />
                        {/* Flèches de sélection à droite, décalées vers le bas, + sliders pour position et taille */}
                        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:10,marginLeft:24,marginTop:28, flexShrink:1, minWidth:0, maxWidth:170}}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap:'wrap' }}>
                                <button className="customize-arrow-btn" onClick={e => { e.stopPropagation(); handleChangeCustom('eye', -1); setSelectedPart('eye'); }} style={{ border: 'none', background: 'none', fontSize: 26, cursor: 'pointer', color: '#111', padding: 0, fontWeight:700, width:32, height:32, lineHeight:'32px', borderRadius:0, transition:'background 0.1s' }}>&lt;</button>
                                <span className="customize-arrow-btn" onClick={() => setSelectedPart('eye')} style={{ width: 50, display: 'inline-block', textAlign: 'center', fontWeight: selectedPart==='eye'?900:600, textDecoration: selectedPart==='eye'?'underline':'none', cursor:'pointer', color: selectedPart==='eye'?'#111':'#bbb', letterSpacing:1, fontSize:18 }}>YEUX</span>
                                <button className="customize-arrow-btn" onClick={e => { e.stopPropagation(); handleChangeCustom('eye', 1); setSelectedPart('eye'); }} style={{ border: 'none', background: 'none', fontSize: 26, cursor: 'pointer', color: '#111', padding: 0, fontWeight:700, width:32, height:32, lineHeight:'32px', borderRadius:0, transition:'background 0.1s' }}>&gt;</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap:'wrap' }}>
                                <button className="customize-arrow-btn" onClick={e => { e.stopPropagation(); handleChangeCustom('mouth', -1); setSelectedPart('mouth'); }} style={{ border: 'none', background: 'none', fontSize: 26, cursor: 'pointer', color: '#111', padding: 0, fontWeight:700, width:32, height:32, lineHeight:'32px', borderRadius:0, transition:'background 0.1s' }}>&lt;</button>
                                <span className="customize-arrow-btn" onClick={() => setSelectedPart('mouth')} style={{ width: 70, display: 'inline-block', textAlign: 'center', fontWeight: selectedPart==='mouth'?900:600, textDecoration: selectedPart==='mouth'?'underline':'none', cursor:'pointer', color: selectedPart==='mouth'?'#111':'#bbb', letterSpacing:1, fontSize:18 }}>BOUCHE</span>
                                <button className="customize-arrow-btn" onClick={e => { e.stopPropagation(); handleChangeCustom('mouth', 1); setSelectedPart('mouth'); }} style={{ border: 'none', background: 'none', fontSize: 26, cursor: 'pointer', color: '#111', padding: 0, fontWeight:700, width:32, height:32, lineHeight:'32px', borderRadius:0, transition:'background 0.1s' }}>&gt;</button>
                            </div>
                            {/* Sliders pour X, Y, Scale */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 5, width: '100%' }}>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#222', marginBottom: 0 }}>Position X</label>
                                <input type="range" min={-24} max={24} step={1} value={customDraft[selectedPart + '_x'] || 0} onChange={e => setCustomDraft(prev => ({ ...prev, [selectedPart + '_x']: Number(e.target.value) }))} style={{ width: '100%' }} />
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#222', marginBottom: 0 }}>Position Y</label>
                                <input type="range" min={-2} max={24} step={1} value={customDraft[selectedPart + '_y'] || 0} onChange={e => setCustomDraft(prev => ({ ...prev, [selectedPart + '_y']: Number(e.target.value) }))} style={{ width: '100%' }} />
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#222', marginBottom: 0 }}>Taille</label>
                                <input type="range" min={0.5} max={2} step={0.01} value={customDraft[selectedPart + '_scale'] || 1} onChange={e => setCustomDraft(prev => ({ ...prev, [selectedPart + '_scale']: Number(e.target.value) }))} style={{ width: '100%' }} />
                            </div>
                        </div>
                    </div>
                    {/* Bouton enregistrer toujours visible, bien positionné */}
                    <div style={{ display: 'flex', gap: 0, marginTop: 10, justifyContent: 'flex-start', width: '100%' }}>
                        <button onClick={saveCustomize} style={{ fontSize: 18, border: 'none', background: '#eee', color: '#111', borderRadius: 18, padding: '10px 32px', cursor: 'pointer', fontWeight: 900, letterSpacing:1, display:'flex',alignItems:'center',gap:10, boxShadow:'0 2px 8px #eee', minWidth: '100%'}}>
                            <span style={{fontSize:22,marginRight:6,display:'inline-block'}}>●</span> Sauvegarder
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default FocusGraph;
