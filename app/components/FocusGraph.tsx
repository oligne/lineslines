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

import eyeNone from '../assets/face/eyes/none.png';
import mouthNone from '../assets/face/mouse/none.png';

import SidePanel from './SidePanel';
import UserPopup from './UserPopup';

const eyesImages = [eyeNone, eye1, eye2, eye3, eye4, eye5];
const mouthImages = [mouthNone, mouth1, mouth2, mouth3, mouth4, mouth5];

function FocusGraph({data, userIp, onUserNodeClick, onGraphUpdate, onCloseWelcome}) {
    const [showWelcome, setShowWelcome] = useState(false); // false par défaut
    const [welcomeClosedManually, setWelcomeClosedManually] = useState(false);
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
    const [allCustoms, setAllCustoms] = useState([]);

    // --- Gestion dynamique des popups utilisateurs (stacking horizontal et vertical) ---
const [userPopups, setUserPopups] = useState([]); // [{user, relations}]
const [popupHeights, setPopupHeights] = useState([]); // [hauteur de chaque popup]
const [popupPositions, setPopupPositions] = useState([]); // [topPx de chaque popup]

// Ouvre une popup utilisateur (exemple d'appel : openUserPopup(user, relations))
function openUserPopup(user, relations) {
  setUserPopups(prev => {
    if (prev.find(p => p.user.id === user.id)) return prev;
    return [...prev, { user, relations }];
  });
}


// Recalcule les positions verticales à chaque changement
useEffect(() => {
  let top = showWelcome ? 120 : 32;
  const positions = [];
  for (let i = 0; i < userPopups.length; i++) {
    positions[i] = top;
    top += (popupHeights[i] || 120) + 16;
  }
  setPopupPositions(positions);
}, [userPopups, popupHeights, showWelcome]);

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

        // Force dynamique, répulsion plus forte pour une meilleure répartition
        const charge = fgRef.current.d3Force('charge');
        if (charge) charge.strength(-18);
        const collide = fgRef.current.d3Force('collide');
        if (collide) {
            collide.strength(2);
            // Collision personnalisée selon les liens
            collide.radius(node => {
                // Pour chaque node, on regarde ses liens
                const nodeId = node.id;
                // Liens sortants
                const outgoing = graphData.links.filter(l => l.source === nodeId);
                // Liens entrants
                const incoming = graphData.links.filter(l => l.target === nodeId);
                // Réciproques
                const reciprocal = outgoing.some(l => incoming.some(l2 => l2.source === l.target && l2.target === l.source));
                if (reciprocal) return 10; // collision faible si réciproque
                if (outgoing.length > 0 || incoming.length > 0) return 30; // collision moyenne si lié dans un sens
                return 80; // collision forte si aucun lien
            });
        }
        // Force d'attraction des liens : forte si réciproque, modérée sinon
        const linkForce = fgRef.current.d3Force('link');
        if (linkForce) {
            linkForce.strength(link => {
                const reciprocal = graphData.links?.some(l => l.source === link.target && l.target === link.source);
                return reciprocal ? 2.5 : 0.5;
            });
            linkForce.distance(link => {
                const reciprocal = graphData.links?.some(l => l.source === link.target && l.target === link.source);
                return reciprocal ? 18 : 40;
            });
        }
        fgRef.current.refresh();
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
            if (
                !e.target.closest('.profile-popup') &&
                !e.target.closest('.mini-customize-popup') &&
                !e.target.closest('.customize-arrow-btn')
            ) {
                setSelectedNode(null);
                setShowCustomize(false);
                setShowMiniCustomize(false);
                // Revenir à la vue initiale (zoomToFit) seulement si recherche
                if (isSearchFocused && fgRef.current) {
                    fgRef.current.zoomToFit(0, 120); // zoom plus proche
                    setIsSearchFocused(false);
                }
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

    // Récupère toutes les customisations à chaque changement de graphData
    useEffect(() => {
        fetch('/api/customizations/all')
            .then(r => r.json())
            .then(setAllCustoms);
    }, [graphData]);

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
            openUserPopup(node, graphData.links);
            if (onUserNodeClick) onUserNodeClick(node);
        }
    }

    // Edition du pseudo sur clic (uniquement sur son node)
    useEffect(() => {
        if (!editingId || !fgRef.current) return;
        function onKeyDown(e) {
            if (e.key === "Enter") handleInputBlurOrEnter();
            else if (e.key === "Escape") setEditingId(null);
            // else if (e.key.length === 1) setEditValue(v => v + e.key);
            // else if (e.key === "Backspace") setEditValue(v => v.slice(0, -1));
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
                    if (onGraphUpdate) onGraphUpdate(); // Ajouté pour rafraîchir le graph après modif customface
                });
            // Ajout : forcer un refresh local du graphData pour déclencher le useEffect
            setGraphData(gd => ({ ...gd, nodes: [...gd.nodes] }));
        });
    }



    function handleChangeCustom(type, dir) {
        setCustomDraft(prev => {
            let max = type === 'eye' ? eyesImages.length : mouthImages.length;
            let next = ((prev[type] || 0) + dir + max) % max;
            return { ...prev, [type]: next };
        });
    }

        function handleCloseWelcome() {
  setShowWelcome(false);
  setWelcomeClosedManually(true);
  const myNodeId = graphData.nodes.find(n => n.ip === userIp)?.id;
  if (myNodeId) {
    fetch(`/api/users/${myNodeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ starter: 0 })
      
    });
  }
      if (onCloseWelcome) onCloseWelcome(); // AJOUTÉ

    }

    // Composant visage personnalisé
    function CustomFace({ eye, mouth, eye_x, eye_y, mouth_x, mouth_y, eye_scale, mouth_scale, size = 120 }) {
        // Sécurise les index et les valeurs
        const eyeIdx = typeof eye === 'number' && eye > 0 && eye < eyesImages.length ? eye : 0;
        const mouthIdx = typeof mouth === 'number' && mouth > 0 && mouth < mouthImages.length ? mouth : 0;
        // Adapter les offsets proportionnellement à la taille
        const baseSize = 120;
        const scale = size / baseSize;
        // Correction : la position Y des yeux doit être centrée verticalement comme dans le canvas
        const baseEyeLeft = 0.3, baseEyeTop = 0.37, baseMouthLeft = 0.3, baseMouthTop = 0.67;
        const eyeScale = typeof eye_scale === 'number' ? eye_scale : 1;
        const mouthScale = typeof mouth_scale === 'number' ? mouth_scale : 1;
        // Correction : positionnement identique au canvas (nodeThreeObject)
        const eyeX = size * baseEyeLeft + (typeof eye_x === 'number' ? eye_x : 0) * scale;
        const eyeY = size * baseEyeTop + (typeof eye_y === 'number' ? eye_y : 0) * scale;
        const mouthX = size * baseMouthLeft + (typeof mouth_x === 'number' ? mouth_x : 0) * scale;
        const mouthY = size * baseMouthTop + (typeof mouth_y === 'number' ? mouth_y : 0) * scale;
        return (
            <div style={{ position: 'relative', width: size, height: size, margin: 0, flexShrink: 0, transition: 'width 0.1s, height 0.1s' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: '50%', background: '#111', boxShadow: '0 2px 8px #8888', zIndex: 1, transition: 'width 0.1s, height 0.1s' }} />
                {/* Eyes */}
                {eyeIdx !== 0 && eyesImages[eyeIdx]?.src ? (
                    <img src={eyesImages[eyeIdx].src} alt="eye" style={{ position: 'absolute', left: eyeX, top: eyeY, width: size * 0.4 * eyeScale, height: size * 0.18 * eyeScale, zIndex: 2, transition: 'left 0.1s, top 0.1s, width 0.1s, height 0.1s' }} />
                ) : eyeIdx !== 0 ? (
                    <div style={{position:'absolute',left:eyeX,top:eyeY,width:size*0.4,height:size*0.18,zIndex:2,background:'#e22',color:'#fff',fontWeight:900,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>?</div>
                ) : null}
                {/* Mouth */}
                {mouthIdx !== 0 && mouthImages[mouthIdx]?.src ? (
                    <img src={mouthImages[mouthIdx].src} alt="mouth" style={{ position: 'absolute', left: mouthX, top: mouthY, width: size * 0.4 * mouthScale, height: size * 0.18 * mouthScale, zIndex: 3, transition: 'left 0.1s, top 0.1s, width 0.1s, height 0.1s' }} />
                ) : mouthIdx !== 0 ? (
                    <div style={{position:'absolute',left:mouthX,top:mouthY,width:size*0.4,height:size*0.18,zIndex:3,background:'#e22',color:'#fff',fontWeight:900,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>?</div>
                ) : null}
            </div>
        );
    }



    // Fusionne la customisation dans le node courant avant le rendu du graph, mais seulement quand custom/myNodeId/graphData changent
    const mergedGraphData = useMemo(() => {
        // Associe la customisation à chaque node si elle existe
        const nodes = graphData.nodes.map(n => {
            const custom = allCustoms.find(c => String(c.user_id) === String(n.id)) || {};
            return {
                ...n,
                ...custom,
                id: String(n.id),
                ...(n.id === myNodeId ? { fx: 0, fy: 0, fz: 0 } : {})
            };
        });
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
    }, [graphData, allCustoms, myNodeId]);

    // Vérifie le statut "starter" de l'utilisateur et affiche ou non le panneau de bienvenue
    useEffect(() => {
        const myNodeId = graphData.nodes.find(n => n.ip === userIp)?.id;
        if (!myNodeId) return;
        fetch(`/api/users/${myNodeId}`)
            .then(async r => {
                if (!r.ok) {
                    setShowWelcome(false);
                    return;
                }
                const user = await r.json();
                if (user && user.starter === 0) {
                    setShowWelcome(false);
                } else {
                    setShowWelcome(true);
                }
            })
            .catch(() => setShowWelcome(false));
    }, [graphData, userIp]);

    // --- Recherche par pseudo ---
    const [searchValue, setSearchValue] = useState("");
    const [searchError, setSearchError] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    function handleSearch(e) {
        e.preventDefault();
        setSearchError("");
        const val = searchValue.trim().toLowerCase().replace(/\s+/g, "");
        if (!val) return;
        let node = mergedGraphData.nodes.find(n =>
            (n.label && n.label.toLowerCase().replace(/\s+/g, "") === val) ||
            (n.pseudo && n.pseudo.toLowerCase().replace(/\s+/g, "") === val) ||
            (String(n.id).toLowerCase() === val)
        );
        if (!node) {
            node = mergedGraphData.nodes.find(n =>
                (n.label && n.label.toLowerCase().replace(/\s+/g, "").includes(val)) ||
                (n.pseudo && n.pseudo.toLowerCase().replace(/\s+/g, "").includes(val))
            );
        }
        if (!node) {
            setSearchError("Aucun utilisateur trouvé");
            return;
        }
        // Centre la caméra sur le node trouvé (distance z plus proche)
        if (fgRef.current) {
            if (node && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
                fgRef.current.cameraPosition(
                    { x: node.x, y: node.y, z: node.z + 40 },
                    { x: node.x, y: node.y, z: node.z },
                    800
                );
                setIsSearchFocused(true);
            }
        }
    }

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
                        width: faceSize * 0.65, // réduit la taille du rond
                        height: faceSize * 0.65,
                        borderRadius: '50%',
                        background: 'transparent',
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
                    <CustomFace {...custom} size={faceSize * 0.65} />
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

            {showWelcome && <SidePanel onClose={handleCloseWelcome} />}


            {/* Champ de recherche pseudo en haut à droite */}
            <form onSubmit={handleSearch} style={{ position: 'fixed', top: 55, left: 20, zIndex: 1200, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.95)', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: '7px 16px 7px 16px' }}>
                <input
                    type="text"
                    placeholder="rechercher un pseudo..."
                    value={searchValue}
                    onChange={e => { setSearchValue(e.target.value); setSearchError(""); }}
                    style={{ fontSize: 18, fontFamily: 'Menlo, monospace', border: 'none', outline: 'none', background: 'transparent', color: '#111', width: 180, padding: 0, margin: 0 }}
                />
                <button type="submit" style={{ fontSize: 18, fontWeight: 700, border: 'none', background: '#eee', color: '#111', borderRadius: 8, padding: '4px 16px', cursor: 'pointer', boxShadow: '0 1px 4px #eee' }}>recherche</button>
                <button
        type="button"
        style={{ fontSize: 18, fontWeight: 700, border: 'none', background: '#fff', color: '#111', borderRadius: 8, padding: '4px 16px', cursor: 'pointer', boxShadow: '0 1px 4px #eee', marginLeft: 4 }}
        onClick={() => {
            setSelectedNode(null);
            setShowCustomize(false);
            setShowMiniCustomize(false);
            setSearchError("");
            setSearchValue("");
            setIsSearchFocused(false);
            // Recentre la caméra comme à l'init
            if (fgRef.current) {
                const n = graphData.nodes.length || 1;
                const z = Math.max(-100, Math.min(200, n * 25));
                fgRef.current.cameraPosition(
                    { x: 0, y: 0, z },
                    { x: 0, y: 0, z: 0 },
                    800
                );
            }
        }}
        title="Vue initiale"
    >OK</button>
                {searchError && <span style={{ color: '#111', fontSize: 15, marginLeft: 8 }}>{searchError}</span>}
            </form>

            {/* Bouton refresh pour recadrer sur soi */}
            
        </>
    );
}



export default FocusGraph;
