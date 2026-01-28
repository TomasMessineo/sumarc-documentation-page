import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';
import { motion } from 'framer-motion';

const WorkflowSteps = [
    {
        title: <Translate id="homepage.workflow.step1.title">1. Importación</Translate>,
        description: <Translate id="homepage.workflow.step1.desc">Sube tu archivo DOCX directamente al flujo editorial.</Translate>,
    },
    {
        title: <Translate id="homepage.workflow.step2.title">2. Procesamiento</Translate>,
        description: <Translate id="homepage.workflow.step2.desc">Convierte automáticamente tu archivo DOCX a formato JATS XML.</Translate>,
    },
    {
        title: <Translate id="homepage.workflow.step3.title">3. Edición</Translate>,
        description: <Translate id="homepage.workflow.step3.desc">Edita tu archivo JATS XML visualmente mediante una interfaz intuitiva.</Translate>,
    },
    {
        title: <Translate id="homepage.workflow.step4.title">4. Publicación</Translate>,
        description: <Translate id="homepage.workflow.step4.desc">Genera diferentes formatos de salida: PDF y HTML. Adapta tu XML JATS para ser soportado por SciELO.</Translate>,
    },
];

export default function HomepageWorkflow() {
    return (
        <section className={styles.workflowSection}>
            <div className="container">
                <div className="text--center">
                    <Heading as="h2">
                        <Translate id="homepage.workflow.title">Cómo funciona</Translate>
                    </Heading>
                </div>
                <div className={styles.stepContainer}>
                    {WorkflowSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.stepCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Heading as="h3">{step.title}</Heading>
                            <p>{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
