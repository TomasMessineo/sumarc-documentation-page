import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';

import styles from './index.module.css';

import { motion } from 'framer-motion';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Heading as="h1" className="hero__title">
            <Translate id="homepage.title">Documentación SUMARC</Translate>
          </Heading>
          <p className="hero__subtitle">
            <Translate id="homepage.tagline">Herramienta de gestión editorial de la UNLP</Translate>
          </p>
          <div className={styles.buttons}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                <Translate id="homepage.cta">Ver documentación</Translate>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

import HomepageWorkflow from '@site/src/components/HomepageWorkflow';
import HomepageAbout from '@site/src/components/HomepageAbout';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      description={translate({
        id: 'homepage.description',
        message: 'Description will go into a meta tag in <head />',
        description: 'Homepage description',
      })}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageWorkflow />
        <HomepageAbout />
      </main>
    </Layout>
  );
}
