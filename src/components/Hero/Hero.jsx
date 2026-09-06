import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { EdulabWordmark, KulturosferaSignature } from '@site/src/components/Brand';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './Hero.module.css';
import KulturosferaButton from '../KulturosferaButton';

/**
 * Heroul Edulab58 — PORTAT din `curs/src/components/Hero/Hero.jsx`, nu rescris.
 *
 * Ce a rămas neatins, linie cu linie: `resize` cu dpr plafonat la 2, `draw01`
 * (trasarea la intrare, în primele ~2,5 secunde), `star4` (steaua concavă
 * Kulturosfera), grila în derivă, spirala, Lissajous-ul cu cometă, unda Fourier
 * de jos, bucla `animate`, respectarea lui `prefers-reduced-motion` (un singur
 * cadru la t = 6, deci scena completă, dar înghețată) și curățenia din
 * `useEffect`.
 *
 * CE S-A SCHIMBAT: doar figura centrală. La edumat58 e un ASTROLAB — cercul
 * unitate cu raza rotitoare, poligonul înscris care își morfează laturile,
 * sinusul care pleacă spre stânga. Aici e PENDULUL LUI FOUCAULT, în plan, văzut
 * de sus.
 *
 * De ce Foucault și nu prisma sau osciloscopul, cele două sugestii alternative:
 * astrolabul e instrumentul care citește cerul măsurând unghiuri; pendulul lui
 * Foucault e instrumentul care citește ROTAȚIA PĂMÂNTULUI măsurând o podea
 * gradată. Sunt aceeași specie de obiect — cerc mare, gradații gravate, un braț
 * care se mișcă peste ele — și de asta se desenează cu exact aceleași funcții.
 * O prismă e un triunghi: ar fi aruncat inelele, gradațiile, inelele punctate
 * contra-rotative, sateliții și nucleul, adică tot ce face desenul să fie al
 * casei. Un osciloscop e un dreptunghi: aceeași pierdere. Foucault păstrează
 * armătura radială și, în plus, îndreptățește fizic două lucruri care la
 * astrolab erau doar frumoase: planul care se rotește lent (precesia) și unda
 * care pleacă spre stânga (înregistrarea în timp a oscilației).
 */

