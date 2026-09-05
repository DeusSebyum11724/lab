import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { EdulabWordmark } from '@site/src/components/Brand';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './Hero.module.css';
import KulturosferaButton from '../KulturosferaButton';
import SplitText from '../SplitText/SplitText';

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

        // --- LENTILA CONVERGENTĂ: raze paralele care se string în focar ------
        // Piesa centrală. Am ales-o fiindcă e singura care leagă trei lucruri:
        // e din programă, e recunoscută instant ca fizică, și explică paleta —
        // violetul mărcii e chiar capătul spectrului pe care îl produce optica.
        const drawLentila = () => {
            const cx = width * 0.78, cy = height * 0.33;
            const R = Math.min(width, height) * 0.2;
            const h = R * 0.92;              // semi-înălțimea lentilei
            const f = R * 1.15;              // distanța focală
            const bulge = R * 0.3;           // bombarea fețelor

            // axa optică
            const a0 = draw01(0.15, 0.9);
            if (a0 > 0) {
                ctx.strokeStyle = W(0.13); ctx.lineWidth = 1;
                ctx.setLineDash([5, 6]);
                ctx.beginPath();
                ctx.moveTo(cx - R * 2.1 * a0, cy); ctx.lineTo(cx + R * 2.1 * a0, cy);
                ctx.stroke(); ctx.setLineDash([]);
            }

            // corpul lentilei: două arce care se ating la margini
            const a1 = draw01(0.35, 1.0);
            if (a1 > 0) {
                ctx.strokeStyle = W(0.5); ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(cx, cy - h * a1);
                ctx.quadraticCurveTo(cx + bulge, cy, cx, cy + h * a1);
                ctx.moveTo(cx, cy - h * a1);
                ctx.quadraticCurveTo(cx - bulge, cy, cx, cy + h * a1);
                ctx.stroke();
            }

            // razele: paralele la intrare, frânte de lentilă, adunate în focar
            const a2 = draw01(0.8, 1.3);
            if (a2 > 0) {
                for (let i = -3; i <= 3; i++) {
                    if (i === 0) continue;
                    const y = cy + (i / 3) * h * 0.82;
                    // pulsul care alunecă pe rază — arată SENSUL luminii
                    const puls = ((t * 0.35 + i * 0.13) % 1);
                    ctx.strokeStyle = W(0.1 + 0.16 * a2);
                    ctx.lineWidth = 1.1;
                    ctx.beginPath();
                    ctx.moveTo(cx - R * 2.05 * a2, y);
                    ctx.lineTo(cx, y);
                    ctx.lineTo(cx + f * a2, cy);   // convergența spre focar
                    ctx.stroke();

                    // bobița de lumină pe segmentul de dinainte de lentilă
                    const px = cx - R * 2.05 + puls * R * 2.05;
                    if (a2 > 0.6 && px < cx) {
                        ctx.fillStyle = W(0.35 * (1 - puls));
                        ctx.beginPath(); ctx.arc(px, y, 1.6, 0, Math.PI * 2); ctx.fill();
                    }
                }
            }

            // focarul, marcat cu steaua Kulturosfera
            const a3 = draw01(1.9, 0.7);
            if (a3 > 0) {
                ctx.fillStyle = W(0.5 * a3);
                star4(cx + f, cy, 9 * a3, 2.6 * a3, t * 0.25);
                ctx.fill();
            }
        };

        // --- LINIILE DE CÂMP ALE UNUI MAGNET BARĂ ---------------------------
        // Clasa a VI-a. Buclele care ies din polul nord și intră în sud —
        // forma cea mai recognoscibilă din tot capitolul de magnetism.
        const drawCampMagnetic = () => {
            const cx = width * 0.2, cy = height * 0.72;
            const L = Math.min(width, height) * 0.085;
            const a = draw01(1.1, 1.4);
            if (a <= 0) return;

            // bara
            ctx.strokeStyle = W(0.32); ctx.lineWidth = 1.5;
            ctx.strokeRect(cx - L, cy - L * 0.26, L * 2, L * 0.52);
            ctx.beginPath(); ctx.moveTo(cx, cy - L * 0.26); ctx.lineTo(cx, cy + L * 0.26); ctx.stroke();

            // buclele, tot mai largi
            for (let k = 1; k <= 4; k++) {
                const spread = L * (0.55 + k * 0.5);
                const rise = L * (0.4 + k * 0.62);
                const av = a * Math.max(0, Math.min(1, (a - k * 0.12) / 0.6));
                if (av <= 0) continue;
                ctx.strokeStyle = W(0.055 + 0.05 / k);
                ctx.lineWidth = 1;
                for (const sgn of [-1, 1]) {
                    ctx.beginPath();
                    ctx.moveTo(cx + L, cy);
                    ctx.bezierCurveTo(
                        cx + L + spread * av, cy + sgn * rise,
                        cx - L - spread * av, cy + sgn * rise,
                        cx - L, cy
                    );
                    ctx.stroke();
                }
            }
        };

        // --- CIRCUIT SIMPLU cu curent care circulă --------------------------
        // Clasa a VIII-a, electrocinetică. Sursă, rezistor, bec — desenate cu
        // simbolurile din manual, nu stilizate.
        const drawCircuit = () => {
            const x0 = width * 0.09, y0 = height * 0.2;
            const w = Math.min(width, height) * 0.16, h = w * 0.62;
            const a = draw01(1.5, 1.2);
            if (a <= 0) return;

            ctx.strokeStyle = W(0.26); ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.rect(x0, y0, w * a, h * a); ctx.stroke();

            if (a > 0.85) {
                // sursa: două bare inegale, ca în simbolul de baterie
                ctx.beginPath();
                ctx.moveTo(x0 + w * 0.42, y0 - 5); ctx.lineTo(x0 + w * 0.42, y0 + 5);
                ctx.moveTo(x0 + w * 0.52, y0 - 9); ctx.lineTo(x0 + w * 0.52, y0 + 9);
                ctx.stroke();
                // rezistorul: dreptunghi pe latura dreaptă
                ctx.strokeRect(x0 + w - 4, y0 + h * 0.34, 8, h * 0.32);
                // becul: cerc cu cruce
                const bx = x0 + w * 0.5, by = y0 + h;
                ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(bx - 5, by - 5); ctx.lineTo(bx + 5, by + 5);
                ctx.moveTo(bx + 5, by - 5); ctx.lineTo(bx - 5, by + 5);
                ctx.stroke();

                // curentul: un punct care face ocolul buclei
                const per = (t * 0.22) % 1;
                const P = 2 * (w + h);
                let d = per * P, px, py;
                if (d < w) { px = x0 + d; py = y0; }
                else if (d < w + h) { px = x0 + w; py = y0 + (d - w); }
                else if (d < 2 * w + h) { px = x0 + w - (d - w - h); py = y0 + h; }
                else { px = x0; py = y0 + h - (d - 2 * w - h); }
                ctx.fillStyle = W(0.55);
                ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
            }
        };

        // --- INTERFERENȚA A DOUĂ SURSE --------------------------------------
        // Clasa a VII-a, unde mecanice. Două pietre în apă: cercurile care se
        // suprapun sunt chiar figura din manual.
        const drawInterferenta = () => {
            const y = height * 0.86;
            const s1 = width * 0.42, s2 = width * 0.58;
            const a = draw01(2.0, 1.5);
            if (a <= 0) return;
            for (const sx of [s1, s2]) {
                for (let k = 0; k < 7; k++) {
                    const r = ((t * 16 + k * 34) % 240) * a;
                    const fade = 1 - r / 240;
                    if (fade <= 0) continue;
                    ctx.strokeStyle = W(0.055 * fade);
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.arc(sx, y, r, Math.PI, 2 * Math.PI); ctx.stroke();
                }
                ctx.fillStyle = W(0.3 * a);
                ctx.beginPath(); ctx.arc(sx, y, 2, 0, Math.PI * 2); ctx.fill();
            }
        };

        const frame = () => {
            ctx.clearRect(0, 0, width, height);
            drawGrid();
            drawCampMagnetic();
            drawCircuit();
            drawInterferenta();
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
                <h1 className={styles.heroTitle} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <span style={{ color: '#fff' }}>
                        <EdulabWordmark width={420} style={{ width: 'min(420px, 86vw)' }} />
                    </span>
                    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                        {siteConfig.title}
                    </span>
                </h1>
                <SplitText
                    text={siteConfig.tagline}
                    className={styles.heroSubtitle}
                    delay={50}
                    animationFrom={{ opacity: 0, transform: 'translate3d(0,40px,0)' }}
                    animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    easing="easeOutCubic"
                    threshold={0.1}
                    rootMargin="-100px"
                />
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
