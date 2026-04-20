'use client';

import React, { useState, useRef, FormEvent, MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Contact.module.css';

interface FormData {
    name: string;
    email: string;
    company: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

const BUDGET_OPTIONS = ['<50k', '50-150k', '150k+'];

const MagneticButton = ({
    children,
    status
}: {
    children: React.ReactNode;
    status: 'idle' | 'submitting' | 'success';
}) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleMouse = (e: ReactMouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => setPosition({ x: 0, y: 0 });

    const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setRipples([...ripples, {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id: Date.now()
        }]);
    };

    const isSuccess = status === 'success';

    return (
        <motion.button
            ref={ref}
            type="submit"
            disabled={status === 'submitting'}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onClick={handleClick}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={styles.magneticBtn}
            style={{
                background: isSuccess
                    ? 'linear-gradient(135deg, var(--success-color), #16a34a)'
                    : 'linear-gradient(135deg, var(--accent-primary), #7c3aed)',
                cursor: status === 'submitting' ? 'wait' : 'pointer',
            }}
        >
            <span style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 'inherit' }}>
                {ripples.map((r) => (
                    <span
                        key={r.id}
                        className={styles.ripple}
                        style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10 }}
                        onAnimationEnd={() => setRipples(prev => prev.filter(rip => rip.id !== r.id))}
                    />
                ))}
            </span>

            <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>

            {!isSuccess && status !== 'submitting' && (
                <motion.span style={{ position: 'relative', zIndex: 1 }} whileHover={{ x: 3, y: -3 }}>
                    &#8599;
                </motion.span>
            )}
        </motion.button>
    );
};

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [formData, setFormData] = useState<FormData>({ name: '', email: '', company: '', message: '' });
    const [budget, setBudget] = useState<string>('150k+');
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSectionInteraction = () => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Your name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.message.trim()) newErrors.message = 'Please tell us about your vision.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus('submitting');
        await new Promise(resolve => setTimeout(resolve, 1800));

        setStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });

        setTimeout(() => {
            setStatus('idle');
        }, 3000);
    };

    return (
        <section
            id="contact"
            className={styles.contactSection}
            ref={sectionRef}
            onClick={handleSectionInteraction}
            onFocusCapture={handleSectionInteraction}
        >
            <div className={styles.ambient} aria-hidden="true">
                <div className={`${styles.blob} ${styles.blob1}`} />
                <div className={`${styles.blob} ${styles.blob2}`} />
            </div>

            <div className={styles.container}>
                <div className={styles.layout}>
                    <div className={styles.leftCol}>
                        <div className={styles.headerBlock}>
                            <h2 className={styles.title}>
                                <span className={styles.titleLine}>Let&apos;s Build</span>
                                <span className={styles.titleLine}>
                                    <em className={styles.titleItalic}>Something</em>{' '}
                                    <strong className={styles.titleBold}>Inevitable.</strong>
                                </span>
                            </h2>
                        </div>

                        <div className={styles.infoBlock}>
                            {[
                                { label: 'Email', value: 'hello@nonato.design' },
                                { label: 'Based in', value: 'Worldwide' },
                                { label: 'Available for', value: 'Q3 2026' }
                            ].map((info, i) => (
                                <div key={i} className={styles.infoItem}>
                                    <span className={styles.infoLabel}>{info.label}</span>
                                    <span className={styles.infoValue}>{info.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className={styles.form}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={styles.input}
                                placeholder=" "
                                value={formData.name}
                                onChange={handleChange}
                                aria-invalid={!!errors.name}
                            />
                            <label htmlFor="name" className={styles.label}>Your Name</label>
                            <div className={styles.fieldLine}><div className={styles.fieldLineFill} /></div>
                            <AnimatePresence>
                                {errors.name && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.errorText}>{errors.name}</motion.p>}
                            </AnimatePresence>
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.input}
                                placeholder=" "
                                value={formData.email}
                                onChange={handleChange}
                                aria-invalid={!!errors.email}
                            />
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <div className={styles.fieldLine}><div className={styles.fieldLineFill} /></div>
                            <AnimatePresence>
                                {errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.errorText}>{errors.email}</motion.p>}
                            </AnimatePresence>
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                className={styles.input}
                                placeholder=" "
                                value={formData.company}
                                onChange={handleChange}
                            />
                            <label htmlFor="company" className={styles.label}>Company / Project (Optional)</label>
                            <div className={styles.fieldLine}><div className={styles.fieldLineFill} /></div>
                        </div>

                        <div className={styles.formGroup}>
                            <textarea
                                id="message"
                                name="message"
                                className={styles.input}
                                placeholder=" "
                                rows={3}
                                value={formData.message}
                                onChange={handleChange}
                                aria-invalid={!!errors.message}
                            />
                            <label htmlFor="message" className={styles.label}>Tell us about your vision</label>
                            <div className={styles.fieldLine}><div className={styles.fieldLineFill} /></div>
                            <AnimatePresence>
                                {errors.message && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.errorText}>{errors.message}</motion.p>}
                            </AnimatePresence>
                        </div>

                        <div className={styles.budgetSection}>
                            <span className={styles.budgetLabel}>Project Budget</span>
                            <div className={styles.budgetPills}>
                                {BUDGET_OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => setBudget(opt)}
                                        className={`${styles.budgetPill} ${budget === opt ? styles.budgetPillActive : ''}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.submitWrapper}>
                            <MagneticButton status={status}>
                                {status === 'idle' && 'Send Message'}
                                {status === 'submitting' && 'Sending...'}
                                {status === 'success' && '✓ Message Sent!'}
                            </MagneticButton>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}