export default function Hero() {
    const { siteConfig } = useDocusaurusContext();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let width, height, dpr, raf;
        let t = 0;

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const W = (a) => `rgba(255,255,255,${a})`;
        // intrarea în scenă: totul se „trasează" în primele ~2.5 secunde
        const draw01 = (delay, dur = 1.2) => Math.max(0, Math.min(1, (t - delay) / dur));

        // steaua concavă Kulturosfera (limbajul emblemei), desenată pe canvas
        const star4 = (cx, cy, outer, waist, rot = 0) => {
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const tip = rot + (i * Math.PI) / 2 - Math.PI / 2;
                const tx = cx + outer * Math.cos(tip), ty = cy + outer * Math.sin(tip);
                const wx = cx + waist * Math.cos(tip + Math.PI / 4), wy = cy + waist * Math.sin(tip + Math.PI / 4);
                if (i === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
                ctx.quadraticCurveTo(cx, cy, wx, wy);
            }
            ctx.closePath();
        };

        // --- grila planului, drift lent --------------------------------------
        const drawGrid = () => {
            const step = 56;
            const off = (t * 5) % step;
            ctx.strokeStyle = W(0.045);
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = -off; x < width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
            for (let y = -off * 0.6; y < height; y += step) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
            ctx.stroke();
        };

        // =====================================================================
        //  PATRU FIGURI DIN PROGRAMĂ
        //
        //  Prima versiune păstra armătura astrolabului — inele gravate cu
        //  gradații — și adăuga o spirală și figuri Lissajous. Autorul: „tot de
        //  mate sunt". Avea dreptate de două ori: Lissajous și spirala SUNT
        //  curbe matematice, iar un pendul văzut de sus e tot un cerc gradat,
        //  adică exact silueta astrolabului.
        //
        //  Acum fiecare figură e un capitol din programa de gimnaziu
        //  (OMEN 3393/2017), nu o formă frumoasă:
        //    lentila convergentă  -> Elemente de optică geometrică, clasa a VIII-a
        //    liniile de câmp      -> Fenomene electrice și magnetice, clasa a VI-a
        //    circuitul            -> Electrocinetică, clasa a VIII-a
        //    interferența         -> Unde mecanice, clasa a VII-a
        //
        //  Limbajul de desen rămâne al casei: linii albe subțiri, trasare în
        //  primele ~2,5 secunde prin `draw01`, steluțele Kulturosfera ca accent.
        // =====================================================================

        // --- LENTILA CONVERGENTĂ, cu dispersie ---------------------------
        // Piesa centrală. Raze paralele intră, lentila le frânge, se string în
        // focar — iar dincolo de focar se DESPART în spectru, fiindcă indicele
        // de refracție depinde de culoare. Dispersia e singurul loc din tot
        // heroul unde apare culoare: restul e linie albă.
        const SPECTRU = ['#b8556b', '#e8a3b3', '#f0d9a0', '#a8d3b0', '#8fc4d6', '#7fb0c9'];

        const drawLentila = () => {
            const cx = width * 0.78, cy = height * 0.33;
            const R = Math.min(width, height) * 0.2;
            // lentila „respiră": curbura variază lent, deci focarul se plimbă —
            // exact relația dintre raza de curbură și distanța focală.
            const puls = 1 + 0.06 * Math.sin(t * 0.5);
            const h = R * 0.92, bulge = R * 0.3 * puls, f = R * 1.15 / puls;

            const a0 = draw01(0.15, 0.9);
            if (a0 > 0) {
                ctx.strokeStyle = W(0.13); ctx.lineWidth = 1; ctx.setLineDash([5, 6]);
                ctx.beginPath();
                ctx.moveTo(cx - R * 2.1 * a0, cy); ctx.lineTo(cx + R * 2.4 * a0, cy);
                ctx.stroke(); ctx.setLineDash([]);
            }

            const a1 = draw01(0.35, 1.0);
            if (a1 > 0) {
                ctx.strokeStyle = W(0.5); ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(cx, cy - h * a1); ctx.quadraticCurveTo(cx + bulge, cy, cx, cy + h * a1);
                ctx.moveTo(cx, cy - h * a1); ctx.quadraticCurveTo(cx - bulge, cy, cx, cy + h * a1);
                ctx.stroke();
            }

            const a2 = draw01(0.8, 1.3);
            if (a2 > 0) {
                for (let i = -4; i <= 4; i++) {
                    if (i === 0) continue;
                    const y = cy + (i / 4) * h * 0.85;
                    ctx.strokeStyle = W(0.09 + 0.15 * a2); ctx.lineWidth = 1.1;
                    ctx.beginPath();
                    ctx.moveTo(cx - R * 2.05 * a2, y); ctx.lineTo(cx, y);
                    ctx.lineTo(cx + f * a2, cy);
                    ctx.stroke();

                    // pachetul de lumină care parcurge raza: intră, se frânge,
                    // trece prin focar. Un singur punct, dar face drumul întreg.
                    const u = ((t * 0.3 + i * 0.11) % 1);
                    if (a2 > 0.55) {
                        let px, py;
                        if (u < 0.55) { px = cx - R * 2.05 + (u / 0.55) * R * 2.05; py = y; }
                        else { const v = (u - 0.55) / 0.45; px = cx + v * f; py = y + (cy - y) * v; }
                        ctx.fillStyle = W(0.45 * Math.sin(u * Math.PI));
                        ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
                    }
                }
            }

            // DISPERSIA: dincolo de focar fasciculul se desface în spectru.
            const a4 = draw01(2.1, 1.4);
            if (a4 > 0) {
                SPECTRU.forEach((col, k) => {
                    const ang = (k - (SPECTRU.length - 1) / 2) * 0.052;
                    const len = R * 1.5 * a4;
                    ctx.strokeStyle = col + '66';
                    ctx.lineWidth = 1.6;
                    ctx.beginPath();
                    ctx.moveTo(cx + f, cy);
                    ctx.lineTo(cx + f + Math.cos(ang) * len, cy + Math.sin(ang) * len);
                    ctx.stroke();
                });
            }

            const a3 = draw01(1.9, 0.7);
            if (a3 > 0) {
                ctx.fillStyle = W(0.55 * a3);
                star4(cx + f, cy, 9 * a3, 2.6 * a3, t * 0.25);
                ctx.fill();
            }
        };

        // --- CÂMPUL MAGNETIC, cu ace de busolă care se orientează ---------
        // Clasa a VI-a. Buclele sunt figura din manual; acele arată CE FACE
        // câmpul — se rotesc lin până se aliniază pe tangenta liniei de câmp.
        const drawCampMagnetic = () => {
            const cx = width * 0.19, cy = height * 0.7;
            const L = Math.min(width, height) * 0.085;
            const a = draw01(1.1, 1.4);
            if (a <= 0) return;

            // bara, cu polii marcați
            ctx.strokeStyle = W(0.34); ctx.lineWidth = 1.5;
            ctx.strokeRect(cx - L, cy - L * 0.26, L * 2, L * 0.52);
            ctx.beginPath(); ctx.moveTo(cx, cy - L * 0.26); ctx.lineTo(cx, cy + L * 0.26); ctx.stroke();

            // liniile de câmp, cu un impuls care le parcurge
            for (let k = 1; k <= 5; k++) {
                const spread = L * (0.5 + k * 0.46), rise = L * (0.36 + k * 0.58);
                const av = Math.max(0, Math.min(1, (a - k * 0.1) / 0.6));
                if (av <= 0) continue;
                const val = 0.05 + 0.05 / k + 0.035 * Math.sin(t * 1.1 - k * 0.6);
                ctx.strokeStyle = W(Math.max(0.02, val)); ctx.lineWidth = 1;
                for (const sgn of [-1, 1]) {
                    ctx.beginPath();
                    ctx.moveTo(cx + L, cy);
                    ctx.bezierCurveTo(cx + L + spread * av, cy + sgn * rise,
                                      cx - L - spread * av, cy + sgn * rise, cx - L, cy);
                    ctx.stroke();
                }
            }

            // acele de busolă: se aliniază pe direcția câmpului, cu o mică
            // oscilație amortizată în jurul poziției de echilibru
            if (a > 0.7) {
                for (let i = 0; i < 7; i++) {
                    const ang0 = Math.PI * (0.18 + i * 0.11);
                    const rr = L * 2.5;
                    const px = cx + Math.cos(ang0) * rr * 1.25;
                    const py = cy - Math.sin(ang0) * rr * 0.75;
                    const dir = Math.atan2(cy - py, cx - px) + Math.PI / 2
                              + 0.16 * Math.sin(t * 1.6 - i * 0.5) * Math.exp(-Math.max(0, t - 6) * 0.3);
                    ctx.strokeStyle = W(0.3); ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.moveTo(px - Math.cos(dir) * 7, py - Math.sin(dir) * 7);
                    ctx.lineTo(px + Math.cos(dir) * 7, py + Math.sin(dir) * 7);
                    ctx.stroke();
                    ctx.fillStyle = W(0.42);
                    ctx.beginPath(); ctx.arc(px + Math.cos(dir) * 7, py + Math.sin(dir) * 7, 1.9, 0, 7); ctx.fill();
                }
            }
        };

        // --- CIRCUIT: mai mulți purtători, becul care pulsează --------------
        // Clasa a VIII-a. Becul se aprinde în ritmul curentului care trece prin
        // el, iar rezistorul se încălzește — cele două efecte din programă.
        const drawCircuit = () => {
            const x0 = width * 0.085, y0 = height * 0.19;
            const w = Math.min(width, height) * 0.17, h = w * 0.6;
            const a = draw01(1.5, 1.2);
            if (a <= 0) return;

            ctx.strokeStyle = W(0.26); ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.rect(x0, y0, w * a, h * a); ctx.stroke();
            if (a <= 0.85) return;

            ctx.beginPath();
            ctx.moveTo(x0 + w * 0.42, y0 - 5); ctx.lineTo(x0 + w * 0.42, y0 + 5);
            ctx.moveTo(x0 + w * 0.52, y0 - 9); ctx.lineTo(x0 + w * 0.52, y0 + 9);
            ctx.stroke();

            // rezistorul, cu efectul termic sugerat de o aură care pulsează
            const cald = 0.5 + 0.5 * Math.sin(t * 1.3);
            ctx.strokeStyle = W(0.2 + 0.2 * cald);
            ctx.strokeRect(x0 + w - 4, y0 + h * 0.34, 8, h * 0.32);

            // becul: cerc cu cruce, cu strălucire ritmată
            const bx = x0 + w * 0.5, by = y0 + h;
            const glow = 0.35 + 0.35 * Math.sin(t * 1.3 - 0.7);
            ctx.strokeStyle = W(0.25 + 0.3 * glow); ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bx - 5, by - 5); ctx.lineTo(bx + 5, by + 5);
            ctx.moveTo(bx + 5, by - 5); ctx.lineTo(bx - 5, by + 5);
            ctx.stroke();
            ctx.fillStyle = W(0.1 * glow);
            ctx.beginPath(); ctx.arc(bx, by, 13, 0, Math.PI * 2); ctx.fill();

            // TREI purtători de sarcină, egal distanțați pe buclă
            const P = 2 * (w + h);
            for (let n = 0; n < 3; n++) {
                let d = ((t * 0.2 + n / 3) % 1) * P, px, py;
                if (d < w) { px = x0 + d; py = y0; }
                else if (d < w + h) { px = x0 + w; py = y0 + (d - w); }
                else if (d < 2 * w + h) { px = x0 + w - (d - w - h); py = y0 + h; }
                else { px = x0; py = y0 + h - (d - 2 * w - h); }
                ctx.fillStyle = W(0.55);
                ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
            }
        };

        // --- INTERFERENȚA: cu liniile nodale ------------------------------
        // Clasa a VII-a. Cercurile sunt fronturile de undă; liniile care pleacă
        // în evantai sunt locurile unde undele se anulează — franjele care fac
        // figura să fie interferență, nu două pietre aruncate separat.
        const drawInterferenta = () => {
            const y = height * 0.87;
            const s1 = width * 0.4, s2 = width * 0.6, mid = (s1 + s2) / 2;
            const a = draw01(2.0, 1.5);
            if (a <= 0) return;

            for (const sx of [s1, s2]) {
                for (let k = 0; k < 8; k++) {
                    const r = ((t * 18 + k * 32) % 260) * a;
                    const fade = 1 - r / 260;
                    if (fade <= 0) continue;
                    ctx.strokeStyle = W(0.05 * fade); ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.arc(sx, y, r, Math.PI, 2 * Math.PI); ctx.stroke();
                }
                ctx.fillStyle = W(0.32 * a);
                ctx.beginPath(); ctx.arc(sx, y, 2.2, 0, Math.PI * 2); ctx.fill();
            }

            if (a > 0.8) {
                ctx.setLineDash([3, 7]);
                for (let m = -2; m <= 2; m++) {
                    if (m === 0) continue;
                    const spread = m * 0.36;
                    ctx.strokeStyle = W(0.07); ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(mid, y);
                    ctx.lineTo(mid + Math.sin(spread) * 260, y - Math.cos(spread) * 260);
                    ctx.stroke();
                }
                ctx.setLineDash([]);
            }
        };

        // --- PÂRGHIA: colțul din dreapta-jos ------------------------------
        // Clasa a VII-a, mecanisme simple. Era singurul colț gol al scenei.
        // Bara se înclină încet până se echilibrează, iar brațele se schimbă:
        // arată LEGEA pârghiei, nu doar forma ei — greutatea mică pe brațul
        // lung ridică greutatea mare de pe brațul scurt.
        const drawParghia = () => {
            const cx = width * 0.84, cy = height * 0.8;
            const Lb = Math.min(width, height) * 0.14;
            const a = draw01(2.4, 1.5);
            if (a <= 0) return;

            // oscilație amortizată spre echilibru
            const damp = Math.exp(-Math.max(0, t - 4.2) * 0.42);
            const ang = 0.3 * Math.sin(t * 1.15) * damp + 0.055 * Math.sin(t * 0.4);
            const c = Math.cos(ang), sn = Math.sin(ang);

            // punctul de sprijin: triunghi
            ctx.strokeStyle = W(0.34); ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy); ctx.lineTo(cx - 11, cy + 17); ctx.lineTo(cx + 11, cy + 17);
            ctx.closePath(); ctx.stroke();

            // bara, cu brațe inegale — scurt la stânga, lung la dreapta
            const bs = Lb * 0.62 * a, bl = Lb * 1.25 * a;
            const x1 = cx - bs * c, y1 = cy - bs * sn;
            const x2 = cx + bl * c, y2 = cy + bl * sn;
            ctx.strokeStyle = W(0.42); ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

            // gradațiile de pe braț — unitățile de lungime ale legii pârghiei
            if (a > 0.7) {
                ctx.strokeStyle = W(0.14); ctx.lineWidth = 1;
                for (let k = 1; k <= 4; k++) {
                    const f = (k / 4) * bl;
                    const gx = cx + f * c, gy = cy + f * sn;
                    ctx.beginPath();
                    ctx.moveTo(gx - sn * 3.5, gy + c * 3.5);
                    ctx.lineTo(gx + sn * 3.5, gy - c * 3.5);
                    ctx.stroke();
                }
            }

            // greutățile: mare pe brațul scurt, mică pe cel lung
            const greutate = (gx, gy, w2, h2) => {
                ctx.strokeStyle = W(0.36); ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + 9);
                ctx.stroke();
                ctx.strokeRect(gx - w2 / 2, gy + 9, w2, h2);
            };
            if (a > 0.85) { greutate(x1, y1, 16, 13); greutate(x2, y2, 9, 8); }
        };

        const frame = () => {
            ctx.clearRect(0, 0, width, height);
            drawGrid();
            drawCampMagnetic();
            drawCircuit();
            drawInterferenta();
            drawParghia();
            drawLentila();
        };

        const animate = () => {
            t += 0.016;
            frame();
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        if (reduced) {
            t = 6; frame();
        } else {
            animate();
        }

        return () => {
            window.removeEventListener('resize', resize);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <header className={styles.heroContainer}>
            <canvas ref={canvasRef} className={styles.canvasBackground} />
            <div className={styles.heroOverlay}></div>
            <div className={clsx('container', styles.heroContent)}>
                {/* Semnătura Kulturosfera a stat aici, deasupra numelui
                    platformei. A fost scoasă la cererea autorului: eroul se
                    deschide direct cu wordmarkul edulab58. Marca gazdei rămâne
                    în navbar și în subsol, unde e locul ei; componenta
                    `KulturosferaSignature` din `src/components/Brand` e în
                    continuare folosită de butonul „Descoperă Kulturosfera”. */}
                <h1 className={styles.heroTitle} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <span style={{ color: '#fff' }}>
                        <EdulabWordmark width={420} style={{ width: 'min(420px, 86vw)' }} />
                    </span>
                    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                        {siteConfig.title}
                    </span>
                </h1>

                <br></br>
                <br></br>
                <div className={styles.buttons}>
                    {/* edumat58 trimite spre `/navigation`, o pagină pe care
                        Edulab58 n-o are. Până există, butonul duce unde chiar
                        se poate ajunge. */}
                    <Link
                        className={clsx('button button--lg', styles.glowButton)}
                        to="/docs/despre">
                        Descoperă Edulab
                    </Link>
                    <KulturosferaButton />
                </div>
            </div>
        </header>
    );
}
