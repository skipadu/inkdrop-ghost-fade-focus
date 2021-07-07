'use babel';

import GhostFadeFocus from './ghost-fade-focus';

module.exports = {
  config: {
    pluginEnabled: {
      title: 'Plugin Enabled',
      type: 'boolean',
      default: true,
    }
  },

  activate() {
    inkdrop.components.registerClass(GhostFadeFocus);
    inkdrop.layouts.addComponentToLayout(
      'modal',
      'GhostFadeFocus'
    )
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      'modal',
      'GhostFadeFocus'
    )
    inkdrop.components.deleteClass(GhostFadeFocus);
  }
};
