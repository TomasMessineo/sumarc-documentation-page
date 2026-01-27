import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

type FeatureItem = {
  title: ReactNode;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: <Translate id="feature.workflow.title">Flujo Integral</Translate>,
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <Translate id="feature.workflow.description">
        Gestione todo el proceso editorial en una sola plataforma, desde la recepción del manuscrito DOCX hasta la generación de PDF y HTML finales.
      </Translate>
    ),
  },
  {
    title: <Translate id="feature.standards.title">Estándares Internacionales</Translate>,
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <Translate id="feature.standards.description">
        Trabaje con el estándar JATS XML para garantizar la interoperabilidad, preservación y calidad semántica de sus publicaciones académicas.
      </Translate>
    ),
  },
  {
    title: <Translate id="feature.plugins.title">Plugins Especializados</Translate>,
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <Translate id="feature.plugins.description">
        Utilice herramientas potentes como Texture para edición visual, Converters automáticos y enriquecedores de metadatos integrados.
      </Translate>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
