import React from 'react';
import { CircleHelp } from 'lucide-react';
export default function HelpTip({ children, label = 'More information' }) {
  return <span className="help-tip-wrap"><button className="help-tip-trigger" aria-label={label} onClick={e=>e.stopPropagation()}><CircleHelp size={13}/></button><span className="help-tip" role="tooltip">{children}</span></span>;
}
