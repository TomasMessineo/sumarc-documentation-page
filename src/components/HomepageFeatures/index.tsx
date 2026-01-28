import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

type FeatureItem = {
  title: ReactNode;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  image?: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: <Translate id="feature.workflow.title">Flujo Integral</Translate>,
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <Translate id="feature.workflow.description">
        Gestione el ciclo de vida del artículo desde un único ecosistema, automatizando la transformación de manuscritos DOCX a formatos de preservación y difusión digital.
      </Translate>
    ),
  },
  {
    title: <Translate id="feature.standards.title">Estándares Internacionales</Translate>,
    image: require('@site/static/img/homepage-image1.png').default,
    description: (
      <Translate id="feature.standards.description">
        Asegure la interoperabilidad global mediante el estándar JATS XML, garantizando una estructura semántica robusta para la indexación en bases de datos y repositorios internacionales.
      </Translate>
    ),
  },
  {
    title: <Translate id="feature.plugins.title">Plugins Especializados</Translate>,
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <Translate id="feature.plugins.description">
        Optimice la edición con herramientas de vanguardia: edición visual del XML JATS, enriquecimiento automático de metadatos y validación inteligente de referencias bibliográficas.
      </Translate>
    ),
  },
];

import { motion } from 'framer-motion';

function Feature({ title, Svg, image, description, index }: FeatureItem & { index: number }) {
  return (
    <motion.div
      className={clsx('col col--4')}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      viewport={{ once: true }}
    >
      <div className="text--center">
        {Svg ? (
          <Svg className={styles.featureSvg} role="img" />
        ) : (
          <img src={image} className={styles.featureSvg} role="img" alt="Feature" />
        )}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </motion.div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
