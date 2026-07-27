import React from 'react';
import MinimalistTemplate from './MinimalistTemplate';
import CreativeTemplate from './CreativeTemplate';
import CorporateTemplate from './CorporateTemplate';
import CyberTemplate from './CyberTemplate';
import SleekTemplate from './SleekTemplate';

const TemplateRenderer = ({ data }) => {
  const templateId = data?.templateId || 'minimalist';

  switch (templateId) {
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'corporate':
      return <CorporateTemplate data={data} />;
    case 'cyber':
      return <CyberTemplate data={data} />;
    case 'sleek':
      return <SleekTemplate data={data} />;
    case 'minimalist':
    default:
      return <MinimalistTemplate data={data} />;
  }
};

export default TemplateRenderer;
