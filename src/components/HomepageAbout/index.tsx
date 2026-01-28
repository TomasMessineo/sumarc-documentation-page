import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';

export default function HomepageAbout() {
    return (
        <>
            <section className={styles.aboutSection}>
                <div className="container">
                    <Heading as="h2">
                        <Translate id="homepage.about.title">Desarrollado por SEDICI</Translate>
                    </Heading>
                    <p className="margin-bottom--lg">
                        <Translate id="homepage.about.desc">
                            SUMARC es un proyecto liderado por el Servicio de Difusión de la Creación Intelectual de la Universidad Nacional de La Plata.
                        </Translate>
                    </p>
                    <div className={styles.statsContainer}>
                        <motion.div className={styles.statItem} initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} viewport={{ once: true }}>
                            <span className={styles.statValue}>100%</span>
                            <span className={styles.statLabel}><Translate id="homepage.stats.opensource">Codigo Abierto</Translate></span>
                        </motion.div>
                        <motion.div className={styles.statItem} initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
                            <span className={styles.statValue}>+20</span>
                            <span className={styles.statLabel}><Translate id="homepage.stats.journals">Revistas Usando</Translate></span>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
