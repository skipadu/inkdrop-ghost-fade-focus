'use babel';

import React, { useEffect, useCallback } from 'react'

/* Plugin state
 * Used keys:
 * - currentLine: number
 * - pluginEnabled: boolean
 */
let pluginState = {};
const setState = (key, value) => {
  pluginState = {
    ...pluginState,
    [key.valueOf()]: value
  }
}

const GhostFadeFocus = () => {
  const [pluginEnabled, setPluginEnabled] = React.useState(true);

  const toggle = useCallback(() => {
    const newPluginState = !pluginState.pluginEnabled;
    inkdrop.config.set('ghost-fade-focus.pluginEnabled', newPluginState);
    setPluginEnabled(newPluginState);
    setState('pluginEnabled', newPluginState);
    if(newPluginState) {
      addGhostFadeFocusClassNamesOutsider();
    }
    else {
      removeGhostFadeFocusClassNamesOutsider();
    }
  }, [pluginEnabled])

  useEffect(() => {
    const sub = inkdrop.commands.add(document.body, {
      'ghost-fade-focus:toggle': toggle
    })
    return () => sub.dispose()
  }, [toggle])

  const onUpdate = ({doc}) => {
    if(pluginState.pluginEnabled) {
      const currentCursorPos = doc.getCursor();
      if (pluginState.currentLine !== currentCursorPos.line) {
	setState('currentLine', currentCursorPos.line);
	const cm = doc.getEditor();
	const totalLines = doc.size;
	removeGhostFadeFocusClassNames(cm, totalLines, currentCursorPos.line);
	addGhostFadeFocusClassNames(cm, totalLines, currentCursorPos.line);
      }
    }
  };

  const addGhostFadeFocusClassNamesOutsider = () => {
    const { cm } = inkdrop.getActiveEditor();
    const doc = cm.getDoc();
    const currentCursorPos = doc.getCursor();
    const totalLines = doc.size;
    addGhostFadeFocusClassNames(cm, totalLines, currentCursorPos.line);
  };

  const addGhostFadeFocusClassNames = (cm, totalLines, currentCursorPosLine) => {
    for(let i = -5; i <= 5; i++) {
      const lineNumber = currentCursorPosLine + i;
      if(lineNumber >= 0 && lineNumber < totalLines) {
	if(i === 0) {
	  cm.addLineClass(lineNumber, "wrap", 'CodeMirror-activeline');
	} else {
	  if(pluginState.pluginEnabled) {
	    cm.addLineClass(lineNumber, "wrap", `ghost-fade-focus--${Math.abs(i)}`);
	  }
	}
      } 
    }
    for(let i = 0; i < totalLines; i++) {
      if(i !== currentCursorPosLine) {
	cm.addLineClass(i, "wrap", 'ghost-fade-focus');
      }
    }
  };

  const removeGhostFadeFocusClassNamesOutsider = () => {
    const {cm} = inkdrop.getActiveEditor();
    const doc = cm.getDoc();
    const currentCursorPos = doc.getCursor();
    const totalLines = doc.size;
    removeGhostFadeFocusClassNames(cm, totalLines, currentCursorPos.line);
  };

  const removeGhostFadeFocusClassNames = (cm, totalLines, currentCursorPosLine) => {
    for(let i = 0; i < totalLines; i++) {
      cm.removeLineClass(i, "wrap");
      if(i === currentCursorPosLine) {
	cm.addLineClass(i, "wrap", 'CodeMirror-activeline');
      }
    }
  };

  global.inkdrop.onEditorLoad((editor) => {
    editor.cm.on("cursorActivity", onUpdate);

    setState('pluginEnabled', inkdrop.config.get(
      'ghost-fade-focus.pluginEnabled'
    ));

    inkdrop.config.onDidChange(
      'ghost-fade-focus.pluginEnabled',
      ({ newValue }) => {
	setState('pluginEnabled', newValue);
      }
    );

  });

  return (
    <>
    </>
  )
}

export default GhostFadeFocus;
